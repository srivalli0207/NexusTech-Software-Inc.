from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("users", views.users, name="users"),
    path("forum", views.forum, name="forum"),
    path("posts", views.posts, name="posts"),
]
