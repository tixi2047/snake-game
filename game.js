var gameConfig = [];
var boardSize = 0;
var food = [];
var snakeHead = [];
var blockSize = 27;
var gameBoard;
var boardContext;
var tempValue;
var velocityX = 0;
var velocityY = 0;
var intervalHandler = null;
var speed = 0;
var snakeBody = [];
var currentScore = 0;
var pressedKey;
var isGameOver = false;
var superFood = [];
var superFoodHandler;
var firstClick = 0;
var timer = 0;
var superFoodActive = false;
var superFoodTimer = 0;
var eyeContext;
var playerName;
var playerScore;
var promptInput;
var bestScoreValue;
var hasShownGameOverPrompt = false;

var currentGame = [];
var playerNames = ["", "", "", "", ""];
var topScores = [-1, -1, -1, -1, -1];

function initializeGame() {
    if (localStorage.getItem("currentGame") == null) {
        localStorage.setItem("currentGame", currentGame);
    }

    if (localStorage.getItem("playerNames") == null) {
        localStorage.setItem("playerNames", playerNames);
    }

    if (localStorage.getItem("topScores") == null) {
        localStorage.setItem("topScores", topScores);
    } else {
        topScores = localStorage.getItem("topScores");
        topScores = topScores.split(",");
    }

    if (parseInt(topScores[0]) != -1) document.getElementById("bestScore").innerText = topScores[0];
    else document.getElementById("bestScore").innerText = 0;

    gameConfig = localStorage.getItem("gameConfig");
    gameConfig = gameConfig.split(",");
    boardSize = parseInt(gameConfig[2]);

    gameBoard = document.getElementById("gameBoard");
    gameBoard.height = blockSize * boardSize;
    gameBoard.width = blockSize * boardSize;

    speed = gameConfig[1];
    if (speed == "easy") speed = 200;
    if (speed == "medium") speed = 100;
    if (speed == "hard") speed = 50;

    currentScore = 0;
    isGameOver = false;
    hasShownGameOverPrompt = false;
    firstClick = 0;
    timer = 0;

    if (boardSize == 25) {
        document.getElementById("gameContainer").style.height = "850px";
        document.getElementById("gameContainer").style.width = "800px";
    }

    if (boardSize == 20) {
        document.getElementById("gameContainer").style.height = "800px";
        document.getElementById("gameContainer").style.width = "800px";
    }

    if (boardSize == 15) {
        document.getElementById("gameContainer").style.height = "650px";
        document.getElementById("gameContainer").style.width = "700px";
    }

    boardContext = gameBoard.getContext("2d");
    eyeContext = gameBoard.getContext("2d");

    drawStripedBoard();
    placeRandomSnakeHead();
    placeRandomFood();
}

function drawGameOver() {
    if (hasShownGameOverPrompt) {
        return;
    }
    hasShownGameOverPrompt = true;

    boardContext.fillStyle = "black";
    boardContext.fillRect(0, 0, boardSize * blockSize, boardSize * blockSize);

    boardContext.fillStyle = "white";
    boardContext.font = "bolder 50px Arial";
    boardContext.fillText("GAME OVER!", (boardSize * blockSize) / 2 - 160, (boardSize * blockSize) / 2);

    setTimeout(function () {
        promptInput = prompt("TYPE IN PLAYER'S NAME");
        if (promptInput == null || promptInput == "") {
            hasShownGameOverPrompt = false;
            drawGameOver();
        } else {
            localStorage.setItem("currentGame", "");
            currentGame = [];
            currentGame.push(promptInput);
            currentGame.push(currentScore);
            localStorage.setItem("currentGame", currentGame);
            window.location.href = "results.html";
        }
    }, 500);
}

function placeRandomSuperFood() {
    let retryPlacement = false;

    while (true) {
        retryPlacement = false;
        superFood = [];

        tempValue = Math.floor(Math.random() * boardSize);
        superFood.push(tempValue);
        tempValue = Math.floor(Math.random() * boardSize);
        superFood.push(tempValue);

        for (let i = 0; i < snakeBody.length; i++) {
            if (snakeBody[i][0] == superFood[0] && snakeBody[i][1] == superFood[1]) {
                retryPlacement = true;
                break;
            }
        }

        if (retryPlacement) continue;

        if (snakeHead[0] == superFood[0] && snakeHead[1] == superFood[1] && food[0] == superFood[0] && superFood[1] == food[1]) retryPlacement = true;

        if (retryPlacement) continue;
        else break;
    }
}

function drawStripedBoard() {
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            tempValue = i + j;
            if (tempValue % 2 == 0) {
                boardContext.fillStyle = "#3D495A";
                boardContext.fillRect(i * blockSize, j * blockSize, blockSize, blockSize);
            } else {
                boardContext.fillStyle = "#313740";
                boardContext.fillRect(i * blockSize, j * blockSize, blockSize, blockSize);
            }
        }
    }
}

function placeRandomFood() {
    let placed = false;

    while (placed == false) {
        food = [];

        tempValue = Math.floor(Math.random() * boardSize);
        food.push(tempValue);
        tempValue = Math.floor(Math.random() * boardSize);
        food.push(tempValue);

        if (snakeHead[0] != food[0] && snakeHead[1] != food[1]) placed = true;
    }

    boardContext.beginPath();
    boardContext.fillStyle = "red";
    boardContext.arc(food[0] * blockSize + blockSize / 2, food[1] * blockSize + blockSize / 2, blockSize / 2.5, 0, 2 * Math.PI);
    boardContext.fill();
}

function placeRandomSnakeHead() {
    tempValue = Math.floor(Math.random() * boardSize);
    snakeHead.push(tempValue);

    tempValue = Math.floor(Math.random() * boardSize);
    snakeHead.push(tempValue);

    moveSnake();
}

function handleFoodCollision() {
    snakeBody.push([food[0], food[1]]);
    currentScore++;
    document.getElementById("currentScore").innerHTML = currentScore;
    placeRandomFood();
}

function drawSnakeEyes(a, b, c, d) {
    boardContext.fillStyle = "black";
    boardContext.fillRect(snakeHead[0] * blockSize + a, snakeHead[1] * blockSize + b, 5, 5);
    boardContext.fillRect(snakeHead[0] * blockSize + c, snakeHead[1] * blockSize + d, 5, 5);
}

function collidedWithWalls() {
    if (snakeHead[0] < 0 || snakeHead[1] < 0 || snakeHead[0] > boardSize || snakeHead[1] > boardSize) return (isGameOver = true);
}

function snakeAteItself() {
    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeBody[i][0] == snakeHead[0] && snakeBody[i][1] == snakeHead[1]) {
            return (isGameOver = true);
        }
    }
}

function drawSuperFood() {
    boardContext.beginPath();
    boardContext.fillStyle = "orange";
    boardContext.arc(superFood[0] * blockSize + blockSize / 2, superFood[1] * blockSize + blockSize / 2, blockSize / 2.5, 0, 2 * Math.PI);
    boardContext.fill();
}

function handleSuperFoodCollision() {
    snakeBody.push([superFood[0], superFood[1]]);
    currentScore += 10;
    document.getElementById("currentScore").innerHTML = currentScore;
}

function moveSnake() {
    isGameOver = collidedWithWalls();
    if (isGameOver) {
        clearInterval(intervalHandler);
        clearInterval(tempValue);
        drawGameOver();
        return;
    }

    isGameOver = snakeAteItself();
    if (isGameOver) {
        clearInterval(intervalHandler);
        clearInterval(tempValue);
        drawGameOver();
        return;
    }

    let i = 0;
    timer++;

    drawStripedBoard();

    boardContext.fillStyle = "red";
    boardContext.arc(food[0] * blockSize + blockSize / 2, food[1] * blockSize + blockSize / 2, blockSize / 2.5, 0, 2 * Math.PI);
    boardContext.fill();

    if ((superFood[0] + superFood[1]) % 2 == 0) {
        boardContext.fillStyle = "#3D495A";
        boardContext.fillRect(superFood[0] * blockSize, superFood[1] * blockSize, blockSize, blockSize);
    } else {
        boardContext.fillStyle = "#313740";
        boardContext.fillRect(superFood[0] * blockSize, superFood[1] * blockSize, blockSize, blockSize);
    }

    if (timer != 0 && (speed * timer) % 10000 == 0) {
        superFoodActive = true;
        timer++;
        superFoodTimer = 0;
        placeRandomSuperFood();
    }

    if (superFoodActive) {
        timer--;
        superFoodTimer++;

        if (superFood[0] == snakeHead[0] && superFood[1] == snakeHead[1]) {
            handleSuperFoodCollision();
            superFoodActive = false;
        }
        if ((superFoodTimer * speed) % 5000 == 0) superFoodActive = false;
    }

    if (superFoodActive) {
        drawSuperFood();
    }

    if (food[0] == snakeHead[0] && food[1] == snakeHead[1]) {
        handleFoodCollision();
    }

    for (i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeHead[0], snakeHead[1]];

    i = 0;
    boardContext.fillStyle = "#3498DB";
    
    while (i < snakeBody.length) {
        boardContext.fillRect(snakeBody[i][0] * blockSize, snakeBody[i][1] * blockSize, blockSize, blockSize);
        i++;
    }
    i = 0;
    boardContext.fillStyle = "#A7C7E7";
    boardContext.fillRect(snakeHead[0] * blockSize, snakeHead[1] * blockSize, blockSize, blockSize);

    updateEyes();
}

var activateObstacle = false;
var obstacleDuration = 0;
var obstacleTimer = 0;
let obstacleX = 0;
let obstacleY = 0;

function updateEyes() {
    if (pressedKey == 37 && velocityX != 1) {
        drawSnakeEyes(2, 2, 2, blockSize * 0.75);
    } else if (pressedKey == 38 && velocityY != 1) {
        drawSnakeEyes(2, 2, blockSize * 0.75, 2);
    } else if (pressedKey == 39 && velocityX != -1) {
        drawSnakeEyes(blockSize * 0.75, blockSize * 0.75, blockSize * 0.75, 2);
    } else if (pressedKey == 40 && velocityY != -1) {
        drawSnakeEyes(2, blockSize * 0.75, blockSize * 0.75, blockSize * 0.75);
    } else {
        if (pressedKey == 37 && velocityX == 1) drawSnakeEyes(blockSize * 0.75, blockSize * 0.75, blockSize * 0.75, 2);
        else if (pressedKey == 39 && velocityX == -1) drawSnakeEyes(2, 2, 2, blockSize * 0.75);
        else if (pressedKey == 40 && velocityY == -1) drawSnakeEyes(2, 2, blockSize * 0.75, 2);
        else if (pressedKey == 38 && velocityY == 1) drawSnakeEyes(2, blockSize * 0.75, blockSize * 0.75, blockSize * 0.75);
    }
}

function update() {
    snakeHead[0] = snakeHead[0] + velocityX;
    snakeHead[1] = snakeHead[1] + velocityY;
    moveSnake();
}

document.addEventListener("keyup", handleArrowKeyPress);

function handleArrowKeyPress(event) {
    if (isGameOver) {
        return;
    }

    if (event.keyCode != 37 && event.keyCode != 38 && event.keyCode != 39 && event.keyCode != 40) {
        return;
    }

    clearInterval(intervalHandler);

    eyeLock = false;
    pressedKey = event.keyCode;

    if (pressedKey == 37 && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
        intervalHandler = setInterval(update, speed);
    } else if (pressedKey == 38 && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
        intervalHandler = setInterval(update, speed);
    } else if (pressedKey == 39 && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
        intervalHandler = setInterval(update, speed);
    } else if (pressedKey == 40 && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
        intervalHandler = setInterval(update, speed);
    } else {
        eyeLock = true;
        intervalHandler = setInterval(update, speed);
    }
    firstClick = 1;
}
