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
