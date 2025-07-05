// Firebase SDK dạng module
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDR34V4nSclq1kIMgbnSyMgTMeqUlzFOqo",
  authDomain: "checkgdvut-d2bcc.firebaseapp.com",
  projectId: "checkgdvut-d2bcc",
  storageBucket: "checkgdvut-d2bcc.appspot.com",
  messagingSenderId: "242735289196",
  appId: "1:242735289196:web:cf729b41af26987cb05949",
  measurementId: "G-WLS5PJ4X2G"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM Elements
const gdvContainer = document.getElementById("gdv-list");
const searchInput = document.getElementById("search-input");
const filterTags = document.getElementById("filter-tags");

let allGDV = [];
let selectedService = "";
let allServices = new Set();

// Lấy dữ liệu từ Firestore
async function fetchGDVs() {
  const snapshot = await getDocs(collection(db, "gdv_list"));
  allGDV = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  // Thu thập các dịch vụ duy nhất
  allGDV.forEach(item => {
    if (Array.isArray(item.dichvu)) {
      item.dichvu.forEach(dv => allServices.add(dv));
    }
  });

  renderServiceTags();
  renderGDVList(allGDV);
}

// Render các tag dịch vụ
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

// Render danh sách GDV
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

    const row = document.createElement("div");
    row.className = "gdv-row";
    row.onclick = () => {
      window.location.href = `gdv-detail.html?id=${item.id}`;
    };

    row.innerHTML = `
      <span>#${index + 1}</span>
      <span class="avatar-cell">
        <img src="${avatar}" alt="${name}" onerror="this.src='../assets/img/default-avatar.png'" />
      </span>
      <span>${name}</span>
    `;
    gdvContainer.appendChild(row);
  });
}

// Sự kiện tìm kiếm
searchInput.addEventListener("input", () => {
  renderGDVList(allGDV);
});

// Khởi chạy
fetchGDVs();
