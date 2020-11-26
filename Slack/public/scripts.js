const username = prompt("What is your name?");

// const socket = io("http://localhost:9000");
const socket = io("http://localhost:9000", {
  query: {
    username
  }
});
let nsSocket = "";

socket.on("nsList", (nsData) => {
  let namespacesDiv = document.querySelector(".namespaces");
  namespacesDiv.innerHTML = "";
  nsData.forEach((ns) => {
    const imgDiv = document.createElement("div");
    imgDiv.classList.add("namespace");
    imgDiv.dataset.ns = ns.endpoint;

    const img = document.createElement("img");
    img.src = ns.img;
    img.alt = ns.endpoint;

    imgDiv.appendChild(img);

    namespacesDiv.appendChild(imgDiv);
  });

  document.querySelectorAll(".namespace").forEach((elem) => {
    elem.addEventListener("click", (e) => {
      const nsEndpoint = elem.dataset.ns;
      console.log(`I should go to now: ${nsEndpoint}`);
      joinNs(nsEndpoint);
    });
  });

  joinNs("/wiki");
});
