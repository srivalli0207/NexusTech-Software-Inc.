from django.db import models
from .forum import Forum
from .user import UserProfile
from django.utils.translation import gettext_lazy as _

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