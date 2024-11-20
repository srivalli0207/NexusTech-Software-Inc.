import { useEffect, useState, useRef } from "react";
import { get_messages, MessageResponse, send_message } from "../utils/fetch";
import { useParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Grid2 as Grid,
  IconButton,
  ImageList,
  ImageListItem,
  styled,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useUser } from "../utils/auth-hooks";
import ImageIcon from "@mui/icons-material/Image";
import { blue, grey } from "@mui/material/colors";

export default function MessageList() {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<MessageResponse[]>([]);
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
        const msg: MessageResponse = data.message;
        if (msg.user.username !== user!.username) {
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
    <Box sx={{ height: "100%", p: 2 }}>
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

function MessageBubble({ message }: { message: MessageResponse }) {
  const user = useUser();
  const theme = useTheme();
  const isSender = message.user.username === user!.username;

  return (
    <Grid
      container
      spacing={1}
      justifyItems={isSender ? "flex-end" : "flex-start"}
      justifyContent={isSender ? "flex-end" : "flex-start"}
    >
      {!isSender && (
        <Grid size={1}>
          <Tooltip title={message.user.username}>
            <Avatar src={message.user.profilePicture ?? undefined} sx={{ float: "right" }}>
              {message.user.username[0].toUpperCase()}
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
          <Tooltip title={message.user.username}>
            <Avatar src={message.user.profilePicture ?? undefined}>
              {message.user.username[0].toUpperCase()}
            </Avatar>
          </Tooltip>
        </Grid>
      )}
    </Grid>
  );
}

function MessageInput({ onSend }: { onSend: (text: string) => void }) {
  const [textInput, setTextInput] = useState("");
  const [imageFile, setImageFile] = useState<FileList | null>(null);

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

  const handleImageFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null) return;
    setImageFile(event.target.files);
  }

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  return (
    <Box sx={{ p: 2, borderTop: "solid 1px", borderColor: "white" }}>
      {imageFile && <ImageList gap={8} cols={4} sx={{ overflowX: "auto" }}>
        {Array.from(imageFile).slice(0, 4).map((file) => (
          <ImageListItem key={file.name} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <img 
              src={URL.createObjectURL(file)}
              alt={file.name} 
              style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "8px", maxHeight: "150px" }}
            />
          </ImageListItem>
        ))}
      </ImageList>}
      <Grid container spacing={1} sx={{ marginTop: "auto" }} alignItems="center">
        <Grid size={1}>
          <IconButton component="label">
            <ImageIcon color="primary" fontSize="large" />
            <VisuallyHiddenInput
              type="file"
              onChange={handleImageFiles}
              multiple
              accept="image/png, image/jpeg, image/gif"
            />
          </IconButton>
        </Grid>
        <Grid size={10}>
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
    </Box>
  );
}
