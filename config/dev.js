const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} = process.env;

module.exports = {
  googleClientID: GOOGLE_CLIENT_ID,
  googleClientSecret: GOOGLE_CLIENT_SECRET,
  mongoURI: 'mongodb://localhost/blog_dev',
  cookieKey: '123123123'
};
