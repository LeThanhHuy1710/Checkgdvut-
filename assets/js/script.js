document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("thongbao-modal");
  const closeBtn1 = document.getElementById("dongModal");
  const closeBtn2 = document.getElementById("dongModal2");
  const hideBtn = document.getElementById("anModal");

  // Hiện modal khi tải trang
  modal.style.display = "flex";

  // Ẩn tạm
  hideBtn.addEventListener("click", function () {
    modal.style.display = "none";
    setTimeout(() => {
      modal.style.display = "flex";
    }, 60000); // hiện lại sau 60s
  });

  // Đóng hoàn toàn
  closeBtn1.addEventListener("click", () => modal.style.display = "none");
  closeBtn2.addEventListener("click", () => modal.style.display = "none");
});
