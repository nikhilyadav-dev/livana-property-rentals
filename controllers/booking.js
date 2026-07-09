const Listing = require("../modles/listing");
const sendEmail = require("../utils/sendEmail");
const Stripe = require("stripe");
const Booking = require("../modles/booking");

// ───  check date availability ───
const checkAvailability = async ({ checkInDate, checkOutDate, listingId }) => {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  const overlapping = await Booking.find({
    listing: listingId,
    status: { $ne: "cancelled" },
    checkInDate: { $lte: checkOut },
    checkOutDate: { $gte: checkIn },
  });

  return overlapping.length === 0;
};

// ─── check-availability ───
module.exports.checkAvailability = async (req, res) => {
  try {
    const { listingId, checkInDate, checkOutDate } = req.body;
    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      listingId,
    });
    res.json({ success: true, isAvailable });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ─── book ───
module.exports.createBooking = async (req, res) => {
  try {
    const { listingId, checkInDate, checkOutDate, guests, paymentMethod } =
      req.body;
    // Validate dates
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    if (checkOut <= checkIn) {
      req.flash("error", "Check-out must be after check-in.");
      return res.redirect(`/listings/${listingId}`);
    }
    // Check availability
    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      listingId,
    });
    if (!isAvailable) {
      req.flash("error", "Property is not available for selected dates.");
      return res.redirect(`/listings/${listingId}`);
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      req.flash("error", "Listing not found.");
      return res.redirect("/listings");
    }
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 3600 * 24));
    const totalPrice = listing.price * nights;
    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      listing: listingId,
      checkInDate,
      checkOutDate,
      guests: +guests,
      totalPrice,
      paymentMethod: paymentMethod || "Pay at Check-in",
    });
    // Send confirmation email
    await sendEmail({
      to: req.user.email,
      subject: "Booking Confirmed – Livana Property Rentals",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1a1a2e;">🏠 Booking Confirmed!</h2>
          <p>Hi ${req.user.username}, thank you for your booking. Here are your details:</p>
          <table style="width:100%; border-collapse:collapse; margin-top:16px;">
            <tr style="background:#f8f8f8;">
              <td style="padding:10px; border:1px solid #eee;"><strong>Booking ID</strong></td>
              <td style="padding:10px; border:1px solid #eee;">${booking._id}</td>
            </tr>
            <tr>
              <td style="padding:10px; border:1px solid #eee;"><strong>Property</strong></td>
              <td style="padding:10px; border:1px solid #eee;">${listing.title}</td>
            </tr>
            <tr style="background:#f8f8f8;">
              <td style="padding:10px; border:1px solid #eee;"><strong>Location</strong></td>
              <td style="padding:10px; border:1px solid #eee;">${listing.location}, ${listing.country}</td>
            </tr>
            <tr>
              <td style="padding:10px; border:1px solid #eee;"><strong>Check-In</strong></td>
              <td style="padding:10px; border:1px solid #eee;">${checkIn.toDateString()}</td>
            </tr>
            <tr style="background:#f8f8f8;">
              <td style="padding:10px; border:1px solid #eee;"><strong>Check-Out</strong></td>
              <td style="padding:10px; border:1px solid #eee;">${checkOut.toDateString()}</td>
            </tr>
            <tr>
              <td style="padding:10px; border:1px solid #eee;"><strong>Nights</strong></td>
              <td style="padding:10px; border:1px solid #eee;">${nights}</td>
            </tr>
            <tr style="background:#f8f8f8;">
              <td style="padding:10px; border:1px solid #eee;"><strong>Guests</strong></td>
              <td style="padding:10px; border:1px solid #eee;">${booking.guests}</td>
            </tr>
            <tr>
              <td style="padding:10px; border:1px solid #eee;"><strong>Total Amount</strong></td>
              <td style="padding:10px; border:1px solid #eee;">₹${totalPrice.toLocaleString()}</td>
            </tr>
            <tr style="background:#f8f8f8;">
              <td style="padding:10px; border:1px solid #eee;"><strong>Payment</strong></td>
              <td style="padding:10px; border:1px solid #eee;">${booking.paymentMethod}</td>
            </tr>
          </table>
          <p style="margin-top:20px; color:#666;">We look forward to welcoming you!</p>
          <p style="color:#666;">– Livana Property Rentals Team</p>
        </div>
      `,
    });
    req.flash("success", "Booking created! Check your email for details.");
    res.redirect("/bookings/my-bookings");
  } catch (error) {
    console.error("Booking Error:", error.message);
    req.flash("error", "Failed to create booking. Please try again.");
    res.redirect("back");
  }
};

// ─── my-bookings ───
module.exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("listing")
      .sort({ createdAt: -1 });

    res.render("bookings/myBookings", {
      bookings,
      title: "My Bookings",
    });
  } catch (error) {
    req.flash("error", "Could not load bookings.");
    res.redirect("/listings");
  }
};

// ─── stripe ───
module.exports.stripePayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId).populate("listing");
    if (!booking) {
      req.flash("error", "Booking not found.");
      return res.redirect("/bookings/my-bookings");
    }

    // Security: only booking owner can pay
    if (booking.user.toString() !== req.user._id.toString()) {
      req.flash("error", "Unauthorized.");
      return res.redirect("/bookings/my-bookings");
    }

    if (booking.isPaid) {
      req.flash("error", "Already paid.");
      return res.redirect("/bookings/my-bookings");
    }

    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: req.user.email,
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: booking.listing.title,
              description: `Check-in: ${new Date(booking.checkInDate).toDateString()} | Guests: ${booking.guests}`,
            },
            unit_amount: Math.round(booking.totalPrice * 100), // paise
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.protocol}://${req.get("host")}/bookings/payment-success?bookingId=${bookingId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.protocol}://${req.get("host")}/bookings/my-bookings`,
      metadata: {
        bookingId: bookingId.toString(),
        userId: req.user._id.toString(),
      },
    });

    // SSR: direct redirect to Stripe
    res.redirect(303, session.url);
  } catch (error) {
    console.error("Stripe Error:", error.message);
    req.flash("error", "Payment failed. Please try again.");
    res.redirect("/bookings/my-bookings");
  }
};

// ─── payment-success ───
module.exports.paymentSuccess = async (req, res) => {
  try {
    const { bookingId, session_id } = req.query;

    // Verify with Stripe API before marking paid
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripeInstance.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      req.flash("error", "Payment not completed.");
      return res.redirect("/bookings/my-bookings");
    }

    const booking = await Booking.findById(bookingId).populate("listing");
    if (!booking) {
      req.flash("error", "Booking not found.");
      return res.redirect("/bookings/my-bookings");
    }

    if (!booking.isPaid) {
      booking.isPaid = true;
      booking.status = "confirmed";
      booking.paymentMethod = "Online (Stripe)";
      await booking.save();

      // Send payment confirmation email
      await sendEmail({
        to: req.user.email,
        subject: "Payment Successful – Livana Property Rentals",
        html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #22c55e;">✅ Payment Successful!</h2>

  <p>
    Hi ${booking.user.username}, your payment of
    <strong>₹${booking.totalPrice.toLocaleString()}</strong>
    for
    <strong>${booking.listing.title}</strong>
    has been received.
  </p>

  <p>Your booking is now <strong>confirmed</strong>.</p>

  <p style="color:#666;">
    Booking ID: ${booking._id}
  </p>

  <p style="margin-top:20px; color:#666;">
    – Livana Property Rentals Team
  </p>
</div>
`,
      });
    }

    req.flash("success", "🎉 Payment successful! Booking confirmed.");
    res.redirect("/bookings/my-bookings");
  } catch (error) {
    console.error("Payment Success Error:", error.message);
    req.flash("error", "Could not verify payment.");
    res.redirect("/bookings/my-bookings");
  }
};

// ─── webhook (Stripe server-to-server) ───
module.exports.stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    event = stripeInstance.webhooks.constructEvent(
      req.body, // must be raw buffer
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { bookingId } = session.metadata;

    try {
      await Booking.findByIdAndUpdate(bookingId, {
        isPaid: true,
        status: "confirmed",
        paymentMethod: "Online (Stripe)",
      });
      console.log(`✅ Webhook: Booking ${bookingId} confirmed.`);
    } catch (err) {
      console.error("Webhook DB Error:", err.message);
      return res.status(500).send("DB update failed");
    }
  }

  res.json({ received: true });
};

// ─── cancel ───
module.exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findOne({
      _id: bookingId,
      user: req.user._id,
    });

    if (!booking) {
      req.flash("error", "Booking not found.");
      return res.redirect("/bookings/my-bookings");
    }

    if (booking.isPaid) {
      req.flash("error", "Paid bookings cannot be cancelled. Contact support.");
      return res.redirect("/bookings/my-bookings");
    }

    booking.status = "cancelled";
    await booking.save();

    req.flash("success", "Booking cancelled successfully.");
    res.redirect("/bookings/my-bookings");
  } catch (error) {
    req.flash("error", "Failed to cancel booking.");
    res.redirect("/bookings/my-bookings");
  }
};
