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
        path("posts", get_posts, name="posts"),
        path("get_post", get_post, name='get_post'),
        path("post_submit", submit_post, name='submit_post'),
        path("post_delete", delete_post, name='delete_post'),
        path("upload_file", upload_file, name='upload_file'),
        path("like_post", like_post, name="like_post"),
        path("bookmark_post", bookmark_post, name="bookmark_post"),
    ]

def json_serial(obj):
    """JSON serializer for objects not serializable by default json code"""

    if isinstance(obj, (datetime, date, time)):
        return obj.isoformat()
    raise TypeError ("Type %s not serializable" % type(obj))


@require_POST
@custom_login_required
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

@require_GET
def get_post(request: HttpRequest):
    id = request.GET.get("post_id")
    post = Post.objects.filter(post_id=id)
    post_response = serialize_post(post[0], request)
    return HttpResponse(json.dumps(post_response, default=json_serial), content_type="application/json")

@require_GET
def get_posts(request: HttpRequest):
    if (username := request.GET.get("username")) is not None:
        posts = Post.objects.filter(user__user__username=username)
    elif request.user.is_authenticated:
        posts = Post.objects.filter(user_id=request.user.id)
    else:
        posts = Post.objects.all()
    
    posts_response = [serialize_post(post, request) for post in posts.order_by("-creation_date")]
    return HttpResponse(json.dumps(posts_response, default=json_serial), content_type="application/json")

@require_POST
@custom_login_required
def submit_post(request: HttpRequest):
    data: dict = json.loads(request.body)
    text = data.get("text")
    user = UserProfile.objects.filter(user__username=request.user.username)[0]
    post = Post(user=user,text=text, comment_setting=Post.PostCommentSetting.NONE)
    post.save()
    return JsonResponse(serialize_post(post, request), status=200)

@require_http_methods(['DELETE'])
@custom_login_required
def delete_post(request: HttpRequest):
    data: dict = json.loads(request.body)
    post_id = data.get("post_id")
    post = Post.objects.get(pk=post_id)
    post.delete()
    return JsonResponse({'message': 'post request processed'}, status=200)

@require_POST
def like_post(request: HttpRequest):
    profile = UserProfile.objects.get(user_id=request.user.id)
    post_id = int(request.GET.get("post"))
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
def bookmark_post(request: HttpRequest):
    profile = UserProfile.objects.get(user_id=request.user.id)
    post_id = int(request.GET.get("post"))
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