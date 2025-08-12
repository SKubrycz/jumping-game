const c = document.getElementById("canvas");
const ctx = c.getContext('2d');
const w = c.clientWidth;
const h = c.clientHeight;
const DEFAULT_GAME_HEIGHT = h - 50;
const DEFAULT_GAME_VELOCITY_X = 7;
const GRAVITY = 0.1;
let currentTime = performance.now();
let isGenerated = false;
let obstacleTimeout = null;
let isGameOver = false;
let gameScore = 0;
const SCORE_INTERVAL = 250; // ms
let scoreIntervalTimer = performance.now();

class Player {
    width = 20;
    height = 20;
    velocityX = 0;
    velocityY = 0;
    score = 0;
    coordinates = {
        x: 50, 
        y: DEFAULT_GAME_HEIGHT - this.height,
    }
    isJumping = false;

    constructor() {
    }
}

class Obstacle {
    width = 15;
    height = 30;
    coordinates = {
        x: w + this.width,
        y: DEFAULT_GAME_HEIGHT - this.height,
    }
}

const player = new Player();
let obstacles = [];

function jump(e) {
    if (!isGameOver) {
        if (e.code === "Space" && !player.isJumping) {
            currentTime = performance.now();
            player.velocityY = 8.5;
            player.isJumping = true;
        }
    } else {
        if (e.code === "Space") {
            isGameOver = false;
            obstacles = [];
            console.log(obstacles)
        }
    }
}
function updatePlayerPosition() {
    if (!isGameOver && player.isJumping) {
        const t = (performance.now() - currentTime)/5;
        player.coordinates.y = DEFAULT_GAME_HEIGHT - player.velocityY * t + GRAVITY * t * t;
    
        if (player.coordinates.y > DEFAULT_GAME_HEIGHT) {
            player.coordinates.y = DEFAULT_GAME_HEIGHT - player.height;
            player.isJumping = false;
        }
    }
}

function updateObstaclePosition() {
    if (!isGameOver && obstacles.length > 0) {
        for (let i = 0; i < obstacles.length; i++) {
            obstacles[i].coordinates.x -= DEFAULT_GAME_VELOCITY_X;
            if (obstacles[i].coordinates.x <= -obstacles[i].width) {
                obstacles.shift();
            }
        }
    }
}

function updateGameScore() {
    if (!isGameOver) {
        const now = performance.now()
        const diff = now - scoreIntervalTimer;
        
        if (diff >= SCORE_INTERVAL) {
            gameScore += 1;
            scoreIntervalTimer = performance.now();
        }
    } else {
        gameScore = 0;
    }
}

function checkCollision() {
    obstacles.forEach((obstacle) => {
        if (player.coordinates.x < obstacle.coordinates.x + obstacle.width && player.coordinates.x + player.width > obstacle.coordinates.x && player.coordinates.y < obstacle.coordinates.y + obstacle.height && player.coordinates.y + player.height > obstacle.coordinates.y) {
            isGameOver = true;
        }
    })
}

function generateObstacle() {
    if (!isGameOver && !isGenerated) {
        isGenerated = true;
        const randomTime = Math.floor(Math.random() * 1000 * 2) + 2;
        obstacleTimeout = setTimeout(() => {
            obstacles.push(new Obstacle());
            console.log(obstacles)
            isGenerated = false;
        }, randomTime);
    }
}

function draw() {
    ctx.fillStyle = 'lightblue'
    ctx.fillRect(0, 0, c.clientWidth, c.clientHeight)
    ctx.fillStyle = 'green';
    ctx.fillRect(player.coordinates.x, player.coordinates.y, player.width, player.height);
    ctx.fillStyle = 'purple';
    obstacles.forEach((obstacle) => {
        ctx.fillRect(obstacle.coordinates.x, obstacle.coordinates.y, obstacle.width, obstacle.height)
    })
    ctx.font = '20px sans-serif';
    ctx.fillStyle = 'black';
    ctx.fillText(gameScore, w - 50, 50);
    updatePlayerPosition();
    generateObstacle();
    updateObstaclePosition();
    checkCollision();
    updateGameScore();
    window.requestAnimationFrame(draw)
}

function main() {
    window.requestAnimationFrame(draw)
}

document.addEventListener("DOMContentLoaded", draw);
document.addEventListener('keydown', jump)
