// Access the canvas and set up the context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game variables
let gameState = "prison"; // Start in the prison game
let player = { x: 200, y: 450, width: 150, height: 150, dx: 0, dy: 0, onGround: false };
let gravity = 0.5;
let jumpStrength = -18;
let platforms = [];
let lessons = [
    { text: "True happiness comes from within.", correct: true },
    { text: "Money will make me happy.", correct: false },
    { text: "Power will bring me joy.", correct: false },
    { text: "Evil is powerless without goodness.", correct: true },
    { text: "The universe is governed by God.", correct: true }
];
let lessonDisplay = ""; // Text to display for lessons

// Background images
const playerImg = new Image();
playerImg.src = "old-man.png"; // Replace with your player sprite path
const prisonBackground = new Image();
prisonBackground.src = "prison.png"; // Replace with your prison background path
const mainBackground = new Image();
mainBackground.src = "sky.png"; // Replace with your main game background path
const ladyPhilosophyImg = new Image();
ladyPhilosophyImg.src = "lady.png"; // Use your "lady.png" image for Lady Philosophy

// Helper functions
function createPrisonPlatforms() {
    platforms = [
        { x: 150, y: 450, width: 100, height: 10, color: "#636262" },
        { x: 300, y: 300, width: 100, height: 10, color: "#636262" },
        { x: 200, y: 150, width: 150, height: 20, color: "#636262", isTop: true } // Top platform
    ];
    console.log("Prison platforms initialized.");
}

function createMainGamePlatforms() {
    platforms = [];
    for (let i = 0; i < 5; i++) {
        let correctIndex = Math.floor(Math.random() * 3); // One correct platform per level
        for (let j = 0; j < 3; j++) {
            platforms.push({
                x: 100 + j * 200,
                y: 500 - i * 150,
                width: 150,
                height: 20,
                color: j === correctIndex ? "green" : "red", // Green for correct, red for incorrect
                lesson: lessons[i % lessons.length].text,
                correct: j === correctIndex
            });
        }
    }
    console.log("Main game platforms created.");
}

function initializeMainGame() {
    console.log("Initializing main game...");
    createMainGamePlatforms(); // Create platforms for the main game
    player.x = 200; // Reset player position
    player.y = 400;
    player.dx = 0; // Reset horizontal velocity
    player.dy = 0; // Reset vertical velocity
    gameState = "main"; // Switch to main game state
}

// Draw functions
function drawTransitionScene() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(ladyPhilosophyImg, 50, canvas.height - 200, 150, 150);
    ctx.fillStyle = "lightyellow";
    ctx.fillRect(220, canvas.height - 120, canvas.width - 240, 100);

    ctx.fillStyle = "black";
    ctx.font = "bold 18px Arial";
    ctx.fillText("Lady Philosophy", 240, canvas.height - 95);

    ctx.font = "20px Arial";
    ctx.fillText("I will help you find true happiness.", 240, canvas.height - 65);
}

function drawPlayer() {
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}

function drawPlatforms() {
    platforms.forEach(platform => {
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
}

function drawBackground() {
    if (gameState === "prison") {
        ctx.drawImage(prisonBackground, 0, 0, canvas.width, canvas.height);
    } else if (gameState === "main") {
        ctx.drawImage(mainBackground, 0, 0, canvas.width, canvas.height);
    }
}

// Update functions
function updatePlayer() {
    player.dy += gravity;

    const platform = platforms.find(
        p =>
            player.x + player.width > p.x &&
            player.x < p.x + p.width &&
            player.y + player.height <= p.y &&
            player.y + player.height + player.dy >= p.y
    );

    if (platform) {
        player.dy = 0;
        player.y = platform.y - player.height;
        player.onGround = true;

        if (gameState === "prison" && platform.isTop) {
            console.log("Reached the top platform! Switching to transition scene.");
            gameState = "transition";
        }
    } else {
        player.onGround = false;
    }

    player.y += player.dy;
    player.x += player.dx;

    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.dy = 0;
        player.onGround = true;
    }
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameState === "prison") {
        drawBackground();
        drawPlatforms();
        drawPlayer();
        updatePlayer();
    } else if (gameState === "transition") {
        drawTransitionScene();
    } else if (gameState === "main") {
        drawBackground();
        drawPlatforms();
        drawPlayer();
    }

    requestAnimationFrame(gameLoop);
}

// Event listeners
document.addEventListener("keydown", event => {
    if (event.code === "ArrowLeft") {
        player.dx = -5;
    }
    if (event.code === "ArrowRight") {
        player.dx = 5;
    }
    if (event.code === "Space") {
        if (gameState === "transition") {
            initializeMainGame();
        } else if (player.onGround) {
            player.dy = jumpStrength;
        }
    }
});

document.addEventListener("keyup", event => {
    if (event.code === "ArrowLeft" || event.code === "ArrowRight") {
        player.dx = 0;
    }
});

// Initialize the game
createPrisonPlatforms();
gameLoop();
