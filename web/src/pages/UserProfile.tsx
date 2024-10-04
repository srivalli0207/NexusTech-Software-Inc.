import { FormEvent, useEffect, useState } from "react"
import { Box, CircularProgress } from '@mui/material'
import PostFeedCard, { Post } from "../components/PostFeedCard"
import { get_posts } from "../utils/fetch"
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useUser } from "../utils/auth-hooks";
import { submit_post, delete_post } from "../utils/fetch"
import CSRF_Token from "../utils/csrf_token"
import { useParams } from "react-router-dom";

export default function UserProfile() {
   const [loading, setLoading] = useState(true);
   const [posts, setPosts] = useState<Post[]>([]);
   const user = useUser();
   const { username } = useParams();

   const handleDelete = async (post: Post) => {
      await delete_post( {post_id: post.id} );
      setPosts(posts.filter(p => p.id != post.id))
   }

   useEffect(() => {
      get_posts(username).then(async (res) => {
         setPosts(res.map((post: any) => {
            return {
               id: post.pk,
               username: post.user_id_hint,
               pfp: user,
               date: new Date(post.creation_date),
               text: post.text,
               photos: [""]
              // photos: ["https://media.istockphoto.com/id/98201918/photo/small-koala-sitting-on-white-background.jpg?s=1024x1024&w=is&k=20&c=5QNao-I60NybQMxtI8YoP72K468M9GLofRcD3zQz3DA="]
            }
         }));
         setLoading(false);
      }).catch((err) => {
         console.error(err);
         setLoading(false);
      });
   }, []);

   return (
      <Box bgcolor='	#202020' height='100%'>
         {(username === undefined || username === user?.username) && <UserProfilePost />}
         {loading && <CircularProgress />}
         {
            posts.map((post) => {
               return (<PostFeedCard post={post} onDelete={handleDelete} />);
            })
         }
      </Box>
   )
}

export function UserProfilePost() {

   const submitPost = async (event: FormEvent<HTMLFormElement>) => {
      //event.preventDefault()

      const formData = new FormData(event.currentTarget)
      let formObject = Object.fromEntries(formData.entries()) as {text: string}
      await submit_post( {text: formObject.text} )
   }

   return (
      <Box
         component="form"
         //sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' }}}
         noValidate
         autoComplete="off"
         onSubmit={ submitPost }
      >
         <CSRF_Token />
         <div>
            <TextField
               sx={{ width: '100%' }}
               name="text"
               label="Text Post"
               multiline
               maxRows={5}
            />
         </div>
         <Button type='submit' variant="contained" sx={{ marginTop: '1rem', marginBottom: '1rem' }}>Make a Post</Button>
      </Box>

   )
}
