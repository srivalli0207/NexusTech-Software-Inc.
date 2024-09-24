from django.core import serializers
from django.shortcuts import render
from django.http import HttpResponse, HttpRequest, JsonResponse
from .models import *
import json, random
from datetime import datetime, date, time
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST
#from django.contrib.auth.models import User

def json_serial(obj):
    """JSON serializer for objects not serializable by default json code"""

    if isinstance(obj, (datetime, date, time)):
        return obj.isoformat()
    raise TypeError ("Type %s not serializable" % type(obj))

# Create your views here.
def index(request: HttpRequest):
    return render(request, "index.html")

user_id_fields = ["user_id", "blocked_id", "following_id", "creator", "from_user_id", "to_user_id", "reported_user_id", "report_user_id"]
post_id_fields = ["post_id"]
def response(objects):
    data = serializers.serialize("python", objects)
    ret = []
    for d in data:
        fields = {"pk": d.get("pk"), **d["fields"]}
        for key in list(fields.keys()):
            if key in user_id_fields:
                fields[key + "_hint"] = User.objects.get(pk=fields["user_id"]).username
            elif key in post_id_fields:
                fields[key + "_hint"] = Post.objects.get(pk=fields["user_id"]).username
        ret.append(fields)
    return HttpResponse(json.dumps(ret, default=json_serial), content_type="application/json")


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

def settings(request: HttpRequest):
    return response(UserSettings.objects.all())

@csrf_exempt
@require_POST
def register_user(request: HttpRequest):
    if request.method != "POST":
        return HttpResponse(status=405)
    print(request.body)

    data: dict = json.loads(request.body)
    name = data.get("username")
    email = data.get("email")
    password = data.get("password")
    
    user = User(user_id=random.randint(10, 99999), username=name, email=email, password=password)
    user.save()
    return HttpResponse("success")

