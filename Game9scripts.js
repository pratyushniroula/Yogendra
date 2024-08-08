class Vector {
    constructor(x = 0, y = 0) {
      this.x = x;
      this.y = y;
    }
  
    get len() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }
  
    set len(value) {
      const fact = value / this.len;
      this.x *= fact;
      this.y *= fact;
    }
  }
  
  class Rectangle {
    constructor(width, height) {
      this.position = new Vector();
      this.size = new Vector(width, height);
    }
  
    get left() {
      return this.position.x - this.size.x / 2;
    }
  
    get right() {
      return this.position.x + this.size.x / 2;
    }
  
    get top() {
      return this.position.y - this.size.y / 2;
    }
  
    get bottom() {
      return this.position.y + this.size.y / 2;
    }
  }
  
  class Ball extends Rectangle {
    constructor() {
      super(10, 10);
      this.velocity = new Vector();
    }
  }
  
  class Player extends Rectangle {
    constructor() {
      super(15, 120);
      this.score = 0;
      this.velocity = new Vector();
    }
  }
  
  class Particle {
    constructor(x, y, color) {
      this.position = new Vector(x, y);
      this.velocity = new Vector(Math.random() * 2 - 1, Math.random() * 2 - 1);
      this.color = color;
      this.size = Math.random() * 2 + 2;
      this.lifetime = Math.random() * 30 + 30;
    }
  
    update() {
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
      this.lifetime--;
    }
  
    draw(context) {
      context.fillStyle = this.color;
      context.beginPath();
      context.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI);
      context.fill();
    }
  }
  
  class ParticleSystem {
    constructor() {
      this.particles = [];
    }
  
    createParticles(x, y, count, color) {
      for (let i = 0; i < count; i++) {
        this.particles.push(new Particle(x, y, color));
      }
    }
  
    update() {
      this.particles = this.particles.filter(particle => particle.lifetime > 0);
      this.particles.forEach(particle => particle.update());
    }
  
    draw(context) {
      this.particles.forEach(particle => particle.draw(context));
    }
  }
  
  class Pong {
    constructor(canvas) {
      this._canvas = canvas;
      this._context = this._canvas.getContext('2d');
  
      this.ball = new Ball();
      this.reset();
  
      this.players = [
        new Player(),
        new Player()
      ];
  
      this.charPixel = 10;
      this.chars = [
        '111101101101111',
        '010010010010010',
        '111001111100111',
        '111001111001111',
        '101101111001001',
        '111100111001111',
        '111100111101111',
        '111001001001001',
        '111101111101111',
        '111101111001111',
      ].map(number => {
        const canvas = document.createElement('canvas');
        canvas.width = this.charPixel * 3;
        canvas.height = this.charPixel * 5;
  
        const context = canvas.getContext('2d');
        context.fillStyle = '#E74C3C';
  
        number.split('').forEach((fill, i) => {
          if (fill === '1') {
            context.fillRect(
              (i % 3) * this.charPixel,
              (i / 3 | 0) * this.charPixel,
              this.charPixel,
              this.charPixel
            );
          }
        });
        return canvas;
      });
  
      const boardToLimitSpace = 20;
      this.players[0].position.x = boardToLimitSpace;
      this.players[1].position.x = this._canvas.width - boardToLimitSpace;
      this.players[0].position.y = this._canvas.height / 2;
      this.players[1].position.y = this._canvas.height / 2;
  
      this.showStartText = true;
      this.isPaused = false;
      this.isAI = true; // Start with AI opponent
      this.gameOver = false;
      this.winner = null;
  
      this.particleSystem = new ParticleSystem();
  
      let lastTime = 0;
      const callback = time => {
        if (time && !this.isPaused) {
          this.update((time - lastTime) / 1000);
        }
        lastTime = time;
        requestAnimationFrame(callback);
      };
      callback(0);
  
      this._canvas.addEventListener('keydown', event => {
        if (event.keyCode === 40) { this.players[1].velocity.y = 400; } // Down arrow
        if (event.keyCode === 38) { this.players[1].velocity.y = -400; } // Up arrow
        if (event.keyCode === 87) { this.players[0].velocity.y = -400; } // W key
        if (event.keyCode === 83) { this.players[0].velocity.y = 400; }  // S key
        if (event.keyCode === 32) { this.start(); } // Spacebar
        if (event.keyCode === 16) { this.togglePause(); } // Shift key
        if (event.keyCode === 81) { this.toggleOpponent(); } // Q key (toggle opponent)
      });
  
      this._canvas.addEventListener('keyup', event => {
        if (event.keyCode === 40 || event.keyCode === 38) {
          this.players[1].velocity.y = 0;
        }
        if (event.keyCode === 87 || event.keyCode === 83) {
          this.players[0].velocity.y = 0;
        }
      });
  
      document.addEventListener('keydown', event => {
        if (event.key === 'r' || event.key === 'R') {
          if (this.gameOver) {
            this.restart();
          } else {
            history.go(); // Reload the page only if the game is not over
          }
        }
      });
    }
  
    reset() {
      this.ball.position.x = this._canvas.width / 2;
      this.ball.position.y = this._canvas.height / 2;
      this.ball.velocity.x = 0;
      this.ball.velocity.y = 0;
    }
  
    start() {
      if (this.ball.velocity.x === 0 && this.ball.velocity.y === 0) {
        const angle = (5 + 2 * Math.random()) / 4 * Math.PI;
        const vx = 200 * Math.cos(angle - Math.PI / 2) * (Math.random() > 0.5 ? 1 : -1);
        const vy = 200 * Math.sin(angle - Math.PI / 2) * (Math.random() > 0.5 ? 1 : -1);
        this.ball.velocity = new Vector(vx, vy);
        this.showStartText = false;
      }
    }
  
    togglePause() {
      this.isPaused = !this.isPaused;
    }
  
    toggleOpponent() {
      this.isAI = !this.isAI;
      if (this.isAI) {
        this.players[0].velocity.y = 0;
      }
    }
  
    drawRect(rect, color = "#fff") {
      this._context.fillStyle = color;
      this._context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
    }
  
    collide() {
      this.players.forEach(player => {
        if (player.left < this.ball.right && player.right > this.ball.left &&
          player.top < this.ball.bottom && player.bottom > this.ball.top) {
          this.ball.velocity.x = -this.ball.velocity.x;
          this.ball.velocity.len *= 1.10;
          this.particleSystem.createParticles(this.ball.position.x, this.ball.position.y, 20, '#698219');
        }
      });
    }
  
    drawScore() {
      this._context.fillStyle = "#E74C3C";
      const align = this._canvas.width / 3;
      const characterWidth = this.charPixel * 4;
  
      this.players.forEach((player, playerIndex) => {
        const scoreChars = player.score.toString().split('');
        const offset = align * (playerIndex + 1) - (characterWidth * scoreChars.length / 2) + (this.charPixel / 2);
  
        scoreChars.forEach((char, charIndex) => {
          this._context.drawImage(
            this.chars[char],
            offset + charIndex * characterWidth,
            20
          );
        });
      });
    }
  
    drawMiddleLine() {
      this._context.beginPath();
      this._context.setLineDash([5, 20]);
      this._context.moveTo(this._canvas.width / 2, 0);
      this._context.lineTo(this._canvas.width / 2, this._canvas.height);
      this._context.closePath();
      this._context.strokeStyle = '#fff';
      this._context.stroke();
    }
  
    drawStartText() {
      this._context.fillStyle = "#ffdbdb";
      this._context.font = "30px Arial";
      this._context.textAlign = "center";
      this._context.fillText("Pong", this._canvas.width / 2, this._canvas.height / 2 - 30);
      this._context.fillText("press any key to start", this._canvas.width / 2, this._canvas.height / 2);
    }
  
    drawStatusBox() {
      const statusBoxHeight = 30;
      this._context.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this._context.fillRect(0, this._canvas.height - statusBoxHeight, this._canvas.width, statusBoxHeight);
      this._context.fillStyle = '#fff';
      this._context.font = '20px Arial';
      this._context.textAlign = 'left';
      this._context.fillText(this.isPaused ? 'Paused' : `Opponent: ${this.isAI ? 'AI' : 'Player'}`, 10, this._canvas.height - 10);
    }
  
    drawEndScreen() {
      this._context.fillStyle = "rgba(0, 0, 0, 0.75)";
      this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
  
      this._context.fillStyle = "#fff";
      this._context.font = "48px Arial";
      this._context.textAlign = "center";
      this._context.fillText(`Player ${this.winner + 1} Wins!`, this._canvas.width / 2, this._canvas.height / 2 - 50);
  
      this._context.font = "24px Arial";
      this._context.fillText("Press 'R' to restart", this._canvas.width / 2, this._canvas.height / 2 + 50);
    }
  
    update(dt) {
      if (this.gameOver) {
        return;
      }
  
      this.ball.position.x += this.ball.velocity.x * dt;
      this.ball.position.y += this.ball.velocity.y * dt;
  
      if (this.ball.left < 0 || this.ball.right > this._canvas.width) {
        const playerId = this.ball.velocity.x < 0 ? 1 : 0;
        this.players[playerId].score++;
        this.reset();
  
        if (this.players[playerId].score >= 10) {
          this.gameOver = true;
          this.winner = playerId;
        }
      }
  
      if (this.ball.top < 0 || this.ball.bottom > this._canvas.height) {
        this.ball.velocity.y = -this.ball.velocity.y;
        this.particleSystem.createParticles(this.ball.position.x, this.ball.position.y, 10, '#681b6e');
      }
  
      this.players[1].position.y += this.players[1].velocity.y * dt;
  
      if (this.isAI) {
        const diff = this.ball.position.y - this.players[0].position.y;
        const aiSpeed = 8; // you can change the difficulty
        if (Math.abs(diff) > 10) {
          this.players[0].position.y += aiSpeed * (diff < 0 ? -1 : 1);
        }
      } else {
        this.players[0].position.y += this.players[0].velocity.y * dt;
      }
  
      this.players.forEach(player => {
        if (player.top < 0) {
          player.position.y = player.size.y / 2;
        } else if (player.bottom > this._canvas.height) {
          player.position.y = this._canvas.height - player.size.y / 2;
        }
      });
  
      this.collide();
      this.particleSystem.update();
      this.draw();
    }
  
    draw() {
      this._context.fillStyle = '#23303d'; // Updated background color
      this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
  
      this.drawMiddleLine();
      this.drawScore();
      this.drawRect(this.ball, '#fff'); // Ball color
      this.players.forEach(player => this.drawRect(player, '#eef5df')); // Paddle color
      this.particleSystem.draw(this._context);
  
      if (this.showStartText) {
        this.drawStartText();
      }
  
      if (this.isPaused) {
        this.drawPauseText();
      }
  
      this.drawStatusBox();
  
      if (this.gameOver) {
        this.drawEndScreen();
      }
    }
  
    restart() {
      this.players.forEach(player => player.score = 0);
      this.gameOver = false;
      this.winner = null;
      this.reset();
      this.showStartText = true;
    }
  }
  
  const canvas = document.getElementById('pong');
  const pong = new Pong(canvas);
  canvas.focus();