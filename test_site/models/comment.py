from django.db import models
from .user import UserProfile
from .post import Post

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
    
    @staticmethod
    def __create_like(self, user: UserProfile, like: bool) -> "CommentLike":
        like_obj = CommentLike.objects.create(comment=self, user=user, like=like)
        return like_obj

    def dislike_comment(self, user: UserProfile) -> "CommentLike":
        return self.__create_like(user, False)