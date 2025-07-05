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

// Lấy ID từ URL
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

if (!id) {
  alert("Không tìm thấy GDV!");
} else {
  db.collection("gdv_list").doc(id).get().then(doc => {
    if (!doc.exists) {
      alert("Không tìm thấy GDV!");
      return;
    }

    const d = doc.data();

    // DOM
    document.querySelector("#avatar").src = d.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    document.querySelector("#name").textContent = d.name || "Không rõ";

    // Nút
    document.querySelector("#linkMessenger").href = d.facebook || "#";
    document.querySelector("#linkBotCheck").href = `https://m.me/checkgdvbot?ref=${id}`;

    // Thông tin liên hệ
    document.querySelector("#fb_chinh").textContent = d.facebook || "";
    document.querySelector("#fb_chinh").href = d.facebook || "#";

    document.querySelector("#fb_phu").textContent = d.fb_phu || "";
    document.querySelector("#fb_phu").href = d.fb_phu || "#";

    document.querySelector("#zalo").textContent = d.zalo || "";
    document.querySelector("#zalo").href = `https://zalo.me/${d.zalo || ""}`;

    document.querySelector("#web").textContent = d.web || "";
    document.querySelector("#web").href = d.web || "#";

    const qrZalo = document.querySelector("#qr_zalo");
    if (d.zalo) {
      qrZalo.src = `https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=https://zalo.me/${d.zalo}`;
    } else {
      qrZalo.style.display = "none";
    }

    // Quỹ bảo hiểm
    const bh = d.baohiem || 0;
    const date = d.ngaybaohiem || "---";
    document.querySelector("#baohiem").innerHTML = `
      Từ ngày <b>${date}</b> hệ thống sẽ bảo đảm an toàn cho bạn với số tiền là
      <span style="color:red">${bh.toLocaleString()} vnđ</span> của <b>${d.name || "?"}</b>.
    `;

    // Dịch vụ
    const dichvu = d.dichvu || [];
    const dvHTML = dichvu.map(item => `<li>${item}</li>`).join("");
    document.querySelector("#dichvu").innerHTML = dvHTML || "<li>Không rõ</li>";

    // Tài khoản ngân hàng
    const bank = d.bank || [];
    const bankHTML = bank.map(item => `<li>${item}</li>`).join("");
    document.querySelector("#bank").innerHTML = bankHTML || "<li>Không rõ</li>";
  });
}
