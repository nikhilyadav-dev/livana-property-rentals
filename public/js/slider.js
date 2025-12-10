// Js For Image Slider

let images = window.sliderImages;
let imageIndex = null;

const fullSlider = document.querySelector(".fullSlider");
const fullImage = document.getElementById("fullImage");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const closeSlider = document.getElementById("closeSlider");

console.log(images);

function openSlider(index) {
  console.log(index);
  imageIndex = index;
  fullImage.src = images[imageIndex].url;
  fullSlider.classList.remove("hidden");
}

// Next image
nextBtn.onclick = () => {
  imageIndex = (imageIndex + 1) % images.length;
  fullImage.src = images[imageIndex].url;
};

// Prev image
prevBtn.onclick = () => {
  imageIndex = (imageIndex - 1 + images.length) % images.length;
  fullImage.src = images[imageIndex].url;
};

// Close slider
closeSlider.onclick = () => {
  fullSlider.classList.add("hidden");
};

// JS For Price And Calender

const price = window.price;

const today = new Date();
today.setHours(0, 0, 0, 0);

const picker = new Litepicker({
  element: document.getElementById("startDate"),
  elementEnd: document.getElementById("endDate"),
  singleMode: false,
  selectForward: true,
  numberOfMonths: 2,
  numberOfColumns: 2,
  minDate: today,
  format: "MMM DD, YYYY",
});

picker.on("selected", (start, end) => {
  // Calculate night count
  const diff = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  const nights = diff === 0 ? 1 : diff; // minimum 1 night (same as Airbnb)

  // Update UI
  document.getElementById("nightPrice").innerHTML = `₹${price} x ${nights} ${
    nights > 1 ? "nights" : "night"
  }`;

  document.getElementById("totalPrice").innerHTML = `Total price: ₹${
    price * nights
  }`;

  document.getElementById(
    "startDisplay"
  ).innerHTML = `Start Date: ${start.toDateString()}`;

  document.getElementById(
    "endDisplay"
  ).innerHTML = `End Date: ${end.toDateString()}`;

  // Save values for booking
  window.bookingData = {
    startDate: start,
    endDate: end,
    nights,
    total: price * nights,
  };
});

// Handle BOOKING
document.getElementById("bookingBtn").addEventListener("click", function () {
  if (!window.bookingData) {
    alert("Please select a date range!");
    return;
  }

  // You can submit form or send AJAX here
  console.log("Booking data:", window.bookingData);
});
