import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function CommentDialog() {
   

   return (
      <>
         <div>
            comment dialog here
         </div>
         <TextField 
            autoFocus
            margin="dense"
            id="comment_text"
            name="comment_text"
            fullWidth
            multiline
            rows={8}
            variant="standard"

         />
         
      </>
   )
}