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
  {buttonName: "etc", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/posts"}, 
  {buttonName: "etc", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/posts"},
  {buttonName: "etc", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/posts"},
  {buttonName: "etc", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/posts"},
  {buttonName: "etc", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/posts"},
  {buttonName: "etc", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/posts"},
  {buttonName: "etc", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/posts"},
  {buttonName: "etc", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/posts"},
  {buttonName: "etc", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/posts"},
  {buttonName: "etc", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/posts"},
  {buttonName: "etc", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/posts"},
  {buttonName: "etc", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/posts"},
  {buttonName: "etc", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/posts"},
  {buttonName: "etc", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/posts"}
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
