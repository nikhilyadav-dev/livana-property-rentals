/* ═══════════════════════════════════════
     Image Slider LOGIC
  ═══════════════════════════════════════ */

let images = window.sliderImages;
let imageIndex = null;

const fullSlider = document.querySelector(".fullSlider");
const fullImage = document.getElementById("fullImage");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const closeSlider = document.getElementById("closeSlider");

function openSlider(index) {
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

/* ═══════════════════════════════════════
     WISHLIST LOGIC
  ═══════════════════════════════════════ */
const btn = document.querySelector(".wishlist-btn");

if (btn) {
  btn.addEventListener("click", () => {
    const userId = btn.dataset.user;
    const listingId = btn.dataset.listing;
    if (!userId) {
      alert("Login first");
      return;
    }
    fetch(`/wishlist/${userId}/${listingId}`, { method: "PATCH" });
    const icon = btn.querySelector("i");
    icon.classList.toggle("fas");
    icon.classList.toggle("far");
  });
}

/* ═══════════════════════════════════════
     MAP LOGIC
  ═══════════════════════════════════════ */

mapboxgl.accessToken = mapToken;
const lightStyle = "mapbox://styles/mapbox/streets-v12";
const darkStyle = "mapbox://styles/mapbox/dark-v11";
let isDark = false;

const map = new mapboxgl.Map({
  container: "map",
  style: lightStyle,
  center: coordinates || [77.209, 28.6139],
  zoom: 9,
});

map.addControl(new mapboxgl.NavigationControl());
new mapboxgl.Marker({ color: "red" }).setLngLat(coordinates).addTo(map);

// Privacy curcle

map.on("load", () => {
  map.addSource("privacy-circle", {
    type: "geojson",
    data: turf.circle(coordinates, 0.3, { units: "kilometers", steps: 64 }),
  });
  map.addLayer({
    id: "circle-fill",
    type: "fill",
    source: "privacy-circle",
    paint: { "fill-color": "#ff385c", "fill-opacity": 0.15 },
  });
  map.addLayer({
    id: "circle-outline",
    type: "line",
    source: "privacy-circle",
    paint: { "line-color": "#ff385c", "line-width": 2 },
  });
});

// Glob Projection

map.on("load", () => {
  map.setProjection("globe");

  map.setFog({
    color: "rgb(220,220,230)",
    "high-color": "rgb(36,92,223)",
    "horizon-blend": 0.02,
    "space-color": "rgb(11,11,25)",
    "star-intensity": 0.6,
  });
});

//

map.on("load", () => {
  map.flyTo({
    center: coordinates,
    zoom: 14,
    pitch: 45,
    bearing: -17.6,
    duration: 3000,
    essential: true,
  });
});

// Fly animation

map.on("load", () => {
  map.flyTo({
    center: coordinates,
    zoom: 14,
    pitch: 45,
    bearing: -17.6,
    duration: 3000,
    essential: true,
  });
});

//Fullscreen + geolocate controls

map.addControl(new mapboxgl.FullscreenControl());
map.addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: { enableHighAccuracy: true },
    trackUserLocation: true,
    showUserHeading: true,
  }),
);

map.on("load", () => {
  map.scrollZoom.setWheelZoomRate(1 / 300);
  map.dragRotate.enable();
  map.touchZoomRotate.enableRotation();
});

/* ═══════════════════════════════════════
     BOOKING WIDGET LOGIC
  ═══════════════════════════════════════ */
const PRICE_PER_NIGHT = listing.price;
const LISTING_ID = listing._id;

// When check-in changes: enable check-out, reset form
const bwCheckIn = document.getElementById("bwCheckIn");
const bwCheckOut = document.getElementById("bwCheckOut");

if (bwCheckIn) {
  bwCheckIn.addEventListener("change", function () {
    if (bwCheckOut) {
      bwCheckOut.min = this.value;
      bwCheckOut.disabled = !this.value;
      bwCheckOut.value = "";
    }
    // Reset availability state when dates change
    const result = document.getElementById("bwAvailResult");
    const form = document.getElementById("bwBookingForm");
    if (result) {
      result.style.display = "none";
      result.className = "bw-avail-result";
    }
    if (form) {
      form.style.display = "none";
    }
    const checkBtn = document.getElementById("bwCheckBtn");
    if (checkBtn) checkBtn.textContent = "Check Availability";
  });

  bwCheckOut.addEventListener("change", function () {
    // If dates change after availability was confirmed, reset
    const form = document.getElementById("bwBookingForm");
    if (form && form.style.display === "block") {
      const result = document.getElementById("bwAvailResult");
      result.style.display = "none";
      form.style.display = "none";
      document.getElementById("bwCheckBtn").textContent = "Check Availability";
    }
  });
}

async function bwCheckAvailability() {
  const checkIn = bwCheckIn ? bwCheckIn.value : "";
  const checkOut = bwCheckOut ? bwCheckOut.value : "";
  const resultDiv = document.getElementById("bwAvailResult");
  const form = document.getElementById("bwBookingForm");
  const checkBtn = document.getElementById("bwCheckBtn");

  // ── Validation ──
  if (!checkIn) {
    resultDiv.className = "bw-avail-result warn";
    resultDiv.textContent = "⚠️ Please select a check-in date.";
    resultDiv.style.display = "block";
    return;
  }
  if (!checkOut) {
    resultDiv.className = "bw-avail-result warn";
    resultDiv.textContent = "⚠️ Please select a check-out date.";
    resultDiv.style.display = "block";
    return;
  }
  if (new Date(checkOut) <= new Date(checkIn)) {
    resultDiv.className = "bw-avail-result warn";
    resultDiv.textContent = "⚠️ Check-out must be after check-in.";
    resultDiv.style.display = "block";
    form.style.display = "none";
    return;
  }

  // ── Loading state ──
  resultDiv.className = "bw-avail-result checking";
  resultDiv.textContent = "⏳ Checking availability...";
  resultDiv.style.display = "block";
  checkBtn.textContent = "Checking...";
  checkBtn.disabled = true;
  form.style.display = "none";

  try {
    const response = await fetch("/bookings/check-availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        listingId: LISTING_ID,
        checkInDate: checkIn,
        checkOutDate: checkOut,
      }),
    });

    const data = await response.json();
    checkBtn.disabled = false;

    if (!data.success) {
      resultDiv.className = "bw-avail-result warn";
      resultDiv.textContent = "⚠️ Could not check availability. Try again.";
      return;
    }

    if (data.isAvailable) {
      // ── Available ──
      resultDiv.className = "bw-avail-result available";
      resultDiv.textContent = "✅ Available! Fill in details below to reserve.";
      checkBtn.textContent = "✓ Recheck Dates";

      // Populate hidden inputs
      document.getElementById("bwFormCheckIn").value = checkIn;
      document.getElementById("bwFormCheckOut").value = checkOut;

      // Calculate nights & price
      const nights = Math.ceil(
        (new Date(checkOut) - new Date(checkIn)) / (1000 * 3600 * 24),
      );
      const total = nights * PRICE_PER_NIGHT;

      document.getElementById("bwSummary").innerHTML = `
        <div class="bw-summary-row">
          <span>₹${PRICE_PER_NIGHT.toLocaleString()} × ${nights} night${nights > 1 ? "s" : ""}</span>
          <span>₹${total.toLocaleString()}</span>
        </div>
        <div class="bw-summary-row">
          <span>Service fee</span>
          <span>₹0</span>
        </div>
        <div class="bw-summary-total">
          <span>Total</span>
          <span>₹${total.toLocaleString()}</span>
        </div>
      `;

      // Show form
      form.style.display = "block";
    } else {
      // ── Not available ──
      resultDiv.className = "bw-avail-result unavailable";
      resultDiv.textContent =
        "❌ Not available for these dates. Please try other dates.";
      checkBtn.textContent = "Check Availability";
      form.style.display = "none";
    }
  } catch (err) {
    checkBtn.disabled = false;
    checkBtn.textContent = "Check Availability";
    resultDiv.className = "bw-avail-result warn";
    resultDiv.textContent = "⚠️ Network error. Please try again.";
  }
}
