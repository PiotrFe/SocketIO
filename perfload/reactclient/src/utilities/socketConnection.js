import io from "socket.io-client";

let socket = io.connect("htpp://localhost:8181");
socket.emit("clientAuth", "32234ewefsdf");

export default ServiceWorkerContainer;
