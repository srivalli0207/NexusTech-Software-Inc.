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
