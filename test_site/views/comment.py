from django.http import HttpRequest, HttpResponse, JsonResponse
from django.urls import path
from django.views.decorators.http import require_GET, require_POST, require_http_methods
from test_site.models import Comment, Post, UserProfile

def get_comment_views():
   return [
      path("get_post_comments", get_comments, name="get_post_comments"),
      path("post_comment", post_comment, name="post_comment")
   ]

@require_GET
def get_comments(request: HttpRequest):
   post_id = request.GET["post_id"]
   post = Post.objects.filter(post_id=post_id)[0]
   comment = Comment.objects.filter(post=post)[0]
   return JsonResponse({"hi": comment.content}, status=200)

def post_comment(request: HttpRequest):
   post_id = request.GET["post_id"]
   user_profile = UserProfile.objects.filter(user=request.user)[0]
   post = Post.objects.filter(post_id=post_id)[0]
   comment = Comment.objects.create(post=post, user=user_profile, content="dummy comment")
   comment.save()

   return JsonResponse({"msg": request.user.username}, status=200)
   