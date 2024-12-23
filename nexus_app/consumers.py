from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
import json
import os
import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "nexus_site.settings")
django.setup()
from nexus_app.models.user import UserProfile

class ChatConsumer(WebsocketConsumer):
   def connect(self):
      self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
      self.room_group_name = f"chat_{self.room_name}"
      self.user = self.scope['user']

      # connect to group
      async_to_sync(self.channel_layer.group_add)(
         self.room_group_name, self.channel_name
      )

      self.accept()
   
   def disconnect(self, close_code):
      async_to_sync(self.channel_layer.group_discard)(
         self.room_group_name, self.channel_name
      )

   def receive(self, text_data):
      text_data_json = json.loads(text_data)
      message = text_data_json["message"]

      # send message to group
      async_to_sync(self.channel_layer.group_send)(
         # send message to chat_message function
         self.room_group_name, {"type": "chat.message", "message": message}
      )

   # recieve message from group, note how the function name matches the type field in the recieve function
   def chat_message(self, event):
      message = event["message"]
      self.send(text_data=json.dumps({"message": message}))


online: set[str] = set()

class StatusConsumer(WebsocketConsumer):
   profile: UserProfile

   def connect(self):
      username = str(self.scope["user"])
      self.profile = UserProfile.objects.get(user__username=username)
      print("connected:", self.profile.display_name or self.profile.user.username)

      # connect to group
      async_to_sync(self.channel_layer.group_add)(
         'status_group', self.channel_name
      )

      self.accept()
      online.add(username)
      async_to_sync(self.channel_layer.group_send)(
         "status_group", {"type": "status.message", "message": list(online)}
      )
   
   def disconnect(self, close_code):
      username = str(self.scope["user"])
      print("disconect")
      online.discard(username)
      async_to_sync(self.channel_layer.group_send)(
         "status_group", {"type": "status.message", "message": list(online)}
      )
      async_to_sync(self.channel_layer.group_discard)(
         "status_group", self.channel_name
      )

   def status_message(self, event):
      message = event["message"]
      self.send(text_data=json.dumps({"message": message}))
