from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("users", views.users, name="users"),
    path("user_muted_words", views.user_muted_words, name="user_muted_word"),
    path("user_blocks", views.user_blocks, name="user_blocks"),
    path("comments", views.comments, name="comments"),
    # path("sessions", views.sessions, name="sessions"),
    path("follows", views.follows, name="follows"),
    path("posts", views.get_posts, name="posts"),
    path("is_following", views.get_is_following, name="is_following"),
    path("follow_user", views.follow_user, name="follow_user"),
    path("post_likes", views.post_likes, name="post_likes"),
    path("post_bookmarks", views.post_bookmarks, name="post_bookmarks"),
    path("post_medias", views.post_medias, name="post_medias"),
    path("post_user_tags", views.post_user_tags, name="post_user_tags"),
    path("forums", views.forums, name="forums"),
    path("forum_follows", views.forum_follows, name="forum_follows"),
    path("forum_moderators", views.forum_moderators, name="forum_moderators"),
    path("dms", views.dms, name="dms"),
    path("reports", views.reports, name="reports"),
    path("settings", views.settings, name="settings"),
    path("post_submit", views.submit_post, name='submit_post'),
    path("post_delete", views.delete_post, name='delete_post'),

    path("auth/csrf", views.get_csrf_token, name="get_csrf-token"),
    path("auth/session", views.get_session, name="get_session"),
    path("auth/signup", views.register_user, name="register_user"),
    path("auth/login", views.login_user, name="login_user"),
    path("auth/logout", views.logout_user, name="logout_user")
]
