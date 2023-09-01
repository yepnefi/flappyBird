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

        // update img width
        imgX -= scrollSpeed;

        // when the first image goes completely out of view to the left, reset its position
        if (imgX <= -canvas.height) {
            imgX = 0;
        }

        updateBird(); // draw new bird position

        context.fillStyle = "blue"; // bird color
        context.fillRect(bird.x, bird.y, bird.width, bird.height); // draw bird
        requestAnimationFrame(gameloop); // adds animation for each frame + repeats the loop
    }
   gameloop();
});