const passport = require("passport");
const User = require("../modles/user");

var FacebookStrategy = require("passport-facebook").Strategy;
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "/auth/facebook/callback",
      profileFields: ["id", "displayName", "photos", "emails"],
    },
    async function (accessToken, refreshToken, profile, cb) {
      let existingUser = await User.findOne({ providerId: profile.id });
      if (existingUser) {
        return cb(null, existingUser);
      } else {
        const newUser = new User({
          providerId: profile.id,
          provider: "facebook",

          email:
            profile._json.email ||
            `facebook${Math.floor(Math.random() * 501) + 500}@example.com`,
          username:
            profile._json.name.split(" ")[0].toLowerCase() +
            (Math.floor(Math.random() * 501) + 500),
        });
        let facebookUser = await newUser.save();
        return cb(null, facebookUser);
      }
    }
  )
);

module.exports = passport;
