import { getCSRFTokenFromCookie } from "./cookie"
import { URLS } from "../utils/urls"

const request = async (method: string, path: string, data?: {[key: string]: string}) => {
   const options: {[key: string]: any} = {
      method,
      headers: {
         "Accept": "application/json",
         "X-CSRFToken": getCSRFTokenFromCookie(),
      },
   }

   if (typeof data !== 'undefined') {
      options.body = JSON.stringify(data)
      options.headers['Content-Type'] = 'application/json'
   }

   const response = await fetch(path, options)
   const msg = await response.json()

   return msg
}

export const get_csrf_token = async () => {
   await request('GET', URLS.CSRF_TOKEN)
}

export const signup = async (data: {username: string, email: string, password: string}) => {
   await request('POST', URLS.SIGNUP, data)
}