<script>
  db.collection("gdv_list").get().then(snapshot => {
    console.log("Kết nối Firebase thành công, có", snapshot.size, "GDV");
  }).catch((err) => {
    console.error("Lỗi kết nối Firebase:", err);
  });
</script>
