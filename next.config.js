/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  eslint: {
    dirs: ['pages/', 'components/', 'client/']
  },
  env: {
    APP_NAME: "TaskGroup",
    MAX_USER_LIMIT: 5,
    COOKIE_KEY_USER_ID: "task2022uid",
    CSRF_SECRET: "secret1234",
    APOLLO_SV_URI: "http://localhost:4000/graphql",
    /* firebase */
    REACT_APP_FIREBASE_API_KEY: "",
    REACT_APP_FIREBASE_AUTH_DOMAIN: "",
    REACT_APP_FIREBASE_PROJECT_ID: "",
    REACT_APP_FIREBASE_STORAGE_BUCKET: "",
    REACT_APP_FIREBASE_MESSAGE_SENDER_ID: "",
    REACT_APP_FIREBASE_APP_ID: "",
    /*  
    staus: none/working/complete
    */
  },  
}
