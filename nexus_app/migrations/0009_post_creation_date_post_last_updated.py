# Generated by Django 4.2.12 on 2024-10-02 18:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        (
            "nexus_app",
            "0008_comment_parent_id_post_comment_setting_commentlike_and_more",
        ),
    ]

    operations = [
        migrations.AddField(
            model_name="post",
            name="creation_date",
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name="post",
            name="last_updated",
            field=models.DateTimeField(auto_now=True),
        ),
    ]