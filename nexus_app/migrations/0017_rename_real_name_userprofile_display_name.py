# Generated by Django 4.2.12 on 2024-10-20 01:44

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("nexus_app", "0016_messageconversation_last_message_and_more"),
    ]

    operations = [
        migrations.RenameField(
            model_name="userprofile",
            old_name="real_name",
            new_name="display_name",
        ),
    ]