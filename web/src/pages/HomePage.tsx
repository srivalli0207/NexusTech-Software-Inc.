import { useState } from 'react'
import SplitButton from '../components/SplitButton'
import '../styles/App.css'
import '../styles/index.css'
import PostFeedCard, { Post } from '../components/PostFeedCard'
import Typography from '@mui/material/Typography'

type ButtonOptions = 
{
  buttonName: string,
  fetchURL: string,
}

const splitButtonOptions: ButtonOptions[] = [
  //{buttonName: "User", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/users"},
  //{buttonName: "User Muted Word", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/user_muted_words"},
  //{buttonName: "User Block", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/user_blocks"},
  //{buttonName: "Session", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/sessions"}, 
  //{buttonName: "Follow", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/follows"},
  //{buttonName: "Post", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/posts"},
  //{buttonName: "Post Like", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/post_likes"},
  //{buttonName: "Bookmark", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/post_bookmarks"},
  //{buttonName: "ForumFollow", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/forum_follows"},
  //{buttonName: "PostMedia", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/post_medias"},
  //{buttonName: "PostUserTag", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/post_user_tags"},
  //{buttonName: "Forum", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/forums"},
  //{buttonName: "Forum Moderator", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/forum_moderators"},
  //{buttonName: "Comment", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/comments"},
  //{buttonName: "Direct Message", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/dms"},
  //{buttonName: "Settings", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/settings"},
  //{buttonName: "Report", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/reports"},
];

//const testPosts: Post[] = [
  {
    //username: "triph",
    //pfp: "h",
    //date: "October 1st, 2024",
    //text: "Say hello to my koala.",
    //photos: ["https://media.istockphoto.com/id/98201918/photo/small-koala-sitting-on-white-background.jpg?s=1024x1024&w=is&k=20&c=5QNao-I60NybQMxtI8YoP72K468M9GLofRcD3zQz3DA="]
  }
//]

export default function HomePage() {
  const [testData, setTestData] = useState<any[]>([])

  const fetchOnClick = async (index: number) => {
    const fetch_res = await fetch(splitButtonOptions[index].fetchURL)
    const data = await fetch_res.json()
    console.log(data)
    setTestData(data)
  }

  return (
    <Typography variant="h1">WIP :)</Typography>
  )
/*
  return (
    <>
      {testData.length > 0 && <table style={{border: "1px solid white", borderCollapse: "collapse", margin: 'auto'}}>
        <tr>
          {Object.keys(testData[0]).map((key) => {
            return (<th>{key}</th>)
          })}
        </tr>
        {testData.map((data) => {
          return (
          <tr>
            {Object.values(data).map((val: any) => {
              return (<td style={{paddingLeft: "4px", paddingRight: "4px"}}>{val}</td>);
            })}
          </tr>
          )
        })}
     </table>}
      <SplitButton options={splitButtonOptions.map((value) => value.buttonName)} handleClickCallback={fetchOnClick}/>
      {testPosts.map((post) => {
        return (<PostFeedCard post={post} />);
      })}
    //</>
  )*/
}
