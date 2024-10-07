from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import User as DjangoUser

# Create your models here.

class UserProfile(models.Model):
    user = models.OneToOneField(DjangoUser, on_delete=models.CASCADE, primary_key=True)
    profile_picture = models.URLField(null=True, default=None)
    bio = models.TextField(null=True, default=None)
    pronouns = models.CharField(max_length=32, null=True, default=None)
    verified = models.BooleanField(default=False)
    online_status = models.BooleanField(default=False)
    real_name = models.CharField(max_length=128, null=True, default=None)
    privacy = models.BooleanField(default=True)


class UserMutedWord(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    muted_word = models.TextField()


class UserBlock(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="blocking_user_id")
    blocked = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="blocked_user_id")

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "blocked"], name="user_block_constraint")
        ]


class Follow(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="following_user_id")
    following = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="follow_user_id")

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "following"], name="follow_constraint")
        ]


class Forum(models.Model):
    name = models.CharField(max_length=32, primary_key=True)
    description = models.TextField()
    creator = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    privacy = models.BooleanField(default=True)
    created = models.DateTimeField(auto_now=True)


class ForumFollow(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    forum = models.ForeignKey(Forum, on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "forum"], name="forum_follow_unq_constraint")
        ]


class ForumModerator(models.Model):
    forum = models.ForeignKey(Forum, on_delete=models.CASCADE)
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["forum", "user"], name="forum_moderator_unq_constraint")
        ]


class Post(models.Model):
    class PostCommentSetting(models.TextChoices):
        ALL = "ALL", _("All")
        FOLLOWING = "FOLLOWING", _("Following")
        NONE = "NONE", _("None")

    post_id = models.AutoField(primary_key=True)
    forum = models.ForeignKey(Forum, null=True, default=None, on_delete=models.CASCADE)
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    text = models.TextField(null=True)
    comment_setting = models.CharField(max_length=9, choices=PostCommentSetting.choices, default=PostCommentSetting.ALL)
    sensitive = models.BooleanField(default=False)
    location_tag = models.TextField(null=True)
    creation_date = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)


class PostMedia(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    media_type = models.CharField(max_length=8)
    url = models.URLField()
    index = models.IntegerField(default=0)


class PostLike(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    like = models.BooleanField(default=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["post", "user"], name="post_like_unq_constraint")
        ]


class PostBookmark(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["post", "user"], name="post_bookmark_unq_constraint")
        ]


class PostUserTag(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["post", "user"], name="post_user_tag_unq_constraint")
        ]


class Comment(models.Model):
    comment_id = models.AutoField(primary_key=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    parent = models.ForeignKey("self", on_delete=models.SET_NULL, null=True, default=None)
    creation_date = models.DateTimeField(auto_now=True)
    last_updated = models.DateTimeField(auto_now=True)
    content = models.TextField()


class CommentLike(models.Model):
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)
    user = models.ForeignKey(UserProfile, on_delete=models.SET_NULL, null=True, default=None)
    like = models.BooleanField(default=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["comment", "user"], name="comment_like_unq_constraint")
        ]


class DirectMessage(models.Model):
    message_id = models.AutoField(primary_key=True)
    from_user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="sending_user")
    to_user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="receiving_user")
    message = models.TextField()
    sent = models.DateTimeField()
    # TODO: media


class Report(models.Model):
    report_id = models.AutoField(primary_key=True)
    reported_user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="reported_user")
    report_user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="report_sender")
    reason = models.TextField()
    post = models.ForeignKey(Post, on_delete=models.CASCADE, null=True)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, null=True)
    reported_at = models.DateTimeField()


class UserSettings(models.Model):
    class SensitiveContentBehavior(models.TextChoices):
        SHOW = "SHOW", _("Show")
        BLUR = "BLUR", _("Blur")
        HIDE = "HIDE", _("Hide")

    user = models.OneToOneField(UserProfile, on_delete=models.CASCADE, primary_key=True)
    language = models.CharField(max_length=2)
    sensitive_content_behavior = models.CharField(max_length=4, choices=SensitiveContentBehavior.choices, default=SensitiveContentBehavior.BLUR)
