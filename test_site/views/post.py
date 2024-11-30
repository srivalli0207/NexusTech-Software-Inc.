import json, os
from datetime import datetime, date, time
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.urls import path
from django.views.decorators.http import require_GET, require_POST, require_http_methods
from storages.backends.s3 import S3Storage

from test_site.models.post import Post, PostBookmark, PostLike, PostMedia
from test_site.models.user import UserProfile
from .serializers import serialize_post
from nexus_site.custom_decorators import custom_login_required

def get_post_views():
    return [
        path("", posts, name="posts"), # Getting feed and creating new posts
        path("<int:post_id>/", post_action, name='post_action'), # Getting and deleting posts
        path("<int:post_id>/like", like_post, name="like_post"),
        path("<int:post_id>/bookmark", bookmark_post, name="bookmark_post"),
    ]

def json_serial(obj):
    """JSON serializer for objects not serializable by default json code"""

    if isinstance(obj, (datetime, date, time)):
        return obj.isoformat()
    raise TypeError ("Type %s not serializable" % type(obj))

@require_http_methods(["GET", "POST"])
def posts(request: HttpRequest):
    if request.method == "GET":
        return get_posts(request)
    else:
        return submit_post(request)
    
def get_posts(request: HttpRequest):
    if request.user.is_authenticated:
        profile = UserProfile.objects.get(user_id=request.user.id)
        following_ids = [following for following in profile.following.all()]
        following_ids.append(profile)
        posts = Post.objects.filter(user__in=following_ids)
    else:
        posts = Post.objects.all()
    
    posts_response = [serialize_post(post, request) for post in posts.order_by("-creation_date")]
    return HttpResponse(json.dumps(posts_response, default=json_serial), content_type="application/json")

def submit_post(request: HttpRequest):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "User is unauthenticated"}, status=401)
    user = UserProfile.objects.filter(user__username=request.user.username)[0]

    # Get fields from form data
    text = request.POST.get("text")
    forum = request.POST.get("forum")
    images = request.FILES.getlist("images")
    video = request.FILES.getlist("video")
    
    # Create post
    post = Post(user=user, text=text, comment_setting=Post.PostCommentSetting.NONE)
    if forum is not None:
        from test_site.models.forum import Forum
        post.forum = Forum.get_forum(forum)
    post.save()
    
    # Upload media
    fs = S3Storage()
    media = []
    for i, file in enumerate(images + video):
        filename, file_extension = os.path.splitext(file.name)
        filename = f"post_{post.post_id}_{i}{file_extension}"
        fs_file = fs.save(filename, file)
        file_url = fs.url(fs_file)
        media.append(PostMedia(post=post, media_type="image" if len(images) > 0 else "video", url=file_url, index=i))
    for m in media:
        m.save()
    
    # Return post data
    return JsonResponse(serialize_post(post, request), status=200)

@require_http_methods(["GET", "DELETE"])
def post_action(request: HttpRequest, post_id: int):
    post = Post.objects.filter(post_id=post_id)
    if not post.exists():
        return JsonResponse({"error": "Post not found"}, status=404)
    
    if request.method == "GET":
        return get_post(request, post.first())
    elif request.method == "DELETE":
        return delete_post(request, post.first())
    
@require_GET
def get_post(request: HttpRequest, post: Post):
    post_response = serialize_post(post, request)
    return HttpResponse(json.dumps(post_response, default=json_serial), content_type="application/json")

@require_http_methods(['DELETE'])
def delete_post(request: HttpRequest, post: Post):
    if request.user.pk != post.user.pk:
        return JsonResponse({"error": "User is forbidden from deleting this post"}, status=403)
    post.delete()
    return JsonResponse({'message': 'post request processed'}, status=200)

@require_POST
def upload_file(request: HttpRequest):
    entity_type = request.GET.get("type")
    entity_id = request.GET.get("id") or request.user.username
    media_type = request.GET.get("media_type") or "image"
    fs = S3Storage()
    urls = []

    for i, file in enumerate(request.FILES.getlist("file")):
        filename, file_extension = os.path.splitext(file.name)
        filename = f"{entity_type}_{entity_id}_{i if entity_type not in {"pfp", "banner"} else int(datetime.now().timestamp())}{file_extension}"
        fs_file = fs.save(filename, file)
        file_url = fs.url(fs_file)
        urls.append(file_url)
    
    match entity_type:
        case "post":
            post = Post.objects.get(post_id=int(entity_id))
            for i, url in enumerate(urls):
                PostMedia.objects.create(post=post, media_type=media_type, url=url, index=i)
        case "pfp" | "banner":
            profile = UserProfile.objects.get(user__username=request.user.username)
            match entity_type:
                case "pfp": profile.profile_picture = file_url
                case "banner": profile.banner = file_url
            profile.save()
    
    return JsonResponse({"urls": urls}, status=200)

@require_POST
def like_post(request: HttpRequest, post_id: int):
    profile = UserProfile.objects.get(user_id=request.user.id)
    liked = request.GET.get("like") == "true"
    post = Post.objects.get(post_id=post_id)

    res = None
    if (like := PostLike.objects.filter(user=profile, post_id=post_id).first()) is not None:
        if like.like != liked:
            like.like = liked
            like.save()
            res = liked
        else:
            like.delete()
            res = None
    else:
        like = PostLike(post=post, user=profile, like=liked)
        like.save()
        res = liked
    return JsonResponse({"liked": res, "likeCount": post.get_like_count(), "dislikeCount": post.get_dislike_count()}, status=200)

@require_POST
def bookmark_post(request: HttpRequest, post_id: int):
    profile = UserProfile.objects.get(user_id=request.user.id)
    post = Post.objects.get(post_id=post_id)

    res = None
    if (bookmark := profile.bookmarks.filter(post_id=post_id).first()) is not None:
        profile.bookmarks.remove(bookmark)
        res = False
    else:
        bookmark = PostBookmark(post=post, user=profile)
        bookmark.save()
        res = True
    return JsonResponse({"bookmarked": res}, status=200)