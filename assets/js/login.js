document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#loginForm");
  const usernameInput = document.querySelector("#username");
  const passwordInput = document.querySelector("#password");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    // ✅ Tài khoản và mật khẩu cố định
    const validUsername = "admin";
    const validPassword = "123456";

    if (username === validUsername && password === validPassword) {
      // Ghi session xác nhận đăng nhập thành công
      sessionStorage.setItem("admin", "true");

      // Chuyển sang trang quản trị
      window.location.href = "admin.html";
    } else {
      alert("❌ Sai tên đăng nhập hoặc mật khẩu!");
    }
  });
});
