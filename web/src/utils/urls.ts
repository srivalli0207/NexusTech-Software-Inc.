const DOMAIN = Object.freeze({
   DEVELOPMENT: 'http://localhost:5173',
   PRODUCTION: 'http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com'
})

const BASE_URL = (import.meta.env.MODE == 'production') ? DOMAIN.PRODUCTION : DOMAIN.DEVELOPMENT

export const URLS = Object.freeze({
   // authentication
   CSRF_TOKEN: `${BASE_URL}/api/test/auth/csrf`,
   GET_AUTH: `${BASE_URL}/api/test/auth/session`,
   SIGNUP: `${BASE_URL}/api/test/auth/signup`,
   LOGIN: `${BASE_URL}/api/test/auth/login`,
   LOGOUT: `${BASE_URL}/api/test/auth/logout`,
   
   // add rest of api endpoint urls
   POSTS: `${BASE_URL}/api/test/posts`,
   GET_POST: `${BASE_URL}/api/test/get_post`,
   SUBMIT_POST: `${BASE_URL}/api/test/post_submit`,
   DELETE_POST: `${BASE_URL}/api/test/post_delete`,
   UPLOAD_FILE: `${BASE_URL}/api/test/upload_file`,
   GET_FOLLOWS: `${BASE_URL}/api/test/follows`,
   GET_FOLLOWERS: `${BASE_URL}/api/test/followers`,
   GET_FOLLOWING: `${BASE_URL}/api/test/following`,
   FOLLOW_USER: `${BASE_URL}/api/test/follow_user`,
   CONVERSATION: `${BASE_URL}/api/test/conversation`,
   CONVERSATIONS: `${BASE_URL}/api/test/conversations`,
   MESSAGES: `${BASE_URL}/api/test/messages`,
   SEND_MESSAGE: `${BASE_URL}/api/test/send_message`,
   SEARCH_USERS: `${BASE_URL}/api/test/search_users`,
   GET_USER: `${BASE_URL}/api/test/user`,
   GET_FEED: `${BASE_URL}/api/test/feed`,
   GET_LIKES: `${BASE_URL}/api/test/likes`,
   LIKE_POST: `${BASE_URL}/api/test/like_post`,
   GET_BOOKMARKS: `${BASE_URL}/api/test/bookmarks`,
   BOOKMARK_POST: `${BASE_URL}/api/test/bookmark_post`,
   UPDATE_PROFILE: `${BASE_URL}/api/test/update_profile`,
})

/**
 * Creates a url with the next param which is the redirect url.
 * @param base base url
 */
export const createRedirectUrl = (base: string) => {
   const url = new URL(base)
   url.searchParams.append('next', window.location.pathname)
   return url.href
}
