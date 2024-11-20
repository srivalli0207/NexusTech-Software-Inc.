import { getCSRFTokenFromCookie } from "./cookie"
import { URLS, createRedirectUrl } from "./urls"

export type UserResponse = {
   username: string,
   displayName: string | null,
   profilePicture: string | null,
   bio: string | null,
   verified: boolean
}

export type UserProfileResponse = UserResponse & {
   banner: string | null,
   pronouns: string | null,
   following: boolean,
   followingYou: boolean,
   followerCount: number,
   followingCount: number
}

export type UserPostActionsResponse = {
   liked: boolean | null,
   bookmarked: boolean
}

export type PostResponse = {
   id: number,
   user: UserResponse
   text: string | null,
   date: string,
   media: { id: number, type: string, url: string }[],
   actions: UserPostActionsResponse | null;
   likeCount: number;
   dislikeCount: number
}

export type FollowResponse = {
   following: boolean
}

export type LikeResponse = {
   liked: boolean | null;
   likeCount: number;
   dislikeCount: number
}

export type BookmarkResponse = {
   bookmarked: boolean;
}

export type MessageResponse = {
   id: number;
   user: UserResponse;
   text: string;
   sent: string;
}

export type ConversationIdResponse = {
   id: number;
}

export type ConversationResponse = {
   id: number;
   name: string | null;
   group: boolean;
   lastMessage: MessageResponse | null,
   members: UserResponse[]
}

export type SetProfileRequest = {
   displayName: string | null,
   pronouns: string | null,
   bio: string | null,
   profilePicture: string | null,
   banner: string | null
}

export type MediaResponse = {
   urls: string[]
}

const fetch_request = async (method: string, path: string, data?: { [key: string]: string | number | File[] | null }) => {
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
   console.log(options);

   const response = await fetch(path, options)

   if (response.redirected) {
      window.location.href = response.url // redirect
   }

   const msg = await response.json()
   return msg
}

export const get_post = async (post_id: string): Promise<PostResponse> => {
   const res = await fetch_request('GET',  `${URLS.GET_POST}?post_id=${post_id}`)
   return res;
}

export const get_posts = async (username?: string): Promise<PostResponse[]> => {
   const res = await fetch_request('GET', URLS.POSTS + (username !== undefined ? `?username=${username}` : ""))
   return res;
}

export const submit_post = async (data: { text: string }): Promise<PostResponse> => {
   console.log(data.text);
   const res = await fetch_request('POST', createRedirectUrl(URLS.SUBMIT_POST), data)
   return res
}

export const delete_post = async (data: { post_id: number }): Promise<void> => {
   const res = await fetch_request('DELETE', createRedirectUrl(URLS.DELETE_POST), data)
   return res
}

export const upload_file = async (files: File[], entityType: string, entityId?: string, mediaType: string = "image"): Promise<MediaResponse> => {
   const formData = new FormData();
   for (const file of files) {
      formData.append("file", file);
   }
   const url = new URL(URLS.UPLOAD_FILE)
   url.searchParams.append("type", entityType);
   url.searchParams.append("media_type", mediaType);
   if (entityId) url.searchParams.append("id", entityId);
   const res = await fetch(url, {
      method: "POST",
      body: formData,
      headers: {
         "X-CSRFToken": getCSRFTokenFromCookie(),
      }
   });
   if (res.status !== 200) {
      throw "h";
   }
   return await res.json();
}

export const get_followers = async (user: string): Promise<UserResponse[]> => {
   const url = new URL(URLS.GET_FOLLOWERS)
   url.searchParams.append('username', user)
   const res = await fetch_request('GET', url.href)
   return res as UserResponse[]
}

export const get_following = async (user: string): Promise<UserResponse[]> => {
   const url = new URL(URLS.GET_FOLLOWING)
   url.searchParams.append('username', user)
   const res = await fetch_request('GET', url.href)
   return res as UserResponse[]
}

export const follow_user = async (user: string, follow: boolean): Promise<FollowResponse> => {
   const url = new URL(URLS.FOLLOW_USER);
   url.searchParams.append('username', user)
   url.searchParams.append('follow', follow.toString())
   const res = await fetch_request('POST', url.href)
   return res
}

export const get_conversation = async (username: string): Promise<ConversationResponse> => {
   const url = new URL(URLS.CONVERSATION);
   url.searchParams.append("username", username)
   const res = await fetch_request('GET', url.href)
   return res
}

export const get_conversations = async (): Promise<ConversationResponse[]> => {
   const url = new URL(URLS.CONVERSATIONS);
   const res = await fetch_request('GET', url.href)
   return res
}

export const get_messages = async (conversation: number): Promise<MessageResponse[]> => {
   const url = new URL(URLS.MESSAGES);
   url.searchParams.append("conversation", conversation.toString())
   const res = await fetch_request('GET', url.href)
   return res
}

export const send_message = async (conversation: number, text: string): Promise<MessageResponse> => {
   const url = new URL(URLS.SEND_MESSAGE);
   const res = await fetch_request('POST', url.href, { conversation: conversation, text: text })
   return res
}

export const search_users = async (search_query: string): Promise<UserResponse[]> => {
   const url = new URL(URLS.SEARCH_USERS)
   url.searchParams.append("query", search_query)
   const res = await fetch_request('GET', url.href)
   return res as UserResponse[]
}

export const get_user = async (username: string): Promise<UserProfileResponse> => {
   const url = new URL(URLS.GET_USER)
   url.searchParams.append("username", username)
   const res = await fetch_request('GET', url.href)
   return res
}

export const get_feed = async (): Promise<PostResponse[]> => {
   const url = new URL(URLS.GET_FEED)
   const res = await fetch_request('GET', url.href)
   return res
}

export const get_likes = async (username: string): Promise<PostResponse[]> => {
   const url = new URL(URLS.GET_LIKES)
   url.searchParams.append("username", username)
   const res = await fetch_request('GET', url.href)
   return res
}

export const like_post = async (postId: number, like: boolean): Promise<LikeResponse> => {
   const url = new URL(URLS.LIKE_POST)
   url.searchParams.append("post", postId.toString())
   url.searchParams.append("like", like ? "true" : "false");
   const res = await fetch_request('POST', url.href)
   return res
}

export const get_bookmarks = async (): Promise<PostResponse[]> => {
   const url = new URL(URLS.GET_BOOKMARKS)
   const res = await fetch_request('GET', url.href)
   return res
}

export const bookmark_post = async (postId: number): Promise<BookmarkResponse> => {
   const url = new URL(URLS.BOOKMARK_POST)
   url.searchParams.append("post", postId.toString())
   const res = await fetch_request('POST', url.href)
   return res
}

export const update_profile = async (profile: SetProfileRequest): Promise<void> => {
   const url = new URL(URLS.UPDATE_PROFILE);
   const res = await fetch_request("POST", url.href, profile);
   return res;
}

