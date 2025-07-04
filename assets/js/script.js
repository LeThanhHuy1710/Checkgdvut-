// Toggle menu khi bấm nút ☰
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.querySelector(".menu-toggle");
  const navbar = document.querySelector(".navbar");
  toggleBtn.addEventListener("click", () => {
    navbar.classList.toggle("active");
  });

  // Hiển thị alert khi vào trang (1 lần duy nhất mỗi phiên)
  if (!sessionStorage.getItem("shownAlert")) {
    document.getElementById("alertBox").style.display = "block";
    sessionStorage.setItem("shownAlert", "true");
  }
});
