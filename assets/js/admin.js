// Firebase init
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
const auth = firebase.auth();

// DOM
const form = document.querySelector("#formAdd");
const btnAdd = document.querySelector("#btnAdd");
const list = document.querySelector("#gdvList .list");
const loginForm = document.querySelector("#loginForm");
const loginSection = document.querySelector("#loginSection");
const adminContent = document.querySelector("#adminContent");

// Input
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

let editId = null; // Theo dõi ID khi đang sửa

// Đăng nhập admin bằng username
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  try {
    const q = db.collection("admin_users").where("username", "==", username);
    const snap = await q.get();
    if (snap.empty) return alert("❌ Tên đăng nhập không tồn tại!");

    const userData = snap.docs[0].data();
    await auth.signInWithEmailAndPassword(userData.email, password);
    alert("✅ Đăng nhập thành công!");
  } catch (err) {
    alert("❌ Sai thông tin đăng nhập!");
  }
});

// Theo dõi trạng thái đăng nhập
auth.onAuthStateChanged((user) => {
  if (user) {
    loginSection.style.display = "none";
    adminContent.style.display = "block";
    loadGDVs();
  } else {
    loginSection.style.display = "block";
    adminContent.style.display = "none";
  }
});

// Thêm hoặc cập nhật GDV
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = inputName.value.trim();
  if (name === "") return alert("❌ Vui lòng nhập tên!");

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
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  if (!editId) data.createdAt = firebase.firestore.FieldValue.serverTimestamp();

  btnAdd.disabled = true;
  btnAdd.textContent = "⏳ Đang xử lý...";

  try {
    if (editId) {
      await db.collection("gdv_list").doc(editId).update(data);
      alert("✅ Cập nhật GDV thành công!");
      editId = null;
    } else {
      await db.collection("gdv_list").add(data);
      alert("✅ Thêm GDV thành công!");
    }
    form.reset();
    loadGDVs();
  } catch (err) {
    alert("❌ Lỗi: " + err.message);
  } finally {
    btnAdd.disabled = false;
    btnAdd.textContent = "➕ Thêm GDV";
  }
});

// Tải danh sách
function loadGDVs() {
  list.innerHTML = "";
  db.collection("gdv_list")
    .orderBy("createdAt", "desc")
    .get()
    .then((snap) => {
      snap.forEach((doc) => renderGDV(doc.id, doc.data()));
    });
}

// Hiển thị từng GDV
function renderGDV(id, d) {
  const div = document.createElement("div");
  div.className = "gdv-item";
  div.innerHTML = `
    <strong>${d.name}</strong><br>
    <small>Ngày: ${d.ngaybaohiem || "---"}</small><br>
    Bảo hiểm: ${d.baohiem?.toLocaleString()} VNĐ<br>
    Facebook: <a href="${d.facebook}" target="_blank">Link</a>
    <div class="buttons">
      <button class="edit" data-id="${id}">✏️ Sửa</button>
      <button class="delete" data-id="${id}">🗑️ Xoá</button>
    </div>
  `;
  list.appendChild(div);
}

// Sự kiện click cho nút Xoá và Sửa
list.addEventListener("click", async (e) => {
  const id = e.target.dataset.id;
  if (e.target.classList.contains("delete")) {
    if (confirm("❗Bạn có chắc muốn xoá GDV này?")) {
      await db.collection("gdv_list").doc(id).delete();
      alert("🗑️ Đã xoá!");
      loadGDVs();
    }
  }

  if (e.target.classList.contains("edit")) {
    const doc = await db.collection("gdv_list").doc(id).get();
    const d = doc.data();
    inputName.value = d.name || "";
    inputAvatar.value = d.avatar || "";
    inputFacebook.value = d.facebook || "";
    inputFbPhu.value = d.fb_phu || "";
    inputZalo.value = d.zalo || "";
    inputWebsite.value = d.web || "";
    inputBank.value = (d.bank || []).join("\n");
    inputDichVu.value = (d.dichvu || []).join(",");
    inputTien.value = d.baohiem || "";
    inputNgay.value = d.ngaybaohiem || "";
    inputNote.value = d.note || "";
    editId = id;
    btnAdd.textContent = "💾 Lưu thay đổi";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});
