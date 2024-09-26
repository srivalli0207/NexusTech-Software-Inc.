import { createContext, useEffect, useState } from "react";
import { get_auth } from "./auth";

export type UserAuth = {
   username: string,
   email: string,
} | null

export const AuthContext = createContext<UserAuth>(null)

type AuthContextProviderProp = {
   children: React.ReactNode
}

export function AuthContextProvider({children}: AuthContextProviderProp) {
   const [auth, setAuth] = useState<UserAuth>(null)

   useEffect(() => {
      const get_user_auth = async () => {
         const data = await get_auth()
         console.log(data)
      }

      get_user_auth()

   }, [])

   return (
      <AuthContext.Provider value={auth}>
         {children}
      </AuthContext.Provider>
   )
}