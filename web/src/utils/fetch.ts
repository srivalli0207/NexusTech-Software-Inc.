import { getCSRFTokenFromCookie } from "./cookie"
import { URLS, createRedirectUrl } from "./urls"

const fetch_request = async (method: string, path: string, data?: { [key: string]: string | number }) => {
   const options: { [key: string]: any } = {
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

   if (response.redirected) {
      window.location.href = response.url // redirect
   }

   const msg = await response.json()
   return msg
}

export const get_posts = async (username?: string) => {
   const res = await fetch_request('GET', URLS.POSTS + (username !== undefined ? `?username=${username}` : ""))
   return res;
}

// next param is for redirects, if a post is submitted without a session, redirect to login, after login success
// redirect back to original page

export const submit_post = async (data: { text: string }) => {
   const res = await fetch_request('POST', createRedirectUrl(URLS.SUBMIT_POST), data)
   return res
}

export const delete_post = async (data: { post_id: number }) => {
   const res = await fetch_request('DELETE', createRedirectUrl(URLS.DELETE_POST), data)
   return res
}