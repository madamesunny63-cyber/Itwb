const menu = document.getElementById("menu");
const game = document.getElementById("game");

const startButton = document.getElementById("start");
const restartButton = document.getElementById("restart");

const world = document.getElementById("world");
const player = document.getElementById("player");
const playerImage = document.getElementById("playerImage");

const scoreElement = document.getElementById("score");
const livesElement = document.getElementById("lives");
const bestElement = document.getElementById("best");

const gameOver = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");
const gameOverTitle = document.getElementById("gameOverTitle");

const leftButton = document.getElementById("left");
const rightButton = document.getElementById("right");
const jumpButton = document.getElementById("jump");


/* =========================
   VARIABLES
========================= */

let selectedSkin = 0;

let playerX = 110;
let playerY = 0;

let velocityY = 0;

let cameraX = 0;

let score = 0;
let lives = 3;

let speed = 3.5;

let gameRunning = false;

let lastTime = 0;
let animationFrame;


/* =========================
   SKINS
========================= */

const skins = [
  "images/skin1.png",
  "images/skin2.png",
  "images/skin3.png"
];

document.querySelectorAll(".skin").forEach((button) => {

  button.addEventListener("click", () => {

    document.querySelectorAll(".skin").forEach((b) => {
      b.classList.remove("selected");
    });

    button.classList.add("selected");

    selectedSkin = Number(button.dataset.skin);

    playerImage.src = skins[selectedSkin];

  });

});


/* =========================
   MEILLEUR SCORE
========================= */

let bestScore = Number(localStorage.getItem("jadenBest") || 0);

bestElement.textContent = bestScore;


/* =========================
   DÉMARRER
========================= */

startButton.addEventListener("click", startGame);

restartButton.addEventListener("click", startGame);


function startGame() {

  menu.style.display = "none";
  game.style.display = "block";

  gameOver.style.display = "none";

  playerX = 110;
  playerY = 0;

  velocityY = 0;

  cameraX = 0;

  score = 0;
  lives = 3;

  speed = 3.5;

  scoreElement.textContent = score;
  livesElement.textContent = lives;

  world.style.transform = "translateX(0px)";

  gameRunning = true;

  lastTime = performance.now();

  cancelAnimationFrame(animationFrame);

  animationFrame = requestAnimationFrame(gameLoop);
}


/* =========================
   SAUT
========================= */

function jump() {

  if (!gameRunning) return;

  // On peut sauter uniquement depuis le sol
  if (playerY <= 1) {

    velocityY = 11;

  }

}


/* =========================
   DÉPLACEMENT
========================= */

function moveLeft() {

  if (!gameRunning) return;

  playerX -= 45;

  if (playerX < 60) {
    playerX = 60;
  }

}


function moveRight() {

  if (!gameRunning) return;

  playerX += 45;

  if (playerX > 180) {
    playerX = 180;
  }

}


/* =========================
   BOUTONS TACTILES
========================= */

jumpButton.addEventListener("pointerdown", (event) => {

  event.preventDefault();

  jump();

});


leftButton.addEventListener("pointerdown", (event) => {

  event.preventDefault();

  moveLeft();

});


rightButton.addEventListener("pointerdown", (event) => {

  event.preventDefault();

  moveRight();

});


/* =========================
   CLAVIER
========================= */

document.addEventListener("keydown", (event) => {

  if (event.code === "Space" || event.code === "ArrowUp") {

    event.preventDefault();

    jump();

  }

  if (event.code === "ArrowLeft") {

    moveLeft();

  }

  if (event.code === "ArrowRight") {

    moveRight();

  }

});


/* =========================
   COLLISION
========================= */

function collision(a, b) {

  return (

    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y

  );

}


/* =========================
   PERDRE UNE VIE
========================= */

function loseLife() {

  lives--;

  livesElement.textContent = lives;

  player.style.opacity = "0.4";

  setTimeout(() => {

    player.style.opacity = "1";

  }, 250);

  if (lives <= 0) {

    endGame(false);

  }

}


/* =========================
   FIN DU JEU
========================= */

function endGame(won) {

  gameRunning = false;

  cancelAnimationFrame(animationFrame);

  if (score > bestScore) {

    bestScore = score;

    localStorage.setItem("jadenBest", bestScore);

    bestElement.textContent = bestScore;

  }

  finalScore.textContent = score;

  if (won) {

    gameOverTitle.textContent = "🏁 VICTOIRE !";

  } else {

    gameOverTitle.textContent = "💥 GAME OVER";

  }

  gameOver.style.display = "flex";

}


/* =========================
   BOUCLE DU JEU
========================= */

function gameLoop(time) {

  if (!gameRunning) return;

  const delta = Math.min(
    2,
    (time - lastTime) / 16.67
  );

  lastTime = time;


  /* GRAVITÉ */

  velocityY -= 0.6 * delta;

  playerY += velocityY * delta;


  if (playerY < 0) {

    playerY = 0;

    velocityY = 0;

  }


  /* POSITION JOUEUR */

  player.style.left = playerX + "px";

  player.style.bottom =
    "calc(35% + " + playerY + "px)";


  /* CAMÉRA */

  cameraX -= speed * delta;

  world.style.transform =
    `translateX(${cameraX}px)`;


  /* COLLISIONS */

  checkObjects();


  /* SCORE */

  score += Math.floor(speed * delta / 10);

  scoreElement.textContent = score;


  /* DIFFICULTÉ */

  speed = Math.min(
    6.5,
    3.5 + score / 800
  );


  animationFrame =
    requestAnimationFrame(gameLoop);

}


/* =========================
   OBJETS
========================= */

function checkObjects() {

  const objects = document.querySelectorAll(
    ".obstacle, .enemy, .coin"
  );

  const gameArea =
    document.getElementById("gameArea");

  const areaHeight =
    gameArea.clientHeight;


  const playerRect = {

    x: playerX - cameraX,

    y:
      areaHeight -
      areaHeight * 0.35 -
      playerY -
      70,

    width: 45,

    height: 65

  };


  objects.forEach((object) => {

    if (
      object.dataset.hit === "true"
    ) {
      return;
    }


    const rect =
      object.getBoundingClientRect();

    const areaRect =
      gameArea.getBoundingClientRect();


    const objectRect = {

      x: rect.left - areaRect.left,

      y: rect.top - areaRect.top,

      width: rect.width,

      height: rect.height

    };


    if (
      collision(
        playerRect,
        objectRect
      )
    ) {


      /* COIN */

      if (
        object.classList.contains("coin")
      ) {

        object.dataset.hit = "true";

        object.style.display = "none";

        score += 25;

        scoreElement.textContent = score;

      }


      /* OBSTACLE / ENNEMI */

      else {

        object.dataset.hit = "true";

        object.style.display = "none";

        loseLife();

      }

    }

  });


  /* ARRIVÉE */

  const finish =
    document.getElementById("finish");

  const finishRect =
    finish.getBoundingClientRect();

  const areaRect =
    gameArea.getBoundingClientRect();


  const finishX =
    finishRect.left -
    areaRect.left;


  if (
    finishX > 0 &&
    finishX < 180
  ) {

    endGame(true);

  }

}
