from django.shortcuts import render
from django.http import HttpResponse, HttpRequest, JsonResponse
from .models import Post


# Create your views here.
def index(request: HttpRequest):
    return render(request, "index.html")

def posts(request: HttpRequest):
    posts = Post.objects.all()
    return JsonResponse([{"author": post.author, "text": post.text} for post in posts], safe=False)