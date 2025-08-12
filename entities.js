export class Player {
  width = 20;
  height = 20;
  velocityX = 0;
  velocityY = 0;
  score = 0;
  coordinates = {
    x: 0, // 50,
    y: 0, // DEFAULT_GAME_HEIGHT - this.height,
  };
  isJumping = false;

  constructor(x, y) {
    this.coordinates.x = x;
    this.coordinates.y = y - this.height;
  }
}

export class Obstacle {
  width = 15;
  height = 30;
  coordinates = {
    x: 0, // w + this.width,
    y: 0, // DEFAULT_GAME_HEIGHT - this.height,
  };

  constructor(x, y) {
    this.coordinates.x = x + this.width;
    this.coordinates.y = y - this.height;
  }
}
