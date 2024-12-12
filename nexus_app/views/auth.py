import json
from django.http import HttpRequest, JsonResponse
from django.urls import path
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_GET, require_POST
from django.contrib.auth.models import User as DjangoUser
from django.contrib.auth import authenticate, login, logout
from .serializers import serialize_user_profile

from nexus_app.models.user import UserProfile

def get_auth_views():
    return [
        path("csrf", get_csrf_token, name="get_csrf-token"),
        path("session", get_session, name="get_session"),
        path("signup", register_user, name="register_user"),
        path("login", login_user, name="login_user"),
        path("logout", logout_user, name="logout_user"),
    ]

@ensure_csrf_cookie
@require_GET
def get_csrf_token(request: HttpRequest):
    return JsonResponse({"message": "Retrieving token success!"},status=200)

@require_GET
def get_session(request: HttpRequest):
    if (request.user.is_authenticated):
        user = DjangoUser.objects.get(username=request.user.username)
        profile = UserProfile.objects.get(pk=user.pk)
        user_object = serialize_user_profile(profile, request)
        
        return JsonResponse({"message": "User authenticated!", "user": user_object}, status=200)
    else:
        return JsonResponse({"message": "User not authenticated!", "user": None}, status=200)
    
@require_POST
def login_user(request: HttpRequest):
    data: dict = json.loads(request.body)
    username = data.get("username")
    password = data.get("password")
    
    user = authenticate(request=request, username=username, password= password)

    if user is not None:
        login(request=request, user=user)
        user = DjangoUser.objects.get(username=request.user.username)
        profile = UserProfile.objects.get(pk=user.pk)
        user_object = serialize_user_profile(profile, request)

        return JsonResponse({"message": "Login success!", "user": user_object}, status=200)
    else:
        return JsonResponse({"message": "Invalid username or password!", "user": None}, status=401)
    
@require_POST
def logout_user(request: HttpRequest):
    logout(request=request)
    return JsonResponse({"message": "Logout!"}, status=200)

@require_POST
def register_user(request: HttpRequest, ):
    data: dict = json.loads(request.body)
    name = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if DjangoUser.objects.filter(username=name).exists():
        return JsonResponse({"message": "Username taken!"}, status=409)
    elif len(password) < 8:
        return JsonResponse({"message": "Password should be 8 characters or longer"}, status=409)
    
    user = DjangoUser.objects.create_user(name, email, password)
    
    if (user.is_authenticated):
        login(request, user)
        user_model = UserProfile(user=user)
        user_model.save()
        user_object = serialize_user_profile(user_model, request)
        return JsonResponse({"message": "Register user success!", "user": user_object},status=200)
    else:
        return JsonResponse({"message": "Login failed!","user": None}, status=409)