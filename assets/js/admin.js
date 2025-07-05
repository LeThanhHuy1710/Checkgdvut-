// Firebase config
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

// Ngăn reload khi submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = inputName.value.trim();
  if (name === "") {
    alert("❌ Vui lòng nhập Tên Giao Dịch Viên!");
    return;
  }

  btnAdd.disabled = true;
  btnAdd.innerHTML = "⏳ Đang xử lý...";

  const data = {
    name,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  // Chỉ thêm nếu có giá trị
  if (inputAvatar.value.trim()) data.avatar = inputAvatar.value.trim();
  if (inputFacebook.value.trim()) data.facebook = inputFacebook.value.trim();
  if (inputFbPhu.value.trim()) data.fb_phu = inputFbPhu.value.trim();
  if (inputZalo.value.trim()) data.zalo = inputZalo.value.trim();
  if (inputWebsite.value.trim()) data.web = inputWebsite.value.trim();
  if (inputBank.value.trim()) data.bank = inputBank.value.trim().split("\n");
  if (inputDichVu.value.trim()) data.dichvu = inputDichVu.value.trim().split(",");
  if (inputTien.value.trim()) data.baohiem = parseInt(inputTien.value.trim()) || 0;
  if (inputNgay.value) data.ngaybaohiem = inputNgay.value;
  if (inputNote.value.trim()) data.note = inputNote.value.trim();

  // Nếu mạng yếu: thông báo sau 8 giây
  const timeout = setTimeout(() => {
    alert("⏱ Mạng chậm hoặc Firebase bị treo. Vui lòng thử lại.");
    btnAdd.disabled = false;
    btnAdd.innerHTML = "➕ Thêm GDV";
  }, 8000);

  try {
    await db.collection("gdv_list").add(data);
    clearTimeout(timeout);
    alert("✅ Thêm GDV thành công!");
    form.reset(); // reset form sau khi thêm
  } catch (err) {
    clearTimeout(timeout);
    alert("❌ Lỗi khi thêm GDV: " + err.message);
  } finally {
    btnAdd.disabled = false;
    btnAdd.innerHTML = "➕ Thêm GDV";
  }
});
