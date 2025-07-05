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

    // Facebook chính
    const facebook = d.facebook || "";
    const facebookLink = document.getElementById("facebook");
    const fbUrl = facebook.startsWith("http") ? facebook : `https://facebook.com/${facebook}`;
    facebookLink.href = facebook ? fbUrl : "#";
    facebookLink.textContent = facebook || "---";

    // Facebook phụ
    const fb_phu = d.fb_phu || "";
    const fbPhuLink = document.getElementById("fb_phu");
    const fbPhuUrl = fb_phu.startsWith("http") ? fb_phu : `https://facebook.com/${fb_phu}`;
    fbPhuLink.href = fb_phu ? fbPhuUrl : "#";
    fbPhuLink.textContent = fb_phu || "---";

    // Zalo
    const zalo = d.zalo || "";
    const zaloLink = document.getElementById("zalo");
    zaloLink.textContent = zalo || "---";
    zaloLink.href = zalo ? `https://zalo.me/${zalo}` : "#";

    // Website
    const web = d.web || "";
    const webLink = document.getElementById("web");
    webLink.href = web ? web : "#";
    webLink.textContent = web || "---";

    // Messenger Chat
    const messengerBtn = document.getElementById("messenger");
    messengerBtn.href = facebook ? `https://m.me/${facebook.replace("https://facebook.com/", "")}` : "#";

    // Discord Bot Check
    document.getElementById("botcheck").href = "https://discord.gg/Tq3qaKdU";

    // Bảo hiểm
    const name = d.name || "---";
    const money = (d.baohiem || 0).toLocaleString("vi-VN");
    const date = d.ngaybaohiem || "---";

    // QR Facebook (nếu có)
    if (facebook) {
      if (document.getElementById("qrFb")) {
        new QRCode(document.getElementById("qrFb"), {
          text: fbUrl,
          width: 128,
          height: 128,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H
        });
      }

      // Nội dung bảo hiểm kèm logo 1 lần duy nhất
      document.getElementById("baohiemText").innerHTML = `
        <div style="margin-bottom: 8px;">
          Từ ngày <strong>${date}</strong>, khách hàng sẽ được
        </div>
        <div style="font-weight: bold; font-size: 17px; color: #d9534f;">
          CHECKGDVUT bảo hiểm an toàn giao dịch
        </div>
        <div>
          với số tiền <strong style="color: red">${money} VND</strong> của <strong>${name}</strong>.
        </div>
        <img src="../assets/img/stamp-checkgdvut.png" style="width: 150px; opacity: 0.15; margin-top: 10px;" />
      `;
    }

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
