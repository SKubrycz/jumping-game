export class Game {
  c = document.getElementById("canvas");
  restart = document.getElementById("restart");
  restartButton = document.getElementById("restart-button");
  ctx = null; //c.getContext("2d");
  w = 0; // c.clientWidth;
  h = 0; // c.clientHeight;
  DEFAULT_GAME_HEIGHT = 0; // h - 50;
  DEFAULT_GAME_VELOCITY_X = 7;
  BACKGROUND_VELOCITY_X = 3;
  GRAVITY = 1;
  obstacleTimeout = null;
  isGenerated = false;
  isGameOver = false;
  gameScore = 0;
  SCORE_INTERVAL = 250; // ms
  scoreIntervalTimer = performance.now();

  player = null; // new Player(50, this.DEFAULT_GAME_HEIGHT);
  obstacles = [];
  grounds = [];
  backgrounds = []; // moving background tiles

  constructor(c) {
    this.c = c;
    this.ctx = this.c.getContext("2d");
    this.w = this.c.clientWidth;
    this.h = this.c.clientHeight;
    this.DEFAULT_GAME_HEIGHT = this.h - 50;
    this.player = new Player(50, this.DEFAULT_GAME_HEIGHT);
    this.restartButton.addEventListener("click", () => this.startGame());
  }

  jump(e) {
    if (!this.isGameOver) {
      if (e.code === "Space" && !this.player.isJumping) {
        this.player.velocityY = -20;
        this.player.isJumping = true;
      }
    } else {
      if (e.code === "Space") {
        this.startGame();
      }
    }
  }
  updatePlayerPosition() {
    if (!this.isGameOver && this.player.isJumping) {
      this.player.velocityY += this.GRAVITY;
      this.player.coordinates.y += this.player.velocityY;

      if (this.player.coordinates.y >= this.DEFAULT_GAME_HEIGHT) {
        this.player.coordinates.y =
          this.DEFAULT_GAME_HEIGHT - this.player.height;
        this.player.isJumping = false;
        this.player.velocityY = 0;
      }
    }
  }

  updateObstaclePosition() {
    if (!this.isGameOver && this.obstacles.length > 0) {
      for (let i = 0; i < this.obstacles.length; i++) {
        this.obstacles[i].coordinates.x -= this.DEFAULT_GAME_VELOCITY_X;
      }
    }
  }

  // Sliding ground texture
  updateGroundPosition() {
    if (!this.isGameOver && this.grounds.length > 0) {
      for (let i = 0; i < this.grounds.length; i++) {
        this.grounds[i].coordinates.x -= this.DEFAULT_GAME_VELOCITY_X;

        if (this.grounds[i].coordinates.x <= -this.grounds[i].width) {
          this.grounds[i].coordinates.x += 2 * this.w;
        }
      }
    }
  }

  updateBackgroundPosition() {
    const bgCount = this.backgrounds.length;

    if (!this.isGameOver && bgCount > 0) {
      for (let i = 0; i < bgCount; i++) {
        this.backgrounds[i].coordinates.x -= this.BACKGROUND_VELOCITY_X;

        if (this.backgrounds[i].coordinates.x <= -this.backgrounds[i].dWidth) {
          this.backgrounds[i].coordinates.x += this.w + this.w / 4;
        }
      }
    }
  }

  updateGameScore() {
    if (!this.isGameOver) {
      const now = performance.now();
      const diff = now - this.scoreIntervalTimer;

      if (diff >= this.SCORE_INTERVAL) {
        this.gameScore += 1;
        this.scoreIntervalTimer = performance.now();
      }
    }
  }

  checkCollision() {
    this.obstacles.forEach((obstacle) => {
      if (
        this.player.coordinates.x < obstacle.coordinates.x + obstacle.width &&
        this.player.coordinates.x + this.player.width >
          obstacle.coordinates.x &&
        this.player.coordinates.y < obstacle.coordinates.y + obstacle.height &&
        this.player.coordinates.y + this.player.height > obstacle.coordinates.y
      ) {
        this.stopGame();
      }
    });
  }

  generateObstacle() {
    if (!this.isGameOver && !this.isGenerated) {
      const notVisibleObstacle = this.obstacles.findIndex(
        (o) => o.coordinates.x < 0
      );
      if (notVisibleObstacle != -1) {
        this.isGenerated = true;
        const randomTime = Math.floor(Math.random() * 1000 * 2) + 500;
        this.obstacleTimeout = setTimeout(() => {
          this.obstacles[notVisibleObstacle].coordinates.x = this.w;
          this.isGenerated = false;
        }, randomTime);
      }
    }
  }

  prepareObstacles() {
    for (let i = 0; i < 2; i++) {
      this.obstacles.push(new Obstacle(this.w, this.DEFAULT_GAME_HEIGHT));
    }
  }

  prepareGround() {
    for (let i = 0; i < 2; i++) {
      this.grounds.push(
        new Ground(i * this.w, this.DEFAULT_GAME_HEIGHT, this.w, this.h)
      );
    }
  }

  prepareBackground() {
    for (let i = 0; i <= 4; i++) {
      this.backgrounds.push(
        new Background(
          (i * (this.w / 4)) % this.w,
          0,
          this.w / 4,
          100,
          i * (this.w / 4),
          this.DEFAULT_GAME_HEIGHT - 100,
          this.w / 4,
          100
        )
      );
    }
  }

  stopGame() {
    this.isGameOver = true;
    this.c.style.filter = `blur(2px) grayscale(90%)`;
    this.restart.style.display = `block`;
  }

  startGame() {
    this.isGameOver = false;
    this.c.style.filter = ``;
    this.restart.style.display = `none`;
    this.gameScore = 0;
    this.obstacles = [];
    this.prepareObstacles();
  }
}

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

// Sliding background {
export class Background {
  dWidth = 0;
  dWeight = 0;
  coordinates = {
    x: 0,
    y: 0,
  };
  texture = new Image();
  sliceCoordinates = {
    x: 0,
    y: 0,
  };
  sWidth = 0;
  sHeight = 0;

  constructor(sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
    this.coordinates.x = dx;
    this.coordinates.y = dy;
    this.dWidth = dWidth;
    this.dHeight = dHeight;
    this.texture.src = "assets/background_1.png";
    this.texture.width = this.dWidth;
    this.texture.height = this.dWeight;
    this.sliceCoordinates.x = sx;
    this.sliceCoordinates.y = sy;
    this.sWidth = sWidth;
    this.sHeight = sHeight;
  }
}
