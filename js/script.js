document.addEventListener("DOMContentLoaded", () => {
    // Get the canvas element and its 2D drawing context
    const canvas = document.getElementById('gamecanvas');
    const context = canvas.getContext('2d');

    // background image
    const bgImg = new Image();
    bgImg.src = "bgspace.png";

    // Background scrolling speed
    const scrollSpeed = 2;

    // Initial position of the background image
    let imgX = 0;

    // Flags to track game state
    let firstJump = false; // flag to track first jump
    let obstaclesSpawned = false; // flag to track if obstacles are on screen
    let score = 0; // initialize score
    let increasingDifficulty = false; // flag to track if difficulty is increasing

    const bird = {
        x: canvas.width / 100, // starting x position
        y: canvas.height / 2.5, // starting y position
        width: 20, // width of bird
        height: 20, // height of bird
        velocityY: 0,  // Vertical velocity
        gravity: 0.2, // Gravity strength
        jumpStrength: -4, // Strength of the jump
    };

    // Function to draw the score on the canvas
    function drawScore() {
        context.fillStyle = "white";
        context.font = "20px Arial";
        context.fillText("Score: " + score, 10, 30);
    }

    // array that stores obstacle objects
    const obstacles = [
        {
            width: 30,
            height: 0,
            y: 0,
            x: canvas.width,
        },
        {
            width: 30,
            height: 0,
            y: 0,
            x: canvas.width,
        }
    ];

    // Gap height between top and bottom obstacles
    const gapHeight = 70;

    // Speed at which obstacles move from right to left
    let obstacleSpeed= 0;

    function spawnobstacles() {
        // if obstacle has moved offscreen set obstaclesSpawned to false
        if (obstacles[0].x + obstacles[0].width < 0) {
            obstaclesSpawned = false;
            score++;
        }


        // if obstacles are already on screen, don't draw new ones
        if (obstaclesSpawned === true) return;
        obstacles[0].x = canvas.width;
        obstacles[1].x = canvas.width;
        obstacles[0].y = 0;
        obstacles[0].height = Math.random() * (canvas.height - gapHeight);
        obstacles[1].y = obstacles[0].height + gapHeight;
        obstacles[1].height = canvas.height + obstacles[1].y;
        obstaclesSpawned = true;
    }

    // jump when spacebar is hit
    document.addEventListener("keydown", (event) => {
        if (event.code === "Space") {
            if (!firstJump) {
                // sets firstJump flag to true
                firstJump = true;
            }

            // make the bird jump
            bird.velocityY = bird.jumpStrength;
        }
    });

    function lose() {
        score = 0; // reset score
        firstJump = false; // reset firstJump state

        obstacles.forEach(obstacle => {
            obstacle.x = canvas.width
        });

        bird.x = canvas.width / 100;
        bird.y = canvas.height / 2.5;
        obstacleSpeed = 0;
        clearInterval(increasingDifficulty);
    }

    function checkCollision() {
        obstacles.forEach((obstacle) => {
            if (
                bird.x + bird.width > obstacle.x &&
                bird.x < obstacle.x + obstacle.width &&
                bird.y + bird.height > obstacle.y &&
                bird.y < obstacle.y + obstacle.height ||
                bird.y + bird.height > canvas.height ||
                bird.y < 0
            ) {
                // Collision detected
                lose();
            }
        });
    }

    function updateBird() {
        // add gravity to the velocity
        bird.velocityY += bird.gravity;

        // Apply velocity to bird y position
        bird.y += bird.velocityY;
    }

    function gameloop() {
        context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

        // draw bg img 1
        context.drawImage(bgImg, imgX, 0, canvas.width, canvas.height);

        // draw bg img 2
        context.drawImage(bgImg, imgX + canvas.width, 0, canvas.width, canvas.height);

        // do this once first jump was performed
        if (firstJump) {
            imgX -= scrollSpeed; // movement of background image
            obstacleSpeed = 2;

            updateBird(); // draw new bird position
            spawnobstacles(); // spawn obstacles once first jump performed


            if (!increasingDifficulty) {
                // Start increasing difficulty every 5 seconds once the first jump is performed
                increasingDifficulty = setInterval(() => {
                    obstacleSpeed += 0.3;
                }, 5000);
            }
        }

        // collision detection
        checkCollision();

        // when the first image goes completely out of view to the left, reset its position
        if (imgX <= -canvas.height) {
            imgX = 0;
        }

        context.fillStyle = "green"; // Obstacle color
        obstacles.forEach(obstacle => {
            context.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            obstacle.x -= obstacleSpeed;
        });

        drawScore();

        context.fillStyle = "blue"; // bird color
        context.fillRect(bird.x, bird.y, bird.width, bird.height); // draw bird

        requestAnimationFrame(gameloop); // adds animation for each frame + repeats the loop
    }

    gameloop(); // start the game loop
});