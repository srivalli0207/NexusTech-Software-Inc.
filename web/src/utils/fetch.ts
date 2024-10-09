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

export const submit_post = async (data: { text: string }) => {
   const res = await fetch_request('POST', createRedirectUrl(URLS.SUBMIT_POST), data)
   return res
}

export const delete_post = async (data: { post_id: number }) => {
   const res = await fetch_request('DELETE', createRedirectUrl(URLS.DELETE_POST), data)
   return res
}

export type follows = {
   following: {
      username: string,
      pfp: string | null,
   },
   pk: number,
   user: {
      username: string,
      pfp: string | null,
   }
}

export const get_follows = async (user: string) => {
   const url = new URL(URLS.GET_FOLLOWS)
   url.searchParams.append('user', user)
   const res = await fetch_request('GET', url.href)
   return res as follows[]
}

export const get_is_following = async (user: string) => {
   const url = new URL(URLS.GET_IS_FOLLOWING);
   url.searchParams.append('username', user)
   const res = await fetch_request('GET', url.href)
   return res
}

export const follow_user = async (user: string, follow: boolean) => {
   const url = new URL(URLS.FOLLOW_USER);
   url.searchParams.append('username', user)
   url.searchParams.append('follow', follow.toString())
   const res = await fetch_request('POST', url.href)
   return res
}