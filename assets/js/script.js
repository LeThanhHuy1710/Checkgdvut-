document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("thongbao-modal");
  const closeBtn1 = document.getElementById("dongModal");
  const closeBtn2 = document.getElementById("dongModal2");
  const hideBtn = document.getElementById("anModal");

  // Hiện modal khi tải trang (nếu có)
  if (modal) modal.style.display = "flex";

  // Ẩn tạm modal
  if (hideBtn) {
    hideBtn.addEventListener("click", function () {
      modal.style.display = "none";
      setTimeout(() => {
        modal.style.display = "flex";
      }, 60000);
    });
  }

  // Đóng hoàn toàn modal
  if (closeBtn1) closeBtn1.addEventListener("click", () => modal.style.display = "none");
  if (closeBtn2) closeBtn2.addEventListener("click", () => modal.style.display = "none");

  // ✅ Load header.html từ đúng đường dẫn (dựa theo vị trí trang)
  let headerPath = location.pathname.includes("/pages/") ? "../header.html" : "header.html";

  fetch(headerPath)
    .then(res => res.text())
    .then(data => {
      document.getElementById("header-placeholder").innerHTML = data;

      // Gắn sự kiện menu-toggle
      const menuToggle = document.getElementById("menu-toggle");
      const mobileMenu = document.getElementById("mobileMenu");
      const closeBtn = document.querySelector(".close-btn");

      if (menuToggle && mobileMenu) {
        menuToggle.addEventListener("click", () => {
          const isVisible = mobileMenu.style.display === "block";
          mobileMenu.style.display = isVisible ? "none" : "block";
        });
      }

      if (closeBtn && mobileMenu) {
        closeBtn.addEventListener("click", () => {
          mobileMenu.style.display = "none";
        });
      }

      // Gắn sự kiện click vào logo để quay về trang chủ
      const logo = document.querySelector(".logo img");
      if (logo) {
        logo.style.cursor = "pointer";
        logo.addEventListener("click", () => {
          window.location.href = "/index.html";
        });
      }
    });
});
