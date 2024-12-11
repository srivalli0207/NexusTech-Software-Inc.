from django.contrib.auth.models import User as DjangoUser
from django.http import HttpRequest
from test_site.models.forum import Forum, ForumFollow
from test_site.models.user import Follow, UserProfile
from test_site.models.post import Post, PostLike, PostMedia
from test_site.models.message import Message, MessageConversation
from test_site.models.comment import Comment, CommentLike

def serialize_user_profile(user: UserProfile, request: HttpRequest):
    fields = {
        "username": user.user.username,
        "displayName": user.display_name,
        "profilePicture": user.profile_picture,
        "bio": user.bio,
        "verified": user.verified,
        "banner": user.banner,
        "pronouns": user.pronouns,
        "following": None,
        "followingYou": None,
        "followerCount": user.followers.count(),
        "followingCount": user.following.count(),
        "userActions": None,
        "blocking": None,
        "blockingYou": None
    }

    if request.user.is_authenticated:
        user_actions = {
            "following": Follow.objects.filter(user_id=request.user.id, following=user).first() is not None,
            "followingYou": Follow.objects.filter(user=user, following__user=request.user.id).first() is not None,
            "blocking": False,
            "blockingYou": False
        }
        fields["userActions"] = user_actions

    return fields

def serialize_post(post: Post, request: HttpRequest):
    fields = {
        "id": post.post_id,
        "user": serialize_user_profile(post.user, request),
        "forum": post.forum.name if post.forum is not None else None,
        "text": post.text,
        "date": post.creation_date,
        "media": [serialize_post_media(media) for media in post.get_media()],
        "actions": None,
        "likeCount": post.get_like_count(),
        "dislikeCount": post.get_dislike_count(),
        "commentCount": post.get_comment_count()
    }

    if request is not None and request.user.is_authenticated:
        actions = {
            "liked": like.like if (like := PostLike.objects.filter(user_id=request.user.id, post_id=post.post_id).first()) is not None else None,
            "bookmarked": post.bookmarkers.filter(user_id=request.user.id).first() is not None,
        }
        fields["actions"] = actions

    return fields

def serialize_post_media(media: PostMedia):
    fields = {
        "id": media.id,
        "type": media.media_type,
        "url": media.url
    }
    return fields

def serialize_message(message: Message, request: HttpRequest):
    fields = {
        "id": message.pk,
        "user": serialize_user_profile(message.user, request),
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
        "lastMessage": serialize_message(conversation.last_message, request) if conversation.last_message is not None else None,
        "members": [serialize_user_profile(member, request) for member in conversation.members.all() if member.pk != request.user.pk]
    }
    return fields

def serialize_forum(forum: Forum, request: HttpRequest):
    fields = {
        "name": forum.name,
        "description": forum.description,
        "creator": serialize_user_profile(forum.creator, request),
        "banner": forum.banner,
        "icon": forum.icon,
        "userActions": None
    }

    if request.user.is_authenticated:
        user_actions = {
            "following": ForumFollow.objects.filter(user_id=request.user.id, forum=forum).first() is not None,
        }
        fields["userActions"] = user_actions

    return fields

def serialize_comment(comment: Comment, request: HttpRequest):
    profile = UserProfile.objects.get(user_id=request.user.id)
    comment_like = CommentLike.objects.filter(comment=comment, user=profile)
    res = None
    if comment_like.exists():
        res = comment_like.first().like

    fields = {
        "id" : comment.comment_id,
        "creation_date" : comment.creation_date,
        "last_updated" : comment.last_updated,
        "content" : comment.content,
        "liked": res,
        "likeCount": CommentLike.objects.filter(comment=comment, like=True).count(),
        "dislikeCount": CommentLike.objects.filter(comment=comment, like=False).count(),
        "replyCount": Comment.objects.filter(parent=comment).count(),
        "user": serialize_user_profile(comment.user, request)
    }
    return fields