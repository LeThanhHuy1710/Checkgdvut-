const gdvContainer = document.getElementById("gdv-list");
const searchInput = document.getElementById("search-input");
const filterTags = document.getElementById("filter-tags");

let allGDV = [];
let selectedService = "";
let allServices = new Set();

// Tải danh sách GDV từ Firebase
function fetchGDVs() {
  db.collection("gdv_list").get().then(snapshot => {
    allGDV = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Thu thập tất cả dịch vụ để tạo bộ lọc
    allGDV.forEach(item => {
      if (Array.isArray(item.dichvu)) {
        item.dichvu.forEach(dv => allServices.add(dv));
      }
    });

    renderServiceTags();
    renderGDVList(allGDV);
  });
}

// Hiển thị các thẻ lọc dịch vụ
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

// Hiển thị danh sách GDV
function renderGDVList(data) {
  const keyword = searchInput.value.toLowerCase();
  const filtered = data.filter(item => {
    const matchName = item.ten?.toLowerCase().includes(keyword);
    const matchService = selectedService === "" || (item.dichvu || []).includes(selectedService);
    return matchName && matchService;
  });

  gdvContainer.innerHTML = "";
  if (filtered.length === 0) {
    gdvContainer.innerHTML = "<p>Không tìm thấy GDV nào phù hợp.</p>";
    return;
  }

  filtered.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "gdv-card";
    card.onclick = () => {
      window.location.href = `gdv-detail.html?id=${item.id}`;
    };

    card.innerHTML = `
      <div class="gdv-avatar">
        <img src="${item.avatar || '../assets/img/default-avatar.png'}" alt="${item.ten}" />
      </div>
      <div class="gdv-info">
        <p class="gdv-stt">#${index + 1}</p>
        <p class="gdv-name">${item.ten}</p>
      </div>
    `;
    gdvContainer.appendChild(card);
  });
}

// Bắt sự kiện tìm kiếm
searchInput.addEventListener("input", () => {
  renderGDVList(allGDV);
});

// Gọi hàm khởi động
fetchGDVs();
