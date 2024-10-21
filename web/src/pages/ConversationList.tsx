import { Avatar, Box, CircularProgress, List, ListItemAvatar, ListItemButton, ListItemText, Typography } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { ConversationResponse, get_conversations } from "../utils/fetch";
import { Link } from "react-router-dom";

export default function ConversationList() {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<ConversationResponse[]>([])
  
  useEffect(() => {
    (async () => {
      setConversations(await get_conversations());
    })().then((_) => {
      setLoading(false);
    });
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

function ConversationListItem({ conversation }: {conversation: ConversationResponse}) {
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