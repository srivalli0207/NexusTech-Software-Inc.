import { Avatar, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, List, ListItemAvatar, ListItemButton, ListItemText, TextField, Typography } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Conversation, MessageManager } from "../api/message";
import ProfileTooltip from "../components/ProfileTooltip";
import { UserManager, UserProfileResponse } from "../api/user";
import { useUser } from "../utils/AuthContext";
import moment from "moment";

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
    <Box p={2}>
      <div style={{ textAlign: "start", marginBottom: "8px" }}>
        <Typography variant="h2">Messages</Typography>
        <CreateConversationButton />
      </div>
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
        <ProfileTooltip profile={conversation.members[0]} />
      </ListItemAvatar>
      <ListItemText
        primary={conversation.name ?? conversation.members.map((member) => member.username).join(", ")}
        secondary={
          conversation.lastMessage ? <Fragment>
            <Typography component="span" variant="body2" sx={{ color: "text.primary", display: "inline" }}>{conversation.lastMessage.user.username}</Typography>
            {` — ${conversation.lastMessage.text} (${moment(new Date(conversation.lastMessage.sent)).startOf("m").fromNow()})`}
          </Fragment> : "No messages"
        }
      >
      </ListItemText>
    </ListItemButton>
  )
}

function CreateConversationButton() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);
  const [creatingError, setCreatingError] = useState<Error | null>(null);
  const [friendsLoading, setFriendsLoading] = useState(true);
  const [friends, setFriends] = useState<UserProfileResponse[]>([]);
  const userManager = UserManager.getInstance();
  const messageManager = MessageManager.getInstance();
  const user = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    setFriendsLoading(true);
    (async () => {
      try {
        const friends = await userManager.getFriends(user!.username);
        setFriends(friends);
        setFriendsLoading(false);
      } catch (e) {
        setFriendsLoading(false);
      }
    })();
  }, []);

  const handleClickOpen = () => {
    setName("");
    setMembers([]);
    setCreating(false);
    setCreatingError(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleName = (event: any) => {
    setName(event.target.value);
  }

  const handleListItemClick = (_: React.MouseEvent<HTMLDivElement, MouseEvent>, username: string) => {
    if (members.includes(username)) {
      setMembers((members) => members.filter((member) => member !== username));
    } else {
      setMembers((members) => [...members, username]);
    }
  };

  const createConversation = async () => {
    setCreating(true);
    try {
      const conversation = await messageManager.createConversation(members, true, name || null);
      setCreating(false);
      setOpen(false);
      navigate(`/messages/${conversation.id}`);
    } catch (e) {
      setCreatingError(e as any);
      setCreating(false);
    }
  }

  return (
    <>
      <Button variant="contained" onClick={handleClickOpen}>Create Conversation</Button>
      <Dialog open={open} onClose={handleClose} fullWidth PaperProps={{ sx: { minHeight: "60vh", maxHeight: "60vh"} }}>
        <DialogTitle>Create Conversation</DialogTitle>
        <DialogContent>
          {creatingError && <DialogContentText color="error">{creatingError.message}</DialogContentText>}
          <Typography variant="h6">Name</Typography>
          <TextField
            margin="dense"
            id="text"
            name="name"
            label="Conversation Name"
            variant="standard"
            disabled={creating}
            value={name}
            onChange={handleName}
            helperText={undefined}
            error={undefined}
          />
          <Typography variant="h6">Members</Typography>
          {friendsLoading && <CircularProgress />}
          {!friendsLoading && friends.length === 0
            ? <Typography>You have no friends :(</Typography>
            : 
            <List sx={{ overflowY: "auto" }}>
              {friends.map((friend) => <ListItemButton component="div" key={friend.username} selected={members.includes(friend.username)} onClick={(event) => handleListItemClick(event, friend.username)}>
                <ListItemAvatar>
                <Avatar src={friend.profilePicture ?? undefined}>
                  {friend.username[0].toUpperCase()}
                </Avatar>
                </ListItemAvatar>
                <ListItemText primary={friend.displayName ?? friend.username} secondary={`@${friend.username}`} />
              </ListItemButton>)}
            </List>
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={creating}>Cancel</Button>
          <Button variant="contained" onClick={createConversation} disabled={members.length < 2}>Create</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}