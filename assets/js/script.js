document.addEventListener("DOMContentLoaded", function () {
  // Modal nếu có
  const modal = document.getElementById("thongbao-modal");
  const closeBtn1 = document.getElementById("dongModal");
  const closeBtn2 = document.getElementById("dongModal2");
  const hideBtn = document.getElementById("anModal");

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

  // Đường dẫn header theo vị trí trang
  const headerPath = location.pathname.includes("/pages/") ? "../header.html" : "header.html";

  fetch(headerPath)
    .then((res) => res.text())
    .then((data) => {
      document.getElementById("header-placeholder").innerHTML = data;

      // Gắn sự kiện sau khi header đã được load xong
      const menuToggle = document.getElementById("menu-toggle");
      const mobileMenu = document.getElementById("mobileMenu");
      const closeBtn = document.getElementById("menu-close");

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

      // Click vào logo về trang chủ
      const logo = document.querySelector(".logo img");
      if (logo) {
        logo.style.cursor = "pointer";
        logo.addEventListener("click", () => {
          window.location.href = "/index.html";
        });
      }
    });
});
