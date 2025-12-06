const passport = require("passport");
const User = require("../modles/user");

var GoogleStrategy = require("passport-google-oauth20").Strategy;
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, cb) {
      let existingUser = await User.findOne({ providerId: profile.id });
      if (existingUser) {
        return cb(null, existingUser);
      } else {
        const newUser = new User({
          providerId: profile.id,
          provider: "google",
          email:
            profile._json.email ||
            `google${Math.floor(Math.random() * 501) + 500}@example.com`,
          username:
            profile._json.given_name.toLowerCase() +
            (Math.floor(Math.random() * (1000 - 500 + 1)) + 500),
        });
        let googleUser = await newUser.save();
        console.log(googleUser);
        return cb(null, googleUser);
      }
    }
  )
);

module.exports = passport;
