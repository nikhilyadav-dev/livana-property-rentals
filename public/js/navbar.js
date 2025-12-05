const header = document.querySelector(".header");
const hamburger = document.querySelector(".ham");
const hamList = document.querySelector(".hamburger-list");

window.addEventListener("scroll", (e) => {
  header.classList[window.scrollY > 50 ? "add" : "remove"]("active");
});

console.log(hamburger);
console.log(hamList);

hamburger.addEventListener("click", () => {
  hamList.classList.toggle("active");
});
