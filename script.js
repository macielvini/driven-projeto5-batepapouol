const userObj = { name: "" };
const messageInput = document.querySelector(".user-input #user-message");
let userNameInput = document.querySelector(".modal input");
let participants = [];
let lastSelected = "";

messageInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage();
  }
});

userNameInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    loadChat();
  }
})

function realoadPage() {
  window.location.reload(true);
}

function loadChat() {
  userNameInput = userNameInput.value;

  userObj.name = userNameInput;

  const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", userObj);

  promise.then(hideModal);
  promise.catch(modalRequestValidName);

  getMessages();
  getParticipants();

  setInterval(isUserOnline, 5000);
  setInterval(getMessages, 3000);
  setInterval(getParticipants, 1000 * 10);
}

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

function isUserOnline() {
  const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", userObj);
  promise.catch(realoadPage);
}

function getMessages() {
  const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
  promise.then(displayMessages);
}

function divMessage(message) {
  return `
  <li class="message ${message.type.replace(/_/g, "-")}">
      <span class="time">(${message.time})</span>
      <span class="from">${message.from}</span>
      <span class="type">${message.privateOrPublic}</span>
      <span class="to">${message.to}</span>
      <span class="text">${message.text}</span>
  </li>
`;
}

function displayMessages(response) {
  const messages = response.data;
  const chat = document.querySelector(".chat");

  chat.innerHTML = "";

  messages.forEach(msg => {

    const newMessage = {
      from: msg.from,
      text: msg.text,
      time: msg.time,
      type: msg.type,
      to: msg.to + ":",
      privateOrPublic: ""
    }

    switch (msg.type) {
      case "status":
        newMessage.to = "";
        newMessage.privateOrPublic = "";
        break;

      case "private_message":
        newMessage.privateOrPublic = "reservadamente para ";
        break;

      default:
        newMessage.privateOrPublic = "para ";
        break;
    }

    chat.innerHTML += divMessage(newMessage);

    const lastMessage = document.querySelector(".message:last-of-type");
    lastMessage.scrollIntoView();

  });
}

function sendMessage() {

  // const to = document.querySelector(".selected span").innerText;
  const messageObj = { from: userObj.name, to: "Todos", text: messageInput.value, type: checkVisibility() };

  const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", messageObj);
  promise.catch(realoadPage);
  promise.then(() => {
    getMessages();
    messageInput.value = "";
  });
}

function getParticipants() {
  const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");

  promise.then(displayParticipants)
}

function divParticipant(e) {
  return `
  <li class="" onclick="toggleSelected(this)">
    <div>
      <ion-icon name="people"></ion-icon>
      <span class="contact-name">${e}</span>
    </div>
    <ion-icon name="checkmark-circle" class="check"></ion-icon>
  </li >
`;
}

function displayParticipants(response) {
  const elementHTML = document.querySelector(".contacts");
  const data = response.data;

  elementHTML.innerHTML = `${divParticipant("Todos")}
  ${(() => {
      if (lastSelected === "") return "";
      return lastSelected.outerHTML;
    })()}`;

  data.filter(e => e.name !== lastSelected.innerText).forEach(e => {
    elementHTML.innerHTML += divParticipant(e.name);
  });

}

function checkVisibility() {
  const selected = document.querySelector(".visibility .selected");

  return selected.dataset.type;

}

function toggleSelected(element) {

  const selected = element.parentNode.querySelector(".selected");

  if (selected !== null) {
    selected.classList.remove("selected");
  }

  element.classList.add("selected");

  lastSelected = element;

}

function showSidebar() {
  const sidebar = document.querySelector("aside");
  sidebar.classList.toggle("open");
}

function isSomeoneSelected() {
  const selected = document.querySelector(".contacts .selected");
  if (selected !== null) {
    return true;
  }

  return false;
}

function hideNonIntentionedMessages(message) {
  if (message.to !== "Todos" || message.to !== userObj.name) {
    return true;
  }
}