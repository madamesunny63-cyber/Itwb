"use strict";


/* =========================
   ELEMENTS
========================= */

const menu = document.getElementById("menu");

const game = document.getElementById("game");

const startButton =
    document.getElementById("startButton");

const restartButton =
    document.getElementById("restartButton");

const menuButton =
    document.getElementById("menuButton");

const gameArea =
    document.getElementById("gameArea");

const world =
    document.getElementById("world");

const player =
    document.getElementById("player");

const scoreElement =
    document.getElementById("score");

const livesElement =
    document.getElementById("lives");

const coinsElement =
    document.getElementById("coins");

const finalScoreElement =
    document.getElementById("finalScore");

const gameOver =
    document.getElementById("gameOver");

const gameOverTitle =
    document.getElementById("gameOverTitle");

const jumpButton =
    document.getElementById("jumpButton");

const leftButton =
    document.getElementById("leftButton");

const rightButton =
    document.getElementById("rightButton");


/* =========================
   VARIABLES
========================= */

let selectedSkin = "ninja";

let running = false;

let animationFrame = 0;

let previousTime = 0;


/*
    Position verticale du joueur.
    0 = sol.
*/

let playerY = 0;

let velocityY = 0;


/*
    Position du monde.
    Plus la valeur est négative,
    plus le niveau défile vers la gauche.
*/

let worldX = 0;


/*
    Vitesse du niveau.
*/

let speed = 3.5;


/*
    Score.
*/

let score = 0;

let coins = 0;

let lives = 3;


/*
    Empêche de perdre plusieurs vies
    immédiatement.
*/

let invincible = false;


/* =========================
   CONSTANTES
========================= */

const GRAVITY = 0.58;

const JUMP_FORCE = 11.5;

const PLAYER_X = 110;

const GROUND_PERCENT = 37;


/* =========================
   SKINS
========================= */

document
    .querySelectorAll(".skin")
    .forEach(button => {

        button.addEventListener("click", () => {

            document
                .querySelectorAll(".skin")
                .forEach(item => {

                    item.classList.remove("selected");

                });


            button.classList.add("selected");


            selectedSkin =
                button.dataset.skin;


            applySkin();

        });

    });


function applySkin() {

    const body =
        document.querySelector(".player-body");

    const head =
        document.querySelector(".player-head");

    const scarf =
        document.querySelector(".player-scarf");


    if (selectedSkin === "ninja") {

        body.style.background = "#28365d";

        head.style.background = "#d69a70";

        scarf.style.background = "#e24e4e";

    }


    if (selectedSkin === "shadow") {

        body.style.background = "#1b2030";

        head.style.background = "#8d909c";

        scarf.style.background = "#713e80";

    }


    if (selectedSkin === "fire") {

        body.style.background = "#b7442e";

        head.style.background = "#d69a70";

        scarf.style.background = "#ffb52e";

    }

}


/* =========================
   MENU -> JEU
========================= */

startButton.addEventListener(
    "click",
    startGame
);


restartButton.addEventListener(
    "click",
    startGame
);


menuButton.addEventListener(
    "click",
    returnToMenu
);


function startGame() {

    menu.style.display = "none";

    game.style.display = "block";

    gameOver.style.display = "none";


    /*
        Réinitialisation.
    */

    playerY = 0;

    velocityY = 0;

    worldX = 0;

    speed = 3.5;

    score = 0;

    coins = 0;

    lives = 3;

    invincible = false;


    /*
        Remet les objets du niveau.
    */

    resetObjects();


    /*
        HUD.
    */

    updateHUD();


    /*
        Position initiale.
    */

    player.style.left =
        PLAYER_X + "px";

    updatePlayerPosition();


    world.style.transform =
        "translate3d(0, 0, 0)";


    applySkin();


    running = true;

    previousTime =
        performance.now();


    cancelAnimationFrame(
        animationFrame
    );


    animationFrame =
        requestAnimationFrame(gameLoop);

}


/* =========================
   RETOUR MENU
========================= */

function returnToMenu() {

    running = false;

    cancelAnimationFrame(
        animationFrame
    );

    game.style.display = "none";

    gameOver.style.display = "none";

    menu.style.display = "block";

}


/* =========================
   RESET OBJETS
========================= */

function resetObjects() {

    document
        .querySelectorAll(".coin")
        .forEach(coin => {

            coin.style.display = "block";

            delete coin.dataset.collected;

        });


    document
        .querySelectorAll(".obstacle, .enemy")
        .forEach(object => {

            object.style.display = "block";

            delete object.dataset.hit;

        });

}


/* =========================
   SAUT
========================= */

function jump() {

    if (!running) {
        return;
    }


    /*
        Le joueur doit être au sol.
    */

    if (playerY <= 0.5) {

        playerY = 1;

        velocityY =
            JUMP_FORCE;

    }

}


/* =========================
   DÉPLACEMENT
========================= */

function moveLeft() {

    if (!running) {
        return;
    }


    /*
        Ces boutons modifient légèrement
        la position du ninja.
    */

    const current =
        parseFloat(
            player.style.left
        ) || PLAYER_X;


    const next =
        Math.max(
            65,
            current - 35
        );


    player.style.left =
        next + "px";

}


function moveRight() {

    if (!running) {
        return;
    }


    const current =
        parseFloat(
            player.style.left
        ) || PLAYER_X;


    const next =
        Math.min(
            180,
            current + 35
        );


    player.style.left =
        next + "px";

}


/* =========================
   COMMANDES TACTILES
========================= */

jumpButton.addEventListener(
    "pointerdown",
    event => {

        event.preventDefault();

        jump();

    }
);


leftButton.addEventListener(
    "pointerdown",
    event => {

        event.preventDefault();

        moveLeft();

    }
);


rightButton.addEventListener(
    "pointerdown",
    event => {

        event.preventDefault();

        moveRight();

    }
);


/* =========================
   CLAVIER
========================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.code === "Space" ||
            event.code === "ArrowUp"
        ) {

            event.preventDefault();

            jump();

        }


        if (
            event.code === "ArrowLeft"
        ) {

            moveLeft();

        }


        if (
            event.code === "ArrowRight"
        ) {

            moveRight();

        }

    }
);


/* =========================
   BOUCLE PRINCIPALE
========================= */

function gameLoop(currentTime) {

    if (!running) {
        return;
    }


    /*
        Temps écoulé.
    */

    const delta =
        Math.min(
            2,
            (currentTime - previousTime) /
            16.67
        );


    previousTime =
        currentTime;


    /* =====================
       GRAVITÉ
    ===================== */

    velocityY -=
        GRAVITY * delta;


    playerY +=
        velocityY * delta;


    /*
        Sol.
    */

    if (playerY < 0) {

        playerY = 0;

        velocityY = 0;

    }


    updatePlayerPosition();


    /* =====================
       DÉFILEMENT
    ===================== */

    worldX -=
        speed * delta;


    world.style.transform =
        `translate3d(${worldX}px, 0, 0)`;


    /* =====================
       COLLISIONS
    ===================== */

    checkCoins();

    checkDanger();

    checkFinish();


    /* =====================
       SCORE
    ===================== */

    score +=
        speed * delta * 0.08;


    /*
        Augmente doucement la difficulté.
    */

    speed =
        Math.min(
            7,
            3.5 + score / 1000
        );


    updateHUD();


    animationFrame =
        requestAnimationFrame(
            gameLoop
        );

}


/* =========================
   POSITION JOUEUR
========================= */

function updatePlayerPosition() {

    player.style.bottom =
        `calc(${GROUND_PERCENT}% + ${playerY}px)`;

}


/* =========================
   RECTANGLE DU JOUEUR
========================= */

function getPlayerRect() {

    const areaRect =
        gameArea.getBoundingClientRect();


    const playerRect =
        player.getBoundingClientRect();


    return {

        left:
            playerRect.left -
            areaRect.left,

        right:
            playerRect.right -
            areaRect.left,

        top:
            playerRect.top -
            areaRect.top,

        bottom:
            playerRect.bottom -
            areaRect.top,

        width:
            playerRect.width,

        height:
            playerRect.height

    };

}


/* =========================
   RECTANGLE OBJET
========================= */

function getObjectRect(object) {

    const areaRect =
        gameArea.getBoundingClientRect();


    const rect =
        object.getBoundingClientRect();


    return {

        left:
            rect.left -
            areaRect.left,

        right:
            rect.right -
            areaRect.left,

        top:
            rect.top -
            areaRect.top,

        bottom:
            rect.bottom -
            areaRect.top,

        width:
            rect.width,

        height:
            rect.height

    };

}


/* =========================
   COLLISION
========================= */

function isColliding(a, b) {

    return (

        a.left < b.right &&
        a.right > b.left &&
        a.top < b.bottom &&
        a.bottom > b.top

    );

}


/* =========================
   PIÈCES
========================= */

function checkCoins() {

    const playerRect =
        getPlayerRect();


    const coinsElements =
        document.querySelectorAll(
            ".coin"
        );


    coinsElements.forEach(coin => {

        if (
            coin.dataset.collected === "true"
        ) {
            return;
        }


        const coinRect =
            getObjectRect(coin);


        if (
            isColliding(
                playerRect,
                coinRect
            )
        ) {

            coin.dataset.collected =
                "true";

            coin.style.display =
                "none";


            coins++;

            score += 25;

            updateHUD();

        }

    });

}


/* =========================
   OBSTACLES / ENNEMIS
========================= */

function checkDanger() {

    if (invincible) {
        return;
    }


    const playerRect =
        getPlayerRect();


    const dangers =
        document.querySelectorAll(
            ".obstacle, .enemy"
        );


    dangers.forEach(object => {

        if (
            object.dataset.hit === "true"
        ) {
            return;
        }


        const objectRect =
            getObjectRect(object);


        if (
            isColliding(
                playerRect,
                objectRect
            )
        ) {

            object.dataset.hit =
                "true";


            loseLife();

        }

    });

}


/* =========================
   PERDRE UNE VIE
========================= */

function loseLife() {

    if (invincible) {
        return;
    }


    lives--;


    updateHUD();


    /*
        Petite période d'invincibilité
        pour éviter de perdre les 3 vies
        instantanément.
    */

    invincible = true;


    player.style.opacity = "0.35";


    setTimeout(() => {

        player.style.opacity = "1";

        invincible = false;

    }, 900);


    if (lives <= 0) {

        endGame(false);

    }

}


/* =========================
   ARRIVÉE
========================= */

function checkFinish() {

    const finish =
        document.getElementById(
            "finish"
        );


    const finishRect =
        getObjectRect(finish);


    const playerRect =
        getPlayerRect();


    if (
        isColliding(
            playerRect,
            finishRect
        )
    ) {

        endGame(true);

    }

}


/* =========================
   FIN DU JEU
========================= */

function endGame(won) {

    if (!running) {
        return;
    }


    running = false;


    cancelAnimationFrame(
        animationFrame
    );


    const finalScore =
        Math.floor(score);


    finalScoreElement.textContent =
        finalScore;


    if (won) {

        gameOverTitle.textContent =
            "🏆 VICTOIRE !";

    } else {

        gameOverTitle.textContent =
            "💥 GAME OVER";

    }


    gameOver.style.display =
        "flex";

}


/* =========================
   HUD
========================= */

function updateHUD() {

    scoreElement.textContent =
        Math.floor(score);

    livesElement.textContent =
        lives;

    coinsElement.textContent =
        coins;

       }
