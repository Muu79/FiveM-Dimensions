window.addEventListener("message", (event) => {
  const data = event.data;
  if (!data || !data.type) {
    return;
  }
  switch (data.type) {
    case "dimesion-update":
        document.getElementById('dimension-text').textContent = "Dimension: " + data.n
      break;
    default:
      break;
  }
});
