from django.test import TestCase
from test_site.models.user import UserProfile, Follow, UserBlock
from test_site.models.post import Post, PostLike, PostBookmark
from test_site.models.message import MessageConversation, MessageConversationMember, Message, MessageMedia 
from test_site.models.comment import Comment, CommentLike 
from test_site.models.report import Report
from test_site.models.forum import Forum, ForumFollow, ForumModerator 
from django.contrib.auth import get_user_model
import datetime
from django.utils import timezone

USER_MODEL = get_user_model()

# Create your tests here.
class UserProfileTests(TestCase):
    user1: UserProfile
    user2: UserProfile
        
    def setUp(self):
        self.user1 = UserProfile.create_user("tester", "test@gmail.com", "testing123")
        self.user2 = UserProfile.create_user("tester2", "test2@gmail.com", "testing456")

    def test_user_create_username_empty(self):
        self.assertRaisesMessage(
            expected_exception=Exception,
            expected_message="Username is empty",
            callable_obj=lambda: UserProfile.create_user("", "test@example.com", "password")
        )
    
    def test_user_create_email_empty(self):
        self.assertRaisesMessage(
            expected_exception=Exception,
            expected_message="Email is empty",
            callable_obj=lambda: UserProfile.create_user("username", "", "password")
        )

    def test_user_create_password_empty(self):
        self.assertRaisesMessage(
            expected_exception=Exception,
            expected_message="Password is empty",
            callable_obj=lambda: UserProfile.create_user("username", "test@example.com", "")
        )
        
    def test_user_create_email_invalid(self):
        self.assertRaisesMessage(
            expected_exception=Exception,
            expected_message="Email is invalid",
            callable_obj=lambda: UserProfile.create_user("username", "testexample.com", "password"),
        )

    def test_user_create_username_exists(self):
        self.assertRaisesMessage(
            expected_exception=Exception,
            expected_message="Username already exists",
            callable_obj=lambda: UserProfile.create_user("tester", "test@example.com", "password"),
        )

    def test_user_create_email_exists(self):
        self.assertRaisesMessage(
            expected_exception=Exception,
            expected_message="Email already exists",
            callable_obj=lambda: UserProfile.create_user("example", "test@gmail.com", "password"),
        )
    
    def test_user_create_success(self):
        user_profile = UserProfile.create_user("username", "test@example.com", "password")
        self.assertIsInstance(user_profile, UserProfile, "user exists")

    def test_edit_profile(self):
        user = self.user1
        user.set_bio("hi")
        self.assertEqual(user.bio, "hi")
        user.set_bio("")
        self.assertEqual(user.bio, None)
    
    def test_user_follow(self):
        follow_obj = Follow.objects.create(user=self.user1, following=self.user2)
        self.assertTrue(Follow.objects.filter(user=self.user1, following=self.user2).exists(), "User 1 follows User 2")
        follow_obj.delete()
        self.assertFalse(Follow.objects.filter(user=self.user1, following=self.user2).exists(), "User 1 no longer follows User 2")

    def test_user_unfollow(self):
        Follow.objects.create(user=self.user1, following=self.user2)
        Follow.objects.filter(user=self.user1, following=self.user2).delete()
        self.assertFalse(Follow.objects.filter(user=self.user1, following=self.user2).exists(), "User 1 no longer follows User 2")
    
    def test_user_block(self):
        UserBlock.objects.create(user=self.user1, blocked=self.user2)
        self.assertTrue(UserBlock.objects.filter(user=self.user1, blocked=self.user2).exists(), "User 1 blocked User 2")

class PostTests(TestCase):
    def setUp(self):
        self.user1 = UserProfile.create_user("tester", "test@gmail.com", "testing123")
        self.post = Post.objects.create(user=self.user1, text="This is a post.")


    def test_create_post(self):
        post = Post.objects.create(user=self.user1, text="Test post 2")
        self.assertTrue(Post.objects.filter(user=self.user1))
        self.assertEqual(post.text, "Test post 2")
        self.assertEqual(post.user, self.user1)

    def test_post_empty(self):
        self.assertRaisesMessage(
            expected_exception=Exception,
            expected_message="text is empty",
            callable_obj=lambda: Post.create_post_text("")
        )

    def test_post_like(self):
        like_obj = self.post.like_post(self.user1)
        self.assertTrue(self.user1.likes.filter(post_id=self.post.post_id).exists())
        self.assertTrue(like_obj.like)
    
    def test_post_remove_like(self):
        PostLike.objects.create(post=self.post, user=self.user1)
        PostLike.objects.filter(post=self.post, user=self.user1).delete()
        self.assertFalse(PostLike.objects.filter(post=self.post, user=self.user1).exists())
        
    def test_post_dislike(self):
        like_obj = self.post.dislike_post(self.user1)
        self.assertTrue(self.user1.likes.filter(post_id=self.post.post_id).exists())
        self.assertFalse(like_obj.like)
        
    def test_post_remove_dislike(self):
        self.post.dislike_post(self.user1)
        self.post.unlike_post(self.user1)
        self.assertFalse(PostLike.objects.filter(post=self.post, user=self.user1).exists())

    def test_post_bookmark(self):
        PostBookmark.objects.create(post=self.post, user=self.user1).save()
        self.assertTrue(PostBookmark.objects.filter(user=self.user1, post=self.post).exists(), "User 1 bookmarked post")

    def test_post_remove_bookmark(self):
        bookmark_obj = PostBookmark.objects.create(post=self.post, user=self.user1)
        bookmark_obj.delete()
        self.assertFalse(PostBookmark.objects.filter(post=self.post, user=self.user1).exists())

    def test_delete_post(self):
        post_obj = Post.objects.create(user=self.user1, text="Test post")
        post_obj.save()
        post_obj.delete()
        self.assertFalse(Post.objects.filter(post_id=post_obj.post_id))


class TestComments(TestCase):
    def setUp(self):
        self.user1 = UserProfile.create_user("tester", "test@gmail.com", "testing123")
        self.post = Post.objects.create(user=self.user1, text="This is a post.")
    
    def test_create_comment(self):
        comment = Comment.objects.create(post=self.post, user=self.user1, content="Test comment")
        self.assertTrue(Comment.objects.filter(comment_id=comment.comment_id).exists())
        self.assertEqual(comment.content, "Test comment")
 
    def test_like_comment(self):
        comment = Comment.objects.create(post=self.post, user=self.user1, content="Test comment")
        comment_like = CommentLike.objects.create(comment=comment, user=self.user1, like=True)
        self.assertTrue(CommentLike.objects.filter(comment_id=comment.comment_id).exists())

    def test_remove_like_comment(self):
        comment = Comment.objects.create(post=self.post, user=self.user1, content="Test comment")
        CommentLike.objects.create(comment=comment, user=self.user1, like=True)
        CommentLike.objects.filter(comment=comment, user=self.user1, like=True).first().delete()
        self.assertFalse(CommentLike.objects.filter(comment=comment, user=self.user1, like=True).exists())
    
    def test_dislike_comment(self):
        comment = Comment.objects.create(post=self.post, user=self.user1, content="Test comment")
        # TODO: implement like/dislike_comment
        # comment.dislike_comment(self.user1)
        comment_like = CommentLike.objects.create(comment=comment, user=self.user1, like=False)
        self.assertTrue(CommentLike.objects.filter(comment_id=comment.comment_id, user=self.user1, like=False).exists())


    def test_remove_dislike_comment(self):
        comment = Comment.objects.create(post=self.post, user=self.user1, content="Test comment")
        CommentLike.objects.create(comment=comment, user=self.user1, like=False)
        CommentLike.objects.filter(comment=comment, user=self.user1, like=False).first().delete()
        self.assertFalse(CommentLike.objects.filter(comment=comment, user=self.user1, like=False).exists())

    def test_delete_comment(self):
        comment = Comment.objects.create(post=self.post, user=self.user1, content="Test comment")
        comment.delete()
        self.assertFalse(Comment.objects.filter(comment_id=comment.comment_id).exists())
        

class TestMessages(TestCase):
    def setUp(self):
        self.user1 = UserProfile.create_user("sender", "send@gmail.com", "sending_msg")
        self.user2 = UserProfile.create_user("receiver", "receive@gmail.com", "receiving_msg")
        self.user3 = UserProfile.create_user("extra", "extra@gmail.com", "extra_msg")
        self.conversation = MessageConversation.objects.create(name="test_chat")      
        self.conversation.members.add(self.user1, self.user2)
        self.assertEqual(self.conversation.name, "test_chat")
        
        
    def test_create_conversation(self):
        conversation = MessageConversation.objects.create(group=True)
        conversation.members.add(self.user1, self.user2)
        self.assertTrue(MessageConversation.objects.filter(members=self.user1, group=True, conversation_id=conversation.conversation_id).exists())
    
    def test_get_conversation(self):
        self.assertFalse(MessageConversation.get_conversation_exists(self.user1, self.user2))
        conversation = MessageConversation.get_conversation(self.user1, self.user2)
        self.assertFalse(conversation.group)
        self.assertTrue(MessageConversation.get_conversation_exists(self.user1, self.user2))
        self.assertEqual(MessageConversation.get_conversation(self.user1, self.user2).conversation_id, conversation.conversation_id)
        
    
    def test_add_conversation_member(self):
        conversation = MessageConversation.create_conversation(self.user1, self.user2)
        self.assertFalse(conversation.group)
        conversation.add_member(self.user3)
        self.assertTrue(conversation.group)
        self.assertTrue(MessageConversation.objects
                        .filter(members=self.user1, group=True, conversation_id=conversation.conversation_id)
                        .filter(members=self.user2)
                        .filter(members=self.user3)
                        .exists())
        
    def test_remove_conversation_member(self):
        conversation = MessageConversation.objects.create(group=True)
        conversation.add_member(self.user1, self.user2, self.user3)
        conversation.remove_member(self.user3)
        self.assertFalse(self.user3 in conversation.members.all())

    def test_send_message(self):
        message = self.conversation.send_message(self.user1, "hello")
        self.assertEqual(message.text, "hello")

    # def test_delete_message(self):
    #     message = self.conversation.send_message(self.user1, "hello")
    #     self.message.delete()
    #     self.assertFalse

        

    
class TestReport(TestCase):
    def setUp(self):
        self.user1 = UserProfile.create_user("reporter", "report@gmail.com", "testing123")
        self.user2 = UserProfile.create_user("reported", "reported@gmail.com", "testing456")
        self.post = Post.objects.create(user=self.user1, text="This is a post.")

    def test_report_user(self):
        test_report = Report.objects.create(report_user=self.user1, reported_user= self.user2, reason="test reason", reported_at=timezone.make_aware(datetime.datetime(2023, 11, 13, 14, 25, 45)))
        self.assertTrue(Report.objects.filter(report_id=test_report.report_id))


    def test_report_post(self):
        test_report_post = Report.objects.create(report_user=self.user2, reported_user=self.user1, post=self.post, reason="test post reason", reported_at=timezone.make_aware(datetime.datetime(2023, 11, 13, 14, 25, 45)))
        self.assertTrue(Report.objects.filter(report_id=test_report_post.report_id))

    def test_report_comment(self):
        comment = Comment.objects.create(post=self.post, user=self.user1, content="Test comment")
        test_report_comment = Report.objects.create(report_user=self.user2, reported_user=self.user1, comment=comment, reason="test comment reason", reported_at=timezone.make_aware(datetime.datetime(2023, 11, 13, 14, 25, 45)))
        self.assertTrue(Report.objects.filter(report_id=test_report_comment.report_id))

        
class TestForums(TestCase):
    def setUp(self):
        self.forum_owner = UserProfile.create_user("owner", "owner@gmail.com", "forumowner")
        self.test_forum = Forum.objects.create(name="test_forum", description="this is a test forum", creator=self.forum_owner)
    
    def test_forum_follow(self):
        ...
        
    def test_forum_unfollow(self):
        ...

    def test_create_forum(self):
        ...

    def test_delete_forum(self):
        ...