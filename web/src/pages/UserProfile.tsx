import { useEffect, useState } from "react"
import { Box, CircularProgress } from '@mui/material'
import Grid from '@mui/material/Grid2'
import PostFeedCard, { Post } from "../components/PostFeedCard"
import SideBar from "../components/SideBar"
import { get_posts } from "../utils/auth"

export default function UserProfile() {
   const [loading, setLoading] = useState(true);
   const [posts, setPosts] = useState<Post[]>([]);

   useEffect(() => {
      get_posts().then(async (res) => {
         setPosts(res.map((post: any) => {
            return {
               username: post.user_id_hint,
               pfp: "https://avatars.githubusercontent.com/u/1747088",
               date: new Date(post.creation_date),
               text: post.text,
               photos: ["https://media.istockphoto.com/id/98201918/photo/small-koala-sitting-on-white-background.jpg?s=1024x1024&w=is&k=20&c=5QNao-I60NybQMxtI8YoP72K468M9GLofRcD3zQz3DA="]
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
         <Grid container height='100%'>
            <Grid bgcolor='#202020' size={3} sx={{ margin: '0' }}>
               <SideBar />
            </Grid>
            <Grid bgcolor='#202020' size={7} sx={{ margin: '0', display: 'flex', flexDirection: 'column' }}>
               {loading && <CircularProgress />}
               {
                  posts.map((post) => {
                     return (<PostFeedCard post={post} />);
                  })
               }
            </Grid>
         </Grid>
      </Box>

   )
}
