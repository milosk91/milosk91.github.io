const menuBtn = document.querySelector(".menu-btn");

menuBtn.addEventListener("click", function (event) {
  event.stopPropagation();
  document.getElementsByClassName("menu")[0].classList.toggle("open");
});

document.body.addEventListener("click", function (event) {
  if (event.target.classList.contains("menu-item")) return;
  const menu = document.getElementsByClassName("menu")[0];
  if (menu.classList.contains("open")) {
    menu.classList.remove("open");
  }
  if (menuBtn.classList.contains("open")) {
    menuBtn.classList.remove("open");
  }
});

menuBtn.addEventListener("click", () => {
  menuBtn.classList.toggle("open");
});
