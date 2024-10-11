import { useEffect, useState, useRef } from "react";
import { get_messages, send_message } from "../utils/fetch";
import { useParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Grid2 as Grid,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useUser } from "../utils/auth-hooks";
import { blue, grey } from "@mui/material/colors";

interface Message {
  id: number;
  username: string;
  pfp: string | null;
  text: string;
  sent: string;
}

export default function MessageList() {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const { conversation } = useParams();
  const chatSocket = useRef<WebSocket>();
  const user = useUser();

  useEffect(() => {
    (async () => {
      setMessages(await get_messages(parseInt(conversation!)));
    })().then((_) => {
      setLoading(false);
    });

    chatSocket.current = new WebSocket(
      `ws://${window.location.host}/ws/chat/${conversation}/`
    );

    chatSocket.current.onmessage = (e: MessageEvent) => {
      const data = JSON.parse(e.data);
      if ("message" in data) {
        const msg: Message = data.message;
        if (msg.username !== user!.username) {
          setMessages((messages) => [...messages, msg])
        }
      }
    };

    return () => {
      chatSocket.current?.close();
    };
  }, []);

  useEffect(() => {
    if (loading) return;
    const messagesView = document.getElementById("messages-view")!;
    messagesView.scrollTo(0, messagesView.scrollHeight)
  }, [messages]);

  const handleSend = async (text: string) => {
    const res = await send_message(parseInt(conversation!), text);
    setMessages([...messages, res]);
	  chatSocket.current?.send( JSON.stringify({'message': res}) )
  };

  return (
    <Box sx={{ height: "100%" }}>
      {loading && <CircularProgress />}
      {!loading && (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <div style={{ height: "100%", overflowY: "auto" }} id="messages-view">
            {messages.map((message) => (
              <MessageBubble message={message} key={message.id} />
            ))}
          </div>
          <MessageInput onSend={handleSend} />
        </Box>
      )}
    </Box>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const user = useUser();
  const theme = useTheme();
  const isSender = message.username === user!.username;

  return (
    <Grid
      container
      spacing={1}
      justifyItems={isSender ? "flex-end" : "flex-start"}
      justifyContent={isSender ? "flex-end" : "flex-start"}
		//overflow={'hidden'}
    >
      {!isSender && (
        <Grid size={1}>
          <Tooltip title={message.username}>
            <Avatar src={message.pfp ?? undefined} sx={{ float: "right" }}>
              {message.username[0].toUpperCase()}
            </Avatar>
          </Tooltip>
        </Grid>
      )}
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
            backgroundColor: isSender ? blue[500] : grey[800],
          }}
        >
          {message.text}
        </Typography>
      </Grid>
      {isSender && (
        <Grid size={1}>
          <Tooltip title={message.username}>
            <Avatar src={message.pfp ?? undefined}>
              {message.username[0].toUpperCase()}
            </Avatar>
          </Tooltip>
        </Grid>
      )}
    </Grid>
  );
}

function MessageInput({ onSend }: { onSend: (text: string) => void }) {
  const [textInput, setTextInput] = useState("");

  const handleSend = () => {
    onSend(textInput);
    setTextInput("");
  };

  const handleText = (event: any) => {
    setTextInput(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  return (
    <Grid container spacing={1} sx={{ marginTop: "auto" }} alignItems="center">
      <Grid size={11}>
        <TextField
          label="Type something"
          fullWidth
          rows={2}
          maxRows={2}
          onChange={handleText}
          value={textInput}
          onKeyDown={handleKeyDown}
        />
      </Grid>
      <Grid size={1}>
        <Button
          type="submit"
          variant="contained"
          onClick={handleSend}
          disabled={textInput === ""}
        >
          Send
        </Button>
      </Grid>
    </Grid>
  );
}
