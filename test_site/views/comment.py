import json
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.urls import path
from django.views.decorators.http import require_GET, require_POST, require_http_methods
from nexus_site.custom_decorators import custom_login_required
from test_site.models import Comment, Post, UserProfile, CommentLike
from test_site.views.serializers import serialize_comment

def get_comment_views():
   return [
      path("", comments, name="comments"),
      path("<int:comment_id>/like", comment_like, name="like_comment"),
      path("get_replies", get_comment_replies, name="get_comment_replies"),
      path("post_reply", post_comment_reply, name="post_comment_reply"),
   ]

@require_http_methods(["GET", "POST", "DELETE"])
@custom_login_required
def comments(request: HttpRequest):
   if request.method == "DELETE":
      comment = Comment.objects.filter(comment_id=request.GET["comment_id"])
      return delete_comment(request, comment.first())
   else:
      post_id = request.GET["post"]
      post = Post.objects.filter(post_id=post_id)
      if not post.exists():
         return JsonResponse({"error": "Post does not exist"}, status=404)
      
      if request.method == "GET":
         return get_comments(request, post.first())
      elif request.method == "POST":
         return post_comment(request, post.first())


def get_comments(request: HttpRequest, post: Post):
   comments = Comment.objects.filter(post=post, parent=None)
   return JsonResponse([serialize_comment(comment, request) for comment in comments], safe=False, status=200)

def post_comment(request: HttpRequest, post: Post):
   user = UserProfile.objects.get(user=request.user)

   body = json.loads(request.body.decode('utf-8'))
   comment_text = body['content']

   comment = Comment.objects.create(post=post, user=user, content=comment_text)
   comment.save()

   return JsonResponse(serialize_comment(comment, request), status=200)

def delete_comment(request: HttpRequest, comment: Comment):
   if (request.user.pk != comment.user.pk):
      return JsonResponse({"error": "User is forbidden from deleting this post"}, status=403)
   else:
      comment.delete()
      return JsonResponse({'msg': 'comment deleted'}, status=200)
   
@require_POST
@custom_login_required
def comment_like(request: HttpRequest, comment_id: int):
   profile = UserProfile.objects.get(user=request.user)
   liked = request.GET.get("like") == "true"
   comment = Comment.objects.get(comment_id=comment_id)

   res = None
   if (like := CommentLike.objects.filter(user=profile, comment=comment).first()) is not None:
      if like.like != liked:
         like.like = liked
         like.save()
         res = liked
      else:
         like.delete()
         res = None
   else:
      like = CommentLike(comment=comment, user=profile, like=liked)
      like.save()
      res = liked

   likes = CommentLike.objects.filter(comment=comment, like=True).count()
   dislikes = CommentLike.objects.filter(comment=comment, like=False).count()

   return JsonResponse({"liked": res, "likeCount": likes, "dislikeCount": dislikes}, status=200)

@require_GET
@custom_login_required
def get_comment_replies(request: HttpRequest):
   parent_comment_id = request.GET['parent_comment_id']
   
   parent_comment = Comment.objects.get(comment_id=parent_comment_id)
   reply_comments = Comment.objects.filter(parent=parent_comment)
   
   return JsonResponse([serialize_comment(comment, request) for comment in reply_comments], safe=False, status=200)

@require_POST
@custom_login_required
def post_comment_reply(request: HttpRequest):
   body = json.loads(request.body.decode('utf-8'))

   reply_text = body['content']
   parent_comment_id = request.GET['parent_comment_id']

   user = UserProfile.objects.get(user=request.user)
   parent_comment = Comment.objects.get(comment_id=parent_comment_id)

   comment_reply = Comment.objects.create(user=user, post=parent_comment.post, parent=parent_comment, content=reply_text)
   comment_reply.save()
   
   return JsonResponse(serialize_comment(comment_reply, request), status=200, safe=False)
   