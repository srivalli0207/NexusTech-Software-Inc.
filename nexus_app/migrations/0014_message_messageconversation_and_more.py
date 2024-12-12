# Generated by Django 4.2.12 on 2024-10-09 05:54

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        (
            "nexus_app",
            "0013_remove_userprofile_email_remove_userprofile_password_and_more",
        ),
    ]

    operations = [
        migrations.CreateModel(
            name="Message",
            fields=[
                ("message_id", models.AutoField(primary_key=True, serialize=False)),
                ("text", models.TextField(null=True)),
                ("sent", models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name="MessageConversation",
            fields=[
                (
                    "conversation_id",
                    models.AutoField(primary_key=True, serialize=False),
                ),
                ("group", models.BooleanField(default=False)),
                (
                    "creator",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="creator",
                        to="nexus_app.userprofile",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="MessageConversationMember",
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
                    "conversation",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="nexus_app.messageconversation",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="nexus_app.userprofile",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="MessageMedia",
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
                    "media_type",
                    models.CharField(
                        choices=[("PHOTO", "PHOTO"), ("VIDEO", "VIDEO")], max_length=5
                    ),
                ),
                ("url", models.URLField()),
                ("index", models.IntegerField(default=0)),
                (
                    "message",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="nexus_app.message",
                    ),
                ),
            ],
        ),
        migrations.DeleteModel(
            name="DirectMessage",
        ),
        migrations.AddField(
            model_name="messageconversation",
            name="members",
            field=models.ManyToManyField(
                through="nexus_app.MessageConversationMember",
                to="nexus_app.userprofile",
            ),
        ),
        migrations.AddField(
            model_name="message",
            name="conversation",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                to="nexus_app.messageconversation",
            ),
        ),
        migrations.AddField(
            model_name="message",
            name="user",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="nexus_app.userprofile"
            ),
        ),
    ]