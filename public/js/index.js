// Price Toggler
const toggler = document.getElementById("switchCheckDefault");
let clicked = true;
toggler.addEventListener("click", () => {
  const texInfo = document.getElementsByClassName("toggledText");

  for (info of texInfo) {
    if (clicked == true) {
      info.classList.remove("hide");
    } else {
      info.classList.add("hide");
    }
  }
  clicked = !clicked;
});

// Filter Button
let filtersBox = document.querySelector(".filter-main");
let buttonSlide = document.querySelectorAll(".slideButton");

buttonSlide.forEach((button) => {
  button.addEventListener("click", () => {
    const direction = button.classList.contains("left_img_button") ? -1 : 1;
    const scrollImg = direction * (filtersBox.clientWidth - 100);
    filtersBox.scrollBy({ left: scrollImg, behavior: "smooth" });
  });
});

filtersBox.addEventListener("scroll", () => {
  buttonSlide[0].style.display = filtersBox.scrollLeft <= 0 ? "none" : "flex";
  buttonSlide[1].style.display =
    filtersBox.scrollLeft >= filtersBox.scrollWidth - filtersBox.clientWidth - 5
      ? "none"
      : "flex";
  console.log(filtersBox.scrollWidth);
  console.log(filtersBox.scrollWidth - filtersBox.clientWidth);
});

// Image Slider

function nextSlide(e, btn) {
  e.stopPropagation();

  const sliderContainer = btn.closest(".slider-container");
  const imageContainer = sliderContainer.querySelector(".image-container");

  let currentIndex = Number(sliderContainer.dataset.index || 0);
  const totalSlides = imageContainer.children.length;

  currentIndex = (currentIndex + 1) % totalSlides;
  sliderContainer.dataset.index = currentIndex;

  imageContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
}

function prevSlide(e, btn) {
  e.stopPropagation();

  const sliderContainer = btn.closest(".slider-container");
  const imageContainer = sliderContainer.querySelector(".image-container");

  let currentIndex = Number(sliderContainer.dataset.index || 0);
  const totalSlides = imageContainer.children.length;

  currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
  sliderContainer.dataset.index = currentIndex;

  imageContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
}

// Show Listing

function goToListing(id) {
  window.location.href = `/listings/${id}`;
}

// Show Text Price

const gstToggle = document.querySelector(".gstToggle");
const priceEls = document.querySelectorAll(".price-info");
const taxEls = document.querySelectorAll(".tax-info");
const changeAfter = document.querySelectorAll(".changeAfter");
console.log(priceEls);

const GST_RATE = 0.18;

gstToggle.addEventListener("change", () => {
  priceEls.forEach((priceEl, index) => {
    const basePrice = Number(priceEl.dataset.price);
    console.log(basePrice);
    const gstPrice = Math.round(basePrice + basePrice * GST_RATE);

    console.log(gstPrice);

    if (gstToggle.checked) {
      priceEl.style.display = "none";
      taxEls[index].style.display = "inline";
      taxEls[index].style.fontWeight = "600";
      taxEls[index].innerText = `₹${gstPrice} / night`;
    } else {
      priceEl.style.display = "inline";
      taxEls[index].style.display = "none";
    }
  });

  changeAfter.forEach((el) => {
    el.innerText = gstToggle.checked
      ? "Display total after taxes"
      : "Display total before taxes";
  });
});
