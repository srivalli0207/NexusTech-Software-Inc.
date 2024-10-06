import { useParams } from "react-router-dom"
import { useRef, useEffect, FormEvent } from "react"
import { Box, Button, TextField } from '@mui/material'

export default function TestChat() {
   const { room_id } = useParams()
   const chatSocket = useRef<WebSocket>()

   useEffect(() => {
      chatSocket.current = new WebSocket(`ws://${window.location.host}/ws/chat/${room_id}/`)

      chatSocket.current.onmessage = (e: MessageEvent) => {
         const data = JSON.parse(e.data)
         console.log(data)
      }

      chatSocket.current.onclose = (e: CloseEvent) => {
         console.log('socket closed', e)
      }

      return () => {
         chatSocket.current?.close()
      }

   }, [])

   const sendMessage = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const formData = new FormData(event.currentTarget)
      let formObject = Object.fromEntries(formData.entries()) as { message: string }
      chatSocket.current?.send( JSON.stringify({'message': formObject.message}) )
   }

   return (
      <>
         <p>Chat room: {room_id}</p>
         <Box
            component="form"
            autoComplete="off"
            onSubmit={sendMessage}
         >
            <TextField
               sx={{ width: '100%' }}
               name="message"
               label="Enter Text"
               required
               maxRows={5}
            />
            <div style={{ display: 'flex' }}>
               <Button type='submit' variant="contained" sx={{ margin: '1rem 0 1rem auto' }}>
                  Send
               </Button>
            </div>
         </Box>
      </>
   )
}