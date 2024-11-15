from django.db import models
from django.utils.translation import gettext_lazy as _
from .user import UserProfile


class MessageConversation(models.Model):
    conversation_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=128, null=True, default=None)
    group = models.BooleanField(default=False)
    creator = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="creator", null=True, default=None)
    members = models.ManyToManyField(UserProfile, through="MessageConversationMember")
    last_message = models.ForeignKey("Message", on_delete=models.SET_NULL, null=True, default=None)

    def __str__(self):
        return f"{self.conversation_id} ({self.name}): {', '.join([member.user.username for member in self.members.all()])}"
    
    def send_message(self, user: UserProfile, text: str) -> "Message":
        message = Message.objects.create(user=user, conversation=self, text=text)
        self.last_message = message
        return message
    
    def add_member(self, *members: list[UserProfile]):
        for member in members:
            self.members.add(member)
        if self.members.all().count() > 2:
            self.group = True
            self.save()

    def remove_member(self, member: UserProfile):
        self.members.remove(member)
        if self.members.all().count() == 2:
            self.group = False
            self.save()

    @staticmethod
    def create_conversation(user: UserProfile, target: UserProfile) -> "MessageConversation":
        conversation = MessageConversation.objects.create()
        conversation.add_member(user, target)
        conversation.creator = user
        return conversation
    
    @staticmethod
    def get_conversation(user: UserProfile, target: UserProfile) -> "MessageConversation":
        conversation = MessageConversation.objects.filter(members=user, group=False).filter(members=target).first()
        if conversation is None:
            conversation = MessageConversation.create_conversation(user, target)
        return conversation
    
    @staticmethod
    def get_conversation_exists(user: UserProfile, target: UserProfile) -> bool:
        return MessageConversation.objects.filter(members=user, group=False).filter(members=target).exists()


class MessageConversationMember(models.Model):
    conversation = models.ForeignKey(MessageConversation, on_delete=models.CASCADE)
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="member")
        
    def __str__(self):
        return f"{self.conversation.conversation_id}-{self.pk}: {self.user.user.username}"


class Message(models.Model):
    message_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    conversation = models.ForeignKey(MessageConversation, on_delete=models.CASCADE, related_name="messages")
    text = models.TextField(null=True)
    sent = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.conversation.conversation_id}-{self.message_id}: {self.user.user.username} - {self.text}"


class MessageMedia(models.Model):
    class MediaType(models.TextChoices):
        PHOTO = "PHOTO", _("PHOTO")
        VIDEO = "VIDEO", _("VIDEO")

    message = models.ForeignKey(Message, on_delete=models.CASCADE)
    media_type = models.CharField(max_length=5, choices=MediaType.choices)
    url = models.URLField()
    index = models.IntegerField(default=0)

