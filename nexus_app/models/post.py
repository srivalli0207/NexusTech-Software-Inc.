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
    likers = models.ManyToManyField(UserProfile, through="PostLike", related_name="liker")
    bookmarkers = models.ManyToManyField(UserProfile, through="PostBookmark", related_name="bookmarker")

    def __str__(self):
        return f"{self.post_id}: {self.user.user.username} - {self.text}"


    @staticmethod
    def create_post_text(text: str) -> "Post":
        if (text == "" or text.isspace()):
            raise Exception("text is empty")
        
    def __create_like(self, user: UserProfile, like: bool) -> "PostLike":
        like_obj = PostLike.objects.create(post=self, user=user, like=like)
        return like_obj
    
    def dislike_post(self, user: UserProfile) -> "PostLike":
        return self.__create_like(user, False)

    def like_post(self, user: UserProfile) -> "PostLike":
        return self.__create_like(user, True)
    
    def unlike_post(self, user: UserProfile):
        PostLike.objects.filter(post=self, user=user).first().delete()

    def get_like_count(self) -> int:
        return self.likers.filter(postlike__like=True).count()
    
    def get_dislike_count(self) -> int:
        return self.likers.filter(postlike__like=False).count()
    
    def get_comment_count(self) -> int:
        from nexus_app.models.comment import Comment
        return Comment.objects.filter(post=self).count()

    def get_media(self) -> list["PostMedia"]:
        medias = PostMedia.objects.filter(post=self).order_by("index")
        return medias

class PostMedia(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    media_type = models.CharField(max_length=8)
    url = models.URLField()
    index = models.IntegerField(default=0)


class PostLike(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    like = models.BooleanField(default=True)
    datetime = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["post", "user"], name="post_like_unq_constraint")
        ]


class PostBookmark(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    datetime = models.DateTimeField(auto_now_add=True)

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