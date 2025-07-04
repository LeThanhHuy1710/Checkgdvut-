// Mở / Đóng menu
document.getElementById("menu-toggle").addEventListener("click", function () {
  const menu = document.getElementById("menu");
  menu.classList.toggle("active");
});

// Đóng menu khi bấm bên ngoài (nếu muốn)
window.addEventListener("click", function (e) {
  const menu = document.getElementById("menu");
  const toggle = document.getElementById("menu-toggle");
  if (!menu.contains(e.target) && !toggle.contains(e.target)) {
    menu.classList.remove("active");
  }
});

// Hiện modal thông báo khi load trang
window.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("thongbao-modal");
  modal.style.display = "flex";
});

// Đóng modal khi ấn nút đóng
document.getElementById("dongModal").addEventListener("click", function () {
  document.getElementById("thongbao-modal").style.display = "none";
});

// Ẩn modal tạm thời khi ấn nút ẩn
document.getElementById("anModal").addEventListener("click", function () {
  document.getElementById("thongbao-modal").style.display = "none";
});
