from django.test import TestCase
from nexus_app.models.message import Message, MessageConversation
from nexus_app.models.user import UserProfile


class TestMessages(TestCase):
    def setUp(self):
        self.user1 = UserProfile.create_user("sender", "send@gmail.com", "sending_msg")
        self.user2 = UserProfile.create_user("receiver", "receive@gmail.com", "receiving_msg")
        self.user3 = UserProfile.create_user("extra", "extra@gmail.com", "extra_msg")
        
        
    def test_create_conversation(self):
        conversation = MessageConversation.objects.create(group=True)
        conversation.members.add(self.user1, self.user2)
        self.assertTrue(MessageConversation.objects.filter(members=self.user1, group=True, conversation_id=conversation.conversation_id).exists(), "Conversation created")
    
    def test_get_conversation(self):
        self.assertFalse(MessageConversation.get_conversation_exists(self.user1, self.user2), "Conversation doesn't exist yet")
        conversation = MessageConversation.get_conversation(self.user1, self.user2)
        self.assertFalse(conversation.group, "Conversation created")
        self.assertTrue(MessageConversation.get_conversation_exists(self.user1, self.user2), "User1 and 2 are members of the conversation")
        self.assertEqual(MessageConversation.get_conversation(self.user1, self.user2).conversation_id, conversation.conversation_id, "Conversation returns proper ID")
    
    def test_add_conversation_member(self):
        conversation = MessageConversation.create_conversation(self.user1, self.user2)
        self.assertFalse(conversation.group, "Group not created yet")
        conversation.add_member(self.user3)
        self.assertTrue(conversation.group, "Group conversation created")
        self.assertTrue(MessageConversation.objects
                        .filter(members=self.user1, group=True, conversation_id=conversation.conversation_id)
                        .filter(members=self.user2)
                        .filter(members=self.user3)
                        .exists(), "User1, 2, and 3 are members of the group conversation")
        
    def test_remove_conversation_member(self):
        conversation = MessageConversation.create_conversation(self.user1, self.user2)
        conversation.add_member(self.user3)
        conversation.remove_member(self.user3)
        self.assertFalse(self.user3 in conversation.members.all(), "User3 removed from conversation")
        self.assertFalse(conversation.group, "Conversation is no longer a group")

    def test_send_message(self):
        conversation = MessageConversation.create_conversation(self.user1, self.user2)
        message = conversation.send_message(self.user1, "hello")
        self.assertEqual(message.text, "hello", "Message is correct")
        self.assertEqual(conversation.last_message, message, "Message sent")

    def test_delete_message(self):
        conversation = MessageConversation.create_conversation(self.user1, self.user2)
        message = conversation.send_message(self.user1, "hello")
        message.delete()
        self.assertFalse(Message.objects.filter(message_id=message.message_id).exists(), "Message deleted")