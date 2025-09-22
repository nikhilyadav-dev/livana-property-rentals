const User = require("../modles/user");
//signup form
module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

//signup
module.exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({
      username,
      email,
    });

    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Livana");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

//login from

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

//login

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back to Livana");
  console.log(res.locals.redirectUrl);
  const redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

//logout

module.exports.logout = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Your are logged out");
    res.redirect("/listings");
  });
};
