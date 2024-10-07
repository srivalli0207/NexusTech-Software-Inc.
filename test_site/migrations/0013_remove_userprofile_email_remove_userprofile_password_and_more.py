from django.conf import settings
from django.db import migrations, models
from django.db.backends.base.schema import BaseDatabaseSchemaEditor
from django.apps.registry import Apps
import django.db.models.deletion
from django.contrib.auth.models import User as DjangoUser

def migrate_users(apps: Apps, schema_editor: BaseDatabaseSchemaEditor) -> None:
    UserProfile = apps.get_model("test_site", "UserProfile")
    for profile in UserProfile.objects.all():
        user = DjangoUser.objects.filter(pk=profile.pk, username=profile.username)
        if len(user) == 0:
            profile.delete()


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("test_site", "0012_constraints"),
    ]

    operations = [
        migrations.RunPython(
            code=migrate_users,
            reverse_code=django.db.migrations.operations.special.RunPython.noop,
        ),
        migrations.RemoveField(
            model_name="userprofile",
            name="email",
        ),
        migrations.RemoveField(
            model_name="userprofile",
            name="password",
        ),
        migrations.RemoveField(
            model_name="userprofile",
            name="username",
        ),
        migrations.RenameField(
            model_name="userprofile",
            old_name="user_id",
            new_name="user"
        ),
        migrations.AlterField(
            model_name="userprofile",
            name="user",
            field=models.OneToOneField(
                on_delete=django.db.models.deletion.CASCADE,
                primary_key=True,
                serialize=False,
                to=settings.AUTH_USER_MODEL,
            ),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="post",
            name="forum",
            field=models.ForeignKey(
                default=None,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="test_site.forum",
            ),
        ),
    ]
