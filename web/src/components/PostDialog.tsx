import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import ImageIcon from "@mui/icons-material/Image";
import CreateIcon from '@mui/icons-material/Create';
import DialogTitle from '@mui/material/DialogTitle';
import React, { Fragment, useState } from 'react';
import { CircularProgress, DialogContentText, Fab, IconButton, ImageList, ImageListItem, styled, Typography } from '@mui/material';
import { submit_post, upload_file } from '../utils/fetch';
import { useSnackbar } from '../utils/SnackbarContext';

export default function PostDialog({ fab = false }: { fab?: boolean}) {
  const [open, setOpen] = useState(false);
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState("");
  const [textInput, setTextInput] = useState("");
  const [imageFile, setImageFile] = useState<FileList | null>(null)
  const snackbar = useSnackbar();
  const maxWords = 300;

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const wordCount = getWordCount(textInput);
  const remainingWords = maxWords - wordCount;

  const handleClickOpen = () => {
    setOpen(true);
    setPosting(false);
    setImageFile(null);
    setPostError("");
    setTextInput("");
  };

  const handleClose = () => {
    setOpen(false);
    setImageFile(null);
  };

  const handleText = (event: any) => {
    setTextInput(event.target.value);
  };

  const handlePost = async () => {
    setPosting(true);
    if (imageFile) {
      for (const file of imageFile) {
        await upload_file(file)
      }
    }
    submit_post({ text: textInput, files: imageFile ? Array.from(imageFile) : null }).then(() => {
      setOpen(false);
      snackbar({ open: true, message: "Post sent!" })
    }).catch((err) => {
      setPostError(err);
      setPosting(false);
    });
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && event.ctrlKey) {
      console.log(event);
      handlePost();
    }
  };

  const handleFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null || event.target.files.length > 4) return;
    
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
    <Fragment>
      {!fab 
        ? <Button variant="contained" onClick={handleClickOpen}>Create Post</Button> 
        : <Fab sx={{ position: "absolute", bottom: "72px", right: "16px", display: { md: "none", xs: "inline" } }} color="primary" onClick={handleClickOpen}>
            <CreateIcon />
          </Fab>
      }
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
      >
        <DialogTitle>Create Post</DialogTitle>
        <DialogContent>
          {postError && <DialogContentText>{postError}</DialogContentText>}
          <TextField
            autoFocus
            margin="dense"
            id="text"
            name="text"
            label="Text"
            fullWidth
            multiline
            rows={3}
            variant="standard"
            disabled={posting}
            onChange={handleText}
            onKeyDown={handleKeyDown}
            error={wordCount > maxWords}
            helperText={wordCount > maxWords ? "Max text length is 300." : undefined} />
          {imageFile && (
            <>
              <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1}}>
                Selected Images: {Array.from(imageFile).slice(0, 4).map((file) => file.name).join(", ")}
              </Typography>
              <ImageList cols={2} gap={8} sx={{ width: 400, height: 400 }}>
                {Array.from(imageFile).slice(0, 4).map((file) => (
                  <ImageListItem key={file.name} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                    <img 
                      src={URL.createObjectURL(file)}
                      alt={file.name} 
                      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </>
          )}
          </DialogContent>
        <DialogActions>
          <IconButton component="label" role={undefined}>
            <ImageIcon color="primary" />
            <VisuallyHiddenInput
              type="file"
              onChange={handleFiles}
              multiple
              accept="image/png, image/jpeg"
            />
          </IconButton>
          <Typography sx={{ color: wordCount > maxWords ? "red" : undefined }}>
            {remainingWords >= 0 ? `${remainingWords} words remaining` : "Word limit exceeded"}
          </Typography>
          <div style={{ flex: "1 0 0" }} />
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" disabled={posting || !textInput || wordCount > maxWords} onClick={handlePost}>{!posting ? "Post" : <CircularProgress color="inherit" size="1.5rem" />}</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}