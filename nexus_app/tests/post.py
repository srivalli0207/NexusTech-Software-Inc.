from django.test import TestCase
from nexus_app.models.post import Post, PostBookmark, PostLike
from nexus_app.models.user import UserProfile


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