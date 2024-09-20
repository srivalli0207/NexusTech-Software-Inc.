from django.contrib import admin
from .models import *
# Register your models here.

admin.site.register(User)
admin.site.register(Comment)
admin.site.register(Session)
admin.site.register(Post)
admin.site.register(PostMedia)
admin.site.register(Forum)
admin.site.register(DirectMessage)
admin.site.register(Report)
