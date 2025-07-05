const firebaseConfig = {
  apiKey: "AIzaSyDR34V4nSclq1kIMgbnSyMgTMeqUlzFOqo",
  authDomain: "checkgdvut-d2bcc.firebaseapp.com",
  projectId: "checkgdvut-d2bcc"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

const id = getQueryParam("id");
if (!id) {
  alert("Không tìm thấy ID!");
} else {
  db.collection("gdv_list").doc(id).get().then(doc => {
    if (!doc.exists) {
      alert("Không tìm thấy GDV.");
      return;
    }

    const d = doc.data();

    document.getElementById("avatar").src = d.avatar || "../assets/img/default-avatar.png";
    document.getElementById("name").textContent = d.name || "Chưa rõ";

    document.getElementById("facebook").href = d.facebook || "#";
    document.getElementById("fb_phu").href = d.fb_phu || "#";
    document.getElementById("zalo").textContent = d.zalo || "---";
    document.getElementById("web").href = d.web || "#";

    // QR
    document.getElementById("qr").src = d.zalo
      ? `https://img.vietqr.io/image/zalopay-${d.zalo}-compact.png`
      : "../assets/img/default-qr.png";

    // Bot link
    document.getElementById("messenger").href = d.facebook || "#";
    document.getElementById("botcheck").href = d.facebook
      ? `https://m.me/checkrealbot?ref=${encodeURIComponent(d.facebook)}`
      : "#";

    // Bảo hiểm
    const name = d.name || "---";
    const money = (d.baohiem || 0).toLocaleString();
    const date = d.ngaybaohiem || "---";
    document.getElementById("baohiemText").innerHTML =
      `Từ ngày <strong>${date}</strong> hệ thống sẽ bảo đảm an toàn cho bạn với số tiền là <span style="color:red"> ${money} vnd </span> của <strong>${name}</strong>.`;

    // Dịch vụ
    const dichvuList = d.dichvu || [];
    const ulDichVu = document.getElementById("dichvu");
    dichvuList.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item;
      ulDichVu.appendChild(li);
    });

    // Tài khoản ngân hàng
    const bankList = d.bank || [];
    const ulBank = document.getElementById("bank");
    bankList.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item;
      ulBank.appendChild(li);
    });

  }).catch(err => {
    alert("Lỗi tải dữ liệu!");
    console.error(err);
  });
}
