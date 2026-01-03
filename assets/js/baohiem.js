// assets/js/baohiem.js
import { supabase } from "./supabase.js"; // path tới supabase.js

const gdvContainer = document.getElementById("gdv-list");
const searchInput = document.getElementById("search-input");
const filterTags = document.getElementById("filter-tags");

let allGDV = [];
let selectedService = "";
let allServices = new Set();

// ===================== FETCH DỮ LIỆU =====================
async function fetchGDVs() {
  const { data, error } = await supabase
    .from("gdv_list")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    gdvContainer.innerHTML = "<p>Lỗi tải dữ liệu!</p>";
    return;
  }

  allGDV = data.map(doc => ({ id: doc.id, ...doc }));

  // Lấy danh sách dịch vụ duy nhất
  allServices.clear();
  allGDV.forEach(item => {
    if (Array.isArray(item.dichvu)) {
      item.dichvu.forEach(dv => allServices.add(dv));
    }
  });

  renderServiceTags();
  renderGDVList(allGDV);
}

// ===================== RENDER FILTER TAG =====================
function renderServiceTags() {
  filterTags.innerHTML = "";

  const allTag = document.createElement("span");
  allTag.className = "tag" + (selectedService === "" ? " active" : "");
  allTag.innerText = "Tất cả";
  allTag.onclick = () => {
    selectedService = "";
    renderServiceTags();
    renderGDVList(allGDV);
  };
  filterTags.appendChild(allTag);

  [...allServices].sort().forEach(service => {
    const tag = document.createElement("span");
    tag.className = "tag" + (selectedService === service ? " active" : "");
    tag.innerText = service;
    tag.onclick = () => {
      selectedService = service;
      renderServiceTags();
      renderGDVList(allGDV);
    };
    filterTags.appendChild(tag);
  });
}

// ===================== RENDER DANH SÁCH GDV =====================
function renderGDVList(data) {
  const keyword = searchInput.value.toLowerCase();
  const filtered = data.filter(item => {
    const name = (item.ten || item.name || "").toLowerCase();
    const matchName = name.includes(keyword);
    const matchService = selectedService === "" || (item.dichvu || []).includes(selectedService);
    return matchName && matchService;
  });

  gdvContainer.innerHTML = "";

  if (filtered.length === 0) {
    gdvContainer.innerHTML = "<p>Không tìm thấy GDV nào phù hợp.</p>";
    return;
  }

  filtered.forEach((item, index) => {
    const avatar = item.avatar || "../assets/img/default-avatar.png";
    const name = item.ten || item.name || "Không tên";

    cons
