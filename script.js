const userObj = { name: "" };
let test;
const userInput = document.querySelector(".user-input #user-message");

userInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    sendMessage();
  }
})

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

function loadChat() {
  const userNameInput = document.querySelector(".modal input").value;

  userObj.name = userNameInput;

  const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", userObj);

  promise.then(hideModal);
  promise.catch(modalRequestValidName);

  getMessages();

  setInterval(isUserOnline, 5000);
  setInterval(getMessages, 3000);
  setInterval(getParticipants, 1000 * 10);
}

function isUserOnline() {
  const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", userObj);
  promise.catch(realoadPage);
}

function getMessages() {
  const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
  promise.then(displayMessages);
}

function displayMessages(response) {
  const messages = response.data;
  const chat = document.querySelector(".chat");

  chat.innerHTML = "";

  for (let i = 0; i < messages.length; i++) {

    const from = messages[i].from;
    let to = "para" + messages[i].to + ":";
    const text = messages[i].text;
    const type = messages[i].type;
    const time = messages[i].time;

    let statusClass = "";

    if (type === "status") {
      to = "";
    }

    chat.innerHTML += `
    <li class="message ${type}">
      <span class="time">(${time})</span>
      <span class="from">${from}</span>
      <span class="to">${to}</span>
      <span class="text">${text}</span>
    </li>
  `
    const message = document.querySelector(".message:last-of-type");
    message.scrollIntoView();

  }
}

function sendMessage() {

  const messageObj = { from: userObj.name, to: "Todos", text: userInput.value, type: "message" };

  const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", messageObj);
  promise.catch(realoadPage);
  promise.then(() => {
    getMessages();
    userInput.value = "";
  });
}

function getParticipants() {
  const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");

  promise.then(displayParticipants)
}

function displayParticipants(response) {
  const participants = response.data;
  const elementHTML = document.querySelector(".contacts");

  for (let i = 0; i < participants.length; i++) {
    elementHTML.innerHTML += `
    <li>
      <ion-icon name="people"></ion-icon>
      <span class="contact-name">${participants[i].name}</span>
    </li>
    `
  }
}

function realoadPage() {
  window.location.reload(true);
}
