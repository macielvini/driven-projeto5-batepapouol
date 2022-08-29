const userObj = { name: "" };
let lastSelected = "";
let lastSelectedName = "";

//HTML VARIABLES
const messageInput = document.querySelector(".user-input #user-message");
const inputNameErrorMessage = document.querySelector(".error-message");
const spinner = document.querySelector(".spinner");
const modal = document.querySelector(".modal");
const modalForm = document.querySelector(".modal-form");
const userNameInput = document.querySelector(".modal input");

messageInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage();
  }
});

userNameInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    setUserName();
  }
});

function realoadPage() {
  window.location.reload(true);
}

function setUserName() {

  userObj.name = userNameInput.value;

  const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", userObj);

  modalForm.classList.add("hidden");
  spinner.classList.remove("hidden");

  promise.then(loadChat);
  promise.catch(modalRequestValidName);
}

function loadChat() {

  modal.classList.add("hidden");
  getMessages();
  getParticipants();

  setInterval(isUserOnline, 5000);
  setInterval(getMessages, 3000);
  setInterval(getParticipants, 1000 * 10);
}

function modalRequestValidName(answer) {
  console.log(answer.response)
  userNameInput.value = "";
  spinner.classList.add("hidden");
  modalForm.classList.remove("hidden");
  inputNameErrorMessage.innerText = "Nome inválido!";
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

  messages.filter(msg => msg.to === userObj.name || msg.to === "Todos" || msg.from === userObj.name).forEach(msg => {

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
  const messageObj = { from: userObj.name, to: lastSelectedName, text: messageInput.value, type: checkVisibility() };

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
  <li class="" onclick="selectParticipant(this)" data-identifier="participant">
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

  elementHTML.innerHTML = divParticipant("Todos") +
    (() => {

      if (lastSelected === "") {
        lastSelectedName = "Todos";
        return "";
      }

      return lastSelected.outerHTML;

    })();

  data.filter(e => e.name !== lastSelectedName).forEach(e => {
    elementHTML.innerHTML += divParticipant(e.name);
  });

}

function selectVisibility(element) {
  const selected = element.parentNode.querySelector(".selected");

  if (selected !== null) {
    selected.classList.remove("selected");
  }

  element.classList.add("selected");

  updateLabelTo();
}

function updateLabelTo() {
  const visibility = document.querySelector(".visibility .selected");
  const type = visibility.dataset.type;
  const labelTo = document.querySelector(".label-to");

  if (type === "private_message") {
    labelTo.innerText = `Enviando para ${lastSelectedName} (reservadamente)`
  } else if (lastSelectedName !== "Todos" && lastSelectedName !== "" && type == "message") {
    labelTo.innerText = `Enviando para ${lastSelectedName}`
  } else {
    labelTo.innerText = "";
  }
}

function checkVisibility() {
  const selected = document.querySelector(".visibility .selected");

  return selected.dataset.type;

}

function selectParticipant(element) {

  const selected = element.parentNode.querySelector(".selected");

  if (selected !== null) {
    selected.classList.remove("selected");
  }

  element.classList.add("selected");

  lastSelected = element;
  lastSelectedName = element.querySelector(".contact-name").innerText;

  updateLabelTo();

}

function showSidebar() {
  const sidebar = document.querySelector("aside");
  sidebar.classList.toggle("open");
}