// gdv-detail.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/supabase.js";

// -------------------------
// 1️⃣ Khởi tạo Supabase
// -------------------------
const SUPABASE_URL = "https://xeidegtzbbiuglgmkbsm.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_XqJzHKum27HwEEzDhxKAqQ_qdoItx4K";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// -------------------------
// 2️⃣ Lấy id từ URL
// -------------------------
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}
const id = getQueryParam("id");
if (!id) {
  alert("Không tìm thấy ID!");
}

// -------------------------
// 3️⃣ Lấy dữ liệu GDV từ Supabase
// -------------------------
async function loadGDV() {
  try {
    const { data, error } = await supabase
      .from("gdv_list")
      .select("*")
      .eq("id", id)
      .limit(1);

    if (error || !data || data.length === 0) {
      alert("Không tìm thấy GDV.");
      return;
    }

    const d = data[0];

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
    webLink.href = web || "#";
    webLink.textContent = web || "---";

    // Messenger Chat
    const messengerBtn = document.getElementById("messenger");
    messengerBtn.href = facebook ? `https://m.me/${facebook.replace("https://facebook.com/", "")}` : "#";

    // Discord Bot Check
    document.getElementById("botcheck").href = "https://discord.gg/Tq3qaKdU";

    // QR Facebook
    if (facebook && document.getElementById("qrFb")) {
      new QRCode(document.getElementById("qrFb"), {
        text: fbUrl,
        width: 128,
        height: 128,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
    }

    // Bảo hiểm
    const name = d.name || "---";
    const money = (d.baohiem || 0).toLocaleString("vi-VN");
    const date = d.ngaybaohiem || "---";
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

  } catch (err) {
    alert("Lỗi tải dữ liệu!");
    console.error(err);
  }
}

loadGDV();
