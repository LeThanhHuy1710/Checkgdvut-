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

    // Avatar và Tên
    document.getElementById("avatar").src = d.avatar || "../assets/img/default-avatar.png";
    document.getElementById("name").textContent = d.name || "Chưa rõ";

    // Fb chính
    const facebook = d.facebook || "";
    const facebookLink = document.getElementById("facebook");
    facebookLink.href = facebook ? `https://facebook.com/${facebook}` : "#";
    facebookLink.textContent = facebook || "---";

    // Fb phụ
    const fb_phu = d.fb_phu || "";
    const fbPhuLink = document.getElementById("fb_phu");
    fbPhuLink.href = fb_phu ? `https://facebook.com/${fb_phu}` : "#";
    fbPhuLink.textContent = fb_phu || "---";

    // Zalo
    const zalo = d.zalo || "";
    const zaloLink = document.getElementById("zalo");
    zaloLink.textContent = zalo || "---";
    zaloLink.href = zalo ? `https://zalo.me/${zalo}` : "#";

    // Web
    const web = d.web || "";
    const webLink = document.getElementById("web");
    webLink.href = web ? web : "#";
    webLink.textContent = web || "---";

    // QR Zalo
    document.getElementById("qr").src = zalo
      ? `https://img.vietqr.io/image/zalopay-${zalo}-compact.png`
      : "../assets/img/default-qr.png";

    // Messenger → tới Facebook chat
    document.getElementById("messenger").href = facebook ? `https://m.me/${facebook}` : "#";

    // Bot check → dẫn vào Discord group
    document.getElementById("botcheck").href = "https://discord.gg/Tq3qaKdU";

    // Bảo hiểm
    const name = d.name || "---";
    const money = (d.baohiem || 0).toLocaleString("vi-VN");
    const date = d.ngaybaohiem || "---";
    document.getElementById("baohiemText").innerHTML =
      `Từ ngày <strong>${date}</strong> hệ thống sẽ bảo đảm an toàn cho bạn với số tiền là <span style="color:red"> ${money} VND </span> của <strong>${name}</strong>.`;

    // Dịch vụ
    const dichvuList = d.dichvu || [];
    const ulDichVu = document.getElementById("dichvu");
    ulDichVu.innerHTML = "";
    dichvuList.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item;
      ulDichVu.appendChild(li);
    });

    // Ngân hàng
    const bankList = d.bank || [];
    const ulBank = document.getElementById("bank");
    ulBank.innerHTML = "";
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
