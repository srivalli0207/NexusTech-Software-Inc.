from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import User as DjangoUser

# Create your models here.

class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=32, unique=True)
    email = models.CharField(max_length=64)
    password = models.CharField(max_length=64)
    profile_picture = models.URLField(null=True, default=None)
    bio = models.TextField(null=True, default=None)
    pronouns = models.CharField(max_length=32, null=True, default=None)
    verified = models.BooleanField(default=False)
    online_status = models.BooleanField(default=False)
    real_name = models.CharField(max_length=128, null=True, default=None)
    privacy = models.BooleanField(default=True)


class UserMutedWord(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    muted_word = models.TextField()


class UserBlock(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name="blocking_user_id")
    blocked_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name="blocked_user_id")

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user_id", "blocked_id"], name="user_block_constraint")
        ]


class Follow(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name="following_user_id")
    following_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name="follow_user_id")

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user_id", "following_id"], name="follow_constraint")
        ]


class Session(models.Model):
    session_id = models.UUIDField(primary_key=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    expiration = models.DateTimeField()
    activity = models.TimeField()


class Forum(models.Model):
    name = models.CharField(max_length=32, primary_key=True)
    description = models.TextField()
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    privacy = models.BooleanField(default=True)
    created = models.DateTimeField(auto_now=True)


class ForumFollow(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    forum_name = models.ForeignKey(Forum, on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user_id", "forum_name"], name="forum_follow_unq_constraint")
        ]


class ForumModerator(models.Model):
    name = models.ForeignKey(Forum, on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["name", "user_id"], name="forum_moderator_unq_constraint")
        ]


class Post(models.Model):
    class PostCommentSetting(models.TextChoices):
        ALL = "ALL", _("All")
        FOLLOWING = "FOLLOWING", _("Following")
        NONE = "NONE", _("None")

    post_id = models.AutoField(primary_key=True)
    forum_id = models.ForeignKey(Forum, null=True, on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField(null=True)
    comment_setting = models.CharField(max_length=9, choices=PostCommentSetting.choices, default=PostCommentSetting.ALL)
    sensitive = models.BooleanField(default=False)
    location_tag = models.TextField(null=True)
    creation_date = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)


class PostMedia(models.Model):
    post_id = models.ForeignKey(Post, on_delete=models.CASCADE)
    media_type = models.CharField(max_length=8)
    url = models.URLField()
    index = models.IntegerField(default=0)


class PostLike(models.Model):
    post_id = models.ForeignKey(Post, on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    like = models.BooleanField(default=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["post_id", "user_id"], name="post_like_unq_constraint")
        ]


class PostBookmark(models.Model):
    post_id = models.ForeignKey(Post, on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["post_id", "user_id"], name="post_bookmark_unq_constraint")
        ]


class PostUserTag(models.Model):
    post_id = models.ForeignKey(Post, on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["post_id", "user_id"], name="post_user_tag_unq_constraint")
        ]


class Comment(models.Model):
    comment_id = models.AutoField(primary_key=True)
    post_id = models.ForeignKey(Post, on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    parent_id = models.ForeignKey("self", on_delete=models.SET_NULL, null=True, default=None)
    creation_date = models.DateTimeField(auto_now=True)
    last_updated = models.DateTimeField(auto_now=True)
    content = models.TextField()


class CommentLike(models.Model):
    comment_id = models.ForeignKey(Comment, on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, default=None)
    like = models.BooleanField(default=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["comment_id", "user_id"], name="comment_like_unq_constraint")
        ]


class DirectMessage(models.Model):
    message_id = models.AutoField(primary_key=True)
    from_user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sending_user")
    to_user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name="receiving_user")
    message = models.TextField()
    sent = models.DateTimeField()
    # TODO: media


class Report(models.Model):
    report_id = models.AutoField(primary_key=True)
    reported_user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reported_user")
    report_user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name="report_sender")
    reason = models.TextField()
    post_id = models.ForeignKey(Post, on_delete=models.CASCADE, null=True)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, null=True)
    reported_at = models.DateTimeField()


class UserSettings(models.Model):
    class SensitiveContentBehavior(models.TextChoices):
        SHOW = "SHOW", _("Show")
        BLUR = "BLUR", _("Blur")
        HIDE = "HIDE", _("Hide")

    user_id = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    language = models.CharField(max_length=2)
    sensitive_content_behavior = models.CharField(max_length=4, choices=SensitiveContentBehavior.choices, default=SensitiveContentBehavior.BLUR)
