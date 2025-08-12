import { Player, Obstacle, Ground } from "./entities.js";

const c = document.getElementById("canvas");
const restartButton = document.getElementById("restart-button");
const ctx = c.getContext("2d");
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

const player = new Player(50, DEFAULT_GAME_HEIGHT);
let obstacles = [];
let grounds = [];

function jump(e) {
  if (!isGameOver) {
    if (e.code === "Space" && !player.isJumping) {
      currentTime = performance.now();
      player.velocityY = 8.5;
      player.isJumping = true;
    }
  } else {
    if (e.code === "Space") {
      startGame();
    }
  }
}
function updatePlayerPosition() {
  if (!isGameOver && player.isJumping) {
    const t = (performance.now() - currentTime) / 5;
    player.coordinates.y =
      DEFAULT_GAME_HEIGHT - player.velocityY * t + GRAVITY * t * t;

    if (player.coordinates.y >= DEFAULT_GAME_HEIGHT) {
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

// Sliding ground texture
function updateGroundPosition() {
  if (!isGameOver && grounds.length > 0) {
    for (let i = 0; i < grounds.length; i++) {
      grounds[i].coordinates.x -= DEFAULT_GAME_VELOCITY_X;

      if (grounds[i].coordinates.x <= -grounds[i].width) {
        grounds[i].coordinates.x += 2 * w;
      }
    }
  }
}

function updateGameScore() {
  if (!isGameOver) {
    const now = performance.now();
    const diff = now - scoreIntervalTimer;

    if (diff >= SCORE_INTERVAL) {
      gameScore += 1;
      scoreIntervalTimer = performance.now();
    }
  }
}

function checkCollision() {
  obstacles.forEach((obstacle) => {
    if (
      player.coordinates.x < obstacle.coordinates.x + obstacle.width &&
      player.coordinates.x + player.width > obstacle.coordinates.x &&
      player.coordinates.y < obstacle.coordinates.y + obstacle.height &&
      player.coordinates.y + player.height > obstacle.coordinates.y
    ) {
      stopGame();
    }
  });
}

function generateObstacle() {
  if (!isGameOver && !isGenerated) {
    isGenerated = true;
    const randomTime = Math.floor(Math.random() * 1000 * 2) + 2;
    obstacleTimeout = setTimeout(() => {
      obstacles.push(new Obstacle(w, DEFAULT_GAME_HEIGHT));
      isGenerated = false;
    }, randomTime);
  }
}

function prepareGround() {
  for (let i = 0; i < 2; i++) {
    grounds.push(new Ground(i * w, DEFAULT_GAME_HEIGHT, w, h));
  }
}

function stopGame() {
  isGameOver = true;
  c.style.filter = `blur(2px) grayscale(90%)`;
  restart.style.display = `block`;
}

function startGame() {
  isGameOver = false;
  c.style.filter = ``;
  restart.style.display = `none`;
  gameScore = 0;
  obstacles = [];
}

function draw() {
  updatePlayerPosition();
  generateObstacle();
  updateObstaclePosition();
  updateGroundPosition();
  checkCollision();
  updateGameScore();
  ctx.fillStyle = "lightblue";
  ctx.fillRect(0, 0, c.clientWidth, c.clientHeight);
  ctx.fillStyle = "green";
  ctx.drawImage(player.texture, player.coordinates.x, player.coordinates.y);
  ctx.fillStyle = "purple";
  obstacles.forEach((obstacle) => {
    ctx.drawImage(
      obstacle.texture,
      obstacle.coordinates.x,
      obstacle.coordinates.y
    );
  });
  grounds.forEach((ground) => {
    ctx.drawImage(ground.texture, ground.coordinates.x, ground.coordinates.y);
  });
  ctx.font = "20px sans-serif";
  ctx.fillStyle = "black";
  ctx.fillText(gameScore, w - 50, 50);
  window.requestAnimationFrame(draw);
}

function main() {
  scoreIntervalTimer = performance.now();
  prepareGround();
  draw();
}

document.addEventListener("DOMContentLoaded", main);
document.addEventListener("keydown", jump);
restartButton.addEventListener("click", startGame);
