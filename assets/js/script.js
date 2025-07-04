// Toggle menu
document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".mobile-menu");

  toggleBtn.addEventListener("click", function () {
    menu.style.display = (menu.style.display === "flex") ? "none" : "flex";
  });
});
