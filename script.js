import { Game } from "./entities.js";

const game = Game.getInstance();

function draw() {
  game.updatePlayerPosition();
  game.generateObstacle();
  game.updateObstaclePosition();
  game.updateGroundPosition();
  game.updateBackgroundPosition();
  game.checkCollision();
  game.updateGameScore();

  game.ctx.fillStyle = "lightblue";
  game.ctx.fillRect(0, 0, game.c.clientWidth, game.c.clientHeight);
  game.backgrounds.forEach((bg) => {
    game.ctx.drawImage(
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
  game.ctx.fillStyle = "green";
  game.ctx.drawImage(
    game.player.texture,
    game.player.coordinates.x,
    game.player.coordinates.y
  );
  game.ctx.fillStyle = "purple";
  game.obstacles.forEach((obstacle) => {
    game.ctx.drawImage(
      obstacle.texture,
      obstacle.coordinates.x,
      obstacle.coordinates.y
    );
  });
  game.grounds.forEach((ground) => {
    game.ctx.drawImage(
      ground.texture,
      ground.coordinates.x,
      ground.coordinates.y
    );
  });

  game.ctx.font = "20px sans-serif";
  game.ctx.fillStyle = "black";
  game.ctx.fillText(game.gameScore, game.w - 50, 50);
  window.requestAnimationFrame(draw);
}

function main() {
  game.scoreIntervalTimer = performance.now();
  game.prepareGround();
  game.prepareObstacles();
  game.prepareBackground();
  draw();
}

document.addEventListener("DOMContentLoaded", main);
