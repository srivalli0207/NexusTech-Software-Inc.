import { Avatar, Box, CircularProgress, List, ListItemAvatar, ListItemButton, ListItemText, Typography } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { get_conversations } from "../utils/fetch";
import { Link } from "react-router-dom";

interface Conversation {
  id: number,
  name: string | null,
  group: boolean,
  members: ConversationMember[]
}

interface ConversationMember {
  username: string,
  pfp: string | null
}

export default function ConversationList() {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([])
  
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

function ConversationListItem({ conversation }: {conversation: Conversation}) {
  return (
    <ListItemButton alignItems="flex-start" component={Link} to={`/messages/${conversation.id}`} key={conversation.id}>
      <ListItemAvatar>
        <Avatar src={conversation.members[0].pfp ?? undefined}>{conversation.members[0].username[0].toUpperCase()}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={conversation.name ?? conversation.members[0].username}
        secondary={
          <Fragment>
            <Typography component="span" variant="body2" sx={{ color: "text.primary", display: "inline" }}>{conversation.members[0].username}</Typography>
            {"— <last message here>"}
          </Fragment>
        }
      >
      </ListItemText>
    </ListItemButton>
  )
}