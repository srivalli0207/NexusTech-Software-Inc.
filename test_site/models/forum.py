from django.db import models
from .user import UserProfile

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