from django.test import TestCase
from test_site.models.user import Follow, UserBlock, UserProfile


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