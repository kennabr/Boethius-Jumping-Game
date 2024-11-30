// Access the canvas and set up the context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game variables
let gameState = "prison"; // Start in the prison game
let player = { x: 200, y: 450, width: 150, height: 150, dx: 0, dy: 0, onGround: false };
let gravity = 0.5;
let jumpStrength = -18;
let cameraOffsetY = 0; // Used for scrolling in the main game
let platforms = [];
let lessons = [
    { text: "True happiness comes from within.", correct: true },
    { text: "Wealth will make me happy.", correct: false },
    { text: "Power will bring me joy.", correct: false },
    { text: "Evil is powerless without goodness.", correct: true },
    { text: "Fortune is unpredictable.", correct: true },
    { text: "Virtue is its own reward.", correct: true },
    { text: "Material goods bring happiness.", correct: false },
    { text: "Unity with God is key.", correct: true },
    { text: "Justice is necessary for happiness.", correct: true }
];

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
        { x: 50, y: 500, width: 120, height: 15, label: "Wealth will make me happy", correct: false, color: "white" },
        { x: 250, y: 400, width: 120, height: 15, label: "True happiness comes from within", correct: true, color: "white" },
        { x: 450, y: 300, width: 120, height: 15, label: "Power will bring me joy", correct: false, color: "white" },
        { x: 150, y: 200, width: 120, height: 15, label: "Fortune is unpredictable", correct: true, color: "white" },
        { x: 350, y: 100, width: 120, height: 15, label: "Virtue is its own reward", correct: true, color: "white" },
        { x: 550, y: 50, width: 120, height: 15, label: "Unity with God is key.", correct: true, color: "white" }
    ];
    console.log("Main game platforms created.");
}

function initializeMainGame() {
    console.log("Initializing main game...");
    createMainGamePlatforms();
    player.x = 200; // Reset player position
    player.y = canvas.height - player.height; // Place player at the bottom
    player.dx = 0; // Reset horizontal velocity
    player.dy = 0; // Reset vertical velocity
    player.onGround = true; // Ensure player starts on the ground
    cameraOffsetY = 0; // Reset camera offset
    gameState = "main"; // Switch to main game state
}

// Draw functions
function drawTransition1() {
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

function drawTransition2() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(ladyPhilosophyImg, 50, canvas.height - 200, 150, 150);
    ctx.fillStyle = "lightyellow";
    ctx.fillRect(220, canvas.height - 300, canvas.width - 240, 250);

    ctx.fillStyle = "black";
    ctx.font = "bold 18px Arial";
    ctx.fillText("Lady Philosophy", 240, canvas.height - 270);

    ctx.font = "16px Arial";
    ctx.fillText("Congratulations! You’ve learned about God and you have reached true happiness!", 240, canvas.height - 240);
    ctx.fillText("God and Happiness:", 240, canvas.height - 210);
    ctx.fillText("True happiness lies within, not in external circumstances;", 240, canvas.height - 190);
    ctx.fillText("worldly goods like wealth, power, and fame cannot bring lasting happiness.", 240, canvas.height - 170);
    ctx.fillText("The Nature of Fortune:", 240, canvas.height - 140);
    ctx.fillText("Fortune is temperamental and bestows good and bad fortune randomly.", 240, canvas.height - 120);
    ctx.fillText("To be happy, you must not place so much value in things governed by fortune.", 240, canvas.height - 100);
    ctx.fillText("What is Evil?", 240, canvas.height - 70);
    ctx.fillText("To be happy, one must not be evil, as evil strays from God’s goodness.", 240, canvas.height - 50);
}

function drawPlayer() {
    ctx.drawImage(playerImg, player.x, player.y - (gameState === "main" ? cameraOffsetY : 0), player.width, player.height);
}

function drawPlatformsForPrison() {
    platforms.forEach(platform => {
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
}

function drawPlatformsForMain() {
    platforms.forEach(platform => {
        ctx.fillStyle = platform.color || "white"; // Default to white
        ctx.fillRect(platform.x, platform.y - cameraOffsetY, platform.width, platform.height);

        // Draw label above platform
        ctx.fillStyle = "black";
        ctx.font = "bold 12px Arial";
        ctx.fillText(platform.label, platform.x + 5, platform.y - 5 - cameraOffsetY); // Label slightly above platform
    });
}

function drawBackground() {
    if (gameState === "prison") {
        ctx.drawImage(prisonBackground, 0, 0, canvas.width, canvas.height);
    } else if (gameState === "main") {
        ctx.fillStyle = "#ADD8E6"; // Light blue background
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(mainBackground, 0, -cameraOffsetY, canvas.width, canvas.height);
    }
}

// Update functions for prison
function updatePlayerForPrison() {
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
            gameState = "transition1";
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

// Update functions for main game
function updatePlayerForMainGame() {
    player.dy += gravity;
    player.y += player.dy;
    player.x += player.dx;

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

        if (platform.correct && platform.label === "Unity with God is key.") {
            gameState = "transition2";
        }
    } else {
        player.onGround = false;
    }

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
        drawPlatformsForPrison();
        drawPlayer();
        updatePlayerForPrison();
    } else if (gameState === "transition1") {
        drawTransition1();
    } else if (gameState === "main") {
        drawBackground();
        drawPlatformsForMain();
        drawPlayer();
        updatePlayerForMainGame();
    } else if (gameState === "transition2") {
        drawTransition2();
    }

    requestAnimationFrame(gameLoop);
}

// Event listeners
document.addEventListener("keydown", event => {
    if (event.code === "ArrowLeft") player.dx = -5;
    if (event.code === "ArrowRight") player.dx = 5;
    if (event.code === "Space") {
        if (gameState === "transition1") {
            initializeMainGame();
        } else if (player.onGround) {
            player.dy = jumpStrength;
        }
    }
});

document.addEventListener("keyup", event => {
    if (event.code === "ArrowLeft" || event.code === "ArrowRight") player.dx = 0;
});

// Initialize the game
createPrisonPlatforms();
gameLoop();


