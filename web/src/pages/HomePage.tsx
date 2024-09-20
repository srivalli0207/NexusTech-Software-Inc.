import { useState } from 'react'
import SplitButton from '../components/SplitButton'
import '../styles/App.css'
import '../styles/index.css'

type ButtonOptions = 
{
  buttonName: string,
  fetchURL: string,
}

const splitButtonOptions: ButtonOptions[] = [
  {buttonName: "User", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/users"},
  // {buttonName: "UserMutedWord", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/posts"},
  {buttonName: "Comment", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/comments"},
  {buttonName: "Session", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/sessions"}, 
  // {buttonName: "PostLike", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/posts"},
  // {buttonName: "ForumModerator", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/posts"},
  // {buttonName: "Follow", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/posts"},
  {buttonName: "Post", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/posts"},
  // {buttonName: "Bookmark", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/posts"},
  // {buttonName: "ForumFollow", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/posts"},
  {buttonName: "PostMedia", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/post_medias"},
  {buttonName: "Forum", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/forums"},
  // {buttonName: "UserBlock", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/posts"},
  {buttonName: "Direct Message", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/dms"},
  // {buttonName: "Settings", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/posts"},
  {buttonName: "Report", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/reports"},
  // {buttonName: "PostUserTag", fetchURL: "http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/posts"}
];

export default function HomePage() {
  const [testData, setTestData] = useState<any[]>([])

  const fetchOnClick = async (index: number) => {
    const fetch_res = await fetch(splitButtonOptions[index].fetchURL)
    const data = await fetch_res.json()
    console.log(data)
    setTestData(data)
  }

  return (
  <>
    {testData.length > 0 && (
      <table style={{ border: "1px solid white", borderCollapse: "collapse" }}>
        <tr>
          {Object.keys(testData[0]).map((key) => {
            return (
              <th style={{ border: "1px solid white", padding: "4px" }}>
                {key}
              </th>
            );
          })}
        </tr>
        {testData.map((data) => {
          return (
            <tr>
              {Object.values(data).map((val: any) => {
                return (
                  <td style={{ border: "1px solid white", padding: "4px" }}>
                    {val}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </table>
    )}
    <SplitButton
      options={splitButtonOptions.map((value) => value.buttonName)}
      handleClickCallback={fetchOnClick}
    />
  </>
);
}
