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
const gdvListContainer = document.querySelector("#gdvList .list");

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

// Hiển thị thông báo nhỏ
function showToast(msg, isSuccess = true) {
  const toast = document.createElement("div");
  toast.textContent = msg;
  toast.className = `toast ${isSuccess ? "success" : "error"}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Thêm GDV
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = inputName.value.trim();
  if (!name) return showToast("❌ Vui lòng nhập tên GDV!", false);

  btnAdd.disabled = true;
  btnAdd.innerHTML = "⏳ Đang xử lý...";

  const data = {
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
  };

  const timeout = setTimeout(() => {
    showToast("⏱ Mạng chậm hoặc Firebase bị treo!", false);
    btnAdd.disabled = false;
    btnAdd.innerHTML = "➕ Thêm GDV";
  }, 10000);

  try {
    await db.collection("gdv_list").add(data);
    clearTimeout(timeout);
    showToast("✅ Thêm GDV thành công!");
    form.reset();
    loadGDVs();
  } catch (err) {
    clearTimeout(timeout);
    showToast("❌ Lỗi khi thêm GDV: " + err.message, false);
  } finally {
    btnAdd.disabled = false;
    btnAdd.innerHTML = "➕ Thêm GDV";
  }
});

// Hiển thị GDV
function renderGDV(doc) {
  const data = doc.data();
  const item = document.createElement("div");
  item.className = "gdv-item";
  item.innerHTML = `
    <strong>${data.name}</strong><br>
    Facebook: <a href="${data.facebook || "#"}" target="_blank">Link</a><br>
    Bảo hiểm: ${data.baohiem?.toLocaleString() || "0"} VNĐ<br>
    Ngày: ${data.ngaybaohiem || "---"}<br>
    <button class="btn-delete" data-id="${doc.id}">🗑 Xoá</button>
    <button class="btn-edit" data-id="${doc.id}">✏️ Sửa</button>
    <hr>
  `;

  gdvListContainer.appendChild(item);

  item.querySelector(".btn-delete").addEventListener("click", async () => {
    if (confirm("Bạn có chắc chắn muốn xoá GDV này?")) {
      await db.collection("gdv_list").doc(doc.id).delete();
      showToast("🗑 Đã xoá GDV!");
      loadGDVs();
    }
  });

  item.querySelector(".btn-edit").addEventListener("click", () => {
    inputName.value = data.name || "";
    inputAvatar.value = data.avatar || "";
    inputFacebook.value = data.facebook || "";
    inputFbPhu.value = data.fb_phu || "";
    inputZalo.value = data.zalo || "";
    inputWebsite.value = data.web || "";
    inputBank.value = (data.bank || []).join("\n");
    inputDichVu.value = (data.dichvu || []).join(",");
    inputTien.value = data.baohiem || "";
    inputNgay.value = data.ngaybaohiem || "";
    inputNote.value = data.note || "";

    btnAdd.innerHTML = "💾 Cập nhật";
    btnAdd.dataset.editingId = doc.id;
  });
}

// Load GDV
function loadGDVs() {
  gdvListContainer.innerHTML = "🔄 Đang tải...";

  db.collection("gdv_list")
    .orderBy("createdAt", "desc")
    .get()
    .then(snapshot => {
      gdvListContainer.innerHTML = "";
      snapshot.forEach(doc => renderGDV(doc));
    })
    .catch(err => {
      showToast("❌ Lỗi tải danh sách GDV", false);
      console.error(err);
    });
}

// Nếu đang cập nhật, lưu lại
btnAdd.addEventListener("click", async (e) => {
  const id = e.target.dataset.editingId;
  if (!id) return;

  e.preventDefault();

  const data = {
    name: inputName.value.trim(),
    avatar: inputAvatar.value.trim(),
    facebook: inputFacebook.value.trim(),
    fb_phu: inputFbPhu.value.trim(),
    zalo: inputZalo.value.trim(),
    web: inputWebsite.value.trim(),
    bank: inputBank.value.trim().split("\n"),
    dichvu: inputDichVu.value.trim().split(","),
    baohiem: parseInt(inputTien.value.trim()) || 0,
    ngaybaohiem: inputNgay.value,
    note: inputNote.value.trim()
  };

  try {
    await db.collection("gdv_list").doc(id).update(data);
    showToast("✅ Đã cập nhật!");
    form.reset();
    delete btnAdd.dataset.editingId;
    btnAdd.innerHTML = "➕ Thêm GDV";
    loadGDVs();
  } catch (err) {
    showToast("❌ Cập nhật thất bại!", false);
  }
});

// Load ban đầu
loadGDVs();
