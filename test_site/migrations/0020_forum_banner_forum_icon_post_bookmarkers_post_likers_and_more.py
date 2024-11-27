# Generated by Django 5.1.2 on 2024-11-27 00:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("test_site", "0019_postbookmark_datetime_postlike_datetime_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="forum",
            name="banner",
            field=models.URLField(default=None, null=True),
        ),
        migrations.AddField(
            model_name="forum",
            name="icon",
            field=models.URLField(default=None, null=True),
        ),
        migrations.AddField(
            model_name="post",
            name="bookmarkers",
            field=models.ManyToManyField(
                related_name="bookmarker",
                through="test_site.PostBookmark",
                to="test_site.userprofile",
            ),
        ),
        migrations.AddField(
            model_name="post",
            name="likers",
            field=models.ManyToManyField(
                related_name="liker",
                through="test_site.PostLike",
                to="test_site.userprofile",
            ),
        ),
        migrations.AddField(
            model_name="userprofile",
            name="bookmarks",
            field=models.ManyToManyField(
                related_name="bookmarked_posts",
                through="test_site.PostBookmark",
                to="test_site.post",
            ),
        ),
        migrations.AlterField(
            model_name="userprofile",
            name="likes",
            field=models.ManyToManyField(
                related_name="liked_posts",
                through="test_site.PostLike",
                to="test_site.post",
            ),
        ),
    ]
