const markX = document.getElementById("mark--x");
const menuMarkX = document.getElementById("menu-mark-x");
const markO = document.getElementById("mark--o");
const menuMarkO = document.getElementById("menu-mark-o");
const newGameCPU = document.getElementById("new-game-cpu");
const newGamePlayer = document.getElementById("new-game-player");
const newGameMenu = document.getElementById("new-game-menu");
const game = document.getElementById("game");
const restartMenu = document.getElementById("restart-menu");
const restartGameBtn = document.getElementById("restart-game-btn");
const restartGameConfirmBtn = document.getElementById(
  "restart-game-confirm-btn",
);
const restartGameCancelBtn = document.getElementById("restart-game-cancel-btn");
const oPlayerSpan = document.getElementById("o-player");
const xPlayerSpan = document.getElementById("x-player");
const gameBoard = document.getElementById("game-board");
const gameHeader = document.getElementById("game-header");
const gameCells = document.querySelectorAll(".game__cell");
const endRoundMenu = document.getElementById("end-round-menu");
const xWinsElement = document.getElementById("x-wins");
const oWinsElement = document.getElementById("o-wins");
const tiesElement = document.getElementById("ties");
const oWonTitle = document.getElementById("o-won-title");
const xWonTitle = document.getElementById("x-won-title");
const tieTitle = document.getElementById("tie-title");
const nextRoundBtn = document.getElementById("next-round-btn");
const quitBtn = document.getElementById("quit-btn");
const xTurnImg = document.getElementById("x-turn-img");
const oTurnImg = document.getElementById("o-turn-img");
const endRoundMessage = document.getElementById("end-round-message");
const overlay = document.getElementById("overlay");

let gameMode = "";
let player1Mark = "o";
let currentTurn = "x";
let xArray = [];
let oArray = [];
let xWins = 0;
let oWins = 0;
let ties = 0;
let roundIsOver = false;
let firstTurn = "o";
let winningSign = "";
let computerMovePending = false;

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [0, 4, 8],
];
const positionNames = [
  "Top left cell",
  "Top middle cell",
  "Top right cell",
  "Middle left cell",
  "Center cell",
  "Middle right cell",
  "Bottom left cell",
  "Bottom middle cell",
  "Bottom right cell",
];

[markX, markO].forEach((input) => {
  input.addEventListener("change", () => {
    if (markO.checked) {
      menuMarkO.classList.add("menu__mark--selected");
      menuMarkX.classList.remove("menu__mark--selected");
      player1Mark = "o";
    }
    if (markX.checked) {
      menuMarkX.classList.add("menu__mark--selected");
      menuMarkO.classList.remove("menu__mark--selected");
      player1Mark = "x";
    }
  });
});
[newGameCPU, newGamePlayer].forEach((btn) => {
  btn.addEventListener("click", () => {
    newGameMenu.classList.add("hidden");
    game.classList.remove("hidden");
    currentTurn = "x";
    player1Mark = markX.checked ? "x" : "o";
    if (btn === newGameCPU) {
      gameMode = "cpu";
      if (markX.checked) {
        xPlayerSpan.innerText = "(YOU)";
        oPlayerSpan.innerText = "(cpu)";
      } else {
        oPlayerSpan.innerText = "(YOU)";
        xPlayerSpan.innerText = "(cpu)";
      }
    } else {
      gameMode = "player";
      if (markX.checked) {
        xPlayerSpan.innerText = "(p1)";
        oPlayerSpan.innerText = "(p2)";
      } else {
        oPlayerSpan.innerText = "(p1)";
        xPlayerSpan.innerText = "(p2)";
      }
    }

    startNewGame();
  });
});
restartGameBtn.addEventListener("click", () => {
  restartMenu.classList.remove("hidden");
  showOverlay();
});
restartGameConfirmBtn.addEventListener("click", () => {
  quitGame();
});
restartGameCancelBtn.addEventListener("click", () => {
  closeRestartMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !restartMenu.classList.contains("hidden")) {
    closeRestartMenu();
  }
});

function closeRestartMenu() {
  restartMenu.classList.add("hidden");
  showOverlay();
}

gameCells.forEach((cell, index) => {
  cell.addEventListener("click", () => {
    const computerSign = player1Mark === "x" ? "o" : "x";
    if (gameMode === "cpu" && currentTurn === computerSign) {
      return;
    }

    makeMove(index);
  });
});

function makeMove(index) {
  const cell = gameCells[index];
  if (!roundIsOver && !cell.classList.contains("game__cell--taken")) {
    cell.classList.add("game__cell--taken");

    if (currentTurn === "x") {
      cell.classList.add("game__cell--x");
      cell.setAttribute("aria-label", `${cell.getAttribute("aria-label")}, X`);
      xArray.push(index);
      currentTurn = "o";
    } else {
      cell.classList.add("game__cell--o");
      cell.setAttribute("aria-label", `${cell.getAttribute("aria-label")}, O`);
      oArray.push(index);
      currentTurn = "x";
    }
    checkWin();
    updateBoard();
    if (xArray.length + oArray.length === 9 && !roundIsOver) {
      ties++;
      tiesElement.textContent = ties;
      roundIsOver = true;
      tieTitle.classList.remove("hidden");
      endRoundMessage.classList.add("hidden");
      endRoundMenu.classList.remove("hidden");
      showOverlay();
    }
    saveGame();
  }
}

function computerMove() {
  if (computerMovePending || roundIsOver) return;
  let availableCells = [];
  for (let index = 0; index < gameCells.length; index++) {
    if (!gameCells[index].classList.contains("game__cell--taken")) {
      availableCells.push(index);
    }
  }
  if (availableCells.length === 0) return;
  const computerCell = moveSelection(availableCells);
  computerMovePending = true;
  setTimeout(() => {
    computerMovePending = false;
    makeMove(computerCell);
  }, 500);
}

function moveSelection(availableCells) {
  const computerSign = player1Mark === "x" ? "o" : "x";
  const computerArray = computerSign === "x" ? xArray : oArray;
  const playerArray = player1Mark === "x" ? xArray : oArray;

  // Winning move
  for (let i = 0; i < winningCombinations.length; i++) {
    const computerPositions = winningCombinations[i].filter((item) =>
      computerArray.includes(item),
    );
    if (computerPositions.length === 2) {
      const thirdCellArr = winningCombinations[i].filter(
        (item) => !computerArray.includes(item),
      );
      const thirdCell = thirdCellArr[0];
      if (!gameCells[thirdCell].classList.contains("game__cell--taken"))
        return thirdCell;
    }
  }
  // Blocking move
  for (let i = 0; i < winningCombinations.length; i++) {
    const playerPositions = winningCombinations[i].filter((item) =>
      playerArray.includes(item),
    );
    if (playerPositions.length === 2) {
      const thirdCellArr = winningCombinations[i].filter(
        (item) => !playerArray.includes(item),
      );
      const thirdCell = thirdCellArr[0];
      if (!gameCells[thirdCell].classList.contains("game__cell--taken"))
        return thirdCell;
    }
  }
  //Creating a fork
  for (let i = 0; i < availableCells.length; i++) {
    const availableCell = availableCells[i];
    const tempArr = [...computerArray, availableCell];

    let forkCount = 0;
    for (let index = 0; index < winningCombinations.length; index++) {
      const computerPositions = winningCombinations[index].filter((item) =>
        tempArr.includes(item),
      );
      if (computerPositions.length === 2) {
        const thirdCellArr = winningCombinations[index].filter(
          (item) => !tempArr.includes(item),
        );
        const thirdCell = thirdCellArr[0];
        if (!gameCells[thirdCell].classList.contains("game__cell--taken"))
          forkCount++;
      }
    }

    if (forkCount >= 2) {
      return availableCell;
    }
  }
  //Fork prevention
  let possibleForkMoves = [];
  for (let i = 0; i < availableCells.length; i++) {
    const availableCell = availableCells[i];
    const tempArr = [...playerArray, availableCell];

    let forkCount = 0;
    for (let index = 0; index < winningCombinations.length; index++) {
      const playerPositions = winningCombinations[index].filter((item) =>
        tempArr.includes(item),
      );
      if (playerPositions.length === 2) {
        const thirdCellArr = winningCombinations[index].filter(
          (item) => !tempArr.includes(item),
        );
        const thirdCell = thirdCellArr[0];
        if (!gameCells[thirdCell].classList.contains("game__cell--taken"))
          forkCount++;
      }
    }
    if (forkCount >= 2) {
      possibleForkMoves.push(availableCell);
    }
  }
  if (possibleForkMoves.length === 1) {
    return possibleForkMoves[0];
  }
  // Fork prevention when the player has multiple possible fork moves
  else if (possibleForkMoves.length > 1) {
    for (let i = 0; i < availableCells.length; i++) {
      const availableCell = availableCells[i];
      const tempArr = [...computerArray, availableCell];

      // Check whether the computer's move creates an immediate winning threat
      for (let index = 0; index < winningCombinations.length; index++) {
        const computerPositions = winningCombinations[index].filter((item) =>
          tempArr.includes(item),
        );

        if (computerPositions.length === 2) {
          const thirdCellArr = winningCombinations[index].filter(
            (item) => !tempArr.includes(item),
          );
          const thirdCell = thirdCellArr[0];

          if (!playerArray.includes(thirdCell)) {
            let safeMove = true;

            // Check all possible player responses
            for (let i = 0; i < availableCells.length; i++) {
              const newAvailableCell = availableCells[i];

              // Skip the cell already occupied by the hypothetical computer move
              if (newAvailableCell === availableCell) continue;
              // The player must block the computer's winning threat
              if (newAvailableCell !== thirdCell) continue;

              // Simulate the player's response
              const tempArrPlayer = [...playerArray, newAvailableCell];
              let forkCount = 0;

              // Count the player's possible winning threats
              for (let index = 0; index < winningCombinations.length; index++) {
                const playerPositions = winningCombinations[index].filter(
                  (item) => tempArrPlayer.includes(item),
                );

                if (playerPositions.length === 2) {
                  const thirdCellArr = winningCombinations[index].filter(
                    (item) => !tempArrPlayer.includes(item),
                  );
                  const thirdCell = thirdCellArr[0];

                  if (
                    !tempArr.includes(thirdCell) &&
                    !tempArrPlayer.includes(thirdCell)
                  ) {
                    forkCount++;
                  }
                }
              }

              // Mark the computer move as unsafe if the player can still create a fork
              if (forkCount >= 2) {
                safeMove = false;
              }
            }

            // Return the computer move if it successfully prevents the fork
            if (safeMove) {
              return availableCell;
            }
          }
        }
      }
    }
  }
  //Take center if possible
  if (availableCells.includes(4)) {
    return 4;
  }
  // Take the opposite corner
  const oppositeCorners = [
    [0, 8],
    [2, 6],
  ];

  for (const [corner, oppositeCorner] of oppositeCorners) {
    if (
      playerArray.includes(corner) &&
      availableCells.includes(oppositeCorner)
    ) {
      return oppositeCorner;
    }

    if (
      playerArray.includes(oppositeCorner) &&
      availableCells.includes(corner)
    ) {
      return corner;
    }
  }
  // Take any corner
  const corners = [0, 2, 6, 8];
  const availableCorners = corners.filter((corner) =>
    availableCells.includes(corner),
  );

  if (availableCorners.length > 0) {
    return availableCorners[
      Math.floor(Math.random() * availableCorners.length)
    ];
  }
  // Take any side
  const sides = [1, 3, 5, 7];
  const availableSides = sides.filter((side) => availableCells.includes(side));

  if (availableSides.length > 0) {
    return availableSides[Math.floor(Math.random() * availableSides.length)];
  }
  // Fallback
  let randomCell =
    availableCells[Math.floor(Math.random() * availableCells.length)];
  return randomCell;
}

function updateBoard() {
  gameBoard.classList.toggle("game__board--x-turn", currentTurn === "x");
  gameBoard.classList.toggle("game__board--o-turn", currentTurn === "o");

  const computerSign = player1Mark === "x" ? "o" : "x";
  gameBoard.classList.toggle(
    "game__board--cpu-turn",
    gameMode === "cpu" && currentTurn === computerSign,
  );
  if (currentTurn === "x") {
    xTurnImg.classList.remove("hidden");
    oTurnImg.classList.add("hidden");
  } else {
    oTurnImg.classList.remove("hidden");
    xTurnImg.classList.add("hidden");
  }
  if (gameMode === "cpu") {
    if (computerSign === currentTurn) {
      computerMove();
    }
  }
}
function startNewRound() {
  xArray = [];
  oArray = [];
  firstTurn = firstTurn === "x" ? "o" : "x";
  currentTurn = firstTurn;
  winningSign = "";
  gameCells.forEach((cell) => cell.classList.remove("winner-o"));
  gameCells.forEach((cell) => cell.classList.remove("winner-x"));
  endRoundMessage.innerHTML = "";
  gameCells.forEach((cell, index) => {
    cell.classList.remove("game__cell--x");
    cell.classList.remove("game__cell--o");
    cell.classList.remove("game__cell--taken");
    cell.setAttribute("aria-label", `${positionNames[index]}, empty`);
  });
  updateBoard();
}
function startNewGame() {
  xWins = 0;
  oWins = 0;
  ties = 0;
  xWinsElement.textContent = xWins;
  oWinsElement.textContent = oWins;
  tiesElement.textContent = ties;

  firstTurn = "o";
  newRound();
}
function checkWin() {
  [xArray, oArray].forEach((arr) => {
    for (let i = 0; i < winningCombinations.length; i++) {
      if (winningCombinations[i].every((element) => arr.includes(element))) {
        if (currentTurn === "o") {
          xWins++;
          xWinsElement.textContent = xWins;
          xWonTitle.classList.remove("hidden");
          winningSign = "x";
          roundIsOver = true;
        } else {
          oWins++;
          oWinsElement.textContent = oWins;
          oWonTitle.classList.remove("hidden");
          winningSign = "o";
          roundIsOver = true;
        }
        for (let index = 0; index < winningCombinations[i].length; index++) {
          gameCells[winningCombinations[i][index]].classList.add(
            `winner-${winningSign}`,
          );
        }
        let winner = "";
        if (gameMode !== "cpu") {
          if (player1Mark === winningSign) {
            winner = "player 1";
          } else {
            winner = "player 2";
          }
          endRoundMessage.innerHTML = `${winner} wins!`;
        } else {
          if (player1Mark === winningSign) {
            endRoundMessage.innerHTML = "you won!";
          } else {
            endRoundMessage.innerHTML = "oh no, you lost...";
          }
        }
        endRoundMessage.classList.remove("hidden");
        endRoundMenu.classList.remove("hidden");
        showOverlay();

        return;
      }
    }
  });
}
nextRoundBtn.addEventListener("click", newRound);
function newRound() {
  oWonTitle.classList.add("hidden");
  xWonTitle.classList.add("hidden");
  tieTitle.classList.add("hidden");
  endRoundMenu.classList.add("hidden");
  showOverlay();
  roundIsOver = false;
  startNewRound();
  saveGame();
}
function quitGame() {
  restartMenu.classList.add("hidden");
  game.classList.add("hidden");
  newGameMenu.classList.remove("hidden");
  endRoundMenu.classList.add("hidden");
  showOverlay();
  localStorage.removeItem("ticTacToeGame");
}
quitBtn.addEventListener("click", () => quitGame());
function showOverlay() {
  if (
    endRoundMenu.classList.contains("hidden") &&
    restartMenu.classList.contains("hidden")
  ) {
    gameBoard.removeAttribute("inert");
    gameHeader.removeAttribute("inert");
    overlay.classList.add("hidden");
  } else {
    gameBoard.setAttribute("inert", "");
    gameHeader.setAttribute("inert", "");
    overlay.classList.remove("hidden");
  }
}
function saveGame() {
  const endRoundMessageText = endRoundMessage.innerHTML;
  const gameState = {
    gameMode,
    player1Mark,
    currentTurn,
    xArray,
    oArray,
    xWins,
    oWins,
    ties,
    firstTurn,
    roundIsOver,
    winningSign,
    endRoundMessageText,
  };

  localStorage.setItem("ticTacToeGame", JSON.stringify(gameState));
}

function loadGame() {
  const gameState = localStorage.getItem("ticTacToeGame");
  if (!gameState) return null;
  const savedGame = JSON.parse(gameState);
  gameMode = savedGame.gameMode;
  player1Mark = savedGame.player1Mark;
  currentTurn = savedGame.currentTurn;
  xArray = savedGame.xArray;
  oArray = savedGame.oArray;
  xWins = savedGame.xWins;
  oWins = savedGame.oWins;
  ties = savedGame.ties;
  firstTurn = savedGame.firstTurn;
  roundIsOver = savedGame.roundIsOver;
  winningSign = savedGame.winningSign;
  endRoundMessage.innerHTML = savedGame.endRoundMessageText;

  gameCells.forEach((cell, index) => {
    if (xArray.includes(index)) {
      cell.classList.add("game__cell--x");
      cell.setAttribute("aria-label", `${cell.getAttribute("aria-label")}, X`);
      cell.classList.add("game__cell--taken");
    } else if (oArray.includes(index)) {
      cell.classList.add("game__cell--o");
      cell.setAttribute("aria-label", `${cell.getAttribute("aria-label")}, O`);
      cell.classList.add("game__cell--taken");
    }
  });
  xWinsElement.textContent = xWins;
  oWinsElement.textContent = oWins;
  tiesElement.textContent = ties;

  if (gameMode === "cpu") {
    if (player1Mark === "x") {
      xPlayerSpan.innerText = "(YOU)";
      oPlayerSpan.innerText = "(cpu)";
    } else {
      oPlayerSpan.innerText = "(YOU)";
      xPlayerSpan.innerText = "(cpu)";
    }
  }

  if (currentTurn === "x") {
    xTurnImg.classList.remove("hidden");
    oTurnImg.classList.add("hidden");
  } else {
    oTurnImg.classList.remove("hidden");
    xTurnImg.classList.add("hidden");
  }

  gameBoard.classList.toggle("game__board--x-turn", currentTurn === "x");
  gameBoard.classList.toggle("game__board--o-turn", currentTurn === "o");

  const computerSign = player1Mark === "x" ? "o" : "x";
  gameBoard.classList.toggle(
    "game__board--cpu-turn",
    gameMode === "cpu" && currentTurn === computerSign,
  );

  if (roundIsOver) {
    if (winningSign === "x") {
      xWinsElement.textContent = xWins;
      xWonTitle.classList.remove("hidden");
      endRoundMessage.classList.remove("hidden");
    } else if (winningSign === "o") {
      oWinsElement.textContent = oWins;
      oWonTitle.classList.remove("hidden");
      endRoundMessage.classList.remove("hidden");
    } else {
      tieTitle.classList.remove("hidden");
    }

    endRoundMenu.classList.remove("hidden");
    showOverlay();
  }
  if (!roundIsOver) {
    updateBoard();
  }
  return true;
}

document.addEventListener("DOMContentLoaded", () => {
  const savedGame = loadGame();

  if (savedGame) {
    newGameMenu.classList.add("hidden");
    game.classList.remove("hidden");
  } else {
    newGameMenu.classList.remove("hidden");
    game.classList.add("hidden");
  }
});
