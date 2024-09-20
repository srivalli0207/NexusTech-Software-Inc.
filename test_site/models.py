from django.db import models

# Create your models here.

class User(models.Model):
    user_id = models.IntegerField(primary_key=True)
    username = models.CharField(max_length=32)
    email = models.CharField(max_length=64)
    password = models.CharField(max_length=64)
    profile_picture = models.URLField(null=True)
    bio = models.TextField(null=True)
    pronouns = models.CharField(max_length=32, null=True)
    verified = models.BooleanField(default=False)
    online_status = models.BooleanField(default=False)
    real_name = models.CharField(max_length=128, null=True)
    privacy = models.BooleanField(default=True)


class Session(models.Model):
    session_id = models.UUIDField(primary_key=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    expiration = models.DateTimeField()
    activity = models.TimeField()

class Forum(models.Model):
    name = models.CharField(max_length=32, primary_key=True)
    description = models.TextField()
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    privacy = models.BooleanField(default=True)
    created = models.DateTimeField(auto_now=True)


class Post(models.Model):
    post_id = models.IntegerField(primary_key=True)
    forum_id = models.ForeignKey(Forum, null=True, on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField(null=True)
    # TODO: CommentSetting enum
    sensitive = models.BooleanField(default=False)
    location_tag = models.TextField(null=True)


class PostMedia(models.Model):
    post_id = models.ForeignKey(Post, on_delete=models.CASCADE)
    media_type = models.CharField(max_length=8)
    url = models.URLField()
    index = models.IntegerField(default=0)


class Comment(models.Model):
    comment_id = models.IntegerField(primary_key=True)
    post_id = models.ForeignKey(Post, on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    creation_date = models.DateTimeField(auto_now=True)
    last_updated = models.DateTimeField(auto_now=True)
    content = models.TextField()
    # TODO: Like


class DirectMessage(models.Model):
    message_id = models.IntegerField(primary_key=True)
    from_user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sending_user")
    to_user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name="receiving_user")
    message = models.TextField()
    sent = models.DateTimeField()
    # TODO: media


class Report(models.Model):
    report_id = models.IntegerField(primary_key=True)
    reported_user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reported_user")
    report_user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name="report_sender")
    reason = models.TextField()
    post_id = models.ForeignKey(Post, on_delete=models.CASCADE, null=True)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, null=True)
    reported_at = models.DateTimeField()

