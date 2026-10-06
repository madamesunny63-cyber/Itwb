// ========================================
// JADEN NINJA RUN
// ========================================

const menu = document.getElementById("menu");
const game = document.getElementById("game");
const gameOver = document.getElementById("gameOver");

const characters = document.querySelectorAll(".character");

const playButton = document.getElementById("playButton");
const jumpButton = document.getElementById("jumpButton");

const retryButton = document.getElementById("retryButton");
const menuButton = document.getElementById("menuButton");

const player = document.getElementById("player");
const obstacle = document.getElementById("obstacle");

const scoreText = document.getElementById("score");
const bestText = document.getElementById("best");
const finalScore = document.getElementById("finalScore");


// ========================================
// VARIABLES
// ========================================

let selectedCharacter = "ninja";

let playing = false;

let score = 0;
let best = Number(localStorage.getItem("jadenBest")) || 0;

let obstaclePosition = 0;

let speed = 7;

let lastTime = 0;

let nextObstacle = 1000;

let obstacleTimer = 0;


// Afficher le record
bestText.textContent = best;


// ========================================
// CHOIX DU NINJA
// ========================================

characters.forEach(character => {

    character.addEventListener("pointerdown", function(event) {

        event.preventDefault();

        // Retirer la sélection
        characters.forEach(c => {
            c.classList.remove("selected");
        });

        // Sélectionner celui touché
        character.classList.add("selected");

        selectedCharacter =
            character.dataset.character;

        console.log(
            "Ninja choisi :",
            selectedCharacter
        );

    });

});


// ========================================
// JOUER
// ========================================

playButton.addEventListener("pointerdown", function(event) {

    event.preventDefault();

    startGame();

});


// ========================================
// DEMARRER LE JEU
// ========================================

function startGame() {

    console.log("Jeu démarré");

    playing = true;

    score = 0;

    speed = 7;

    obstacleTimer = 0;

    nextObstacle = 1000;

    obstaclePosition =
        window.innerWidth + 100;

    scoreText.textContent = "0";

    menu.classList.add("hidden");

    game.classList.remove("hidden");

    gameOver.classList.add("hidden");

    player.classList.remove("jump");

    changePlayer();

    lastTime = performance.now();

    requestAnimationFrame(gameLoop);
}


// ========================================
// CHANGER LE PERSONNAGE
// ========================================

function changePlayer() {

    if (selectedCharacter === "ninja") {

        player.textContent = "🥷";

    }

    if (selectedCharacter === "shadow") {

        player.textContent = "👤";

    }

    if (selectedCharacter === "fire") {

        player.textContent = "🔥";

    }
}


// ========================================
// SAUT
// ========================================

function jump() {

    if (!playing) {
        return;
    }

    if (player.classList.contains("jump")) {
        return;
    }

    player.classList.add("jump");

    setTimeout(() => {

        player.classList.remove("jump");

    }, 650);
}


// ========================================
// BOUTON SAUT
// ========================================

jumpButton.addEventListener("pointerdown", function(event) {

    event.preventDefault();

    jump();

});


// ========================================
// CLAVIER
// ========================================

document.addEventListener("keydown", function(event) {

    if (
        event.code === "Space" ||
        event.code === "ArrowUp"
    ) {

        event.preventDefault();

        jump();
    }

});


// ========================================
// BOUCLE DU JEU
// ========================================

function gameLoop(time) {

    if (!playing) {
        return;
    }

    const delta = time - lastTime;

    lastTime = time;

    obstacleTimer += delta;


    // Déplacer obstacle

    obstaclePosition -=
        speed * (delta / 16.67);

    obstacle.style.left =
        obstaclePosition + "px";


    // Obstacle sorti de l'écran

    if (obstaclePosition < -100) {

        obstaclePosition =
            window.innerWidth +
            Math.random() * 400;

        obstacleTimer = 0;

        nextObstacle =
            700 + Math.random() * 1000;

    }


    // Score

    score += delta * 0.01;

    const currentScore =
        Math.floor(score);

    scoreText.textContent =
        currentScore;


    // Augmenter difficulté

    speed =
        Math.min(
            15,
            7 + currentScore * 0.02
        );


    // Collision

    if (collision()) {

        endGame();

        return;
    }


    requestAnimationFrame(gameLoop);
}


// ========================================
// COLLISION
// ========================================

function collision() {

    const p =
        player.getBoundingClientRect();

    const o =
        obstacle.getBoundingClientRect();

    const marge = 15;

    return (
        p.right - marge > o.left &&
        p.left + marge < o.right &&
        p.bottom - marge > o.top &&
        p.top + marge < o.bottom
    );
}


// ========================================
// GAME OVER
// ========================================

function endGame() {

    playing = false;

    const currentScore =
        Math.floor(score);

    finalScore.textContent =
        currentScore;


    if (currentScore > best) {

        best = currentScore;

        localStorage.setItem(
            "jadenBest",
            best
        );

        bestText.textContent =
            best;
    }


    gameOver.classList.remove("hidden");
}


// ========================================
// REJOUER
// ========================================

retryButton.addEventListener(
    "pointerdown",
    function(event) {

        event.preventDefault();

        startGame();

    }
);


// ========================================
// RETOUR MENU
// ========================================

menuButton.addEventListener(
    "pointerdown",
    function(event) {

        event.preventDefault();

        playing = false;

        game.classList.add("hidden");

        gameOver.classList.add("hidden");

        menu.classList.remove("hidden");

    }
);
