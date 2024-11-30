from django.http import HttpRequest, HttpResponse, JsonResponse
from django.urls import path
from django.views.decorators.http import require_GET, require_POST, require_http_methods
from test_site.models import Comment, Post, UserProfile

def get_comment_views():
   return [
      path("", comments, name="comments"),
   ]

@require_http_methods(["GET", "POST"])
def comments(request: HttpRequest):
   post_id = request.GET["post"]
   post = Post.objects.filter(post_id=post_id)
   if not post.exists():
      return JsonResponse({"error": "Post does not exist"}, status=404)
   
   if request.method == "GET":
      return get_comments(request, post.first())
   elif request.method == "POST":
      return post_comment(request, post.first())


def get_comments(request: HttpRequest, post: Post):
   comments = Comment.objects.filter(post=post)
   return JsonResponse([{"content": comment.content} for comment in comments], safe=False, status=200)

def post_comment(request: HttpRequest, post: Post):
   if not request.user.is_authenticated:
      return JsonResponse({"error": "User is unauthenticated"}, status=401)
   user = UserProfile.objects.get(user=request.user)
   comment = Comment.objects.create(post=post, user=user, content="dummy comment")
   comment.save()

   return JsonResponse({"msg": request.user.username}, status=200)
   