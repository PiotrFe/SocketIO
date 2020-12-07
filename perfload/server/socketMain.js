const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1/perfData", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const Machine = require("./models/Machine");

function socketMain(io, socket) {
  let macA;
  socket.on("clientAuth", (key) => {
    if (key === "wrwerwrwerwer343qewerwrw") {
      socket.join("clients");
    } else if ((key === "32234ewefsdf")) {
      socket.join("ui");
    } else {
      socket.disconnect(true);
    }
  });

  socket.on("initPerfData", async (data) => {
    macA = data.macA;
     const mongooseResponse = await checkAndAdd(data);
  });

  socket.on("perfData", (data) => {
    console.log(data);
    io.to("ui").emit("data", data);
  });
}

function checkAndAdd(data) {
  return new Promise((resolve, reject) => {
    Machine.findOne({ macA: data.macA }, () => (err, doc) => {
      if (err) {
        throw err;
        reject(err);
      } else if (doc === null) {
        let newMachine = new Machine(data);
        newMachine.save();
        resolve("added");
      } else {
        resolve("found");
      }
    });
  });
}

module.exports = socketMain;
