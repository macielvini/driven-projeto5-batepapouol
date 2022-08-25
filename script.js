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

getUserName();

function getUserName() {
  // const userNameInput = document.querySelector(".modal input").value;
  const userNameInput = "vini1";
  userObj.name = userNameInput;

  const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", userObj);

  promise.then(hideModal);
  promise.catch(modalRequestValidName);

  getMessages();

  // setInterval(isUserOnline, 5000);
}

function isUserOnline() {
  const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", userObj);
  promise.then(() => console.log("online"));
}

function getMessages() {
  const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
  promise.then(displayMessages);
}

function displayMessages(response) {
  const messages = response.data;
  const chat = document.querySelector(".chat");

  for (let i = 0; i < messages.length; i++) {

    const from = messages[i].from;
    let to = messages[i].to + ":";
    const text = messages[i].text;
    const type = messages[i].type;
    const time = messages[i].time;

    if (type === "status") to = "";

    chat.innerHTML += `
    <li class="message">
      <span class="time">(${time})</span>
      <span class="from">${from}</span>
      <span class="to">${to}</span>
      <span class="text">${text}</span>
    </li>
  `

  }
}