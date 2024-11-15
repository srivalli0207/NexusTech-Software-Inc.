from django.test import TestCase

from test_site.models.forum import Forum, ForumFollow
from test_site.models.user import UserProfile


class TestForums(TestCase):
    def setUp(self):
        self.forum_owner = UserProfile.create_user("owner", "owner@gmail.com", "forumowner")
        self.test_forum = Forum.objects.create(name="test_forum", description="this is a test forum", creator=self.forum_owner)
        self.user1 = UserProfile.create_user("user1", "user1@gmail.com", "user1123")

    
    def test_forum_follow(self):
        ForumFollow.objects.create(user=self.user1, forum=self.test_forum)
        self.assertTrue(ForumFollow.objects.filter(user=self.user1, forum=self.test_forum).exists(), "User 1 follows a forum")
        
    def test_forum_unfollow(self):
        test_forum_follow = ForumFollow.objects.create(user=self.user1, forum=self.test_forum)
        self.assertTrue(ForumFollow.objects.filter(user=self.user1, forum=self.test_forum).exists(), "User 1 follows a forum")
        test_forum_follow.delete()
        self.assertFalse(ForumFollow.objects.filter(user=self.user1, forum=self.test_forum).exists(), "User 1 no longer follows a forum")

    def test_create_forum(self):
        Forum.objects.create(name="forum1", description="this is forum1", creator=self.forum_owner)
        self.assertTrue(Forum.objects.filter(name="forum1", creator=self.forum_owner).exists(), "Forum1 is created")

    def test_delete_forum(self):
        forum1=Forum.objects.create(name="forum1", description="this is forum1", creator=self.forum_owner)
        forum1.delete()
        self.assertFalse(Forum.objects.filter(name="forum1", creator=self.forum_owner).exists(), "Forum1 is gone")

