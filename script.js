/* =====================================================
   JADEN NINJA RUN
===================================================== */


const menu = document.getElementById("menu");
const game = document.getElementById("game");
const pauseScreen = document.getElementById("pauseScreen");
const gameOver = document.getElementById("gameOver");
const victory = document.getElementById("victory");

const playButton = document.getElementById("playButton");
const restartButton = document.getElementById("restartButton");
const menuButton = document.getElementById("menuButton");

const pauseButton = document.getElementById("pauseButton");
const resumeButton = document.getElementById("resumeButton");
const pauseMenuButton = document.getElementById("pauseMenuButton");

const nextLevelButton =
    document.getElementById("nextLevelButton");

const player =
    document.getElementById("player");

const level =
    document.getElementById("level");

const scoreDisplay =
    document.getElementById("score");

const coinsDisplay =
    document.getElementById("coins");

const livesDisplay =
    document.getElementById("lives");

const finalScore =
    document.getElementById("finalScore");

const victoryScore =
    document.getElementById("victoryScore");

const newRecord =
    document.getElementById("newRecord");


/* =====================================================
   SKINS
===================================================== */

const skinButtons =
    document.querySelectorAll(".skin");

const skins = [
    "🥷",
    "🧙",
    "🤖"
];

let selectedSkin = 0;


skinButtons.forEach((button, index) => {

    button.addEventListener("click", () => {

        selectedSkin = index;

        skinButtons.forEach(item => {
            item.classList.remove("selected");
        });

        button.classList.add("selected");

        player.textContent =
            skins[selectedSkin];

    });

});


/* =====================================================
   ÉTAT
===================================================== */

let running = false;
let paused = false;

let score = 0;
let coins = 0;
let lives = 3;

let levelNumber = 1;

let speed = 5;

let worldX = 0;

let playerX = 18;
let playerY = 0;

let velocityY = 0;

let grounded = true;

let leftPressed = false;
let rightPressed = false;

let animationFrame;

let obstacleTimer;
let coinTimer;
let enemyTimer;


/* =====================================================
   PHYSIQUE
===================================================== */

const gravity = 0.85;
const jumpPower = 15;


/* =====================================================
   RECORD
===================================================== */

let bestScore =
    Number(localStorage.getItem(
        "jadenNinjaBest"
    ) || 0);


/* =====================================================
   DÉMARRER
===================================================== */

playButton.addEventListener(
    "click",
    startGame
);

restartButton.addEventListener(
    "click",
    startGame
);


function startGame() {

    menu.classList.add("hidden");

    gameOver.classList.add("hidden");

    victory.classList.add("hidden");

    pauseScreen.classList.add("hidden");

    game.classList.remove("hidden");


    resetGame();

    running = true;

    paused = false;

    createInitialLevel();

    startSpawning();

    animationFrame =
        requestAnimationFrame(gameLoop);

}


/* =====================================================
   RESET
===================================================== */

function resetGame() {

    score = 0;

    coins = 0;

    lives = 3;

    levelNumber = 1;

    speed = 5;

    worldX = 0;

    playerX = 18;

    playerY = 0;

    velocityY = 0;

    grounded = true;


    scoreDisplay.textContent =
        "00000";

    coinsDisplay.textContent =
        "0";

    livesDisplay.textContent =
        "3";


    player.textContent =
        skins[selectedSkin];


    clearLevel();


    level.style.width =
        "7000px";

}


/* =====================================================
   NETTOYAGE
===================================================== */

function clearLevel() {

    level.querySelectorAll(
        ".platform, .obstacle, .coin, .enemy, .flag"
    ).forEach(element => {

        element.remove();

    });

}


/* =====================================================
   PREMIER NIVEAU
===================================================== */

function createInitialLevel() {

    clearLevel();


    /*
       Chaque objet possède :

       x = position dans le niveau
       type = type d'objet
    */


    createPlatform(0, 1500);

    createPlatform(1650, 900);

    createPlatform(2700, 1300);

    createPlatform(4200, 800);

    createPlatform(5100, 1700);


    // Obstacles

    createObstacle(650, "rock");

    createObstacle(1000, "log");

    createObstacle(1250, "rock");

    createObstacle(1850, "log");

    createObstacle(2100, "rock");

    createObstacle(2900, "fire");

    createObstacle(3250, "rock");

    createObstacle(3500, "log");

    createObstacle(4400, "rock");

    createObstacle(4700, "fire");

    createObstacle(5450, "log");


    // Ennemis

    createEnemy(1450);

    createEnemy(2300);

    createEnemy(3800);

    createEnemy(4850);

    createEnemy(5800);


    // Pièces

    createCoinLine(450, 5);

    createCoinArc(800);

    createCoinLine(1150, 4);

    createCoinArc(1800);

    createCoinLine(2400, 5);

    createCoinArc(3000);

    createCoinLine(3650, 6);

    createCoinArc(4500);

    createCoinLine(5250, 7);


    // Arrivée

    createFlag(6500);

}


/* =====================================================
   PLATEFORME
===================================================== */

function createPlatform(x, width) {

    const platform =
        document.createElement("div");

    platform.className =
        "platform";

    platform.style.left =
        x + "px";

    platform.style.width =
        width + "px";

    level.appendChild(platform);

}


/* =====================================================
   OBSTACLE
===================================================== */

function createObstacle(x, type) {

    const obstacle =
        document.createElement("div");

    obstacle.className =
        "obstacle " + type;

    obstacle.dataset.x = x;

    obstacle.style.left =
        x + "px";

    level.appendChild(obstacle);

}


/* =====================================================
   ENNEMI
===================================================== */

function createEnemy(x) {

    const enemy =
        document.createElement("div");

    enemy.className =
        "enemy";

    enemy.dataset.x = x;

    enemy.style.left =
        x + "px";

    enemy.textContent =
        "👾";

    level.appendChild(enemy);

}


/* =====================================================
   PIÈCE
===================================================== */

function createCoin(x, y) {

    const coin =
        document.createElement("div");

    coin.className =
        "coin";

    coin.dataset.x = x;

    coin.dataset.y = y;

    coin.style.left =
        x + "px";

    coin.style.bottom =
        (45 + y) + "px";

    coin.textContent =
        "🪙";

    level.appendChild(coin);

}


/* =====================================================
   LIGNES DE PIÈCES
===================================================== */

function createCoinLine(startX, amount) {

    for (let i = 0; i < amount; i++) {

        createCoin(
            startX + i * 55,
            70
        );

    }

}


/* =====================================================
   ARC DE PIÈCES
===================================================== */

function createCoinArc(startX) {

    const heights = [
        70,
        110,
        145,
        110,
        70
    ];

    heights.forEach((height, index) => {

        createCoin(
            startX + index * 55,
            height
        );

    });

}


/* =====================================================
   DRAPEAU
===================================================== */

function createFlag(x) {

    const flag =
        document.createElement("div");

    flag.className =
        "flag";

    flag.dataset.x = x;

    flag.style.left =
        x + "px";

    level.appendChild(flag);

}


/* =====================================================
   SPAWN
===================================================== */

function startSpawning() {

    clearInterval(obstacleTimer);
    clearInterval(coinTimer);
    clearInterval(enemyTimer);


    /*
       Les éléments sont surtout préparés
       dans le niveau.

       Ces timers servent à augmenter
       progressivement le contenu.
    */

    obstacleTimer =
        setInterval(() => {

            if (!running || paused) return;

            const lastX =
                worldX + window.innerWidth + 400;

            const randomType =
                Math.random() > 0.5
                    ? "rock"
                    : "log";

            createObstacle(
                lastX,
                randomType
            );

        }, 2400);


    coinTimer =
        setInterval(() => {

            if (!running || paused) return;

            const x =
                worldX + window.innerWidth + 300;

            createCoin(
                x,
                80 + Math.random() * 80
            );

        }, 1800);


    enemyTimer =
        setInterval(() => {

            if (!running || paused) return;

            const x =
                worldX + window.innerWidth + 700;

            createEnemy(x);

        }, 5000);

}


/* =====================================================
   SAUT
===================================================== */

function jump() {

    if (!running || paused) return;

    if (!grounded) return;

    velocityY =
        jumpPower;

    grounded = false;

}


/* =====================================================
   CONTRÔLES
===================================================== */

function pressLeft(event) {

    event.preventDefault();

    leftPressed = true;

}

function releaseLeft(event) {

    event.preventDefault();

    leftPressed = false;

}


function pressRight(event) {

    event.preventDefault();

    rightPressed = true;

}

function releaseRight(event) {

    event.preventDefault();

    rightPressed = false;

}


/* Gauche */

const leftButton =
    document.getElementById(
        "leftButton"
    );

leftButton.addEventListener(
    "pointerdown",
    pressLeft
);

leftButton.addEventListener(
    "pointerup",
    releaseLeft
);

leftButton.addEventListener(
    "pointercancel",
    releaseLeft
);

leftButton.addEventListener(
    "pointerleave",
    releaseLeft
);


/* Droite */

const rightButton =
    document.getElementById(
        "rightButton"
    );

rightButton.addEventListener(
    "pointerdown",
    pressRight
);

rightButton.addEventListener(
    "pointerup",
    releaseRight
);

rightButton.addEventListener(
    "pointercancel",
    releaseRight
);

rightButton.addEventListener(
    "pointerleave",
    releaseRight
);


/* Saut */

const jumpButton =
    document.getElementById(
        "jumpButton"
    );

jumpButton.addEventListener(
    "pointerdown",
    event => {

        event.preventDefault();

        jump();

    }
);


/* =====================================================
   CLAVIER
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (event.code === "ArrowLeft") {

            leftPressed = true;

        }

        if (event.code === "ArrowRight") {

            rightPressed = true;

        }

        if (
            event.code === "Space" ||
            event.code === "ArrowUp"
        ) {

            jump();

        }

    }
);


document.addEventListener(
    "keyup",
    event => {

        if (event.code === "ArrowLeft") {

            leftPressed = false;

        }

        if (event.code === "ArrowRight") {

            rightPressed = false;

        }

    }
);


/* =====================================================
   COLLISION
===================================================== */

function collision(a, b) {

    const A =
        a.getBoundingClientRect();

    const B =
        b.getBoundingClientRect();


    const padding = 8;


    return !(
        A.right - padding < B.left ||
        A.left + padding > B.right ||
        A.bottom - padding < B.top ||
        A.top + padding > B.bottom
    );

}


/* =====================================================
   GAME LOOP
===================================================== */

function gameLoop() {

    if (!running) return;

    if (!paused) {

        updatePlayer();

        updateWorld();

        checkObjects();

        updateCamera();

        updateScore();

    }

    animationFrame =
        requestAnimationFrame(gameLoop);

}


/* =====================================================
   JOUEUR
===================================================== */

function updatePlayer() {

    if (leftPressed) {

        playerX -= 0.8;

    }

    if (rightPressed) {

        playerX += 0.8;

    }


    /*
       Le personnage avance
       automatiquement.
    */

    playerX += 0.18;


    playerX =
        Math.max(
            5,
            Math.min(
                45,
                playerX
            )
        );


    /* Gravité */

    velocityY -= gravity;

    playerY += velocityY;


    if (playerY <= 0) {

        playerY = 0;

        velocityY = 0;

        grounded = true;

    }


    player.style.left =
        playerX + "%";


    player.style.bottom =
        (playerY + 45) + "px";


    /*
       Petite animation de course
    */

    if (grounded) {

        const run =
            Math.sin(
                Date.now() / 90
            ) * 2;

        player.style.transform =
            `translateY(${run}px)`;

    } else {

        player.style.transform =
            "rotate(-8deg)";

    }

}


/* =====================================================
   CAMÉRA
===================================================== */

function updateCamera() {

    /*
       Le monde défile vers la gauche.
    */

    worldX += speed;

    level.style.transform =
        `translateX(${-worldX}px)`;


    /*
       Augmentation progressive
       de la difficulté.
    */

    speed += 0.00025;

}


/* =====================================================
   OBJETS
===================================================== */

function checkObjects() {

    const objects =
        level.querySelectorAll(
            ".obstacle, .enemy, .coin, .flag"
        );


    objects.forEach(object => {

        if (
            collision(
                player,
                object
            )
        ) {

            if (
                object.classList.contains(
                    "coin"
                )
            ) {

                collectCoin(object);

            }

            else if (
                object.classList.contains(
                    "flag"
                )
            ) {

                finishLevel();

            }

            else {

                hitEnemy(object);

            }

        }

    });

}


/* =====================================================
   PIÈCE
===================================================== */

function collectCoin(coin) {

    coins++;

    score += 100;

    coinsDisplay.textContent =
        coins;

    coin.remove();

}


/* =====================================================
   COLLISION OBSTACLE
===================================================== */

let invincible = false;

function hitEnemy(object) {

    if (invincible) return;

    invincible = true;

    lives--;

    livesDisplay.textContent =
        lives;


    /*
       Faire disparaître l'objet
       qui nous a touché.
    */

    object.remove();


    /*
       Petite période d'invincibilité.
    */

    player.style.opacity = "0.4";


    setTimeout(() => {

        invincible = false;

        player.style.opacity = "1";

    }, 1000);


    if (lives <= 0) {

        endGame();

    }

}


/* =====================================================
   SCORE
===================================================== */

function updateScore() {

    score += speed * 0.025;

    scoreDisplay.textContent =
        String(
            Math.floor(score)
        ).padStart(5, "0");

}


/* =====================================================
   FIN DU NIVEAU
===================================================== */

function finishLevel() {

    if (!running) return;

    running = false;


    clearInterval(obstacleTimer);
    clearInterval(coinTimer);
    clearInterval(enemyTimer);


    cancelAnimationFrame(
        animationFrame
    );


    victoryScore.textContent =
        Math.floor(score);


    game.classList.add("hidden");

    victory.classList.remove("hidden");

}


/* =====================================================
   GAME OVER
===================================================== */

function endGame() {

    if (!running) return;

    running = false;


    clearInterval(obstacleTimer);
    clearInterval(coinTimer);
    clearInterval(enemyTimer);


    cancelAnimationFrame(
        animationFrame
    );


    const final =
        Math.floor(score);


    finalScore.textContent =
        final;


    if (final > bestScore) {

        bestScore = final;

        localStorage.setItem(
            "jadenNinjaBest",
            bestScore
        );

        newRecord.textContent =
            "🏆 NOUVEAU RECORD !";

    } else {

        newRecord.textContent =
            `Meilleur score : ${bestScore}`;

    }


    game.classList.add("hidden");

    gameOver.classList.remove("hidden");

}


/* =====================================================
   PAUSE
===================================================== */

pauseButton.addEventListener(
    "click",
    () => {

        if (!running) return;

        paused = true;

        pauseScreen.classList.remove(
            "hidden"
        );

    }
);


resumeButton.addEventListener(
    "click",
    () => {

        paused = false;

        pauseScreen.classList.add(
            "hidden"
        );

    }
);


pauseMenuButton.addEventListener(
    "click",
    () => {

        paused = false;

        running = false;

        clearInterval(obstacleTimer);
        clearInterval(coinTimer);
        clearInterval(enemyTimer);

        cancelAnimationFrame(
            animationFrame
        );

        pauseScreen.classList.add(
            "hidden"
        );

        game.classList.add(
            "hidden"
        );

        menu.classList.remove(
            "hidden"
        );

    }
);


/* =====================================================
   MENU
===================================================== */

menuButton.addEventListener(
    "click",
    () => {

        gameOver.classList.add(
            "hidden"
        );

        game.classList.add(
            "hidden"
        );

        menu.classList.remove(
            "hidden"
        );

    }
);


/* =====================================================
   NIVEAU SUIVANT
===================================================== */

nextLevelButton.addEventListener(
    "click",
    () => {

        victory.classList.add(
            "hidden"
        );

        game.classList.remove(
            "hidden"
        );


        levelNumber++;

        speed += 1.5;

        running = true;

        paused = false;


        /*
           Pour l'instant, on recrée le niveau
           avec une difficulté supérieure.
        */

        createInitialLevel();

        worldX = 0;

        startSpawning();

        animationFrame =
            requestAnimationFrame(
                gameLoop
            );

    }
);
