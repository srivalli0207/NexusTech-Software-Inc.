from django.core import serializers
from django.shortcuts import render
from django.http import HttpResponse, HttpRequest, JsonResponse
from .models import *
import json
from datetime import datetime, date

def json_serial(obj):
    """JSON serializer for objects not serializable by default json code"""

    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    raise TypeError ("Type %s not serializable" % type(obj))

# Create your views here.
def index(request: HttpRequest):
    return render(request, "index.html")

def response(objects):
    data = serializers.serialize("python", objects)
    return HttpResponse(json.dumps([d["fields"] for d in data], default=json_serial), content_type="application/json")


def users(request: HttpRequest):
    return response(User.objects.all())

def comments(request: HttpRequest):
    return response(Comment.objects.all())

def sessions(request: HttpRequest):
    return response(Session.objects.all())

def posts(request: HttpRequest):
    return response(Post.objects.all())

def post_medias(request: HttpRequest):
    return response(PostMedia.objects.all())

def forums(request: HttpRequest):
    return response(Forum.objects.all())

def dms(request: HttpRequest):
    return response(DirectMessage.objects.all())

def reports(request: HttpRequest):
    return response(Report.objects.all())

