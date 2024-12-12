from django.db import models
from .user import UserProfile
from .post import Post
from .comment import Comment

class Report(models.Model):
    report_id = models.AutoField(primary_key=True)
    reported_user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="reported_user")
    report_user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="report_sender")
    reason = models.TextField()
    post = models.ForeignKey(Post, on_delete=models.CASCADE, null=True)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, null=True)
    reported_at = models.DateTimeField()