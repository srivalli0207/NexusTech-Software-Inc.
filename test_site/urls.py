from django.urls import include, path

from . import views
from .views import get_auth_views, get_message_views, get_post_views, get_user_views, get_comment_views, get_forum_views

urlpatterns = [
    path("auth/", include(get_auth_views())),
    path("user/", include(get_user_views())),
    path("post/", include(get_post_views())),
    path("message/", include(get_message_views())),
    path("forum/", include(get_forum_views())),
    path("comment/", include(get_comment_views())),
]

