// Khởi tạo Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDR34V4nSclq1kIMgbnSyMgTMeqUlzFOqo",
  authDomain: "checkgdvut-d2bcc.firebaseapp.com",
  projectId: "checkgdvut-d2bcc",
  storageBucket: "checkgdvut-d2bcc.appspot.com",
  messagingSenderId: "242735289196",
  appId: "1:242735289196:web:cf729b41af26987cb05949",
  measurementId: "G-WLS5PJ4X2G"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// DOM
const form = document.querySelector("#formAdd");
const btnAdd = document.querySelector("#btnAdd");
const inputName = document.querySelector("#name");
const inputAvatar = document.querySelector("#avatar");
const inputFacebook = document.querySelector("#facebook");
const inputFbPhu = document.querySelector("#fb_phu");
const inputZalo = document.querySelector("#zalo");
const inputWebsite = document.querySelector("#website");
const inputBank = document.querySelector("#bank");
const inputDichVu = document.querySelector("#dichvu");
const inputTien = document.querySelector("#baohiem");
const inputNgay = document.querySelector("#ngay");
const inputNote = document.querySelector("#note");

// Thêm GDV
btnAdd.addEventListener("click", async () => {
  const name = inputName.value.trim();
  if (name === "") {
    alert("❌ Vui lòng nhập Tên Giao Dịch Viên!");
    return;
  }

  btnAdd.disabled = true;
  btnAdd.innerHTML = "⏳ Đang xử lý...";

  try {
    await db.collection("gdv_list").add({
      name,
      avatar: inputAvatar.value.trim(),
      facebook: inputFacebook.value.trim(),
      fb_phu: inputFbPhu.value.trim(),
      zalo: inputZalo.value.trim(),
      web: inputWebsite.value.trim(),
      bank: inputBank.value.trim().split("\n"),
      dichvu: inputDichVu.value.trim().split(","),
      baohiem: parseInt(inputTien.value.trim()) || 0,
      ngaybaohiem: inputNgay.value,
      note: inputNote.value.trim(),
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    alert("✅ Thêm GDV thành công!");
    location.reload();
    form.reset();
  } catch (err) {
    alert("❌ Lỗi khi thêm GDV: " + err.message);
  } finally {
    btnAdd.disabled = false;
    btnAdd.innerHTML = "➕ Thêm GDV";
  }
});
