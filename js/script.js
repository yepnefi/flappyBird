document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('gamecanvas');
    const context = canvas.getContext('2d');
    const bgImg = new Image(); // background image
    bgImg.src = "bgspace.png";
    const scrollSpeed = 2;
    let imgX = 0;
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

    // function checkCollision() {
    //     // Check if the bird has passed an obstacle pair
    //     if (bird.x > obstacles[0].x + obstacles[0].width && !obstacles[0].scored) {
    //         obstacles[0].scored = true; // Mark the obstacle as scored
    //         score++; // Increment the score
    //     }
    // }

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
    const gapHeight = 70; // Gap height between top and bottom obstacles
    let obstacleSpeed = 2; // Speed at which obstacles move from right to left

    // difficulty added by increasing obstacle speed
    // setInterval(() => {
    //     obstacleSpeed += 0.4
    // }, 3000)



    function spawnobstacles() {
        // if obstacle has moved offscreen set obstaclesSpawned to false
        if (obstacles[0].x + obstacles[0].width < 0) obstaclesSpawned = false;

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
                firstJump = true;
            }

            // jump
            bird.velocityY = bird.jumpStrength;
        }
    });

    function checkCollision() {
        obstacles.forEach((obstacle) => {
            if (
                bird.x + bird.width > obstacle.x &&
                bird.x < obstacle.x + obstacle.width &&
                bird.y + bird.height > obstacle.y &&
                bird.y < obstacle.y + obstacle.height
            ) {
                // Collision detected
                alert("test");
            }
        });
    }

    function updateBird() {
        // add gravity to the velocity
        bird.velocityY += bird.gravity;

        // Apply velocity to bird y position
        bird.y += bird.velocityY;

        // prevent bird from falling below canvas
        if (bird.y + bird.height > canvas.height) {
            bird.y = canvas.height - bird.height; // set bird to the bottom of canvas
            bird.velocityY = 0; // stop downward velocity
        }
        // prevent bird from going above the canvas
        if (bird.y < 0) {
            bird.y = 0; // Set bird to the top of the canvas
            bird.velocityY = 0; // stop the upward velocity
        }
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
            updateBird(); // draw new bird position
            spawnobstacles(); // spawn obstacles once first jump performed


            if (!increasingDifficulty) {
                // Start increasing difficulty every 5 seconds once the first jump is performed
                setInterval(() => {
                    obstacleSpeed += 0.3;
                }, 5000);
                increasingDifficulty = true;
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


        context.fillStyle = "blue"; // bird color
        context.fillRect(bird.x, bird.y, bird.width, bird.height); // draw bird

        // checkCollision();
        drawScore();
        requestAnimationFrame(gameloop); // adds animation for each frame + repeats the loop
    }

    gameloop(); // do the game
});