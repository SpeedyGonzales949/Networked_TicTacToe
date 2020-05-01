const socket = io();
const button = document.getElementById("OpenMulti");
const status = document.getElementById("Multilogs");
const X_CLASS = "x";
const CIRCLE_CLASS = "circle";
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
let PlayersData;
const cellElements = document.querySelectorAll("[data-cell]");
const board = document.getElementById("board");
const winningMessageElement = document.getElementById("winningMessage");
const restartButton = document.getElementById("restartButton");
const winningMessageTextElement = document.querySelector(
  "[data-winning-message-text]"
);
let circleTurn;
button.addEventListener("click", () => {
  socket.emit("GameRequest", socket.id);
  status.innerText = "Waiting for opponent";
});
socket.on("game-starts", (data) => {
  PlayersData = data;

  if (data.turn == "" + socket.id + "") {
    status.innerText = "Your Turn";
    setBoardHoverClass(false);
    circleTurn = false;
  } else {
    status.innerText = "Opponent's Turn";
    setBoardHoverClass(true);
    ImpossibleMove(true);
    circleTurn = true;
  }
  startGame();
});
socket.on("Game-Broke", (info) => {
  status.innerText = info + "(Waiting for another Player)";
});
socket.on("Draw-Move", (data) => {
  cellElements.forEach((cell) => {
    if (cell.classList.contains("" + data.CellNumber + "")) {
      if (placeMark(cell, data.ClassList)) {
        if (checkWin("x")) {
          endGame(false, "X's");
        } else if (checkWin("circle")) {
          endGame(false, "O's");
        } else if (isDraw()) {
          endGame(true);
        } else {
          swapTurns();
        }
      }
    }
  });
});
socket.on("New-Move", (data) => {
  if (data.turn == "" + socket.id + "") {
    status.innerText = "Your Turn";
    ImpossibleMove(false);
  } else {
    status.innerText = "Opponent's Turn";
    ImpossibleMove(true);
  }
});

restartButton.addEventListener("click", () => {
  socket.emit("GameRequest", socket.id);
  status.innerText = "Waiting for opponent";
  startGame();
});

function startGame() {
  cellElements.forEach((cell) => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(CIRCLE_CLASS);
    cell.removeEventListener("click", handleClick);
    cell.addEventListener("click", handleClick, { once: true });
  });
  winningMessageElement.classList.remove("show");
}

function handleClick(e) {
  const cell = e.target;
  const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
  returnData(findCell(cell), currentClass);
  socket.emit("TurnDone", PlayersData);
}

function endGame(draw, winner) {
  if (draw) {
    winningMessageTextElement.innerText = "Draw!";
  } else {
    winningMessageTextElement.innerText = `${winner} Wins!`;
  }
  winningMessageElement.classList.add("show");
  socket.emit("delete-User-from-Room", PlayersData);
}

function isDraw() {
  return [...cellElements].every((cell) => {
    return (
      cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
    );
  });
}

function placeMark(cell, currentClass) {
  if (
    !(cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS))
  ) {
    cell.classList.add(currentClass);
    return true;
  }
  return false;
}

function swapTurns() {
  if (PlayersData.turn == PlayersData.Player1) {
    PlayersData.turn = PlayersData.Player2;
  } else {
    PlayersData.turn = PlayersData.Player1;
  }

  if (PlayersData.ClassList == "x") {
    PlayersData.ClassList = "circle";
  } else {
    PlayersData.ClassList = "x";
  }
  if (PlayersData.turn != "" + socket.id + "") {
    socket.emit("MoveDone", PlayersData);
  }
}

function setBoardHoverClass(CurrentTurn) {
  board.classList.remove(X_CLASS);
  board.classList.remove(CIRCLE_CLASS);
  if (CurrentTurn) {
    board.classList.add(CIRCLE_CLASS);
  } else {
    board.classList.add(X_CLASS);
  }
}

function checkWin(someclass) {
  return WINNING_COMBINATIONS.some((combination) => {
    return combination.every((index) => {
      return cellElements[index].classList.contains(someclass);
    });
  });
}

function ImpossibleMove(Turn) {
  if (Turn) {
    cellElements.forEach((cell) => {
      cell.style = "pointer-events:none;";
    });
  } else {
    cellElements.forEach((cell) => {
      cell.style = "pointer-events:all;";
    });
  }
}

function findCell(cell) {
  for (let i = 1; i <= 9; i++)
    if (cell.classList.contains("" + i + "")) return i;
}

function returnData(x, y) {
  PlayersData.ClassList = y;
  PlayersData.CellNumber = x;
}
