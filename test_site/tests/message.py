from django.test import TestCase
from test_site.models.message import MessageConversation
from test_site.models.user import UserProfile


class TestMessages(TestCase):
    def setUp(self):
        self.user1 = UserProfile.create_user("sender", "send@gmail.com", "sending_msg")
        self.user2 = UserProfile.create_user("receiver", "receive@gmail.com", "receiving_msg")
        self.user3 = UserProfile.create_user("extra", "extra@gmail.com", "extra_msg")
        self.conversation = MessageConversation.objects.create(name="test_chat")      
        self.conversation.members.add(self.user1, self.user2)
        self.assertEqual(self.conversation.name, "test_chat")
        
        
    def test_create_conversation(self):
        conversation = MessageConversation.objects.create(group=True)
        conversation.members.add(self.user1, self.user2)
        self.assertTrue(MessageConversation.objects.filter(members=self.user1, group=True, conversation_id=conversation.conversation_id).exists())
    
    def test_get_conversation(self):
        self.assertFalse(MessageConversation.get_conversation_exists(self.user1, self.user2))
        conversation = MessageConversation.get_conversation(self.user1, self.user2)
        self.assertFalse(conversation.group)
        self.assertTrue(MessageConversation.get_conversation_exists(self.user1, self.user2))
        self.assertEqual(MessageConversation.get_conversation(self.user1, self.user2).conversation_id, conversation.conversation_id)
        
    
    def test_add_conversation_member(self):
        conversation = MessageConversation.create_conversation(self.user1, self.user2)
        self.assertFalse(conversation.group)
        conversation.add_member(self.user3)
        self.assertTrue(conversation.group)
        self.assertTrue(MessageConversation.objects
                        .filter(members=self.user1, group=True, conversation_id=conversation.conversation_id)
                        .filter(members=self.user2)
                        .filter(members=self.user3)
                        .exists())
        
    def test_remove_conversation_member(self):
        conversation = MessageConversation.objects.create(group=True)
        conversation.add_member(self.user1, self.user2, self.user3)
        conversation.remove_member(self.user3)
        self.assertFalse(self.user3 in conversation.members.all())

    def test_send_message(self):
        message = self.conversation.send_message(self.user1, "hello")
        self.assertEqual(message.text, "hello")

    # def test_delete_message(self):
    #     message = self.conversation.send_message(self.user1, "hello")
    #     self.message.delete()
    #     self.assertFalse