import os, time
from django.http import HttpRequest, JsonResponse
from django.urls import path
from django.views.decorators.http import require_GET, require_POST, require_http_methods
from test_site.models.post import Post
from test_site.models.user import Follow, UserProfile
from storages.backends.s3 import S3Storage
from .serializers import serialize_post, serialize_user, serialize_user_profile

def get_user_views():
    return [
        path("", search_users, name="search_user"),
        path("<str:username>/profile", get_profile, name="get_profile"),
        path("<str:username>/posts", get_posts, name="get_posts"),
        path("<str:username>/followers", get_followers, name="get_followers"),
        path("<str:username>/following", get_following, name="get_following"),
        path("<str:username>/friends", get_friends, name="get_friends"),
        path("<str:username>/follow", follow_user, name="follow_user"),
        path("<str:username>/likes", get_likes, name="get_likes"),
        path("bookmarks", get_bookmarks, name="get_bookmarks"),
        path("profile", update_profile, name="update_profile")
    ]

@require_GET
def get_profile(request: HttpRequest, username: str):
    profile = UserProfile.objects.get(user__username=username)
    fields = serialize_user_profile(profile, request.user if request.user.is_authenticated else None)
    return JsonResponse(fields, status=200)

@require_GET
def get_posts(request: HttpRequest, username: str):
    profile = UserProfile.objects.get(user__username=username)
    posts = profile.get_posts()
    return JsonResponse([serialize_post(post) for post in posts], status=200, safe=False)

@require_GET
def get_followers(request: HttpRequest, username: str):
    profile = UserProfile.objects.get(user__username=username)
    followers = profile.followers.all()
    fields = [serialize_user(user) for user in followers]
    return JsonResponse(fields, status=200, safe=False)

@require_GET
def get_following(request: HttpRequest, username: str):
    profile = UserProfile.objects.get(user__username=username)
    following = profile.following.all()
    fields = [serialize_user(user) for user in following]
    return JsonResponse(fields, status=200, safe=False)

@require_GET
def get_friends(request: HttpRequest, username: str):
    profile = UserProfile.objects.get(user__username=username)
    friends = profile.followers.all() & profile.following.all()
    return JsonResponse([serialize_user(user) for user in friends], status=200, safe=False)

@require_POST
def follow_user(request: HttpRequest, username: str):
    if not request.user.is_authenticated:
        return JsonResponse({"message": "User is unauthenticated"}, status=401)

    user = UserProfile.objects.get(user_id=request.user.id)
    following = UserProfile.objects.get(user__username=username)
    follow = Follow.objects.filter(user=user, following=following)
    if not follow.exists():
        follow_obj = Follow(user=user, following=following)
        follow_obj.save()
        return JsonResponse({"following": True}, status=200)
    else:
        follow.first().delete()
        return JsonResponse({"following": False}, status=200)

@require_GET
def search_users(request: HttpRequest):
    username_query = request.GET.get("query")
    if username_query is None or username_query == "":
        return JsonResponse({"error": "Query not specified"}, status=400)
    users = UserProfile.objects.filter(user__username__icontains=username_query)
    return JsonResponse([serialize_user(user) for user in users], safe=False, status=200)

@require_GET
def get_likes(request: HttpRequest, username: str):
    profile = UserProfile.objects.get(user__username=username)
    likes = profile.get_likes()
    posts = [serialize_post(like, request) for like in likes]
    return JsonResponse(posts, status=200, safe=False)

@require_GET
def get_bookmarks(request: HttpRequest):
    profile = UserProfile.objects.get(user_id=request.user.id)
    bookmarks = profile.bookmarks.all().order_by("-postbookmark__datetime")
    posts = [serialize_post(bookmark, request) for bookmark in bookmarks]
    return JsonResponse(posts, status=200, safe=False)

@require_POST
def update_profile(request: HttpRequest):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "User is unauthenticated"}, status=401)

    fs = S3Storage()
    user = UserProfile.objects.get(user_id=request.user.id)
    user.set_display_name(request.POST.get("displayName"))
    user.set_pronouns(request.POST.get("pronouns"))
    user.set_bio(request.POST.get("bio"))

    if "profilePicture" in request.FILES:
        profile_picture = request.FILES.get("profilePicture")
        filename, file_extension = os.path.splitext(profile_picture.name)
        filename = f"pfp_{user.user.username}_{int(time.time())}{file_extension}"
        fs_file = fs.save(filename, profile_picture)
        file_url = fs.url(fs_file)
        user.set_profile_picture(file_url)
    elif "profilePicture" not in request.POST:
        user.set_profile_picture(None)
    
    if "banner" in request.FILES:
        banner = request.FILES.get("banner")
        filename, file_extension = os.path.splitext(banner.name)
        filename = f"banner_{user.user.username}_{int(time.time())}{file_extension}"
        fs_file = fs.save(filename, banner)
        file_url = fs.url(fs_file)
        user.set_banner(file_url)
    elif "banner" not in request.POST:
        user.set_banner(None)
    
    user.save()
    fields = {
        "displayName": user.display_name,
        "pronouns": user.pronouns,
        "bio": user.bio,
        "profilePicture": user.profile_picture,
        "banner": user.banner
    }
    return JsonResponse(fields, status=200)