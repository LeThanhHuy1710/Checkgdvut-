import { supabase } from "./supabase.js";

/* ================= DOM ================= */
const gdvContainer = document.getElementById("gdv-list");
const searchInput = document.getElementById("search-input");
const filterTags = document.getElementById("filter-tags");

if (!gdvContainer) {
  console.error("❌ Không tìm thấy #gdv-list");
}

let allGDV = [];
let selectedService = "";
let allServices = new Set();

/* ================= FETCH ================= */
async function fetchGDVs() {
  const { data, error } = await supabase
    .from("gdv_list")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    if (gdvContainer) gdvContainer.innerHTML = "<p>Lỗi tải dữ liệu!</p>";
    return;
  }

  allGDV = data || [];

  /* lấy dịch vụ */
  allServices.clear();
  allGDV.forEach(item => {
    if (Array.isArray(item.dichvu)) {
      item.dichvu.forEach(dv => {
        if (dv) allServices.add(dv.trim());
      });
    }
  });

  renderServiceTags();
  renderGDVList(allGDV);
}

/* ================= TAG FILTER ================= */
function renderServiceTags() {
  if (!filterTags) return;
  filterTags.innerHTML = "";

  const createTag = (label, active, onClick) => {
    const span = document.createElement("span");
    span.className = "tag" + (active ? " active" : "");
    span.textContent = label;
    span.onclick = onClick;
    return span;
  };

  filterTags.appendChild(
    createTag("Tất cả", selectedService === "", () => {
      selectedService = "";
      renderServiceTags();
      renderGDVList(allGDV);
    })
  );

  [...allServices].sort().forEach(service => {
    filterTags.appendChild(
      createTag(service, selectedService === service, () => {
        selectedService = service;
        renderServiceTags();
        renderGDVList(allGDV);
      })
    );
  });
}

/* ================= RENDER LIST ================= */
function renderGDVList(data) {
  if (!gdvContainer) return;

  const keyword = (searchInput?.value || "").toLowerCase();

  const filtered = data.filter(item => {
    const name = (item.name || "").toLowerCase();
    const matchName = name.includes(keyword);
    const matchService =
      selectedService === "" ||
      (Array.isArray(item.dichvu) && item.dichvu.includes(selectedService));

    return matchName && matchService;
  });

  gdvContainer.innerHTML = "";

  if (filtered.length === 0) {
    gdvContainer.innerHTML = "<p>Không tìm thấy GDV phù hợp.</p>";
    return;
  }

  filtered.forEach(item => {
    const avatar = item.avatar || "../assets/img/default-avatar.png";
    const name = item.name || "Không tên";

    const div = document.createElement("div");
    div.className = "gdv-item";
    div.innerHTML = `
      <img src="${avatar}" class="gdv-avatar" alt="${name}">
      <p class="gdv-name">${name}</p>
    `;

    div.querySelector(".gdv-avatar").onclick = () => {
      if (!item.id) {
        alert("❌ Không tìm thấy ID GDV");
        return;
      }
      window.location.href = `gdv-detail.html?id=${item.id}`;
    };

    gdvContainer.appendChild(div);
  });
}

/* ================= SEARCH ================= */
if (searchInput) {
  searchInput.addEventListener("input", () => {
    renderGDVList(allGDV);
  });
}

/* ================= INIT ================= */
fetchGDVs();
