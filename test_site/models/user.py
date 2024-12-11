from django.db import models
from django.contrib.auth.models import User as DjangoUser
from django.utils.translation import gettext_lazy as _
import re


class UserProfile(models.Model):
    user = models.OneToOneField(DjangoUser, on_delete=models.CASCADE, primary_key=True)
    profile_picture = models.URLField(null=True, default=None)
    banner = models.URLField(null=True, default=None)
    bio = models.TextField(null=True, default=None)
    pronouns = models.CharField(max_length=32, null=True, default=None)
    verified = models.BooleanField(default=False)
    online_status = models.BooleanField(default=False)
    display_name = models.CharField(max_length=128, null=True, default=None)
    privacy = models.BooleanField(default=True)
    likes = models.ManyToManyField("Post", through="PostLike", related_name="liked_posts")
    bookmarks = models.ManyToManyField("Post", through="PostBookmark", related_name="bookmarked_posts")
    followers = models.ManyToManyField("UserProfile", through="Follow", through_fields=("following", "user"), related_name="following_users")
    following = models.ManyToManyField("UserProfile", through="Follow", through_fields=("user", "following"), related_name="followed_users")

    def natural_key(self):
        return {
            "username": self.user.username,
            "pfp": self.profile_picture
        }
    
    @staticmethod
    def create_user(username: str, email: str, password: str) -> "UserProfile":
        if username == "" or username.isspace():
            raise Exception("Usename is empty")
        if email == "" or email.isspace():
            raise Exception("Email is empty")
        if password == "" or password.isspace():
            raise Exception("Password is empty")
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            raise Exception("Email is invalid")
        if UserProfile.objects.filter(user__username=username).exists():
            raise Exception("Username already exists")
        if UserProfile.objects.filter(user__email=email).exists():
            raise Exception("Email already exists")

        user = DjangoUser.objects.create_user(username=username, email=email, password=password)
        user_profile = UserProfile.objects.create(user=user)
        user_profile.save()
        return user_profile
    
    def update_profile(self,
                       display_name: str | None = None,
                       profile_picture: str | None = None,
                       banner: str | None = None,
                       bio: str | None = None,
                       pronouns: str | None = None,
                       ):
        self.display_name = display_name if display_name != "" and not display_name.isspace() else None
        self.profile_picture = profile_picture if profile_picture != "" and not profile_picture.isspace() else None
        self.banner = banner if banner != "" and not banner.isspace() else None
        self.bio = bio if bio != "" and not bio.isspace() else None
        self.pronouns = pronouns if pronouns != "" and not pronouns.isspace() else None
        self.save()

    def set_display_name(self, display_name: str | None):
        if display_name == "":
            display_name = None
        self.display_name = display_name
        self.save() 
    
    def set_profile_picture(self, profile_picture: str | None):
        if profile_picture == "":
            profile_picture = None
        self.profile_picture = profile_picture
        self.save()

    def set_banner(self, banner: str | None):
        if banner == "":
            banner = None
        self.banner = banner
        self.save()

    def set_bio(self, bio: str | None):
        if bio == "":
            bio = None
        self.bio = bio
        self.save()
    
    def set_pronouns(self, pronouns: str | None):
        if pronouns == "":
            pronouns = None
        self.pronouns = pronouns
        self.save()

    def get_display_name(self) -> str:
        return self.display_name if self.display_name is not None else self.user.username
    
    def get_posts(self) -> list["Post"]:
        from test_site.models.post import Post
        posts = Post.objects.filter(user=self)
        return posts
    
    def get_likes(self) -> list["Post"]:
        likes = self.likes.filter(postlike__like=True).order_by("-postlike__datetime")
        return likes
    
    def get_dislikes(self) -> list["Post"]:
        dislikes = self.likes.filter(postlike__like=False).order_by("-postlike__datetime")
        return dislikes
    
    def __str__(self):
        return f"{self.user.username} ({self.pk})"


class Follow(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="following_user_id")
    following = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="follow_user_id")

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "following"], name="follow_constraint")
        ]


class UserMutedWord(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    muted_word = models.TextField()


class UserBlock(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="blocking_user_id")
    blocked = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="blocked_user_id")

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "blocked"], name="user_block_constraint")
        ]

class UserSettings(models.Model):
    class SensitiveContentBehavior(models.TextChoices):
        SHOW = "SHOW", _("Show")
        BLUR = "BLUR", _("Blur")
        HIDE = "HIDE", _("Hide")

    user = models.OneToOneField(UserProfile, on_delete=models.CASCADE, primary_key=True)
    language = models.CharField(max_length=2)
    sensitive_content_behavior = models.CharField(max_length=4, choices=SensitiveContentBehavior.choices, default=SensitiveContentBehavior.BLUR)