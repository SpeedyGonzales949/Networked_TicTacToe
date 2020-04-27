const socket = io();
const button = document.getElementById("OpenMulti");
socket.on("new-user", (name) => {
  console.log(name);
});
socket.on("hey", (text) => {
  console.log(text);
});
