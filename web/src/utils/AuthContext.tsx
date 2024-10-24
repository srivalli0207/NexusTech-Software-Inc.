import { createContext, useEffect, useRef, useState } from "react";
import { get_auth } from "./auth";

export type UserAuth = {
   username: string,
   email: string,
   pfp: string | null
} | null

export const AuthContext = createContext<UserAuth>(null)

type AuthContextProviderProp = {
   children: React.ReactNode
}

export function AuthContextProvider({children}: AuthContextProviderProp) {
   const [auth, setAuth] = useState<UserAuth>(null)
   const [loading, setLoading] = useState(true)

   const on_auth_changed = (e: any) => {
      if (e.detail.user === undefined) {
         setAuth(null);
      } else {
         setAuth(e.detail.user);
      }
   }

   const get_user_auth = async () => {
      await get_auth();
      setLoading(false);
   }

   useEffect(() => {
      get_user_auth()
      document.addEventListener('nexify.auth.changed', on_auth_changed)

      return () => {
         document.removeEventListener('nexify.auth.changed', on_auth_changed);
      }
   }, [])

   return (
      <AuthContext.Provider value={auth}>
         {!loading && children}
      </AuthContext.Provider>
   )
}