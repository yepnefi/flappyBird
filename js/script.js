document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('gamecanvas');
    const context = canvas.getContext('2d');
    const bgImg = new Image(); // background image
    bgImg.src = "bgspace.png";
    const scrollSpeed = 2;
    let imgX = 0;
    let firstJump = false;

    const bird = {
        x: canvas.width / 100, // starting x position
        y: canvas.height / 2.5, // starting y position
        width: 20, // width of bird
        height: 20, // height of bird
        velocityY: 0,  // Vertical velocity
        gravity: 0.2, // Gravity strength
        jumpStrength: -4, // Strength of the jump
    };


    const obstacles = []; // array to store obstacles
    const obstacleWidth = 30; // Width of the obstacles
    const gapHeight = 100; // Gap height between top and bottom obstacles
    const obstacleSpeed = 2; // Speed at which obstacles move from right to left

    function createObstacle() {
        const obstacle = {
            x: canvas.width, // Start the obstacle from the right side of the canvas
            topY: Math.random() * (canvas.height - gapHeight), // Random top obstacle position
            bottomY: Math.random() * (canvas.height - gapHeight) + gapHeight, // Calculate bottom obstacle position
        };
        obstacles.push(obstacle);
    }

    function updateObstacles() {
        for (let i = obstacles.length - 1; i >= 0; i--) {
            const obstacle = obstacles[i];
            obstacle.x -= obstacleSpeed; // Move obstacle to the left

            // Remove obstacles that have moved out of the canvas
            if (obstacle.x + obstacleWidth < 0) {
                obstacles.splice(i, 1);
            }
        }

        // Create new obstacles when needed
        if (obstacles.length < 2) {
            createObstacle();
        }
    }

    // jump when spacebar is hit
    document.addEventListener("keydown", (event) => {
        if (event.code === "Space") {
            if (!firstJump) {
                firstJump = true;
            }
            // on jump
            bird.velocityY = bird.jumpStrength;
        }
    });

    function updateBird() {
        // add gravity to the velocity
        bird.velocityY += bird.gravity;

        // Apply velocity after first jump
        if (firstJump) {
            bird.y += bird.velocityY;
        } else {
            bird.y = canvas.height / 2.5; // Bird stays in the middle before the first jump
        }
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

    function gameloop(){
        context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

        // draw bg img 1
        context.drawImage(bgImg, imgX, 0, canvas.width, canvas.height);

        // draw bg img 2
        context.drawImage(bgImg, imgX + canvas.width, 0, canvas.width, canvas.height);

        // update img width once first jump was performed
        if (firstJump) {
            imgX -= scrollSpeed;
        }

        // when the first image goes completely out of view to the left, reset its position
        if (imgX <= -canvas.height) {
            imgX = 0;
        }
        updateObstacles(); // Update and draw obstacles

        context.fillStyle = "green"; // Obstacle color
        for (const obstacle of obstacles) {
            // Draw top obstacle
            context.fillRect(obstacle.x, 0, obstacleWidth, obstacle.topY);
            // Draw bottom obstacle
            context.fillRect(obstacle.x, obstacle.bottomY, obstacleWidth, canvas.height - obstacle.bottomY);
        }

        updateBird(); // draw new bird position

        context.fillStyle = "blue"; // bird color
        context.fillRect(bird.x, bird.y, bird.width, bird.height); // draw bird
        requestAnimationFrame(gameloop); // adds animation for each frame + repeats the loop
    }
   gameloop();
});