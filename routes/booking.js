const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking");
const { isLoggedIn } = require("../middleware"); // your existing middleware

router.post("/check-availability", bookingController.checkAvailability);

// Create booking
router.post("/book", isLoggedIn, bookingController.createBooking);

// My bookings page
router.get("/my-bookings", isLoggedIn, bookingController.getUserBookings);

// Stripe payment — redirects to Stripe
router.post("/stripe", isLoggedIn, bookingController.stripePayment);

// Stripe redirects here after payment
router.get("/payment-success", isLoggedIn, bookingController.paymentSuccess);

// Cancel booking
router.post("/cancel", isLoggedIn, bookingController.cancelBooking);

module.exports = router;
