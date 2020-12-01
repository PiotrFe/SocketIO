const wHeight = window.innerHeight;
const wWidth = window.innerWidth;
const player = {};
let orbs = [];
let players = [];

let canvas = document.querySelector("#the-canvas");
let context = canvas.getContext("2d");
canvas.width = wWidth;
canvas.height = wHeight;

window.onload = () => {
  $("#loginModal").modal("show");
};

document.querySelector(".name-form").addEventListener("submit", (event) => {
  event.preventDefault();
  player.name = document.querySelector("#name-input").value;
  $("#loginModal").modal("hide");
  $("#spawnModal").modal("show");
  document.querySelector(".player-name").innerHTML = player.name;
});

document.querySelector(".start-game").addEventListener("click", (event) => {
  $(".modal").modal("hide");
  document.querySelectorAll(".hiddenOnStart").forEach((elem) => {
    elem.removeAttribute("hidden");
  });
  init();
});
