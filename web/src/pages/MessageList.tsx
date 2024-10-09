import { useEffect, useState } from "react";
import { get_messages, send_message } from "../utils/fetch";
import { useParams } from "react-router-dom";
import { Avatar, Box, Button, CircularProgress, Grid2 as Grid, TextField, Typography, useTheme } from "@mui/material";
import { useUser } from "../utils/auth-hooks";
import { blue, grey } from "@mui/material/colors";

interface Message {
  id: number,
  username: string,
  pfp: string | null,
  text: string,
  sent: string
}

export default function MessageList() {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const { conversation } = useParams();

  useEffect(() => {
    (async () => {
      setMessages(await get_messages(parseInt(conversation!)));
    })().then((_) => {
      setLoading(false);
    });
  }, []);

  const handleSend = async (text: string) => {
    const res = await send_message(parseInt(conversation!), text)
    setMessages([...messages, res])
  }

  return (
    <Box sx={{height: "100%"}}>
      {loading && <CircularProgress />}
      {!loading && 
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div>
          {messages.map((message) => <MessageBubble message={message} key={message.id} />)}
        </div>
        <MessageInput onSend={handleSend} />
      </Box>}
    </Box>
  )
}

function MessageBubble({ message }: { message: Message }) {
  const user = useUser();
  const theme = useTheme();
  const isSender = message.username === user!.username;

  return (
    <Grid container spacing={1} justifyItems={isSender ? "flex-end" : "flex-start"} justifyContent={isSender ? "flex-end" : "flex-start"}>
      {!isSender && <Grid size={1}><Avatar src={message.pfp ?? undefined}>{message.username[0].toUpperCase()}</Avatar></Grid>}
      <Grid>
        <Typography
          align={isSender ? "right" : "left"}
          sx={{
            padding: theme.spacing(1, 2),
            borderRadius: 4,
            marginBottom: 4,
            display: "inline-block",
            textAlign: isSender ? "right" : "left",
            wordBreak: "break-word",
            backgroundColor: isSender ? blue[500] : grey[800]
          }}
        >
          {message.text}
        </Typography>
      </Grid>
      {isSender && <Grid size={1}><Avatar src={message.pfp ?? undefined}>{message.username[0].toUpperCase()}</Avatar></Grid>}
    </Grid>
  )
}

function MessageInput({ onSend }: { onSend: (text: string) => void }) {
  const [textInput, setTextInput] = useState("");

  const handleSend = () => {
    onSend(textInput);
    setTextInput("");
  }

  const handleText = (event: any) => {
    setTextInput(event.target.value);
  }

  return (
    <Grid container spacing={1} sx={{ marginTop: "auto" }} alignItems="center">
      <Grid size={11}>
        <TextField label="Type something" fullWidth rows={2} maxRows={2} onChange={handleText} value={textInput} />
      </Grid>
      <Grid size={1}>
        <Button type="submit" variant="contained" onClick={handleSend} disabled={textInput === ""}>Send</Button>
      </Grid>
    </Grid>
  )
}

