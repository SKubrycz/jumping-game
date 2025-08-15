import { Player, Obstacle, Ground, Background } from "./entities.js";

const c = document.getElementById("canvas");
const restartButton = document.getElementById("restart-button");
const ctx = c.getContext("2d");
const w = c.clientWidth;
const h = c.clientHeight;
const DEFAULT_GAME_HEIGHT = h - 50;
const DEFAULT_GAME_VELOCITY_X = 7;
const BACKGROUND_VELOCITY_X = 3;
const GRAVITY = 1;
let obstacleTimeout = null;
let isGenerated = false;
let isGameOver = false;
let gameScore = 0;
const SCORE_INTERVAL = 250; // ms
let scoreIntervalTimer = performance.now();

const player = new Player(50, DEFAULT_GAME_HEIGHT);
let obstacles = [];
let grounds = [];
let backgrounds = []; // moving background tiles

function jump(e) {
  if (!isGameOver) {
    if (e.code === "Space" && !player.isJumping) {
      player.velocityY = -20;
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
    player.velocityY += GRAVITY;
    player.coordinates.y += player.velocityY;

    if (player.coordinates.y >= DEFAULT_GAME_HEIGHT) {
      player.coordinates.y = DEFAULT_GAME_HEIGHT - player.height;
      player.isJumping = false;
      player.velocityY = 0;
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

function updateBackgroundPosition() {
  const bgCount = backgrounds.length;

  if (!isGameOver && bgCount > 0) {
    for (let i = 0; i < bgCount; i++) {
      backgrounds[i].coordinates.x -= BACKGROUND_VELOCITY_X;

      if (backgrounds[i].coordinates.x <= -backgrounds[i].dWidth) {
        backgrounds[i].coordinates.x += w + w / 4;
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

function prepareBackground() {
  for (let i = 0; i <= 4; i++) {
    backgrounds.push(
      new Background(
        (i * (w / 4)) % w,
        0,
        w / 4,
        100,
        i * (w / 4),
        DEFAULT_GAME_HEIGHT - 100,
        w / 4,
        100
      )
    );
  }

  console.log(backgrounds);
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
  updateBackgroundPosition();
  checkCollision();
  updateGameScore();

  ctx.fillStyle = "lightblue";
  ctx.fillRect(0, 0, c.clientWidth, c.clientHeight);
  backgrounds.forEach((bg) => {
    ctx.drawImage(
      bg.texture,
      bg.sliceCoordinates.x,
      bg.sliceCoordinates.y,
      bg.sWidth,
      bg.sHeight,
      bg.coordinates.x,
      bg.coordinates.y,
      bg.dWidth,
      bg.dHeight
    );
  });
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
  prepareBackground();
  draw();
}

document.addEventListener("DOMContentLoaded", main);
document.addEventListener("keydown", jump);
restartButton.addEventListener("click", startGame);
