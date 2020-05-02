const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
let NumberOfUSers = 0;
let rooms = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];
app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index", {});
});
const port = process.env.PORT || 3000;
server.listen(port);
io.on("connection", (socket) => {
  NumberOfUSers += 1;
  console.log("Connected Users:" + NumberOfUSers);
  socket.on("disconnect", () => {
    const CurrentRoomLeft = deleteUser(socket.id);
    socket.to(CurrentRoomLeft).emit("Game-Broke", "Opponent left the game");
  });
  socket.on("GameRequest", (name) => {
    let place = getEmptySpace();
    if (checkIfUserIsAlreadyInRoom(socket.id, place.i)) {
      socket.join(rooms[place.i][0]);
      rooms[place.i][place.j] = socket.id;
      if (checkRoomIsFull(place.i)) {
        let CurrentGame = {
          Player1: rooms[place.i][1],
          Player2: rooms[place.i][2],
          turn: rooms[place.i][getRandomInt(2)],
          room: rooms[place.i][0],
          ClassList: "x",
          CellNumber: 0,
        };

        io.to(rooms[place.i][0]).emit("game-starts", CurrentGame);
      }
    }
  });
  socket.on("TurnDone", (data) => {
    io.to(data.room).emit("Draw-Move", data);
  });
  socket.on("MoveDone", (data) => {
    io.to(data.room).emit("New-Move", data);
  });
  socket.on("delete-User-from-Room", (data) => {
    socket.leave(data.room);
    EndGameUserDelete(data.room);
  });
});

function makeid(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
for (let i = 0; i <= 9; i++) {
  rooms[i][0] = makeid(5);
}
console.log(rooms);

function getEmptySpace() {
  for (let i = 0; i <= 9; i++)
    for (let j = 1; j <= 2; j++) if (rooms[i][j] === "") return { i: i, j: j };
  return null;
}

function deleteUser(id) {
  for (let i = 0; i <= 9; i++)
    for (let j = 1; j <= 2; j++)
      if (rooms[i][j] == "" + id + "") {
        rooms[i][j] = "";
        return rooms[i][0];
      }
}

function checkRoomIsFull(i) {
  for (let j = 0; j <= 2; j++) if (rooms[i][j] == "") return false;
  return true;
}
function getRandomInt(max) {
  const number = Math.floor(Math.random() * Math.floor(max) + 1);
  return number;
}
function EndGameUserDelete(CurrentRoom) {
  for (let i = 0; i <= 9; i++)
    if (rooms[i][0] == CurrentRoom) {
      rooms[i][1] = "";
      rooms[i][2] = "";
    }
}
function checkIfUserIsAlreadyInRoom(id, i) {
  console.log("checked");
  if (rooms[i][1] == id || rooms[i][2] == id) {
    return false;
  } else return true;
}
