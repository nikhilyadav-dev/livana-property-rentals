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
