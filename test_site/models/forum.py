from django.db import models
from .user import UserProfile

class Forum(models.Model):
    name = models.CharField(max_length=32, primary_key=True)
    description = models.TextField()
    creator = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    privacy = models.BooleanField(default=True)
    created = models.DateTimeField(auto_now=True)
    banner = models.URLField(null=True, default=None)
    icon = models.URLField(null=True, default=None)
    followers = models.ManyToManyField(UserProfile, through="ForumFollow", related_name="forum_follower")

    @staticmethod
    def get_forums() -> list["Forum"]:
        return Forum.objects.all()
    
    @staticmethod
    def get_forum(forum_name: str) -> "Forum":
        res = Forum.objects.filter(name=forum_name)
        if res.exists():
            return res.first()
        else:
            return None
        
    def get_posts(self) -> list["Post"]:
        from test_site.models.post import Post

        posts = Post.objects.filter(forum=self)
        return posts
    
    def follow_forum(self, user: UserProfile) -> bool:
        if self.followers.filter(user_id=user.pk).exists():
            self.followers.remove(user)
            res = False
        else:
            self.followers.add(user)
            res = True
        self.save()
        return res



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