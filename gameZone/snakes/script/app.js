console.log("Hello, welcome to my Snake game");

const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".highScore");
const playBoard = document.querySelector(".playBoard");
const speedSlider = document.getElementById("speedSlider");

let foodXPosition;
let foodYPosition;
let snakeXPosition = 10;
let snakeYPosition = 10;
let score = 0;
let gameOver = false; 
let setIntervalId;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let speed = speedSlider.value;

// Get High score from local storage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;


//הגדרצ צדדים 
const Direction = {
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT'
};

const keyToDirection = {
    ArrowUp: Direction.UP,
    ArrowDown: Direction.DOWN,
    ArrowLeft: Direction.LEFT,
    ArrowRight: Direction.RIGHT
};


// מיפוי הצדדים
const directionVectors = {
    [Direction.UP]: { x: 0, y: -1 },
    [Direction.DOWN]: { x: 0, y: 1 },
    [Direction.LEFT]: { x: -1, y: 0 },
    [Direction.RIGHT]: { x: 1, y: 0 }
};

document.addEventListener("keyup", (e) => {
    const direction = keyToDirection[e.key];
    if (direction) {
        changeDirection(direction);
    }
});

const changeDirection = (direction) => {
    const { x, y } = directionVectors[direction];

    // מניעה מהנחש לללכת לכיוון ההפוך.
    if (velocityX !== -x || velocityY !== -y) {
        velocityX = x;
        velocityY = y;
    }
}
const adjustSpeed = (newSpeed) => {
    clearInterval(setIntervalId);
    setIntervalId = setInterval(initGame, newSpeed);
}

speedSlider.addEventListener("input", (event) => {
    speed = event.target.value;
    adjustSpeed(speed);
});

const updateFoodPosition = () => {
    foodXPosition = Math.floor(Math.random() * 20) + 1;
    foodYPosition = Math.floor(Math.random() * 20) + 1;
}

const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("Game Over! click Ok to Start Again");
    location.reload();
}

const initGame = () => {
    if (gameOver) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${foodYPosition} / ${foodXPosition}"></div>`;

    // כאשר הנחש אוכל את האוכל
    if (snakeXPosition === foodXPosition && snakeYPosition === foodYPosition) {
        updateFoodPosition();
        snakeBody.push([foodYPosition, foodXPosition]); // הוספת האוכל לגוף הנחש
        score++;
        highScore = score >= highScore ? score : highScore; // אם הניקוד הנוכחי גדול מהגבוה, עדכן את הניקוד הגבוה

        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    // עדכון מיקום ראש הנחש
    snakeXPosition += velocityX;
    snakeYPosition += velocityY;

    // הזזת הערכים של האלמנטים בגוף הנחש קדימה
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeXPosition, snakeYPosition];

    // בדיקה אם הנחש חורג מגבולות הלוח
    if (snakeXPosition <= 0 || snakeXPosition > 20 || snakeYPosition <= 0 || snakeYPosition > 20) {
        return gameOver = true;
    }

    // הוספת div עבור כל חלק בגוף הנחש
    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        // בדיקה אם ראש הנחש פוגע בגוף
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = html;
}

updateFoodPosition();
setIntervalId = setInterval(initGame, speed);
