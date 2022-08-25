const userObj = { name: "" };
let test;

function hideModal() {
  const modal = document.querySelector(".modal");
  modal.classList.add("hidden");
}

function modalRequestValidName(promise) {
  const status = promise.response.status;
  const element = document.querySelector(".error-message");

  switch (status) {
    case 400:
      element.innerText = "Nome em uso ou em branco!";
      break;

    default:
      element.innerText = "Nome inválido!"
      break;
  }

}

function showSidebar() {
  const sidebar = document.querySelector("aside");
  sidebar.classList.toggle("open");
}

function getUserName() {
  const userNameInput = document.querySelector(".modal input").value;
  userObj.name = userNameInput;

  const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", userObj);

  promise.then(hideModal);
  promise.catch(modalRequestValidName);


  // setInterval(isUserOnline, 5000);
}

function isUserOnline() {
  const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", userObj);
  promise.then(() => console.log("online"));
}