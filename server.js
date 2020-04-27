const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index", {});
});
var port = process.env.PORT || 3000;
server.listen(port);

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.join("hey00");
  io.in("hey00").emit("hey", "hello");
  socket.on("disconnect", () => {
    console.log("disconneted");
  });
});
