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
let cameraOffsetY = 0; // Used to simulate upward progression

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
    platforms = [
        { x: 100, y: 400, width: 150, height: 20, label: "Wealth will make me happy", correct: false, color: "white" },
        { x: 300, y: 300, width: 150, height: 20, label: "True happiness comes from within", correct: true, color: "white" },
        { x: 500, y: 200, width: 150, height: 20, label: "Power will bring me joy", correct: false, color: "white" }
    ];
    console.log("Initial main game platforms created:", platforms);
}

function addNewPlatforms() {
    const baseY = Math.min(...platforms.map(p => p.y)) - 200; // Find the highest platform and add 200px above it
    const newPlatforms = [
        { x: 150, y: baseY, width: 150, height: 20, label: "Fortune is unpredictable", correct: true, color: "white" },
        { x: 300, y: baseY - 100, width: 150, height: 20, label: "Evil is powerless without goodness", correct: true, color: "white" },
        { x: 450, y: baseY - 200, width: 150, height: 20, label: "Power will bring me joy", correct: false, color: "white" }
    ];
    platforms.push(...newPlatforms);
    console.log("New platforms added:", newPlatforms);
}

function initializeMainGame() {
    console.log("Initializing main game...");
    createMainGamePlatforms(); // Create platforms for the main game
    player.x = 200; // Reset player position
    player.y = 400;
    player.dx = 0; // Reset horizontal velocity
    player.dy = 0; // Reset vertical velocity
    player.onGround = true; // Ensure player starts on the ground
    cameraOffsetY = 0; // Reset camera offset
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
    ctx.drawImage(playerImg, player.x, player.y - cameraOffsetY, player.width, player.height);
}

function drawPlatformsForPrison() {
    platforms.forEach(platform => {
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
}

function drawPlatformsForMain() {
    platforms.forEach(platform => {
        // Draw platform
        ctx.fillStyle = platform.color || "white"; // Default to white
        ctx.fillRect(platform.x, platform.y - cameraOffsetY, platform.width, platform.height);

        // Draw label above platform
        ctx.fillStyle = "black";
        ctx.font = "bold 16px Arial";
        ctx.fillText(platform.label, platform.x + 10, platform.y - 10 - cameraOffsetY); // Label slightly above platform
    });
}

function drawBackground() {
    if (gameState === "prison") {
        ctx.drawImage(prisonBackground, 0, 0, canvas.width, canvas.height);
    } else if (gameState === "main") {
        ctx.drawImage(mainBackground, 0, -cameraOffsetY, canvas.width, canvas.height);
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

function updatePlayerForMainGame() {
    player.dy += gravity; // Apply gravity
    player.y += player.dy; // Update vertical position
    player.x += player.dx; // Update horizontal position

    // Update camera offset
    if (player.y < canvas.height / 2) {
        cameraOffsetY = canvas.height / 2 - player.y;
    }

    // Prevent the player from moving out of bounds
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

    // Check for platform collisions
    const platform = platforms.find(
        p =>
            player.x + player.width > p.x && // Player's right side overlaps platform
            player.x < p.x + p.width && // Player's left side overlaps platform
            player.y + player.height <= p.y && // Player is above platform
            player.y + player.height + player.dy >= p.y // Player is falling onto platform
    );

    if (platform) {
        player.dy = 0; // Stop falling
        player.y = platform.y - player.height; // Place player on top of platform
        player.onGround = true;

        if (platform.correct && platform.color === "white") {
            platform.color = "green"; // Turn correct platform green
            addNewPlatforms(); // Add new platforms
        } else if (!platform.correct) {
            platform.color = "red"; // Turn incorrect platform red
            setTimeout(() => {
                platforms = platforms.filter(p => p !== platform); // Remove incorrect platform
            }, 500); // Remove platform after a short delay
        }
    } else {
        player.onGround = false; // Player is in the air
    }

    // If the player falls to the ground
    if (player.y + player.height >= canvas.height) {
        player.dy = 0;
        player.y = canvas.height - player.height; // Reset to ground
        player.onGround = true;
    }
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameState === "prison") {
        drawBackground();
        drawPlatformsForPrison();
        drawPlayer();
        updatePlayer();
    } else if (gameState === "transition") {
        drawTransitionScene();
    } else if (gameState === "main") {
        drawBackground();
        drawPlatformsForMain(); // Draw platforms for main game
        drawPlayer();
        updatePlayerForMainGame(); // Use updated player logic for the main game
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
