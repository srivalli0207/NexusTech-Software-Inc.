from channels.generic.websocket import WebsocketConsumer
import json

class ChatConsumer(WebsocketConsumer):
   def connect(self):
      print('connect')
      self.accept()
      self.send(text_data=json.dumps({"message": 'connected from server'}))
   
   def disconnect(self, close_code):
      pass

   def receive(self, text_data):
      text_data_json = json.loads(text_data)
      message = text_data_json["message"]
      print("message: ", message)
      self.send(text_data=json.dumps({"from_server": message}))

   