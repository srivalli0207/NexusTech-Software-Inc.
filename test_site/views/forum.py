from django.http import HttpRequest, JsonResponse
from django.urls import path

from test_site.models.forum import Forum
from test_site.views.serializers import serialize_forum, serialize_post


def get_forum_views():
    return [
        path("", get_forums, name="get_forums"),
        path("<str:forum_name>/", get_forum, name="get_forum"),
        path("<str:forum_name>/posts", get_forum_posts, name="get_forum_posts")
    ]

def get_forums(request: HttpRequest):
    return JsonResponse([serialize_forum(forum) for forum in Forum.get_forums()], safe=False)

def get_forum(request: HttpRequest, forum_name: str):
    forum = Forum.get_forum(forum_name)
    if forum is None:
        return JsonResponse({"error": "Forum not found"}, status=404)
    else:
        return JsonResponse(serialize_forum(forum))
    
def get_forum_posts(request: HttpRequest, forum_name: str):
    forum = Forum.get_forum(forum_name)
    if forum is None:
        return JsonResponse({"error": "Forum not found"}, status=404)
    else:
        posts = forum.get_posts()
        return JsonResponse([serialize_post(post) for post in posts], safe=False)
