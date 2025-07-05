import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

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

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get ID từ URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// Lấy dữ liệu GDV
async function loadGDV() {
  if (!id) return;

  const docRef = doc(db, "gdv_list", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return alert("Không tìm thấy thông tin GDV!");

  const data = docSnap.data();

  // Avatar & Tên
  document.getElementById("gdv-avatar").src = data.avatar || "../assets/img/default-avatar.png";
  document.getElementById("gdv-name").textContent = data.name || "Chưa rõ";

  // Liên kết
  document.getElementById("messenger-link").href = data.fb_link || "#";
  document.getElementById("botcheck-link").href = data.bot_link || "#";

  // Liên hệ
  document.getElementById("fb-main").textContent = data.fb_uid || "";
  document.getElementById("fb-main").href = `https://facebook.com/${data.fb_uid}`;
  document.getElementById("fb-sub").textContent = data.fb_phu || "";
  document.getElementById("fb-sub").href = `https://facebook.com/${data.fb_phu}`;
  document.getElementById("zalo-link").textContent = data.zalo || "";
  document.getElementById("zalo-link").href = `https://zalo.me/${data.zalo}`;
  document.getElementById("web-info").textContent = data.web || "";
  document.getElementById("qr-img").src = data.qr || "../assets/img/qr-default.png";

  // Quỹ Bảo Hiểm
  document.getElementById("baohiem-info").innerHTML = `
    Từ ngày <b>${data.ngaybaohiem}</b> hệ thống sẽ bảo đảm an toàn cho bạn với số tiền là 
    <b style="color:red;">${data.quybaohiem || "0 vnđ"}</b> của <b>${data.name}</b>.
  `;

  // Dịch vụ
  const dichvuList = document.getElementById("dichvu-list");
  (data.dichvu || []).forEach(service => {
    const li = document.createElement("li");
    li.textContent = "• " + service;
    dichvuList.appendChild(li);
  });

  // Tài khoản ngân hàng
  const bankList = document.getElementById("bank-list");
  (data.taikhoan || []).forEach(acc => {
    const li = document.createElement("li");
    li.textContent = `• ${acc.bank}: ${acc.stk}`;
    bankList.appendChild(li);
  });
}

loadGDV();
