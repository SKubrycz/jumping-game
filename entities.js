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
  texture = new Image();
  isJumping = false;

  constructor(x, y) {
    this.coordinates.x = x;
    this.coordinates.y = y - this.height;
    this.texture.src = "assets/player.png";
    this.texture.width = this.width;
    this.texture.height = this.height;
  }
}

export class Obstacle {
  width = 15;
  height = 30;
  coordinates = {
    x: 0, // w + this.width,
    y: 0, // DEFAULT_GAME_HEIGHT - this.height,
  };
  texture = new Image();

  constructor(x, y) {
    this.coordinates.x = x + this.width;
    this.coordinates.y = y - this.height;
    this.texture.src = "assets/obstacle.png";
    this.texture.width = this.width;
    this.texture.height = this.height;
  }
}

// Sliding ground
export class Ground {
  width = 0;
  height = 0;
  coordinates = {
    x: 0,
    y: 0,
  };
  texture = new Image();

  constructor(x, y, width, height) {
    this.coordinates.x = x;
    this.coordinates.y = y;
    this.width = width;
    this.height = height;
    this.texture.src = "assets/ground.png";
    this.texture.width = this.width;
    this.texture.height = this.height;
  }
}
