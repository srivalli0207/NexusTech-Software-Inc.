import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

type TestData = 
{
  author: string,
  text: string,
}

function App() {
  const [testData, setTestData] = useState<TestData[]>([])

  const fetchTest = async () => {
    const fetch_res = await fetch("http://127.0.0.1:8000/test/posts")
    const data: TestData[] = await fetch_res.json()
    console.log(data)
    setTestData([...testData, ...data])
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={fetchTest}>
          Fetch Me
        </button>
        {
          testData.map((value, index) => {
            return <p key={index}>Count: {index}, Author: {value.author}, Text: {value.text}</p>
          })
        }
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
