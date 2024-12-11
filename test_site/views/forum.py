import os
import time
from django.http import HttpRequest, JsonResponse
from django.urls import path

from test_site.models.forum import Forum
from test_site.views.serializers import serialize_forum, serialize_post
from storages.backends.s3 import S3Storage

def get_forum_views():
    return [
        path("", get_forums, name="get_forums"),
        path("create", create_forum, name="create_forum"),
        path("<str:forum_name>/", get_forum, name="get_forum"),
        path("<str:forum_name>/posts", get_forum_posts, name="get_forum_posts"),
        path("<str:forum_name>/follow", follow_forum, name="follow_forum")
    ]

def get_forums(request: HttpRequest):
    return JsonResponse([serialize_forum(forum, request) for forum in Forum.get_forums()], safe=False)

def create_forum(request: HttpRequest):
    from test_site.models.user import UserProfile
    if not request.user.is_authenticated:
        return JsonResponse({"error": "User is unauthenticated"}, status=401)
    
    fs = S3Storage()
    user = UserProfile.objects.get(user_id=request.user.id)
    forum = Forum(name=request.POST.get("name"), description=request.POST.get("description"), creator=user)
    if "icon" in request.FILES:
        icon = request.FILES.get("icon")
        filename, file_extension = os.path.splitext(icon.name)
        filename = f"forum_icon_{forum.name}_{int(time.time())}{file_extension}"
        fs_file = fs.save(filename, icon)
        file_url = fs.url(fs_file)
        forum.icon = file_url
    if "banner" in request.FILES:
        banner = request.FILES.get("banner")
        filename, file_extension = os.path.splitext(banner.name)
        filename = f"forum_banner_{forum.name}_{int(time.time())}{file_extension}"
        fs_file = fs.save(filename, banner)
        file_url = fs.url(fs_file)
        forum.banner = file_url
    forum.save()
    return JsonResponse(serialize_forum(forum, request), status=200)

def get_forum(request: HttpRequest, forum_name: str):
    forum = Forum.get_forum(forum_name)
    if forum is None:
        return JsonResponse({"error": "Forum not found"}, status=404)
    else:
        return JsonResponse(serialize_forum(forum, request))
    
def get_forum_posts(request: HttpRequest, forum_name: str):
    forum = Forum.get_forum(forum_name)
    if forum is None:
        return JsonResponse({"error": "Forum not found"}, status=404)
    else:
        posts = forum.get_posts()
        return JsonResponse([serialize_post(post, request) for post in posts], safe=False)

def follow_forum(request: HttpRequest, forum_name: str):
    from test_site.models.user import UserProfile
    if not request.user.is_authenticated:
        return JsonResponse({"error": "User is unauthenticated"}, status=401)
    
    user = UserProfile.objects.get(user_id=request.user.id)
    forum = Forum.get_forum(forum_name)
    if forum is None:
        return JsonResponse({"error": "Forum not found"}, status=404)
    res = forum.follow_forum(user)
    return JsonResponse({"following": res}, status=200)
