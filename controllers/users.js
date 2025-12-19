const User = require("../modles/user");
const generateEmailTemplate = require("../utils/generateEmailTempltae");
const sendEmail = require("../utils/sendEmail");
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

//help form
module.exports.renderContactForm = (req, res) => {
  res.render("users/contact.ejs");
};

module.exports.contactHandle = async (req, res) => {
  const { fullname, email, subject, message } = req.body;
  const emailMessage = generateEmailTemplate(fullname, email, message);
  console.log("route before email sent");
  sendEmail({ email, subject, emailMessage });
  console.log("route after email sent");
  req.flash("success", "Message sent successfully");
  res.redirect("/contact");
};

// Wishlist

module.exports.addToWishList = async (req, res) => {
  const { userId, listingId } = req.params;
  console.log("working", userId, listingId);
  const user = await User.findById(userId);
  const exists = user.wishList.includes(listingId);
  if (exists) {
    user.wishList.pull(listingId);
    await user.save();
    req.flash("success", "Added to wishList");
    return res.redirect(`/listings/${listingId}`);
  } else {
    user.wishList.push(listingId);
    await user.save();
    return res.redirect(`/listings/${listingId}`);
  }
};

// Show Wish List

module.exports.renderWishList = async (req, res) => {
  let { userId } = req.params;
  const user = await User.findById(userId).populate("wishList");
  const wishLists = user.wishList;
  res.render("users/wishList.ejs", { wishLists });
};

// Show My Property

module.exports.renderMyProperty = async (req, res) => {
  let { userId } = req.params;
  const user = await User.findById(userId).populate("propertyList");
  const propertyLists = user.propertyList;
  res.render("users/wishList.ejs", { propertyLists });
};
