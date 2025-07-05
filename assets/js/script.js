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

fetch("header.html")
.then(res => res.text())
.then(data => {
document.getElementById("header-placeholder").innerHTML = data;

// <-- Tải lại script.js để gắn sự kiện menu-toggle  
const script = document.createElement("script");  
script.src = "assets/js/script.js";  
document.body.appendChild(script);

});

Lệnh js của toii đây

