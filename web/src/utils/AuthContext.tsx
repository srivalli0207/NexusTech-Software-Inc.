import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthManager } from "../api/auth";

export type UserAuth = {
   username: string,
   email: string,
   pfp: string | null
}

export const AuthContext = createContext<UserAuth | null>(null)

type AuthContextProviderProp = {
   children: React.ReactNode
}

export function AuthContextProvider({children}: AuthContextProviderProp) {
   const [auth, setAuth] = useState<UserAuth | null>(null)
   const [loading, setLoading] = useState(true)

   const on_auth_changed = (e: any) => {
      if (e.detail.user === undefined) {
         setAuth(null);
      } else {
         setAuth(e.detail.user);
      }
   }

   const get_user_auth = async () => {
      await AuthManager.getInstance().getSession();
      setLoading(false);
   }

   useEffect(() => {
      get_user_auth()
      document.addEventListener('nexus.auth.changed', on_auth_changed)

      return () => {
         document.removeEventListener('nexus.auth.changed', on_auth_changed);
      }
   }, [])

   return (
      <AuthContext.Provider value={auth}>
         {!loading && children}
      </AuthContext.Provider>
   )
}

export const useUser = () => {
   return useContext(AuthContext)
}

export default function CSRF_Token() {
   useEffect(() => {
      AuthManager.getInstance().getCSRFToken();
   }, [])

   return (
      <></>
   )
}