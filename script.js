function hideModal() {
  const modal = document.querySelector(".modal");
  modal.classList.add("hidden");
}

function modalRequestValidName() {
  const e = document.querySelector(".error-message");
  e.innerText = "Nome em uso ou inválido! Digite um novo nome:";
}

function showSidebar() {
  const sidebar = document.querySelector("aside");
  sidebar.classList.toggle("open");
}

function getUserName() {
  const userInput = document.querySelector(".modal input").value;
  const userName = { name: userInput };

  const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", userName);

  promise.then(hideModal);
  promise.catch(modalRequestValidName)
}