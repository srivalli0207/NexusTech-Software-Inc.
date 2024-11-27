from django.urls import include, path

from . import views
from .views import get_auth_views, get_message_views, get_post_views, get_user_views, get_comment_views, get_forum_views

urlpatterns = [
    # path("", views.index, name="index"),
    # path("sessions", views.sessions, name="sessions"),
    # path("user/", include(get_user_views))
    path("auth/", include(get_auth_views())),
    path("forums/", include(get_forum_views())),
    path("comments/", include(get_comment_views())),
] + get_message_views() + get_post_views() + get_user_views()


