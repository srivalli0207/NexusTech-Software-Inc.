from django.contrib.auth.models import User as DjangoUser
from django.http import HttpRequest
from test_site.models.forum import Forum
from test_site.models.user import Follow, UserProfile
from test_site.models.post import Post, PostLike, PostMedia
from test_site.models.message import Message, MessageConversation
from test_site.models.comment import Comment, CommentLike

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
        "forum": post.forum.name if post.forum is not None else None,
        "text": post.text,
        "date": post.creation_date,
        "media": [serialize_post_media(media) for media in post.get_media()],
        "actions": None,
        "likeCount": post.likers.filter(postlike__like=True).count(),
        "dislikeCount": post.likers.filter(postlike__like=False).count(),
        "comment_count": Comment.objects.filter(post=post).count(),
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

def serialize_forum(forum: Forum):
    fields = {
        "name": forum.name,
        "description": forum.description,
        "creator": serialize_user(forum.creator),
        "banner": forum.banner,
        "icon": forum.icon
    }
    return fields

def serialize_comment(comment: Comment, request: HttpRequest):
    profile = UserProfile.objects.get(user_id=request.user.id)
    comment_like = CommentLike.objects.filter(comment=comment, user=profile)
    res = None
    if (comment_like.exists()):
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
        "user" : {
            "username": comment.user.user.username,
            "avatar": comment.user.profile_picture,
            "banner": comment.user.banner,
            "display_name": comment.user.display_name,
            "bio": comment.user.bio,
        }
    }
    return fields