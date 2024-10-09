from django.db import models
from django.contrib.auth.models import User as DjangoUser
from django.utils.translation import gettext_lazy as _


class UserProfile(models.Model):
    user = models.OneToOneField(DjangoUser, on_delete=models.CASCADE, primary_key=True)
    profile_picture = models.URLField(null=True, default=None)
    bio = models.TextField(null=True, default=None)
    pronouns = models.CharField(max_length=32, null=True, default=None)
    verified = models.BooleanField(default=False)
    online_status = models.BooleanField(default=False)
    real_name = models.CharField(max_length=128, null=True, default=None)
    privacy = models.BooleanField(default=True)

    def natural_key(self):
        return {
            "username": self.user.username,
            "pfp": self.profile_picture
        }
    
    def __str__(self):
        return f"{self.user.username} ({self.pk})"


class Follow(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="following_user_id")
    following = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="follow_user_id")

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "following"], name="follow_constraint")
        ]


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

class UserSettings(models.Model):
    class SensitiveContentBehavior(models.TextChoices):
        SHOW = "SHOW", _("Show")
        BLUR = "BLUR", _("Blur")
        HIDE = "HIDE", _("Hide")

    user = models.OneToOneField(UserProfile, on_delete=models.CASCADE, primary_key=True)
    language = models.CharField(max_length=2)
    sensitive_content_behavior = models.CharField(max_length=4, choices=SensitiveContentBehavior.choices, default=SensitiveContentBehavior.BLUR)