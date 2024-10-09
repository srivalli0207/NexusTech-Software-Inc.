from django.db import models
from django.utils.translation import gettext_lazy as _
from .user import UserProfile


class MessageConversation(models.Model):
    conversation_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=128, null=True, default=None)
    group = models.BooleanField(default=False)
    creator = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="creator", null=True, default=None)
    members = models.ManyToManyField(UserProfile, through="MessageConversationMember")


class MessageConversationMember(models.Model):
    conversation = models.ForeignKey(MessageConversation, on_delete=models.CASCADE)
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)


class Message(models.Model):
    message_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    conversation = models.ForeignKey(MessageConversation, on_delete=models.CASCADE, related_name="messages")
    text = models.TextField(null=True)
    sent = models.DateTimeField(auto_now_add=True)


class MessageMedia(models.Model):
    class MediaType(models.TextChoices):
        PHOTO = "PHOTO", _("PHOTO")
        VIDEO = "VIDEO", _("VIDEO")

    message = models.ForeignKey(Message, on_delete=models.CASCADE)
    media_type = models.CharField(max_length=5, choices=MediaType.choices)
    url = models.URLField()
    index = models.IntegerField(default=0)

