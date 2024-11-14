from django.urls import path

from . import views
from .views import get_auth_views, get_message_views, get_post_views, get_user_views

urlpatterns = [
    # path("", views.index, name="index"),
    # path("sessions", views.sessions, name="sessions"),
] + get_auth_views() + get_message_views() + get_post_views() + get_user_views()


