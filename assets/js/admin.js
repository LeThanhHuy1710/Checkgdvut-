// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDR34V4nSclq1kIMgbnSyMgTMeqUlzFOqo",
  authDomain: "checkgdvut-d2bcc.firebaseapp.com",
  projectId: "checkgdvut-d2bcc",
  storageBucket: "checkgdvut-d2bcc.firebasestorage.app",
  messagingSenderId: "242735289196",
  appId: "1:242735289196:web:cf729b41af26987cb05949",
  measurementId: "G-WLS5PJ4X2G"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const form = document.getElementById("gdv-form");
const submitBtn = document.getElementById("submit-btn");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const data = {
    name: getVal("name"),
    avatar: getVal("avatar"),
    fb_main: getVal("fb_main"),
    fb_sub: getVal("fb_sub"),
    zalo: getVal("zalo"),
    website: getVal("website"),
    services: getVal("services").split(',').map(s => s.trim()),
    insurance_amount: Number(getVal("insurance_amount")),
    insurance_date: getVal("insurance_date"),
    note: getVal("note"),
    bank_accounts: {}
  };

  const rawBanks = getVal("bank_accounts").split("\n");
  rawBanks.forEach(line => {
    const [bank, acc] = line.split(":").map(s => s.trim());
    if (bank && acc) data.bank_accounts[bank.toLowerCase()] = acc;
  });

  const editId = document.getElementById("edit-id").value;

  if (editId) {
    db.collection("gdv_list").doc(editId).update(data).then(() => {
      alert("✅ Đã cập nhật GDV");
      resetForm();
      loadGDVs();
    });
  } else {
    db.collection("gdv_list").add(data).then(() => {
      alert("✅ Đã thêm GDV mới");
      form.reset();
      loadGDVs();
    });
  }
});

function getVal(id) {
  return document.getElementById(id).value.trim();
}

function setVal(id, val) {
  document.getElementById(id).value = val || "";
}

function resetForm() {
  form.reset();
  document.getElementById("edit-id").value = "";
  submitBtn.innerText = "➕ Thêm GDV";
}

function loadGDVs() {
  const list = document.getElementById("gdv-list");
  list.innerHTML = "⏳ Đang tải...";
  db.collection("gdv_list").get().then(snapshot => {
    list.innerHTML = "";
    if (snapshot.empty) {
      list.innerHTML = "<p>Không có GDV nào.</p>";
      return;
    }

    snapshot.forEach(doc => {
      const d = doc.data();
      const div = document.createElement("div");
      div.style = "background:#fff;border:1px solid #ddd;padding:12px;margin-bottom:10px;border-radius:6px";
      div.innerHTML = `
        <strong>${d.name}</strong> (${(d.services || []).join(", ")})<br>
        Ngân hàng: ${Object.entries(d.bank_accounts || {}).map(([k,v]) => `${k}: ${v}`).join(", ")}<br>
        <button onclick="editGDV('${doc.id}')">✏️ Sửa</button>
        <button onclick="deleteGDV('${doc.id}')">❌ Xoá</button>
      `;
      list.appendChild(div);
    });
  });
}

function editGDV(id) {
  db.collection("gdv_list").doc(id).get().then(doc => {
    const d = doc.data();
    document.getElementById("edit-id").value = doc.id;
    setVal("name", d.name);
    setVal("avatar", d.avatar);
    setVal("fb_main", d.fb_main);
    setVal("fb_sub", d.fb_sub);
    setVal("zalo", d.zalo);
    setVal("website", d.website);
    setVal("services", (d.services || []).join(", "));
    setVal("insurance_amount", d.insurance_amount);
    setVal("insurance_date", d.insurance_date);
    setVal("note", d.note);

    const banks = Object.entries(d.bank_accounts || {}).map(([k,v]) => `${k}: ${v}`).join("\n");
    setVal("bank_accounts", banks);

    submitBtn.innerText = "💾 Cập nhật GDV";
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function deleteGDV(id) {
  if (confirm("Bạn có chắc chắn muốn xoá GDV này?")) {
    db.collection("gdv_list").doc(id).delete().then(() => {
      alert("🗑️ Đã xoá");
      loadGDVs();
    });
  }
}

// Khởi động
loadGDVs();
