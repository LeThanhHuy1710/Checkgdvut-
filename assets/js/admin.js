import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// --- Supabase config ---
const SUPABASE_URL = "https://xeidegtzbbiuglgmkbsm.supabase.co";
const SUPABASE_KEY = "sb_publishable_XqJzHKum27HwEEzDhxKAqQ_qdoItx4K";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- DOM ---
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

let editId = null; // ID đang sửa

// --- Thêm hoặc cập nhật GDV ---
form.addEventListener("submit", async (e) => {
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
    note: inputNote.value.trim(),
    created_at: new Date().toISOString(),
  };

  btnAdd.disabled = true;
  btnAdd.textContent = "⏳ Đang xử lý...";

  try {
    if (editId) {
      await supabase.from("gdv_list").update(data).eq("id", editId);
      alert("✅ Cập nhật thành công!");
      editId = null;
    } else {
      await supabase.from("gdv_list").insert([data]);
      alert("✅ Thêm mới thành công!");
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

// --- Load danh sách GDV ---
async function loadGDVs() {
  list.innerHTML = "";
  const { data, error } = await supabase
    .from("gdv_list")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return alert("❌ Lỗi tải danh sách GDV: " + error.message);

  data.forEach(d => renderGDV(d.id, d));
}

// --- Render từng GDV ---
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

// --- Xử lý click Edit / Delete ---
list.addEventListener("click", async (e) => {
  const id = e.target.dataset.id;
  if (!id) return;

  // Xoá GDV
  if (e.target.classList.contains("delete")) {
    if (confirm("❗Bạn có chắc muốn xoá GDV này?")) {
      await supabase.from("gdv_list").delete().eq("id", id);
      loadGDVs();
    }
  }

  // Sửa GDV
  if (e.target.classList.contains("edit")) {
    const { data, error } = await supabase.from("gdv_list").select("*").eq("id", id).single();
    if (error) return alert("❌ Lỗi: " + error.message);

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

// --- Logout ---
window.logout = function() {
  // xóa session nếu có login admin
  window.location.href = "login.html";
};

// --- Load danh sách GDV lần đầu ---
loadGDVs();
