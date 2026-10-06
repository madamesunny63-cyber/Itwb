// ==============================
// NINJA RUN
// ==============================

const game = document.querySelector(".game");

const ninja = document.getElementById("ninja");
const obstacle = document.getElementById("obstacle");

const scoreElement = document.getElementById("score");
const bestElement = document.getElementById("best");

const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOver");

const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");

const jumpButton = document.getElementById("jumpButton");

const finalScore = document.getElementById("finalScore");

// ==============================
// VARIABLES
// ==============================

let playing = false;

let score = 0;
let best = Number(localStorage.getItem("ninjaBest")) || 0;

let obstacleX = 0;

let speed = 7;

let lastTime = 0;

let obstacleTimer = 0;

let nextObstacle = 1200;

// Afficher le record
bestElement.textContent = best;


// ==============================
// DEMARRER
// ==============================

function startGame() {

    playing = true;

    score = 0;

    speed = 7;

    obstacleX = game.clientWidth + 100;

    obstacleTimer = 0;

    nextObstacle = random(900, 1700);

    scoreElement.textContent = "0";

    startScreen.classList.add("hidden");
    gameOverScreen.classList.add("hidden");

    ninja.classList.add("running");

    lastTime = performance.now();

    requestAnimationFrame(gameLoop);
}


// ==============================
// SAUT
// ==============================

function jump() {

    if (!playing) {
        return;
    }

    if (ninja.classList.contains("jumping")) {
        return;
    }

    ninja.classList.remove("running");

    ninja.classList.add("jumping");

    setTimeout(() => {

        ninja.classList.remove("jumping");

        if (playing) {
            ninja.classList.add("running");
        }

    }, 650);
}


// ==============================
// BOUCLE PRINCIPALE
// ==============================

function gameLoop(time) {

    if (!playing) {
        return;
    }

    const delta = time - lastTime;

    lastTime = time;

    obstacleTimer += delta;

    // Faire apparaître un nouvel obstacle
    if (obstacleTimer >= nextObstacle) {

        obstacleTimer = 0;

        nextObstacle = random(900, 1700);

        obstacleX = game.clientWidth + 80;
    }

    // Déplacement
    obstacleX -= speed * (delta / 16.67);

    obstacle.style.left = obstacleX + "px";


    // Score
    score += delta * 0.01;

    const displayedScore = Math.floor(score);

    scoreElement.textContent = displayedScore;


    // Difficulté
    speed = 7 + displayedScore * 0.025;

    if (speed > 14) {
        speed = 14;
    }


    // Collision
    if (checkCollision()) {

        gameOver();

        return;
    }


    requestAnimationFrame(gameLoop);
}


// ==============================
// COLLISION
// ==============================

function checkCollision() {

    const ninjaRect = ninja.getBoundingClientRect();

    const obstacleRect = obstacle.getBoundingClientRect();

    // Petite marge pour rendre le jeu plus agréable
    const margin = 12;

    return (

        ninjaRect.right - margin > obstacleRect.left &&

        ninjaRect.left + margin < obstacleRect.right &&

        ninjaRect.bottom - margin > obstacleRect.top &&

        ninjaRect.top + margin < obstacleRect.bottom

    );
}


// ==============================
// GAME OVER
// ==============================

function gameOver() {

    playing = false;

    ninja.classList.remove("running");
    ninja.classList.remove("jumping");

    const currentScore = Math.floor(score);

    finalScore.textContent = currentScore;


    // Nouveau record
    if (currentScore > best) {

        best = currentScore;

        localStorage.setItem("ninjaBest", best);

        bestElement.textContent = best;
    }


    gameOverScreen.classList.remove("hidden");
}


// ==============================
// RECOMMENCER
// ==============================

function restartGame() {

    startGame();
}


// ==============================
// BOUTONS
// ==============================

startButton.addEventListener("click", startGame);

restartButton.addEventListener("click", restartGame);


// ==============================
// TELEPHONE
// ==============================

// Toucher le bouton
jumpButton.addEventListener(
    "touchstart",
    function(event) {

        event.preventDefault();

        jump();

    },
    {
        passive: false
    }
);


// Empêche certains navigateurs de déclencher
// un clic supplémentaire
jumpButton.addEventListener("click", function(event) {

    event.preventDefault();

    jump();

});


// ==============================
// CLAVIER PC
// ==============================

document.addEventListener("keydown", function(event) {

    if (
        event.code === "Space" ||
        event.code === "ArrowUp"
    ) {

        event.preventDefault();

        jump();
    }

});


// ==============================
// TOUCHER L'ÉCRAN
// ==============================

// Permet aussi de sauter en touchant
// une partie vide de l'écran.
game.addEventListener(
    "touchstart",
    function(event) {

        if (!playing) {
            return;
        }

        if (event.target === jumpButton) {
            return;
        }

        jump();

    },
    {
        passive: true
    }
);


// ==============================
// OUTILS
// ==============================

function random(min, max) {

    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;

}
