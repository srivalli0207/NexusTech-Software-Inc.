from django.db import models
from .user import UserProfile

class DirectMessage(models.Model):
    message_id = models.AutoField(primary_key=True)
    from_user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="sending_user")
    to_user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="receiving_user")
    message = models.TextField()
    sent = models.DateTimeField()


# TODO: media