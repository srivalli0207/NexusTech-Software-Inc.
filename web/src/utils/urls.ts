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
   SUBMIT_POST: `${BASE_URL}/api/test/post_submit`,
})