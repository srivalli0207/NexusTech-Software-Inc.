from django.core import serializers
from django.shortcuts import render
from django.http import HttpResponse, HttpRequest, JsonResponse
from .models import *
import json
from datetime import datetime, date, time

def json_serial(obj):
    """JSON serializer for objects not serializable by default json code"""

    if isinstance(obj, (datetime, date, time)):
        return obj.isoformat()
    raise TypeError ("Type %s not serializable" % type(obj))

# Create your views here.
def index(request: HttpRequest):
    return render(request, "index.html")

def response(objects):
    data = serializers.serialize("python", objects)
    return HttpResponse(json.dumps([{"pk": d.get("pk"), **d["fields"]} for d in data], default=json_serial), content_type="application/json")


def users(request: HttpRequest):
    return response(User.objects.all())

def user_muted_words(request: HttpRequest):
    return response(UserMutedWord.objects.all())

def user_blocks(request: HttpRequest):
    return response(UserBlock.objects.all())

def comments(request: HttpRequest):
    return response(Comment.objects.all())

def sessions(request: HttpRequest):
    return response(Session.objects.all())

def follows(request: HttpRequest):
    return response(Follow.objects.all())

def posts(request: HttpRequest):
    return response(Post.objects.all())

def post_likes(request: HttpRequest):
    return response(PostLike.objects.all())

def post_bookmarks(request: HttpRequest):
    return response(PostBookmark.objects.all())

def post_medias(request: HttpRequest):
    return response(PostMedia.objects.all())

def post_user_tags(request: HttpRequest):
    return response(PostUserTag.objects.all())

def forums(request: HttpRequest):
    return response(Forum.objects.all())

def forum_follows(request: HttpRequest):
    return response(ForumFollow.objects.all())

def forum_moderators(request: HttpRequest):
    return response(ForumModerator.objects.all())

def dms(request: HttpRequest):
    return response(DirectMessage.objects.all())

def reports(request: HttpRequest):
    return response(Report.objects.all())

