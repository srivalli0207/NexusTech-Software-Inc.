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
    data = serializers.serialize("python", objects, use_natural_foreign_keys=True)
    ret = []
    for d in data:
        fields = {"pk": d.get("pk"), **d["fields"]}
        ret.append(fields)
    return HttpResponse(json.dumps(ret, default=json_serial), content_type="application/json")


def users(request: HttpRequest):
    return response(UserProfile.objects.all())

def user_muted_words(request: HttpRequest):
    return response(UserMutedWord.objects.all())

def user_blocks(request: HttpRequest):
    return response(UserBlock.objects.all())

def comments(request: HttpRequest):
    return response(Comment.objects.all())

# def sessions(request: HttpRequest):
#     return response(Session.objects.all())

def follows(request: HttpRequest):
    username = request.GET['user']
    user = django_user.objects.filter(username=username)
    profile = UserProfile.objects.filter(user=user[0])

    following = Follow.objects.filter(user=profile[0])
    #print(following.values_list('following', flat=True)[0])

    return response(following)


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
        user = django_user.objects.get(username=request.user.username)
        profile = UserProfile.objects.get(pk=user.pk)
        user_object = {
            "username": user.username,
            "email": user.email,
            "pfp": profile.profile_picture
        }
        
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
        user = django_user.objects.get(username=request.user.username)
        profile = UserProfile.objects.get(pk=user.pk)
        user_object = {
            "username": user.username,
            "email": user.email,
            "pfp": profile.profile_picture
        }

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

    if django_user.objects.filter(username=name).exists():
        return JsonResponse({"message": "Username taken!"}, status=409)
    elif len(password) < 8:
        return JsonResponse({"message": "Password should be 8 characters or longer"}, status=409)
    
    user = django_user.objects.create_user(name, email, password)
    
    if (user.is_authenticated):
        login(request, user)
        user_model = UserProfile(user=user)
        user_model.save()
        user_object = {
            "username": name,
            "email": email,
            "pfp": None
        }
        return JsonResponse({"message": "Register user success!", "user": user_object},status=200)
    else:
        return JsonResponse({"message": "Login failed!","user": None}, status=409)

@require_GET
def get_posts(request: HttpRequest):
    if (username := request.GET.get("username")) is not None:
        return response(Post.objects.filter(user__user__username=username))
    elif request.user.is_authenticated:
        return response(Post.objects.filter(user_id=request.user.id))
    else:
        return response(Post.objects.all())

@require_GET
def get_is_following(request: HttpRequest):
    if request.user.is_authenticated:
        obj = Follow.objects.filter(user_id=request.user.id, following__user__username=request.GET.get("username"))
        return JsonResponse({"following": len(obj) > 0}, status=200)
    else:
        return JsonResponse({"message": "User is unauthenticated"}, status=401)

@require_POST
def follow_user(request: HttpRequest):
    if not request.user.is_authenticated:
        return JsonResponse({"message": "User is unauthenticated"}, status=401)

    user = UserProfile.objects.get(user_id=request.user.id)
    following = UserProfile.objects.get(user__username=request.GET.get("username"))
    follow = request.GET.get("follow") == "true"
    if follow:
        follow_obj = Follow(user=user, following=following)
        follow_obj.save()
    else:
        follow_obj = Follow.objects.get(user_id=request.user.id, following__user__username=request.GET.get("username"))
        follow_obj.delete()
    return JsonResponse({"following": follow}, status=200)
    
        

@require_POST
@custom_login_required
def submit_post(request: HttpRequest):
    data: dict = json.loads(request.body)
    text = data.get("text")
    user = UserProfile.objects.filter(user__username=request.user.username)[0]
    post = Post(user=user,text=text, comment_setting=Post.PostCommentSetting.NONE)
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
