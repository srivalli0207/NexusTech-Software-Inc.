import { useState } from 'react'
import SplitButton from '../components/SplitButton'
import '../styles/App.css'
import '../styles/index.css'

type TestData = 
{
  author: string,
  text: string,
}

type ButtonOptions = 
{
  buttonName: string,
  fetchURL: string,
}

const splitButtonOptions: ButtonOptions[] = [
  {buttonName: "User", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/posts"},
  {buttonName: "UserMutedWord", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/posts"},
  {buttonName: "Comment", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/posts"},
  {buttonName: "Session", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/posts"}, 
  {buttonName: "PostLike", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/posts"},
  {buttonName: "ForumModerator", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/posts"},
  {buttonName: "Follow", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/posts"},
  {buttonName: "Post", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/posts"},
  {buttonName: "Bookmark", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/posts"},
  {buttonName: "ForumFollow", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/posts"},
  {buttonName: "PostMedia", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/posts"},
  {buttonName: "Forum", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/posts"},
  {buttonName: "UserBlock", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/posts"},
  {buttonName: "Direct Message", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/posts"},
  {buttonName: "Settings", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/posts"},
  {buttonName: "Report", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/posts"},
  {buttonName: "PostUserTag", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/posts"}
];

export default function HomePage() {
  const [testData, setTestData] = useState<TestData[]>([])

  const fetchOnClick = async (index: number) => {
    const fetch_res = await fetch(splitButtonOptions[index].fetchURL)
    const data: TestData[] = await fetch_res.json()
    console.log(data)
    setTestData([...testData, ...data])
  }

  return (
    <>
      <SplitButton options={splitButtonOptions.map((value) => value.buttonName)} handleClickCallback={fetchOnClick}/> 
    </>
  )
}
