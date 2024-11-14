import json
from datetime import datetime, date, time
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.urls import path
from django.views.decorators.http import require_GET, require_POST, require_http_methods
from test_site.models.message import Message, MessageConversation
from test_site.models.user import UserProfile

from .serializers import serialize_message, serialize_conversation

def get_message_views():
    return [
        path("conversations", get_conversations, name="conversations"),
        path("conversation", get_conversation, name="conversation"),
        path("messages", get_messages, name="messages"),
        path("send_message", send_message, name="send_message"),
    ]

def json_serial(obj):
    """JSON serializer for objects not serializable by default json code"""

    if isinstance(obj, (datetime, date, time)):
        return obj.isoformat()
    raise TypeError ("Type %s not serializable" % type(obj))

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
    

@require_GET
def get_conversations(request: HttpRequest):
    if not request.user.is_authenticated:
        return JsonResponse({"message": "User is unauthenticated"}, status=401)
    
    conversations = [serialize_conversation(conversation, request) for conversation in MessageConversation.objects.filter(members__in=[request.user.id])]
    return HttpResponse(json.dumps(conversations, default=json_serial), content_type="application/json")

@require_GET
def get_messages(request: HttpRequest):
    if not request.user.is_authenticated:
        return JsonResponse({"message": "User is unauthenticated"}, status=401)
    
    messages = [serialize_message(message) for message in Message.objects.filter(conversation_id=int(request.GET.get("conversation"))).order_by("sent")]
    return HttpResponse(json.dumps(messages, default=json_serial), content_type="application/json")

@require_POST
def send_message(request: HttpRequest):
    if not request.user.is_authenticated:
        return JsonResponse({"message": "User is unauthenticated"}, status=401)
    
    data: dict = json.loads(request.body)
    text = data.get("text")
    conversation = MessageConversation.objects.get(pk=data.get("conversation"))
    user = UserProfile.objects.get(pk=request.user.pk)
    message = Message(user=user, conversation=conversation, text=text)
    message.save()
    conversation.last_message = message
    conversation.save()

    fields = serialize_message(message)
    return HttpResponse(json.dumps(fields, default=json_serial), content_type="application/json")