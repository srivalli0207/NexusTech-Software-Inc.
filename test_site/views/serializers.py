from django.contrib.auth.models import User as DjangoUser
from django.http import HttpRequest
from test_site.models.user import Follow, UserProfile
from test_site.models.post import Post, PostLike
from test_site.models.message import Message, MessageConversation

def serialize_user(user: UserProfile):
    fields = {
        "username": user.user.username,
        "displayName": user.display_name,
        "profilePicture": user.profile_picture,
        "bio": user.bio,
        "verified": user.verified
    }
    return fields

def serialize_user_profile(user: UserProfile, auth_user: DjangoUser = None):
    fields = {
        **serialize_user(user),
        "banner": user.banner,
        "pronouns": user.pronouns,
        "following": None,
        "followingYou": None,
        "followerCount": user.followers.count(),
        "followingCount": user.following.count(),
        "blocking": None,
        "blockingYou": None
    }

    if auth_user is not None:
        following_obj = Follow.objects.filter(user_id=auth_user.id, following=user).first()
        follows_obj = Follow.objects.filter(user=user, following__user=auth_user.id).first()
        fields["following"] = following_obj is not None
        fields["followingYou"] = follows_obj is not None

    return fields

def serialize_post(post: Post, request: HttpRequest = None):
    fields = {
        "id": post.post_id,
        "user": serialize_user(post.user),
        "text": post.text,
        "date": post.creation_date,
        "media": [],
        "actions": None
    }

    if request is not None and request.user.is_authenticated:
        actions = {
            "liked": like.like if (like := PostLike.objects.filter(user_id=request.user.id, post_id=post.post_id).first()) is not None else None,
            "bookmarked": post.bookmarkers.filter(user_id=request.user.id).first() is not None,
        }
        fields["actions"] = actions

    return fields

def serialize_message(message: Message):
    fields = {
        "id": message.pk,
        "user": serialize_user(message.user),
        "text": message.text,
        "sent": message.sent,
        "media": []
    }
    return fields

def serialize_conversation(conversation: MessageConversation, request: HttpRequest):
    fields = {
        "id": conversation.conversation_id,
        "name": conversation.name,
        "group": conversation.group,
        "lastMessage": serialize_message(conversation.last_message) if conversation.last_message is not None else None,
        "members": [serialize_user(member) for member in conversation.members.all() if member.pk != request.user.pk]
    }
    return fields