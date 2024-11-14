import json
from django.http import HttpRequest, JsonResponse
from django.urls import path
from django.views.decorators.http import require_GET, require_POST
from test_site.models.post import Post
from test_site.models.user import Follow, UserProfile
from .serializers import serialize_post, serialize_user, serialize_user_profile

def get_user_views():
    return [
        path("follows", get_follows, name="follows"),
        path("follow_user", follow_user, name="follow_user"),
        path("followers", get_followers, name="get_followers"),
        path("following", get_following, name="get_following"),
        path("search_users", search_users, name="search_users"),
        path("user", get_user, name="get_user"),
        path("feed", get_feed, name="get_feed"),
        path("likes", get_likes, name="get_likes"),
        path("bookmarks", get_bookmarks, name="get_bookmarks"),
        path("update_profile", update_profile, name="update_profile")
    ]



@require_GET
def get_follows(request: HttpRequest):
    username = request.GET['user']
    profile = UserProfile.objects.get(user__username=username)
    following = profile.following.all()
    fields = [serialize_user(user) for user in following]
    return JsonResponse(fields, status=200, safe=False)

@require_GET
def get_followers(request: HttpRequest):
    username_query = request.GET['username']
    profile = UserProfile.objects.get(user__username=username_query)
    followers = profile.followers.all()
    fields = [serialize_user(user) for user in followers]
    return JsonResponse(fields, status=200, safe=False)

@require_GET
def get_following(request: HttpRequest):
    username_query = request.GET['username']
    profile = UserProfile.objects.get(user__username=username_query)
    following = profile.following.all()
    fields = [serialize_user(user) for user in following]
    return JsonResponse(fields, status=200, safe=False)

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

@require_GET
def search_users(request: HttpRequest):
    username_query = request.GET['query']
    users = UserProfile.objects.filter(user__username__icontains=username_query)
    return JsonResponse([serialize_user(user) for user in users], safe=False, status=200)

@require_GET
def get_user(request: HttpRequest):
    username_query = request.GET['username']
    profile = UserProfile.objects.get(user__username=username_query)
    fields = serialize_user_profile(profile, request.user if request.user.is_authenticated else None)
    return JsonResponse(fields, status=200)

@require_GET
def get_feed(request: HttpRequest):
    profile = UserProfile.objects.get(user_id=request.user.id)
    following_ids = [following.pk for following in profile.following.all()]
    following_ids.append(request.user.id)
    posts = [serialize_post(post, request) for post in Post.objects.filter(user__in=following_ids).order_by("-creation_date")]
    return JsonResponse(posts, status=200, safe=False)

@require_GET
def get_likes(request: HttpRequest):
    username_query = request.GET['username']
    profile = UserProfile.objects.get(user__username=username_query)
    likes = profile.likes.all().order_by("-postlike__datetime")
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
    data: dict = json.loads(request.body)
    profile = UserProfile.objects.get(user_id=request.user.id)
    profile.display_name = data["displayName"]
    profile.bio = data["bio"]
    profile.pronouns = data["pronouns"]
    profile.profile_picture = data["profilePicture"]
    profile.banner = data["banner"]
    profile.save()
    return JsonResponse({"message": "Profile updated!"}, status=200)