const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const scoreElement = document.getElementById('score');

// 設定遊戲參數
canvas.width = 400;
canvas.height = 400;
const gridSize = 20;
const tileCount = canvas.width / gridSize;
let score = 0;

// 蛇的初始設定
let snake = [
    { x: 5, y: 5 }
];
let foods = []; // 改為存儲多個食物
let dx = 1;
let dy = 0;
let gameInterval;
let foodInterval;
let gameStarted = false;
let canChangeDirection = true;

// 遊戲初始化
function initGame() {
    snake = [{ x: 5, y: 5 }];
    foods = [generateFood()]; // 初始化一顆食物
    dx = 1;
    dy = 0;
    score = 0;
    scoreElement.textContent = score;
}

// 生成食物
function generateFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    } while (
        snake.some(segment => segment.x === newFood.x && segment.y === newFood.y) ||
        foods.some(food => food.x === newFood.x && food.y === newFood.y)
    );
    return newFood;
}

// 繪製遊戲畫面
function draw() {
    // 清空畫布
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 繪製蛇
    ctx.fillStyle = '#4CAF50';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });

    // 繪製所有食物
    ctx.fillStyle = 'red';
    foods.forEach(food => {
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    });
}

// 移動蛇
function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // 檢查是否撞牆
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }

    // 檢查是否撞到自己
    if (snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    // 檢查是否吃到任何食物
    const foodIndex = foods.findIndex(food => food.x === head.x && food.y === head.y);
    if (foodIndex !== -1) {
        score += 10;
        scoreElement.textContent = score;
        foods.splice(foodIndex, 1); // 移除被吃掉的食物
    } else {
        snake.pop();
    }
}

// 遊戲循環
function gameLoop() {
    moveSnake();
    draw();
    canChangeDirection = true;
}

// 遊戲結束
function gameOver() {
    clearInterval(gameInterval);
    clearInterval(foodInterval);
    gameStarted = false;
    startBtn.textContent = '重新開始';
    alert('遊戲結束！得分：' + score);
}

// 開始遊戲
function startGame() {
    if (gameStarted) return;
    
    initGame();
    gameStarted = true;
    startBtn.textContent = '遊戲進行中';
    gameInterval = setInterval(gameLoop, 200);
    foodInterval = setInterval(() => {
        foods.push(generateFood());
    }, 2000); // 改為每 2 秒生成一個新食物
}

// 按鍵控制
document.addEventListener('keydown', (event) => {
    if (!gameStarted || !canChangeDirection) return;

    let changed = false;
    
    switch (event.key) {
        case 'ArrowUp':
            if (dy !== 1) {
                dx = 0;
                dy = -1;
                changed = true;
            }
            break;
        case 'ArrowDown':
            if (dy !== -1) {
                dx = 0;
                dy = 1;
                changed = true;
            }
            break;
        case 'ArrowLeft':
            if (dx !== 1) {
                dx = -1;
                dy = 0;
                changed = true;
            }
            break;
        case 'ArrowRight':
            if (dx !== -1) {
                dx = 1;
                dy = 0;
                changed = true;
            }
            break;
    }

    if (changed) {
        canChangeDirection = false; // 方向改變後鎖定，直到下一次移動
    }
});

startBtn.addEventListener('click', startGame);

// 初始繪製
draw();