# Generated by Django 4.2.12 on 2024-09-26 22:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("test_site", "0006_alter_user_username"),
    ]

    operations = [
        migrations.AlterField(
            model_name="comment",
            name="comment_id",
            field=models.AutoField(primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name="directmessage",
            name="message_id",
            field=models.AutoField(primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name="post",
            name="post_id",
            field=models.AutoField(primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name="report",
            name="report_id",
            field=models.AutoField(primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name="user",
            name="user_id",
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]
