function hideModal(element) {
  element.parentNode.classList.add("hidden");
}

function showSidebar() {
  const sidebar = document.querySelector("aside");
  sidebar.classList.toggle("open");
}