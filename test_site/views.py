from django.core import serializers
from django.shortcuts import render
from django.http import HttpResponse, HttpRequest, JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_GET, require_POST, require_http_methods
from django.contrib.auth.models import User as django_user
from django.contrib.auth import authenticate, login, logout
from datetime import datetime, date, time
import json
from .models import *
from nexus_site.custom_decorators import custom_login_required

def json_serial(obj):
    """JSON serializer for objects not serializable by default json code"""

    if isinstance(obj, (datetime, date, time)):
        return obj.isoformat()
    raise TypeError ("Type %s not serializable" % type(obj))

# Create your views here.
def index(request: HttpRequest):
    return render(request, "index.html")

user_id_fields = ["user_id", "blocked_id", "following_id", "creator", "from_user_id", "to_user_id", "reported_user_id", "report_user_id"]
post_id_fields = ["post_id"]
def response(objects):
    data = serializers.serialize("python", objects)
    ret = []
    for d in data:
        fields = {"pk": d.get("pk"), **d["fields"]}
        for key in list(fields.keys()):
            if key in user_id_fields:
                fields[key + "_hint"] = User.objects.get(pk=fields["user_id"]).username
            elif key in post_id_fields:
                fields[key + "_hint"] = Post.objects.get(pk=fields["user_id"]).username
        ret.append(fields)
    return HttpResponse(json.dumps(ret, default=json_serial), content_type="application/json")


def users(request: HttpRequest):
    return response(User.objects.all())

def user_muted_words(request: HttpRequest):
    return response(UserMutedWord.objects.all())

def user_blocks(request: HttpRequest):
    return response(UserBlock.objects.all())

def comments(request: HttpRequest):
    return response(Comment.objects.all())

def sessions(request: HttpRequest):
    return response(Session.objects.all())

def follows(request: HttpRequest):
    return response(Follow.objects.all())

# def posts(request: HttpRequest):
#     return response(Post.objects.all())

def post_likes(request: HttpRequest):
    return response(PostLike.objects.all())

def post_bookmarks(request: HttpRequest):
    return response(PostBookmark.objects.all())

def post_medias(request: HttpRequest):
    return response(PostMedia.objects.all())

def post_user_tags(request: HttpRequest):
    return response(PostUserTag.objects.all())

def forums(request: HttpRequest):
    return response(Forum.objects.all())

def forum_follows(request: HttpRequest):
    return response(ForumFollow.objects.all())

def forum_moderators(request: HttpRequest):
    return response(ForumModerator.objects.all())

def dms(request: HttpRequest):
    return response(DirectMessage.objects.all())

def reports(request: HttpRequest):
    return response(Report.objects.all())

def settings(request: HttpRequest):
    return response(UserSettings.objects.all())

@ensure_csrf_cookie
@require_GET
def get_csrf_token(request: HttpRequest):
    return JsonResponse({"message": "Retrieving token success!"},status=200)

@require_GET
def get_session(request: HttpRequest):
    if (request.user.is_authenticated):
        user_object = {}
        user_object['username'] = request.user.username
        user_object['email'] = django_user.objects.get(username=request.user.username).email
        
        return JsonResponse({"message": "User authenticated!", "user": user_object}, status=200)
    else:
        return JsonResponse({"message": "User not authenticated!", "user": None}, status=401)
    
@require_POST
def login_user(request: HttpRequest):
    data: dict = json.loads(request.body)
    username = data.get("username")
    password = data.get("password")
    
    user = authenticate(request=request, username=username, password= password)

    if user is not None:
        login(request=request, user=user)
        user_object = {}
        user_object['username'] = request.user.username
        user_object['email'] = django_user.objects.get(username=request.user.username).email

        return JsonResponse({"message": "Login success!", "user": user_object}, status=200)
    else:
        return JsonResponse({"message": "Invalid username or password!", "user": None}, status=401)
    
@require_POST
def logout_user(request: HttpRequest):
    logout(request=request)
    return JsonResponse({"message": "Logout!"}, status=200)

@require_POST
def register_user(request: HttpRequest, ):
    data: dict = json.loads(request.body)
    name = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if (django_user.objects.filter(username=name).exists()):
        return JsonResponse({"message": "Username taken!"}, status=409)
    elif (len(password) < 8):
        return JsonResponse({"message": "Password should be 8 characters or longer"}, status=409)
    
    user = django_user.objects.create_user(name, email, password)
    
    if (user.is_authenticated):
        login(request, user)
        user_object = {}
        user_object['username'] = name
        user_object['email'] = email
        user_model = User(user_id=user.pk, username=name, email=email, password=password)
        user_model.save()
        return JsonResponse({"message": "Register user success!", "user": user_object},status=200)
    else:
        return JsonResponse({"message": "Login failed!","user": None}, status=409)

@require_GET
def get_posts(request: HttpRequest):
    if (username := request.GET.get("username")) is not None:
        return response(Post.objects.filter(user_id__username=username))
    elif request.user.is_authenticated:
        return response(Post.objects.filter(user_id=request.user.id))
    else:
        return response(Post.objects.all())

@require_POST
@custom_login_required
def submit_post(request: HttpRequest):
    data: dict = json.loads(request.body)
    text = data.get("text")
    user = User.objects.filter(username=request.user.username)[0]
    post = Post( user_id=user, text=text, comment_setting=Post.PostCommentSetting.NONE, )
    post.save()
    return JsonResponse({'message': 'post request processed'}, status=200)

@require_http_methods(['DELETE'])
@custom_login_required
def delete_post(request: HttpRequest):
    data: dict = json.loads(request.body)
    post_id = data.get("post_id")
    post = Post.objects.get(pk=post_id)
    print(post)
    post.delete()
    return JsonResponse({'message': 'post request processed'}, status=200)
