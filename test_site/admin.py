from django.contrib import admin
from .models import *
# Register your models here.

admin.site.register(UserProfile)
admin.site.register(UserMutedWord)
admin.site.register(UserBlock)
admin.site.register(Follow)
admin.site.register(ForumFollow)
admin.site.register(ForumModerator)
admin.site.register(PostLike)
admin.site.register(PostBookmark)
admin.site.register(PostUserTag)
admin.site.register(UserSettings)
admin.site.register(Comment)
admin.site.register(Post)
admin.site.register(PostMedia)
admin.site.register(Forum)
admin.site.register(MessageConversation)
admin.site.register(MessageConversationMember)
admin.site.register(Message)
admin.site.register(MessageMedia)
admin.site.register(Report)
