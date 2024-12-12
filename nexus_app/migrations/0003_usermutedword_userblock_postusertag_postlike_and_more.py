# Generated by Django 4.2.12 on 2024-09-20 17:18

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("nexus_app", "0002_comment_session_report_postmedia_directmessage"),
    ]

    operations = [
        migrations.CreateModel(
            name="UserMutedWord",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("muted_word", models.TextField()),
                (
                    "user_id",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="nexus_app.user"
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="UserBlock",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "blocked_id",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="blocked_user_id",
                        to="nexus_app.user",
                    ),
                ),
                (
                    "user_id",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="blocking_user_id",
                        to="nexus_app.user",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="PostUserTag",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "post_id",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="nexus_app.post"
                    ),
                ),
                (
                    "user_id",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="nexus_app.user"
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="PostLike",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("like", models.BooleanField(default=True)),
                (
                    "post_id",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="nexus_app.post"
                    ),
                ),
                (
                    "user_id",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="nexus_app.user"
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="PostBookmark",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "post_id",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="nexus_app.post"
                    ),
                ),
                (
                    "user_id",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="nexus_app.user"
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="ForumModerator",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "name",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="nexus_app.forum",
                    ),
                ),
                (
                    "user_id",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="nexus_app.user"
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="ForumFollow",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "forum_name",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="nexus_app.forum",
                    ),
                ),
                (
                    "user_id",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="nexus_app.user"
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Follow",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "following_id",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="follow_user_id",
                        to="nexus_app.user",
                    ),
                ),
                (
                    "user_id",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="following_user_id",
                        to="nexus_app.user",
                    ),
                ),
            ],
        ),
        migrations.AddConstraint(
            model_name="userblock",
            constraint=models.UniqueConstraint(
                fields=("user_id", "blocked_id"), name="user_block_constraint"
            ),
        ),
        migrations.AddConstraint(
            model_name="postusertag",
            constraint=models.UniqueConstraint(
                fields=("post_id", "user_id"), name="post_user_tag_unq_constraint"
            ),
        ),
        migrations.AddConstraint(
            model_name="postlike",
            constraint=models.UniqueConstraint(
                fields=("post_id", "user_id"), name="post_like_unq_constraint"
            ),
        ),
        migrations.AddConstraint(
            model_name="postbookmark",
            constraint=models.UniqueConstraint(
                fields=("post_id", "user_id"), name="post_bookmark_unq_constraint"
            ),
        ),
        migrations.AddConstraint(
            model_name="forummoderator",
            constraint=models.UniqueConstraint(
                fields=("name", "user_id"), name="forum_moderator_unq_constraint"
            ),
        ),
        migrations.AddConstraint(
            model_name="forumfollow",
            constraint=models.UniqueConstraint(
                fields=("user_id", "forum_name"), name="forum_follow_unq_constraint"
            ),
        ),
        migrations.AddConstraint(
            model_name="follow",
            constraint=models.UniqueConstraint(
                fields=("user_id", "following_id"), name="follow_constraint"
            ),
        ),
    ]