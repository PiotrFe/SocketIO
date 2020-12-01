const { io } = require("../servers");
const {
  checkForOrbCollisions,
  checkForPlayerCollisions,
} = require("./checkCollisions");

// =========== CLASSES ==============
const Player = require("./classes/Player");
const PlayerData = require("./classes/PlayerData");
const PlayerConfig = require("./classes/PlayerConfig");
const Orb = require("./classes/Orb");
let orbs = [];
let players = [];
let settings = {
  defaultOrbs: 5000,
  defaultSpeed: 6,
  defaultSize: 6,
  defaultZoom: 1.5,
  worldWidth: 5000,
  worldHeight: 5000,
};

initGame();

// issue a message to every connected socket 30 fps
setInterval(() => {
  if (players.length > 0) {
    io.to("game").emit("tock", {
      players,
    });
  }
}, 33); // there are 30 33s in 1000 milliseconds

io.sockets.on("connect", (socket) => {
  let player = {};
  socket.on("init", (data) => {
    socket.join("game");
    let playerConfig = new PlayerConfig(settings);
    let playerData = new PlayerData(data.playerName, settings);
    player = new Player(socket.id, playerConfig, playerData);
    socket.emit("initReturn", {
      orbs,
    });
    players.push(playerData);

    // issue a message to this connected client with loc 30/sec
    setInterval(() => {
      io.emit("ticktock", {
        playerX: player.playerData.locX,
        playerY: player.playerData.locY,
      });
    }, 33); // there are 30 33s in 1000 milliseconds
  });

  socket.on("tick", (data) => {
    speed = player.playerConfig.speed;
    // update the player config option with new direction in data
    // and create the local variable for this callback for readability
    xV = player.playerConfig.xVector = data.xVector;
    yV = player.playerConfig.yVector = data.yVector;

    if (
      (player.playerData.locX < 5 && player.playerData.xVector < 0) ||
      (player.playerData.locX > settings.worldWidth && xV > 0)
    ) {
      player.playerData.locY -= speed * yV;
    } else if (
      (player.playerData.locY < 5 && yV > 0) ||
      (player.playerData.locY > settings.worldHeight && yV < 0)
    ) {
      player.playerData.locX += speed * xV;
    } else {
      player.playerData.locX += speed * xV;
      player.playerData.locY -= speed * yV;
    }
    let capturedOrb = checkForOrbCollisions(
      player.playerData,
      player.playerConfig,
      orbs,
      settings
    );

    capturedOrb
      .then(() => {
        const orbData = {
          ordIndex: data,
          newOrb: orbs[data],
        };
        io.sockets.emit("updateLeaderBoard", getLeaderBoard());
        io.sockets.emit("orbSwitch", orbData);
      })
      .catch(() => {});

    let playerDeath = checkForPlayerCollisions(
      player.playerData,
      player.playerConfig,
      players,
      player.socketId
    )
      .then((data) => {
        io.sockets.emit("updateLeaderBoard", getLeaderBoard());
        io.sockets.emit("playerDeath", data);
      })
      .catch(() => {});
  });
  socket.on("disconnect", (data) => {
    if (player.playerData) {
      players.forEach((curPlayer, i) => {
        if (curPlayer.uid == player.playerData.uid) {
          players.splice(i, 1);
          io.sockets.emit("updateLeaderBoard", getLeaderBoard())
        }
      });
    }
  });
});

function getLeaderBoard() {
  players.sort((a, b) => {
    return b.score - a.score;
  });
  let leaderBoard = players.map((curPlayer) => {
    return {
      name: curPlayer.name,
      score: curPlayer.score,
    };
  });
  return leaderBoard;
}

// Run at the beginning of a new game
function initGame() {
  for (let i = 0; i < settings.defaultOrbs; i++) {
    orbs.push(new Orb(settings));
  }
}

module.exports = io;
