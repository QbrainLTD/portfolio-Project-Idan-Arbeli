let player = "X";
let board = ["", "", "", "", "", "", "", "", ""];
//מערך אפשרויות ניצחון
const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6]             // diagonals
];

//בדיקת ניצחון
function checkWin() {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return true;
    }
  }
  return false;
}

//בדיקת תיקו
function checkTie() {
  return board.every(cell => cell !== "");
}

// אתחול המשחק
function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  player = "X";
  document.querySelectorAll(".cell").forEach(cell => {
    cell.innerText = "";
  });
}

// פונקציה ביצוע הפעולה
function makeMove(cellIndex, cell) {
  if (board[cellIndex] === "") {
    board[cellIndex] = player;
    cell.innerText = player;
    if (checkWin()) {
      setTimeout(() => {
        alert(`${player} wins!`);
        resetGame();
      }, 100);
    } else if (checkTie()) {
      setTimeout(() => {
        alert("It's a tie!");
        resetGame();
      }, 100);
    } else {
      player = player === "X" ? "O" : "X";
    }
  }
}


document.querySelectorAll(".cell").forEach((cell, index) => {
  cell.addEventListener("click", () => {
    makeMove(index, cell);
  });
});

//כפתור לאתחול המסך

let btn = document.querySelector('.restart-button');
btn.addEventListener('click', resetGame);