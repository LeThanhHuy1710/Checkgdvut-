// assets/js/admin.js
import { supabase } from "./supabase.js"; // đường dẫn đúng với bạn

// DOM
const form = document.querySelector("#formAdd");
const btnAdd = document.querySelector("#btnAdd");
const list = document.querySelector("#gdvList .list");
const loginForm = document.querySelector("#loginForm");
const loginSection = document.querySelector("#loginSection");
const adminContent = document.querySelector("#adminContent");

// Inputs
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

let editId = null;

// ===================== ĐĂNG NHẬP ADMIN =====================
loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  try {
    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("username", username)
      .single();

    if (error || !data) return alert("❌ Tên đăng nhập không tồn tại!");

    const { email } = data;

    // Supabase auth sign in
    const { session, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    if (loginError) return alert("❌ Sai thông tin đăng nhập!");

    sessionStorage.setItem("admin", email);
    alert("✅ Đăng nhập thành công!");
    showAdminContent();
  } catch (err) {
    alert("❌ Lỗi đăng nhập: " + err.message);
  }
});

function showAdminContent() {
  loginSection.style.display = "none";
  adminContent.style.display = "block";
  loadGDVs();
}

// Nếu đã login
if (sessionStorage.getItem("admin")) showAdminContent();

// ===================== THÊM / SỬA GDV =====================
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = inputName.value.trim();
  if (!name) return alert("❌ Vui lòng nhập tên!");

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
    updated_at: new Date().toISOString()
  };

  if (!editId) data.created_at = new Date().toISOString();

  btnAdd.disabled = true;
  btnAdd.textContent = "⏳ Đang xử lý...";

  try {
    if (editId) {
      const { error } = await supabase
        .from("gdv_list")
        .update(data)
        .eq("id", editId);
      if (error) throw error;
      alert("✅ Cập nhật GDV thành công!");
      editId = null;
    } else {
      const { error } = await supabase
        .from("gdv_list")
        .insert([data]);
      if (error) throw error;
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

// ===================== LOAD DANH SÁCH =====================
async function loadGDVs() {
  list.innerHTML = "";
  const { data, error } = await supabase
    .from("gdv_list")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    list.innerHTML = "<p>Lỗi tải danh sách GDV!</p>";
    return;
  }

  data.forEach(doc => renderGDV(doc.id, doc));
}

// ===================== RENDER GDV =====================
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

// ===================== SỰ KIỆN XÓA / SỬA =====================
list.addEventListener("click", async (e) => {
  const id = e.target.dataset.id;
  if (!id) return;

  // Xoá
  if (e.target.classList.contains("delete")) {
    if (!confirm("❗Bạn có chắc muốn xoá GDV này?")) return;
    const { error } = await supabase
      .from("gdv_list")
      .delete()
      .eq("id", id);
    if (error) return alert("❌ Lỗi xóa: " + error.message);
    alert("🗑️ Đã xoá!");
    loadGDVs();
  }

  // Sửa
  if (e.target.classList.contains("edit")) {
    const { data, error } = await supabase
      .from("gdv_list")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return alert("❌ Lỗi tải GDV: " + error.message);

    const d = data;
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

// ===================== LOGOUT =====================
function logout() {
  sessionStorage.removeItem("admin");
  window.location.href = "login.html";
}
