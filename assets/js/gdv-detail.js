// ===================== IMPORT SUPABASE =====================
import { supabase } from "./supabase.js";

// ===================== LẤY ID TỪ URL =====================
function getQueryParam(param) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}

const id = getQueryParam("id");

if (!id) {
  alert("❌ Không tìm thấy ID GDV!");
  throw new Error("Missing GDV ID");
}

// ===================== FETCH GDV DETAIL =====================
async function loadGDVDetail() {
  const { data, error } = await supabase
    .from("gdv_list")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error(error);
    alert("❌ Không tìm thấy GDV.");
    return;
  }

  const d = data;

  // ===================== AVATAR + NAME =====================
  document.getElementById("avatar").src =
    d.avatar || "../assets/img/default-avatar.png";
  document.getElementById("name").textContent =
    d.ten || d.name || "Chưa rõ";

  // ===================== FACEBOOK CHÍNH =====================
  const facebook = d.facebook || "";
  const facebookLink = document.getElementById("facebook");
  const fbUrl = facebook.startsWith("http")
    ? facebook
    : `https://facebook.com/${facebook}`;

  facebookLink.href = facebook ? fbUrl : "#";
  facebookLink.textContent = facebook || "---";

  // ===================== FACEBOOK PHỤ =====================
  const fb_phu = d.fb_phu || "";
  const fbPhuLink = document.getElementById("fb_phu");
  const fbPhuUrl = fb_phu.startsWith("http")
    ? fb_phu
    : `https://facebook.com/${fb_phu}`;

  fbPhuLink.href = fb_phu ? fbPhuUrl : "#";
  fbPhuLink.textContent = fb_phu || "---";

  // ===================== ZALO =====================
  const zalo = d.zalo || "";
  const zaloLink = document.getElementById("zalo");
  zaloLink.textContent = zalo || "---";
  zaloLink.href = zalo ? `https://zalo.me/${zalo}` : "#";

  // ===================== WEBSITE =====================
  const web = d.website || d.web || "";
  const webLink = document.getElementById("web");
  webLink.href = web || "#";
  webLink.textContent = web || "---";

  // ===================== MESSENGER =====================
  const messengerBtn = document.getElementById("messenger");
  if (facebook) {
    const fbId = fbUrl.replace("https://facebook.com/", "");
    messengerBtn.href = `https://m.me/${fbId}`;
  } else {
    messengerBtn.href = "#";
  }

  // ===================== DISCORD BOT =====================
  document.getElementById("botcheck").href =
    "https://discord.gg/Tq3qaKdU";

  // ===================== QR FACEBOOK =====================
  if (facebook && document.getElementById("qrFb")) {
    document.getElementById("qrFb").innerHTML = "";
    new QRCode(document.getElementById("qrFb"), {
      text: fbUrl,
      width: 128,
      height: 128,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });
  }

  // ===================== BẢO HIỂM =====================
  const nameGDV = d.ten || d.name || "---";
  const money = Number(d.baohiem || 0).toLocaleString("vi-VN");
  const date = d.ngay || d.ngaybaohiem || "---";

  document.getElementById("baohiemText").innerHTML = `
    <div style="margin-bottom:8px">
      Từ ngày <strong>${date}</strong>, khách hàng sẽ được
    </div>
    <div style="font-weight:bold;font-size:17px;color:#d9534f">
      CHECKGDVUT bảo hiểm an toàn giao dịch
    </div>
    <div>
      với số tiền <strong style="color:red">${money} VND</strong>
      của <strong>${nameGDV}</strong>.
    </div>
    <img src="../assets/img/stamp-checkgdvut.png"
         style="width:150px;opacity:0.15;margin-top:10px">
  `;

  // ===================== DỊCH VỤ =====================
  const dichvuList = d.dichvu || [];
  const ulDichVu = document.getElementById("dichvu");
  ulDichVu.innerHTML = "";

  dichvuList.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    ulDichVu.appendChild(li);
  });

  // ===================== NGÂN HÀNG =====================
  const bankList = d.bank || [];
  const ulBank = document.getElementById("bank");
  ulBank.innerHTML = "";

  bankList.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    ulBank.appendChild(li);
  });
}

// ===================== RUN =====================
loadGDVDetail();
