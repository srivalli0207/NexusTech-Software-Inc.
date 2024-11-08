from django.test import TestCase
from test_site.models.user import UserProfile, Follow, UserBlock
from django.contrib.auth import get_user_model
from django.test import Client

USER_MODEL = get_user_model()

# Create your tests here.
class UserProfileTests(TestCase):
    user1: UserProfile
    user2: UserProfile
    
    def setUp(self):
        self.user1 = UserProfile.create_user("tester", "test@gmail.com", "testing123")
        self.user2 = UserProfile.create_user("tester2", "test2@gmail.com", "testing456")

    def test_user_profile_creation(self):
        self.assertRaisesMessage(
            expected_exception=Exception,
            expected_message="Username is empty",
            callable_obj=lambda: UserProfile.create_user("", "test@example.com", "password")
        )
        self.assertRaisesMessage(
            expected_exception=Exception,
            expected_message="Email is empty",
            callable_obj=lambda: UserProfile.create_user("username", "", "password")
        )
        self.assertRaisesMessage(
            expected_exception=Exception,
            expected_message="Password is empty",
            callable_obj=lambda: UserProfile.create_user("username", "test@example.com", "")
        )
        self.assertRaisesMessage(
            expected_exception=Exception,
            expected_message="Email is invalid",
            callable_obj=lambda: UserProfile.create_user("username", "testexample.com", "password"),
        )

        user_profile = UserProfile.create_user("username", "test@example.com", "password")
        self.assertIsInstance(user_profile, UserProfile, "user exists")

    def test_edit_profile(self):
        user = self.user1
        user.set_bio("hi")
        self.assertEqual(user.bio, "hi")
        user.set_bio("")
        self.assertEqual(user.bio, None)
    
    def test_user_follow(self):
        Follow.objects.create(user=self.user1, following=self.user2)
        self.assertTrue(Follow.objects.filter(user=self.user1, following=self.user2).exists(), "User 1 follows User 2")

    def test_user_unfollow(self):
        Follow.objects.create(user=self.user1, following=self.user2)
        Follow.objects.filter(user=self.user1, following=self.user2).delete()
        self.assertFalse(Follow.objects.filter(user=self.user1, following=self.user2).exists(), "User 1 no longer follows User 2")
    
    def test_user_block(self):
        UserBlock.objects.create(user=self.user1, blocked=self.user2)
        self.assertTrue(UserBlock.objects.filter(user=self.user1, blocked=self.user2).exists(), "User 1 blocked User 2")
    
    def test_user_report(self):
        ...

class PostTests(TestCase):
    def setUp(self):
        ... 
    def test_create_post(self):
        ...

    