document.getElementById("add-gdv-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const bank = document.getElementById("bank").value.trim();
  const facebook = document.getElementById("facebook").value.trim();
  const zalo = document.getElementById("zalo").value.trim();

  if (!name || !bank) {
    alert("Tên và tài khoản ngân hàng là bắt buộc.");
    return;
  }

  db.collection("gdv_list").add({
    name,
    bank,
    social: { facebook, zalo },
    createdAt: new Date()
  }).then(() => {
    document.getElementById("result-msg").innerText = "✅ Thêm GDV thành công!";
    document.getElementById("add-gdv-form").reset();
  }).catch((error) => {
    document.getElementById("result-msg").innerText = "❌ Lỗi: " + error.message;
  });
});
