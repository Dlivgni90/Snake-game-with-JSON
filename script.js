const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
const lifeCounter = document.querySelector("#life-counter");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "white";
const snakeColor = "lightgreen";
const snakeBoarder = "black";
const foodColor = "red";
const unitSize = 25;

let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let snake = [
    {x: unitSize * 3, y: 0},
    {x: unitSize * 2, y: 0},
    {x: unitSize, y: 0},
    {x: 0, y: 0}
];
let lives = 3;
let currentLevel = 1; 
let levelsData;
let gameSpeed;
let foodPoints;

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);

function loadLevels() {
    fetch('levels.json')
        .then(response => response.json())
        .then(data => {
            levelsData = data.levels;
            gameStart();
        })
        .catch(error => console.error('Error loading levels:', error));
}

function gameStart() {
    running = true;
    scoreText.textContent = score;
    updateLifeCounter();
    setGameLevel(currentLevel);
    createFood();
    drawFood();
    nextTick();
}

function setGameLevel(level) {
    const levelData = levelsData[level - 1];
    gameSpeed = levelData.speed;
    foodPoints = levelData.foodPoints;
}

function nextTick() {
    if (running) {
        setTimeout(() => {
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, gameSpeed);
    } else {
        displayGameOver();
    }
}

function clearBoard() {
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
}

function createFood() {
    function randomFood(min, max) {
        const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
        return randNum;
    }
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameHeight - unitSize);
}

function drawFood() {
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
}

function moveSnake() {
    const head = {
        x: snake[0].x + xVelocity,
        y: snake[0].y + yVelocity,
    };
    snake.unshift(head);

    if (snake[0].x === foodX && snake[0].y === foodY) {
        score += foodPoints;
        scoreText.textContent = score;
        createFood();
        if (score % 5 === 0) {
            currentLevel++;
            if (currentLevel > levelsData.length) {
                currentLevel = levelsData.length;
            }
            setGameLevel(currentLevel);
        }
    } else {
        snake.pop();
    }
}

function drawSnake() {
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBoarder;
    snake.forEach(snakePart => {
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    });
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;

    const goingUp = (yVelocity === -unitSize);
    const goingDown = (yVelocity === unitSize);
    const goingRight = (xVelocity === unitSize);
    const goingLeft = (xVelocity === -unitSize);

    switch (true) {
        case (keyPressed === LEFT && !goingRight):
            xVelocity = -unitSize;
            yVelocity = 0;
            break;
        case (keyPressed === UP && !goingDown):
            xVelocity = 0;
            yVelocity = -unitSize;
            break;
        case (keyPressed === RIGHT && !goingLeft):
            xVelocity = unitSize;
            yVelocity = 0;
            break;
        case (keyPressed === DOWN && !goingUp):
            xVelocity = 0;
            yVelocity = unitSize;
            break;
    }
}

function checkGameOver() {
    if (snake[0].x < 0 || snake[0].x >= gameWidth || snake[0].y < 0 || snake[0].y >= gameHeight) {
        running = false;
    }

    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            running = false;
        }
    }

    if (!running) {
        lives--;
        updateLifeCounter();
        if (lives <= 0) {
            running = false;
            displayGameOver();
        } else {
            running = true;
            resetSnakePosition();
            currentLevel += 1;
            setGameLevel(currentLevel);
        }
    }
}

function updateLifeCounter() {
    lifeCounter.textContent = `Lives: ${lives}`;
}

function displayGameOver() {
    ctx.font = "50px MV Boli";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2);
    running = false;
}

function resetGame() {
    score = 0;
    lives = 3;
    scoreText.textContent = score;
    updateLifeCounter();
    xVelocity = unitSize;
    yVelocity = 0;
    snake = [
        {x: unitSize * 3, y: 0},
        {x: unitSize * 2, y: 0},
        {x: unitSize, y: 0},
        {x: 0, y: 0}
    ];
    currentLevel = 1;
    gameStart();
}

function resetSnakePosition() {
    xVelocity = unitSize;
    yVelocity = 0;
    snake = [
        {x: unitSize * 3, y: 0},
        {x: unitSize * 2, y: 0},
        {x: unitSize, y: 0},
        {x: 0, y: 0}
    ];
    running = true;
}

loadLevels();
