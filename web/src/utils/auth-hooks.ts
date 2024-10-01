import { useContext } from "react"
import { AuthContext } from "./AuthContext"

export const useUser = () => {
   return useContext(AuthContext)
}