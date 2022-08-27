const userObj = { name: "" };
let test;
const userInput = document.querySelector(".user-input #user-message");

userInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    sendMessage();
  }
})

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

function displayMessages(response) {
  const messages = response.data;
  const chat = document.querySelector(".chat");

  chat.innerHTML = "";

  for (let i = 0; i < messages.length; i++) {

    const from = messages[i].from;
    const text = messages[i].text;
    const time = messages[i].time;

    let to = messages[i].to + ":";
    let type = messages[i].type;
    let privateOrPublic = "";

    switch (type) {
      case "status":
        to = "";
        privateOrPublic = "";
        break;

      case "private_message":
        privateOrPublic = "reservadamente para ";
        break;

      default:
        privateOrPublic = "para ";
        break;
    }

    chat.innerHTML += `
    <li class="message ${type.replace(/_/g, "-")}">
     
        <span class="time">(${time})</span>
        <span class="from">${from}</span>
        <span class="type">${privateOrPublic}</span>
        <span class="to">${to}</span>
        <span class="text">${text}</span>
      
    </li>
  `
    const message = document.querySelector(".message:last-of-type");
    message.scrollIntoView();

  }
}

function sendMessage() {

  // const to = document.querySelector(".selected span").innerText;
  const messageObj = { from: userObj.name, to: "Todos", text: userInput.value, type: checkVisibility() };

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

  elementHTML.innerHTML = `
  <li class="" onclick="toggleSelected(this)">
    <div>
      <ion-icon name="people"></ion-icon>
      <span class="contact-name">Todos</span>
     </div>
    <ion-icon name="checkmark-circle" class="check"></ion-icon>
  </li > 
`;

  for (let i = 0; i < participants.length; i++) {
    elementHTML.innerHTML += `
    <li onclick="toggleSelected(this)">
      <div>
        <ion-icon name="people"></ion-icon>
        <span class="contact-name">${participants[i].name}</span>
      </div>
      <ion-icon name="checkmark-circle" class="check"></ion-icon>
    </li>
    `
  }
}

function checkVisibility() {
  const selected = document.querySelector(".visibility .selected");

  return selected.dataset.type;

}

function realoadPage() {
  window.location.reload(true);
}

function toggleSelected(element) {

  const selected = element.parentNode.querySelector(".selected");

  if (selected !== null) {
    selected.classList.remove("selected");
  }

  element.classList.add("selected");

}

function showSidebar() {
  const sidebar = document.querySelector("aside");
  sidebar.classList.toggle("open");
}

