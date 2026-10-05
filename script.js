// ===============================
// ÉLÉMENTS
// ===============================

const menu = document.getElementById("menu");
const game = document.getElementById("game");
const gameOver = document.getElementById("gameOver");

const playButton = document.getElementById("playButton");
const restartButton = document.getElementById("restartButton");
const menuButton = document.getElementById("menuButton");

const jumpButton = document.getElementById("jumpButton");

const player = document.getElementById("player");
const gameArea = document.getElementById("gameArea");

const scoreDisplay = document.getElementById("score");
const coinsDisplay = document.getElementById("coins");
const bestDisplay = document.getElementById("best");
const finalScore = document.getElementById("finalScore");


// ===============================
// SKINS
// ===============================

const skins = document.querySelectorAll(".skin");

const skinList = [
    "🥷",
    "🧙",
    "👤"
];

let selectedSkin = 0;


skins.forEach((skin, index) => {

    skin.addEventListener("click", () => {

        selectedSkin = index;

        skins.forEach(s => {
            s.classList.remove("selected");
        });

        skin.classList.add("selected");

    });

});


// ===============================
// VARIABLES DU JEU
// ===============================

let score = 0;
let coins = 0;

let bestScore = 0;

let gameRunning = false;

let playerY = 0;

let velocityY = 0;

let gravity = 0.8;

let isJumping = false;

let gameSpeed = 5;

let obstacleTimer;
let coinTimer;
let gameLoop;


// ===============================
// RECORD
// ===============================

bestScore = Number(
    localStorage.getItem("jadenBestScore") || 0
);

bestDisplay.textContent = bestScore;


// ===============================
// DÉMARRER
// ===============================

playButton.addEventListener("click", startGame);

restartButton.addEventListener("click", startGame);

function startGame() {

    menu.classList.add("hidden");

    gameOver.classList.add("hidden");

    game.classList.remove("hidden");


    // Reset

    score = 0;

    coins = 0;

    gameSpeed = 5;

    playerY = 0;

    velocityY = 0;

    isJumping = false;

    gameRunning = true;


    scoreDisplay.textContent = score;

    coinsDisplay.textContent = coins;


    // Skin

    player.textContent = skinList[selectedSkin];


    // Supprimer anciens objets

    document.querySelectorAll(".obstacle").forEach(o => o.remove());

    document.querySelectorAll(".coin").forEach(c => c.remove());


    // Timers

    clearInterval(obstacleTimer);
    clearInterval(coinTimer);


    obstacleTimer = setInterval(
        createObstacle,
        1300
    );

    coinTimer = setInterval(
        createCoin,
        1600
    );


    cancelAnimationFrame(gameLoop);

    updateGame();

}


// ===============================
// SAUT
// ===============================

function jump() {

    if (!gameRunning) return;

    if (isJumping) return;


    isJumping = true;

    velocityY = 15;

}


// Bouton téléphone

jumpButton.addEventListener("pointerdown", (event) => {

    event.preventDefault();

    jump();

});


// Toucher directement l'écran

gameArea.addEventListener("pointerdown", (event) => {

    if (
        event.target === gameArea ||
        event.target === player
    ) {
        jump();
    }

});


// ===============================
// CLAVIER
// ===============================

document.addEventListener("keydown", (event) => {

    if (
        event.code === "Space" ||
        event.code === "ArrowUp"
    ) {

        event.preventDefault();

        jump();

    }

});


// ===============================
// BOUCLE PRINCIPALE
// ===============================

function updateGame() {

    if (!gameRunning) return;


    // Gravité

    velocityY -= gravity;

    playerY += velocityY;


    // Sol

    if (playerY <= 0) {

        playerY = 0;

        velocityY = 0;

        isJumping = false;

    }


    player.style.bottom =
        `calc(20% + ${playerY}px)`;


    // Déplacement objets

    moveObjects();


    // Score

    score += 0.03;

    scoreDisplay.textContent =
        Math.floor(score);


    // Difficulté

    gameSpeed += 0.0005;


    gameLoop =
        requestAnimationFrame(updateGame);

}


// ===============================
// OBSTACLE
// ===============================

function createObstacle() {

    if (!gameRunning) return;


    const obstacle =
        document.createElement("div");

    obstacle.className = "obstacle";


    obstacle.style.left =
        gameArea.offsetWidth + "px";


    gameArea.appendChild(obstacle);

}


// ===============================
// PIÈCE
// ===============================

function createCoin() {

    if (!gameRunning) return;


    const coin =
        document.createElement("div");

    coin.className = "coin";

    coin.textContent = "🪙";


    const height =
        Math.random() * 150 + 80;


    coin.style.bottom =
        `calc(20% + ${height}px)`;


    coin.style.left =
        gameArea.offsetWidth + "px";


    gameArea.appendChild(coin);

}


// ===============================
// DÉPLACER OBJETS
// ===============================

function moveObjects() {

    const objects =
        document.querySelectorAll(
            ".obstacle, .coin"
        );


    objects.forEach(object => {

        let x =
            parseFloat(object.style.left);


        x -= gameSpeed;


        object.style.left =
            x + "px";


        // Hors écran

        if (x < -100) {

            object.remove();

            return;

        }


        // Collision

        if (object.classList.contains("obstacle")) {

            if (checkCollision(player, object)) {

                endGame();

            }

        }


        // Pièce

        if (object.classList.contains("coin")) {

            if (checkCollision(player, object)) {

                coins++;

                score += 5;

                coinsDisplay.textContent =
                    coins;

                object.remove();

            }

        }

    });

}


// ===============================
// COLLISION
// ===============================

function checkCollision(a, b) {

    const rectA =
        a.getBoundingClientRect();

    const rectB =
        b.getBoundingClientRect();


    return !(
        rectA.right < rectB.left ||
        rectA.left > rectB.right ||
        rectA.bottom < rectB.top ||
        rectA.top > rectB.bottom
    );

}


// ===============================
// FIN DU JEU
// ===============================

function endGame() {

    if (!gameRunning) return;


    gameRunning = false;


    clearInterval(obstacleTimer);

    clearInterval(coinTimer);

    cancelAnimationFrame(gameLoop);


    const currentScore =
        Math.floor(score);


    finalScore.textContent =
        currentScore;


    // Record

    if (currentScore > bestScore) {

        bestScore = currentScore;

        localStorage.setItem(
            "jadenBestScore",
            bestScore
        );

        bestDisplay.textContent =
            bestScore;

    }


    game.classList.add("hidden");

    gameOver.classList.remove("hidden");

}


// ===============================
// RETOUR MENU
// ===============================

menuButton.addEventListener("click", () => {

    gameOver.classList.add("hidden");

    game.classList.add("hidden");

    menu.classList.remove("hidden");

});
