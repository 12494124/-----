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
let food = { x: 10, y: 10 };
let dx = 1; // 設定初始移動方向為向右
let dy = 0;
let gameInterval;
let gameStarted = false;

// 遊戲初始化
function initGame() {
    snake = [{ x: 5, y: 5 }];
    food = generateFood();
    dx = 1; // 確保重新開始時也是向右移動
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
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
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

    // 繪製食物
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

// 移動蛇
function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // 檢查是否撞牆
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }

    // 檢查是否撞到自己（只檢查與身體其他部分的碰撞）
    if (snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    // 檢查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        food = generateFood();
    } else {
        snake.pop();
    }
}

// 遊戲循環
function gameLoop() {
    moveSnake();
    draw();
}

// 遊戲結束
function gameOver() {
    clearInterval(gameInterval);
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
    gameInterval = setInterval(gameLoop, 200); // 將間隔時間從 100 調整為 200 毫秒
}

// 按鍵控制
document.addEventListener('keydown', (event) => {
    if (!gameStarted) return;

    switch (event.key) {
        case 'ArrowUp':
            if (dy !== 1) { dx = 0; dy = -1; }
            break;
        case 'ArrowDown':
            if (dy !== -1) { dx = 0; dy = 1; }
            break;
        case 'ArrowLeft':
            if (dx !== 1) { dx = -1; dy = 0; }
            break;
        case 'ArrowRight':
            if (dx !== -1) { dx = 1; dy = 0; }
            break;
    }
});

startBtn.addEventListener('click', startGame);

// 初始繪製
draw();