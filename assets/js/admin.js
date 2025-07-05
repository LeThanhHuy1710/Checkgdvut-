document.getElementById("add-gdv-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const bank = document.getElementById("bank").value;
  const facebook = document.getElementById("facebook").value;
  const zalo = document.getElementById("zalo").value;

  db.collection("gdv_list").add({
    name,
    bank,
    social: { facebook, zalo },
    createdAt: new Date()
  }).then(() => {
    alert("Thêm GDV thành công!");
    document.getElementById("add-gdv-form").reset();
  }).catch((error) => {
    alert("Lỗi khi thêm GDV: " + error.message);
  });
});
