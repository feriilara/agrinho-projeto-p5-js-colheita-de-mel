let isPlaying = false;
let playButton, restartButton, howToPlayButton, backButton;
let bgColor;
let playerMan;
let honeyDrops = [];
let bees = [];
let score = 0;
let maxScore = 10;
let gamePhase = 1;
let showingHowToPlay = false;

let truck;
let cityX = 550;

function setup() {
  createCanvas(600, 400);
  bgColor = color(255, 223, 102);

  playButton = createButton('Iniciar');
  playButton.position(width / 2 - 60, height / 2 + 60);
  playButton.mousePressed(startGame);

  howToPlayButton = createButton('Como Jogar');
  howToPlayButton.position(width / 2 - 60, height / 2 + 100);
  howToPlayButton.mousePressed(showHowToPlay);

  backButton = createButton('Voltar');
  backButton.position(20, 20);
  backButton.mousePressed(backToIntro);
  backButton.hide();

  restartButton = createButton('Reiniciar');
  restartButton.position(width / 2 - 40, height / 2 + 90);
  restartButton.mousePressed(restartGame);
  restartButton.hide();

  for (let i = 0; i < 3; i++) {
    bees.push(new Bee(random(width), random(height), random(1, 3), random(-2, 2), random(-2, 2)));
  }

  playerMan = new PlayerMan(width / 2, height / 2);
}

function draw() {
  background(bgColor);

  if (!isPlaying) {
    if (showingHowToPlay) {
      displayHowToPlay();
    } else {
      displayIntroText();
    }
    return;
  }

  if (gamePhase === 1) {
    runPhaseOne();
  } else if (gamePhase === 2) {
    runPhaseTwo();
  }

  displayScore();
}

function displayIntroText() {
  textSize(32);
  textAlign(CENTER, CENTER);
  fill(0);
  text('Festejando a Conexão Campo e Cidade', width / 2, height / 2 - 50);
  textSize(16);
  fill(50);
  text('Clique para iniciar a Coleta de Mel', width / 2, height / 2 + 10);
  playButton.show();
  howToPlayButton.show();
}

function showHowToPlay() {
  showingHowToPlay = true;
  playButton.hide();
  howToPlayButton.hide();
  backButton.show();
}

function backToIntro() {
  showingHowToPlay = false;
  backButton.hide();
  playButton.show();
  howToPlayButton.show();
}

function displayHowToPlay() {
  background(240, 250, 255);
  textAlign(CENTER, TOP);
  fill(0);
  textSize(24);
  text('Como Jogar', width / 2, 40);
  textSize(16);
  text('- Use as setas ou W, A, S, D para se mover.', width / 2, 100);
  text('- Colete 10 gotas de mel evitando as abelhas.', width / 2, 140);
  text('- Depois, dirija o caminhão até o mercado.', width / 2, 180);
  text('- Use a seta para a direita ou tecla D para mover o caminhão.', width / 2, 220);
}

function runPhaseOne() {
  for (let bee of bees) {
    bee.update();
    bee.display();
  }

  playerMan.update();
  playerMan.display();

  if (score < maxScore && random(1) < 0.02) {
    honeyDrops.push(new HoneyDrop(random(width), random(height)));
  }

  for (let i = honeyDrops.length - 1; i >= 0; i--) {
    honeyDrops[i].display();
    if (playerMan.collects(honeyDrops[i])) {
      if (score < maxScore) {
        score++;
      }
      honeyDrops.splice(i, 1);
    }
  }

  for (let bee of bees) {
    if (playerMan.collidesWith(bee)) {
      gameOver();
    }
  }

  if (score >= maxScore) {
    startPhaseTwo();
  }
}

function runPhaseTwo() {
  background(200, 250, 255); // céu
  fill(100, 200, 100); // chão
  rect(0, height - 60, width, 60);

  drawMarket(cityX, height - 120);

  truck.update();
  truck.display();

  if (truck.x + truck.width > cityX + 40) {
    gameWon();
  }
}

function drawMarket(x, y) {
  fill(255, 100, 100);
  triangle(x, y, x + 20, y - 30, x + 40, y);
  fill(255);
  rect(x, y, 40, 60);

  fill(255, 204, 0);
  ellipse(x + 10, y + 20, 10, 10);
  fill(255, 100, 0);
  ellipse(x + 20, y + 20, 10, 10);
  fill(139, 69, 19);
  rect(x + 28, y + 18, 8, 6, 2);

  fill(0);
  textSize(12);
  textAlign(CENTER);
  text("MERCADO", x + 20, y - 40);
}

function displayScore() {
  textSize(24);
  textAlign(LEFT, TOP);
  fill(0);
  text('Pontuação: ' + score, 10, 10);
}

function startGame() {
  isPlaying = true;
  playButton.hide();
  howToPlayButton.hide();
  backButton.hide();
  restartButton.hide();
  score = 0;
  honeyDrops = [];
  gamePhase = 1;

  bees = [];
  for (let i = 0; i < 3; i++) {
    bees.push(new Bee(random(width), random(height), random(1, 3), random(-2, 2), random(-2, 2)));
  }

  playerMan = new PlayerMan(width / 2, height / 2);
  loop();
}

function startPhaseTwo() {
  gamePhase = 2;
  truck = new Truck(0, height - 100);
}

function gameWon() {
  textSize(32);
  textAlign(CENTER, CENTER);
  fill(0, 150, 0);
  text('Você entregou o mel com sucesso!', width / 2, height / 2);
  restartButton.show();
  noLoop();
}

function gameOver() {
  textSize(32);
  textAlign(CENTER, CENTER);
  fill(255, 0, 0);
  text('Game Over', width / 2, height / 2);
  textSize(16);
  fill(255);
  text('Pontuação Final: ' + score, width / 2, height / 2 + 40);
  restartButton.show();
  noLoop();
}

function restartGame() {
  score = 0;
  honeyDrops = [];
  bees = [];
  playerMan = new PlayerMan(width / 2, height / 2);
  startGame();
}

class PlayerMan {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 30;
    this.bodyWidth = 20;
    this.bodyHeight = 50;
    this.speed = 5;
  }

  update() {
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) this.x -= this.speed;
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) this.x += this.speed;
    if (keyIsDown(UP_ARROW) || keyIsDown(87)) this.y -= this.speed;
    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) this.y += this.speed;

    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
  }

  display() {
    fill(255, 224, 189);
    ellipse(this.x, this.y - this.bodyHeight / 2, this.size, this.size);
    fill(139, 69, 19);
    arc(this.x, this.y - this.bodyHeight / 2 - this.size / 2, this.size * 1.5, this.size / 2, PI, 0, CHORD);
    fill(255);
    rect(this.x - this.bodyWidth / 2, this.y - this.bodyHeight / 2, this.bodyWidth, this.bodyHeight);
    drawShirtPattern(this.x - this.bodyWidth / 2, this.y - this.bodyHeight / 2, this.bodyWidth, this.bodyHeight);
    fill(70, 130, 180);
    rect(this.x - this.bodyWidth / 4, this.y + this.bodyHeight / 2 - 5, this.bodyWidth / 2, 20);
    stroke(50);
    line(this.x - this.bodyWidth / 4, this.y + this.bodyHeight / 2 - 5, this.x - this.bodyWidth / 4, this.y + this.bodyHeight / 2 + 15);
    line(this.x + this.bodyWidth / 4, this.y + this.bodyHeight / 2 - 5, this.x + this.bodyWidth / 4, this.y + this.bodyHeight / 2 + 15);
    fill(139, 69, 19);
    rect(this.x - this.bodyWidth / 4, this.y + this.bodyHeight - 5, this.bodyWidth / 2, 10);
    rect(this.x + this.bodyWidth / 4 - this.bodyWidth / 2, this.y + this.bodyHeight - 5, this.bodyWidth / 2, 10);
    fill(255, 224, 189);
    rect(this.x - this.bodyWidth / 2 - 10, this.y - this.bodyHeight / 4, 10, 30);
    rect(this.x + this.bodyWidth / 2, this.y - this.bodyHeight / 4, 10, 30);
    fill(255, 0, 0);
    ellipse(this.x - this.bodyWidth / 2 - 10, this.y - this.bodyHeight / 4 + 30, 10, 10);
    ellipse(this.x + this.bodyWidth / 2 + 10, this.y - this.bodyHeight / 4 + 30, 10, 10);
    fill(0);
    ellipse(this.x - 7, this.y - this.bodyHeight / 2, 5, 5);
    ellipse(this.x + 7, this.y - this.bodyHeight / 2, 5, 5);
    fill(255, 0, 0);
    arc(this.x, this.y - this.bodyHeight / 2 + 5, 10, 5, 0, PI);
  }

  collects(honeyDrop) {
    let d = dist(this.x, this.y, honeyDrop.x, honeyDrop.y);
    return d < this.size / 2 + honeyDrop.size / 2;
  }

  collidesWith(otherBee) {
    let d = dist(this.x, this.y, otherBee.x, otherBee.y);
    return d < this.size / 2 + otherBee.size / 2;
  }
}

function drawShirtPattern(x, y, width, height) {
  stroke(0);
  strokeWeight(2);
  for (let i = 0; i < width; i += 10) {
    for (let j = 0; j < height; j += 10) {
      if ((i + j) % 20 == 0) {
        fill(200, 0, 0);
      } else {
        fill(0, 0, 200);
      }
      rect(x + i, y + j, 10, 10);
    }
  }
}

class HoneyDrop {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(12, 20);
    this.alpha = random(150, 200);
  }

  display() {
    let c1 = color(255, 204, 0, this.alpha);
    let c2 = color(255, 178, 0, this.alpha);
    let inter = lerpColor(c1, c2, 0.5);
    fill(inter);
    noStroke();
    beginShape();
    vertex(this.x, this.y);
    for (let i = 0; i < 6; i++) {
      let angle = map(i, 0, 6, 0, TWO_PI);
      let rad = this.size + random(-3, 3);
      let xOffset = cos(angle) * rad;
      let yOffset = sin(angle) * rad;
      vertex(this.x + xOffset, this.y + yOffset);
    }
    endShape(CLOSE);
    fill(255, 255, 255, 120);
    ellipse(this.x - this.size / 4, this.y - this.size / 4, this.size / 2, this.size / 3);
  }
}

class Bee {
  constructor(x, y, size, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speedX = speedX;
    this.speedY = speedY;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x > width) this.x = 0;
    if (this.x < 0) this.x = width;
    if (this.y > height) this.y = 0;
    if (this.y < 0) this.y = height;
  }

  display() {
    fill(255, 255, 0);
    ellipse(this.x, this.y, this.size, this.size / 1.5);
    fill(0);
    ellipse(this.x - 7, this.y, 10, 8);
    ellipse(this.x + 7, this.y, 10, 8);
    fill(255);
    ellipse(this.x - 10, this.y - 10, 20, 15);
    ellipse(this.x + 10, this.y - 10, 20, 15);
  }
}

class Truck {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 100;
    this.height = 40;
    this.speed = 3;
  }

  update() {
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
      this.x += this.speed;
    }
  }

  display() {
    fill(255, 200, 0);
    rect(this.x, this.y - 20, this.width - 30, this.height + 10);

    fill(100);
    rect(this.x + this.width - 30, this.y, 30, this.height);

    fill(0);
    ellipse(this.x + 15, this.y + this.height + 5, 20, 20);
    ellipse(this.x + this.width - 15, this.y + this.height + 5, 20, 20);

    fill(80, 50, 0);
    textSize(14);
    textAlign(CENTER);
    text("MEL", this.x + (this.width - 30) / 2, this.y);
  }
}
