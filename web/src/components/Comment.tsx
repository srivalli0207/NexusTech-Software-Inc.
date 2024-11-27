import Box from '@mui/material/Box'
import CommentIcon from "@mui/icons-material/Comment";
import IconButton from '@mui/material/IconButton';
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ShareIcon from "@mui/icons-material/Share";

export default function Comment() {
   return (

      <Box>
        <div style ={{ textAlign: 'left'}}>
            hi
        </div>
        <div style ={{ textAlign: 'left'}}>
            <IconButton aria-label="like">
                < ThumbUpIcon /> 
            </ IconButton> 
            <IconButton aria-label="dislike">
                < ThumbDownIcon />
            </ IconButton>
            <IconButton aria-label="reply">
                < CommentIcon />
            </ IconButton> 
            <IconButton aria-label="share">
                < ShareIcon />
            </ IconButton>
        </div>
      </Box>
      
      
   )
}