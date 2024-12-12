import datetime
from django.utils import timezone
from django.test import TestCase
from nexus_app.models.comment import Comment
from nexus_app.models.post import Post
from nexus_app.models.report import Report
from nexus_app.models.user import UserProfile

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