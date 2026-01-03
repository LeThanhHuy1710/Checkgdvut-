import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

/* ================= SUPABASE CONFIG ================= */
const SUPABASE_URL = "https://xeidegtzbbiuglgmkbsm.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlaWRlZ3R6YmJpdWdsZ21rYnNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0MjA5ODYsImV4cCI6MjA4Mjk5Njk4Nn0.x7KraIEBvyYXyFcsPiVE9k2wCNfHIUWW9TgrhK6BBN8";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/* ================= DOM ================= */
const form = document.getElementById("formAdd");
const btnAdd = document.getElementById("btnAdd");
const list = document.querySelector("#gdvList .list");

const inputName = document.getElementById("name");
const inputAvatar = document.getElementById("avatar");
const inputFacebook = document.getElementById("facebook");
const inputFbPhu = document.getElementById("fb_phu");
const inputZalo = document.getElementById("zalo");
const inputWebsite = document.getElementById("website");
const inputBank = document.getElementById("bank");
const inputDichVu = document.getElementById("dichvu");
const inputTien = document.getElementById("baohiem");
const inputNgay = document.getElementById("ngay");
const inputNote = document.getElementById("note");

let editId = null;

/* ================= ADD / UPDATE ================= */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    name: inputName.value.trim(),
    avatar: inputAvatar.value.trim(),
    facebook: inputFacebook.value.trim(),
    fb_phu: inputFbPhu.value.trim(),
    zalo: inputZalo.value.trim(),
    web: inputWebsite.value.trim(),
    bank: inputBank.value.trim()
      ? inputBank.value.trim().split("\n")
      : [],
    dichvu: inputDichVu.value.trim()
      ? inputDichVu.value.trim().split(",")
      : [],
    baohiem: Number(inputTien.value) || 0,
    ngaybaohiem: inputNgay.value || null,
    note: inputNote.value.trim(),
  };

  btnAdd.disabled = true;
  btnAdd.textContent = "⏳ Đang xử lý...";

  let error;

  if (editId) {
    ({ error } = await supabase
      .from("gdv_list")
      .update(payload)
      .eq("id", editId));
  } else {
    ({ error } = await supabase
      .from("gdv_list")
      .insert([{ ...payload }]));
  }

  if (error) {
    console.error(error);
    alert("❌ Lỗi: " + error.message);
  } else {
    alert(editId ? "✅ Cập nhật thành công!" : "✅ Thêm GDV thành công!");
    form.reset();
    editId = null;
    btnAdd.textContent = "➕ Thêm GDV";
    loadGDVs();
  }

  btnAdd.disabled = false;
});

/* ================= LOAD LIST ================= */
async function loadGDVs() {
  list.innerHTML = "";

  const { data, error } = await supabase
    .from("gdv_list")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    alert("❌ Lỗi tải danh sách: " + error.message);
    return;
  }

  data.forEach((d) => renderGDV(d));
}

/* ================= RENDER ================= */
function renderGDV(d) {
  const div = document.createElement("div");
  div.className = "gdv-item";
  div.innerHTML = `
    <strong>${d.name}</strong><br>
    <small>Ngày BH: ${d.ngaybaohiem || "---"}</small><br>
    Bảo hiểm: ${Number(d.baohiem).toLocaleString()} VNĐ<br>
    Facebook: <a href="${d.facebook}" target="_blank">Link</a>
    <div class="buttons">
      <button class="edit" data-id="${d.id}">✏️ Sửa</button>
      <button class="delete" data-id="${d.id}">🗑️ Xoá</button>
    </div>
  `;
  list.appendChild(div);
}

/* ================= EDIT / DELETE ================= */
list.addEventListener("click", async (e) => {
  const id = e.target.dataset.id;
  if (!id) return;

  if (e.target.classList.contains("delete")) {
    if (!confirm("❗ Xoá GDV này?")) return;

    const { error } = await supabase
      .from("gdv_list")
      .delete()
      .eq("id", id);

    if (error) {
      alert("❌ Lỗi xoá: " + error.message);
    } else {
      loadGDVs();
    }
  }

  if (e.target.classList.contains("edit")) {
    const { data, error } = await supabase
      .from("gdv_list")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      alert("❌ Lỗi: " + error.message);
      return;
    }

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

    editId = id;
    btnAdd.textContent = "💾 Lưu thay đổi";
  }
});

/* ================= LOGOUT ================= */
window.logout = function () {
  window.location.href = "login.html";
};

/* ================= INIT ================= */
loadGDVs();
