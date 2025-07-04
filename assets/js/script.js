// Menu toggle
document.getElementById("menu-toggle").addEventListener("click", function () {
  document.getElementById("menu").classList.toggle("active");
});

// Show modal on page load
window.addEventListener("DOMContentLoaded", function () {
  document.getElementById("thongbao-modal").style.display = "flex";
});

// Đóng modal
document.getElementById("dongModal").addEventListener("click", function () {
  document.getElementById("thongbao-modal").style.display = "none";
});

document.getElementById("dongModal2").addEventListener("click", function () {
  document.getElementById("thongbao-modal").style.display = "none";
});

// Ẩn modal
document.getElementById("anModal").addEventListener("click", function () {
  document.getElementById("thongbao-modal").style.display = "none";
});
