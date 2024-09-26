import { useEffect } from "react"
import { get_csrf_token } from "./auth"

export default function CSRF_Token() {
   useEffect(() => {
      get_csrf_token()
   }, [])

   return (
      <></>
   )
}