document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("thongbao-modal");
  const closeBtn1 = document.getElementById("dongModal");
  const closeBtn2 = document.getElementById("dongModal2");
  const hideBtn = document.getElementById("anModal");

  // Hiện modal nếu tồn tại
  if (modal) modal.style.display = "flex";

  if (hideBtn) {
    hideBtn.addEventListener("click", function () {
      modal.style.display = "none";
      setTimeout(() => {
        modal.style.display = "flex";
      }, 60000);
    });
  }

  if (closeBtn1) closeBtn1.addEventListener("click", () => modal.style.display = "none");
  if (closeBtn2) closeBtn2.addEventListener("click", () => modal.style.display = "none");

  // Tự động xác định đường dẫn header
  const headerPath = location.pathname.includes("/pages/") ? "../header.html" : "header.html";

  fetch(headerPath)
    .then(res => res.text())
    .then(data => {
      document.getElementById("header-placeholder").innerHTML = data;

      // ✅ Sự kiện menu toggle
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

      // Logo click về trang chủ
      const logo = document.querySelector(".logo img");
      if (logo) {
        logo.style.cursor = "pointer";
        logo.addEventListener("click", () => {
          window.location.href = "/index.html";
        });
      }
    });
});
