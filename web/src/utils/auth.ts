import { getCSRFTokenFromCookie } from "./cookie"
import { URLS } from "../utils/urls"

const auth_request = async (method: string, path: string, data?: {[key: string]: string}) => {
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

   const event = new CustomEvent('nexify.auth.changed', {detail: msg })
   if (path !== URLS.CSRF_TOKEN) {
      document.dispatchEvent(event)
   }

   return msg
}

export const get_csrf_token = async () => {
   await auth_request('GET', URLS.CSRF_TOKEN)
}

export const get_auth = async () => {
   return await auth_request('GET', URLS.GET_AUTH)
}

export const log_in = async (data: {username: string, password: string}) => {
   const res = await auth_request('POST', URLS.LOGIN, data)
   return {message: res.message, user: res.user}
}

export const log_out = async () => {
   await auth_request('POST', URLS.LOGOUT)
}

export const signup = async (data: {username: string, email: string, password: string}) => {
   const res = await auth_request('POST', URLS.SIGNUP, data)
   return {message: res.message, user: res.user}
}
