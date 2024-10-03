import { useEffect, useState } from "react"
import { Box } from '@mui/material'
import Grid from '@mui/material/Grid2'
import PostFeedCard, { Post } from "../components/PostFeedCard"
import SideBar from "../components/SideBar"

export default function UserProfile() {
   const [posts, setPosts] = useState<Post[]>([]);

   useEffect(() => {
      // TODO: change this to AWS
      fetch("http://127.0.0.1:8000/api/test/posts").then(async (res) => {
         const json: any[] = await res.json();
         setPosts(json.map((post) => {
            return {
               username: post.user_id_hint,
               pfp: "https://avatars.githubusercontent.com/u/1747088", // TODO: Get this from database
               date: (new Date()).toLocaleDateString(),
               text: post.text,
               photos: ["https://media.istockphoto.com/id/98201918/photo/small-koala-sitting-on-white-background.jpg?s=1024x1024&w=is&k=20&c=5QNao-I60NybQMxtI8YoP72K468M9GLofRcD3zQz3DA="]
            }
         }))
      });

   }, []);

   const testPosts: Post[] = [
      {
         username: "triph",
         pfp: "https://avatars.githubusercontent.com/u/1747088",
         date: "October 1st, 2024",
         text: "Say hello to my new koala.",
         photos: ["https://media.istockphoto.com/id/98201918/photo/small-koala-sitting-on-white-background.jpg?s=1024x1024&w=is&k=20&c=5QNao-I60NybQMxtI8YoP72K468M9GLofRcD3zQz3DA="]
      },
   ]

   return (
      <Box bgcolor='	#202020' height='100%'>
         {
            testPosts.map((post) => {
               return (<PostFeedCard post={post} />);
            })
         }
      </Box>
   )
}
