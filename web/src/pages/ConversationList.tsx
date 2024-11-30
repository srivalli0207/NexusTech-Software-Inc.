import { Avatar, Box, CircularProgress, List, ListItemAvatar, ListItemButton, ListItemText, Typography } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Conversation, MessageManager } from "../api/message";

export default function ConversationList() {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const messageManager = MessageManager.getInstance();
  
  useEffect(() => {
    (async () => {
      const conversations = await messageManager.getConversations();
      setConversations(conversations);
      setLoading(false);
    })();
  }, []);

  return (
    <Box>
      {loading && <CircularProgress />}
      {!loading && 
      <List>
        {conversations.map((conversation) => <ConversationListItem conversation={conversation} />)}
      </List>}
    </Box>
  )
}

function ConversationListItem({ conversation }: {conversation: Conversation}) {
  return (
    <ListItemButton alignItems="flex-start" component={Link} to={`/messages/${conversation.id}`} key={conversation.id}>
      <ListItemAvatar>
        <Avatar src={conversation.members[0].profilePicture ?? undefined}>{conversation.members[0].username[0].toUpperCase()}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={conversation.name ?? conversation.members.map((member) => member.username).join(", ")}
        secondary={
          conversation.lastMessage ? <Fragment>
            <Typography component="span" variant="body2" sx={{ color: "text.primary", display: "inline" }}>{conversation.lastMessage.user.username}</Typography>
            {` — ${conversation.lastMessage.text}`}
          </Fragment> : "No messages"
        }
      >
      </ListItemText>
    </ListItemButton>
  )
}