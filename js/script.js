document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('gamecanvas');
    const context = canvas.getContext('2d');

    const bird = {
        x: canvas.width / 100, // starting x position
        y: canvas.height / 2.5, // starting y position
        width: 20, // width of bird
        height: 20, // height of bird
        velocityY: 0,  // Vertical velocity
        gravity: 0.3, // Gravity strength
        jumpStrength: -4, // Strength of the jump
    }

    function gameloop(){
        context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

        context.fillStyle = "blue";
        context.fillRect(bird.x, bird.y, bird.width, bird.height);
        requestAnimationFrame(gameloop); // Repeat the loop
    }
   gameloop();
});