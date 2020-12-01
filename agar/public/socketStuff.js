let socket = io.connect("http://localhost:8080");

// this function is called when the user clicks on the button
function init() {
  draw();
  socket.emit("init", {
    // call init when the client is ready for data
    playerName: player.name,
  });
}

socket.on("initReturn", (data) => {
  orbs = data.orbs;
  setInterval(() => {
    socket.emit("tick", {
      xVector: player.xVector,
      yVector: player.yVector,
    });
  }, 33);
});

socket.on("tock", (data) => {
  players = data.players;
 
});

socket.on("orbSwitch", (data) => {
  orbs.splice(data.orbIndex, 1, data.newOrb);
});

socket.on("tickTock", data => {
    player.locX = data.playerX; 
    player.locY = data.playerY;
});

socket.on("updateLeaderBoard", data => {
    let leaderBoard = document.querySelector(".leader-board").innerHTML = "";
    data.forEach(curPlayer => {
        leaderBoard += `<li class="leaderboard-player">${curPlayer.name} - ${curPlayer.score}</li>`
    });
})

socket.on("playerDeath", data => {
    // console.log()
    document.querySelector("#game-message").innerHTML = `${data.died.name} absorbed by ${data.killedBy.name}`;
})
