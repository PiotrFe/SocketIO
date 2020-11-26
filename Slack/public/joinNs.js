function joinNs(endpoint) {
  if (nsSocket) {
    nsSocket.close();
    document
      .querySelector("#user-input")
      .removeEventListener("submit", formSubmission);
  }

  nsSocket = io(`http://localhost:9000${endpoint}`);
  nsSocket.on("nsRoomLoad", (nsRooms) => {
    let roomList = document.querySelector(".room-list");
    roomList.innerHTML = "";
    nsRooms.forEach((room) => {
      let glyph;
      if (room.privateRoom) {
        glyph = "lock";
      } else {
        glyph = "globe";
      }
      let liElem = document.createElement("li");
      liElem.classList.add("room");

      let spanElem = document.createElement("span");
      let textElem = document.createTextNode(room.roomTitle);
      spanElem.classList.add("glyphicon");
      spanElem.classList.add(`glyphicon-${glyph}`);

      liElem.appendChild(spanElem);
      liElem.appendChild(textElem);

      roomList.appendChild(liElem);
    });

    let roomNodes = document.querySelectorAll(".room");
    roomNodes.forEach((el) => {
      el.addEventListener("click", (e) => {
        joinRoom(e.target.innerText);
      });
    });

    const topRoom = document.querySelector(".room");
    const topRoomName = topRoom.innerText;
    joinRoom(topRoomName);
  });

  nsSocket.on("messageToClients", (msg) => {
    console.log(msg);
    const newMsg = buildHtml(msg);
    document.querySelector("#messages").innerHTML += newMsg;
  });

  document
    .querySelector(".message-form")
    .addEventListener("submit", formSubmission);
}

function formSubmission(event) {
  event.preventDefault();
  const newMessage = document.querySelector("#user-message").value;
  nsSocket.emit("newMessageToServer", { text: newMessage });
}

function buildHtml(msg) {
  const convertedDate = new Date(msg.time).toLocaleString();
  const newHTML = `
  <li>
  <div class="user-image">
      <img src="${msg.avatar}" />
  </div>
  <div class="user-message">
      <div class="user-name-time">${msg.username} <span>${convertedDate}</span></div>
      <div class="message-text">${msg.text}</div>
  </div>
</li>
  `;

  return newHTML;
}
