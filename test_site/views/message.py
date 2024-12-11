import json
from datetime import datetime, date, time
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.urls import path
from django.db.models import Q, Count
from django.views.decorators.http import require_GET, require_POST, require_http_methods
from test_site.models.message import Message, MessageConversation
from test_site.models.user import UserProfile

from .serializers import serialize_message, serialize_conversation

def get_message_views():
    return [
        path("", conversations, name="conversations"),
        path("<int:conversation_id>/", conversation_action, name="conversation"),
    ]

@require_http_methods(["GET", "POST"])
def conversations(request: HttpRequest):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "User is unauthenticated"}, status=401)
    
    if request.method == "GET":
        return get_conversations(request)
    elif request.method == "POST":
        return create_conversation(request)
    

def get_conversations(request: HttpRequest):
    user = UserProfile.objects.get(user=request.user)
    usernames = request.GET.getlist("username")
    conversations = MessageConversation.objects.filter(members=user)
    if len(usernames) == 1:
        conversations = conversations.filter(group=False)
    elif len(usernames) > 1:
        conversations = conversations.filter(group=True)
    for username in usernames:
        target = UserProfile.objects.filter(user__username=username)
        if not target.exists():
            return JsonResponse({"error": f"User not found: {username}"}, status=404)
        conversations = conversations.filter(members=target.first())
    
    return JsonResponse([serialize_conversation(conversation, request) for conversation in conversations], safe=False, status=200)

def create_conversation(request: HttpRequest):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "User is unauthenticated"}, status=401)
    user = UserProfile.objects.get(user_id=request.user.id)
    
    data: dict = json.loads(request.body)
    usernames: list[str] = data["usernames"]
    group: bool = data["group"]
    name: str | None = data.get("name")

    conversation = MessageConversation.objects.annotate(member_count=Count("members")).filter(group=group, members__in=[user], member_count=len(usernames) + 1)
    for username in usernames:
        profile = UserProfile.objects.get(user__username=username)
        conversation = conversation.filter(members__in=[profile])
    conversation = conversation.first()
    if conversation is not None:
        return JsonResponse(serialize_conversation(conversation, request), status=200)
    
    conversation = MessageConversation(group=group, name=name)
    conversation.save()
    conversation.members.add(user)
    for username in usernames:
        user = UserProfile.objects.get(user__username=username)
        conversation.members.add(user)
    conversation.save()
    return JsonResponse(serialize_conversation(conversation, request), status=200)

@require_http_methods(["GET", "POST"])
def conversation_action(request: HttpRequest, conversation_id: int):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "User is unauthenticated"}, status=401)
    
    conversation = MessageConversation.objects.filter(conversation_id=conversation_id)
    if not conversation.exists():
        return JsonResponse({"error": "Conversation does not exist"}, status=404)
    
    if request.method == "GET":
        return get_messages(request, conversation.first())
    elif request.method == "POST":
        return send_message(request, conversation.first())

@require_GET
def get_conversation(request: HttpRequest):
    if not request.user.is_authenticated:
        return JsonResponse({"message": "User is unauthenticated"}, status=401)
    
    user = UserProfile.objects.get(pk=request.user.pk)
    target = UserProfile.objects.get(user__username=request.GET.get("username"))
    conversation = MessageConversation.objects.filter(members=user, group=False).filter(members=target).first()
    if conversation is None:
        conversation = MessageConversation()
        conversation.save()
        conversation.members.add(user, target)
    
    return JsonResponse({"id": conversation.conversation_id}, status=200)

def get_messages(request: HttpRequest, conversation: MessageConversation):
    return JsonResponse([serialize_message(message, request) for message in Message.objects.filter(conversation=conversation).order_by("sent")], safe=False, status=200)

@require_POST
def send_message(request: HttpRequest, conversation: MessageConversation):
    text = request.POST.get("text")
    user = UserProfile.objects.get(user=request.user)
    message = Message(user=user, conversation=conversation, text=text)
    message.save()
    conversation.last_message = message
    conversation.save()

    return JsonResponse(serialize_message(message, request), status=200)