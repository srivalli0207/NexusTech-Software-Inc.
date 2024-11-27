from django.test import TestCase

from test_site.models.comment import Comment, CommentLike
from test_site.models.post import Post
from test_site.models.user import UserProfile

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
        comment.like_comment(self.user1)
        self.assertTrue(CommentLike.objects.filter(comment_id=comment.comment_id).exists())

    def test_remove_like_comment(self):
        comment = Comment.objects.create(post=self.post, user=self.user1, content="Test comment")
        CommentLike.objects.create(comment=comment, user=self.user1, like=True)
        CommentLike.objects.filter(comment=comment, user=self.user1, like=True).first().delete()
        self.assertFalse(CommentLike.objects.filter(comment=comment, user=self.user1, like=True).exists())
    
    def test_dislike_comment(self):
        comment = Comment.objects.create(post=self.post, user=self.user1, content="Test comment")
        comment.dislike_comment(self.user1)
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