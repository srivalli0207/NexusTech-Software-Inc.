from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("users", views.users, name="users"),
    path("comments", views.comments, name="comments"),
    path("sessions", views.sessions, name="sessions"),
    path("posts", views.posts, name="posts"),
    path("post_medias", views.post_medias, name="post_medias"),
    path("forums", views.forums, name="forums"),
    path("dms", views.dms, name="dms"),
    path("reports", views.reports, name="reports"),
]
