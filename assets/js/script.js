function initHeaderEvents() {
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const closeBtn = document.querySelector(".close-btn");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("active");
    });
  }

  if (closeBtn && mobileMenu) {
    closeBtn.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
    });
  }
}
