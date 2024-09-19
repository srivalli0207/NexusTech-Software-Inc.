from django.core import serializers
from django.shortcuts import render
from django.http import HttpResponse, HttpRequest, JsonResponse
from .models import Post, User, Forum
import json


# Create your views here.
def index(request: HttpRequest):
    return render(request, "index.html")

def users(request: HttpRequest):
    data = serializers.serialize("python", User.objects.all())
    return HttpResponse(json.dumps([d["fields"] for d in data]), content_type="application/json")

def forums(request: HttpRequest):
    data = serializers.serialize("python", Forum.objects.all())
    return HttpResponse(json.dumps([d["fields"] for d in data]), content_type="application/json")

def posts(request: HttpRequest):
    data = serializers.serialize("python", Post.objects.all())
    return HttpResponse(json.dumps([d["fields"] for d in data]), content_type="application/json")

