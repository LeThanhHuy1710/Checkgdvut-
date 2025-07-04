document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.getElementById("mobileMenu");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", function () {
      mobileMenu.classList.toggle("show");
    });
  }

  // Xử lý nút đóng menu
  const closeBtn = document.querySelector(".close-btn");
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      mobileMenu.classList.remove("show");
    });
  }

  // Xử lý modal thông báo
  const modal = document.getElementById("thongbao-modal");
  const dongModal = document.getElementById("dongModal");
  const dongModal2 = document.getElementById("dongModal2");
  const anModal = document.getElementById("anModal");

  if (modal) {
    modal.style.display = "block";

    dongModal?.addEventListener("click", () => (modal.style.display = "none"));
    dongModal2?.addEventListener("click", () => (modal.style.display = "none"));
    anModal?.addEventListener("click", () => (modal.style.display = "none"));
  }
});
