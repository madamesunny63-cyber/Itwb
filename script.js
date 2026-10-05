document.addEventListener("DOMContentLoaded", function () {

    const menu = document.getElementById("menu");
    const game = document.getElementById("game");

    const startButton = document.getElementById("startButton");
    const restartButton = document.getElementById("restartButton");
    const menuButton = document.getElementById("menuButton");

    const gameOver = document.getElementById("gameOver");

    const player = document.getElementById("player");
    const world = document.getElementById("world");

    const scoreElement = document.getElementById("score");
    const livesElement = document.getElementById("lives");
    const coinsElement = document.getElementById("coins");

    const finalScoreElement =
        document.getElementById("finalScore");

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

    let playing = false;

    let score = 0;
    let coins = 0;
    let lives = 3;

    let playerY = 0;
    let velocityY = 0;

    let worldX = 0;

    let lastTime = 0;
    let animation = null;

    let invincible = false;

    const gravity = 0.55;
    const jumpPower = 11;
    const speed = 3.5;


    /* =========================
       SKINS
    ========================= */

    const skinButtons =
        document.querySelectorAll(".skin");

    skinButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            skinButtons.forEach(function (item) {
                item.classList.remove("selected");
            });

            button.classList.add("selected");

            const skin = button.dataset.skin;

            changeSkin(skin);
        });
    });


    function changeSkin(skin) {

        const body =
            document.querySelector(".player-body");

        const head =
            document.querySelector(".player-head");

        const scarf =
            document.querySelector(".player-scarf");


        if (!body || !head || !scarf) {
            return;
        }


        if (skin === "ninja") {

            body.style.background = "#28365d";
            head.style.background = "#d69a70";
            scarf.style.background = "#e24e4e";

        }


        if (skin === "shadow") {

            body.style.background = "#1b2030";
            head.style.background = "#888b96";
            scarf.style.background = "#713e80";

        }


        if (skin === "fire") {

            body.style.background = "#b7442e";
            head.style.background = "#d69a70";
            scarf.style.background = "#ffb52e";

        }
    }


    /* =========================
       DÉMARRER LE JEU
    ========================= */

    startButton.addEventListener("click", function () {

        startGame();

    });


    function startGame() {

        console.log("JADEN NINJA RUN : démarrage");

        menu.style.display = "none";

        game.style.display = "block";

        gameOver.style.display = "none";


        score = 0;
        coins = 0;
        lives = 3;

        playerY = 0;
        velocityY = 0;

        worldX = 0;

        invincible = false;


        scoreElement.textContent = "0";
        coinsElement.textContent = "0";
        livesElement.textContent = "3";


        world.style.transform =
            "translateX(0px)";


        player.style.left =
            "110px";


        player.style.bottom =
            "37%";


        player.style.opacity =
            "1";


        resetObjects();


        playing = true;

        lastTime = performance.now();


        cancelAnimationFrame(animation);


        animation =
            requestAnimationFrame(loop);
    }


    /* =========================
       REINITIALISER LES OBJETS
    ========================= */

    function resetObjects() {

        document
            .querySelectorAll(".coin")
            .forEach(function (coin) {

                coin.style.display = "block";

                coin.dataset.collected = "false";

            });


        document
            .querySelectorAll(".obstacle, .enemy")
            .forEach(function (object) {

                object.style.display = "block";

                object.dataset.hit = "false";

            });
    }


    /* =========================
       SAUT
    ========================= */

    function jump() {

        if (!playing) {
            return;
        }


        if (playerY <= 1) {

            velocityY = jumpPower;

        }
    }


    /* =========================
       BOUTONS
    ========================= */

    jumpButton.addEventListener(
        "click",
        function () {
            jump();
        }
    );


    leftButton.addEventListener(
        "click",
        function () {

            if (!playing) {
                return;
            }

            worldX += 30;

        }
    );


    rightButton.addEventListener(
        "click",
        function () {

            if (!playing) {
                return;
            }

            worldX -= 30;

        }
    );


    /* =========================
       TOUCHER / CLAVIER
    ========================= */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.code === "Space" ||
                event.code === "ArrowUp"
            ) {

                event.preventDefault();

                jump();
            }


            if (event.code === "ArrowLeft") {

                worldX += 30;

            }


            if (event.code === "ArrowRight") {

                worldX -= 30;

            }

        }
    );


    /* =========================
       BOUCLE DU JEU
    ========================= */

    function loop(time) {

        if (!playing) {
            return;
        }


        let delta =
            (time - lastTime) / 16.67;


        if (delta > 2) {
            delta = 2;
        }


        lastTime = time;


        /* Gravité */

        velocityY -=
            gravity * delta;


        playerY +=
            velocityY * delta;


        /* Sol */

        if (playerY < 0) {

            playerY = 0;

            velocityY = 0;

        }


        player.style.bottom =
            "calc(37% + " +
            playerY +
            "px)";


        /* Défilement automatique */

        worldX -=
            speed * delta;


        world.style.transform =
            "translateX(" +
            worldX +
            "px)";


        /* Score */

        score +=
            0.08 * delta;


        scoreElement.textContent =
            Math.floor(score);


        checkCoins();

        checkObstacles();

        checkFinish();


        animation =
            requestAnimationFrame(loop);
    }


    /* =========================
       COLLISION
    ========================= */

    function collision(element1, element2) {

        const a =
            element1.getBoundingClientRect();

        const b =
            element2.getBoundingClientRect();


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

        const coinsList =
            document.querySelectorAll(".coin");


        coinsList.forEach(function (coin) {

            if (
                coin.dataset.collected === "true"
            ) {
                return;
            }


            if (collision(player, coin)) {

                coin.dataset.collected =
                    "true";

                coin.style.display =
                    "none";

                coins++;

                score += 25;

                coinsElement.textContent =
                    coins;
            }

        });
    }


    /* =========================
       OBSTACLES
    ========================= */

    function checkObstacles() {

        if (invincible) {
            return;
        }


        const obstacles =
            document.querySelectorAll(
                ".obstacle, .enemy"
            );


        obstacles.forEach(function (object) {

            if (
                object.dataset.hit === "true"
            ) {
                return;
            }


            if (collision(player, object)) {

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

        livesElement.textContent =
            lives;


        if (lives <= 0) {

            endGame(false);

            return;
        }


        invincible = true;

        player.style.opacity =
            "0.35";


        setTimeout(function () {

            invincible = false;

            player.style.opacity =
                "1";

        }, 1000);
    }


    /* =========================
       ARRIVÉE
    ========================= */

    function checkFinish() {

        const finish =
            document.getElementById("finish");


        if (!finish) {
            return;
        }


        if (collision(player, finish)) {

            endGame(true);

        }
    }


    /* =========================
       FIN
    ========================= */

    function endGame(won) {

        if (!playing) {
            return;
        }


        playing = false;


        cancelAnimationFrame(animation);


        finalScoreElement.textContent =
            Math.floor(score);


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
       REJOUER
    ========================= */

    restartButton.addEventListener(
        "click",
        function () {

            startGame();

        }
    );


    /* =========================
       MENU
    ========================= */

    menuButton.addEventListener(
        "click",
        function () {

            playing = false;

            cancelAnimationFrame(animation);

            game.style.display = "none";

            gameOver.style.display = "none";

            menu.style.display = "block";

        }
    );


    console.log(
        "Jaden Ninja Run chargé correctement."
    );

});
