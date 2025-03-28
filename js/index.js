document.addEventListener("DOMContentLoaded", function () { const gameContainer = document.getElementById("game-container"); let activeSlot = null; let score = 0; let misses = 0; let gameInterval; let intervalTime = 2000; let difficultyIncreased = false;

const allImage = "https://raw.githubusercontent.com/khalography/Succinct-Game/main/asset/all.png";
const flappyImage = "https://raw.githubusercontent.com/khalography/Succinct-Game/main/asset/Flappy.png";
const crisisImage = "https://raw.githubusercontent.com/khalography/Succinct-Game/main/asset/Crisis.png";

function createBoard() {
    gameContainer.innerHTML = `
        <h1>Succinct</h1>
        <p>Score: <span id="score">0</span> | Misses Left: <span id="misses">5</span></p>
        <div id="game-board">
            ${Array.from({ length: 9 }, (_, i) => `<div class="slot" data-key="${i + 1}"></div>`).join('')}
        </div>
        <button id="restart-btn" style="display: none;">Restart Game</button>
    `;

    document.querySelectorAll(".slot").forEach(slot => {
        slot.style.backgroundImage = `url('${allImage}')`;
        slot.style.backgroundSize = "cover";
        slot.addEventListener("click", () => hitStar(slot));
    });

    document.getElementById("restart-btn").addEventListener("click", restartGame);
}

function getRandomSlot() {
    const slots = document.querySelectorAll(".slot");
    return slots[Math.floor(Math.random() * slots.length)];
}

function showStar() {
    if (activeSlot) {
        activeSlot.style.backgroundImage = `url('${allImage}')`;
    }

    activeSlot = getRandomSlot();
    activeSlot.style.backgroundImage = `url('${flappyImage}')`;

    setTimeout(() => {
        if (activeSlot.style.backgroundImage.includes(flappyImage)) {
            activeSlot.style.backgroundImage = `url('${allImage}')`;
            misses++;
            document.getElementById("misses").textContent = 5 - misses;
            checkGameOver();
        }
    }, intervalTime);
}

function hitStar(slot) {
    if (slot === activeSlot && slot.style.backgroundImage.includes(flappyImage)) {
        slot.style.backgroundImage = `url('${crisisImage}')`;
        score++;
        document.getElementById("score").textContent = score;

        if (score >= 20 && !difficultyIncreased) {
            intervalTime = 1800;
            difficultyIncreased = true;
        }
        if (score % 5 === 0 && score >= 20) {
            intervalTime = Math.max(500, intervalTime - 200);
        }
        
        setTimeout(showStar, 500);
    }
}

function checkGameOver() {
    if (misses >= 5) {
        clearInterval(gameInterval);
        gameContainer.innerHTML = `
            <h1>Game Over</h1>
            <p>Your Score: ${score}</p>
            <button id="restart-btn">Restart Game</button>
        `;
        document.getElementById("restart-btn").addEventListener("click", restartGame);
    }
}

function restartGame() {
    score = 0;
    misses = 0;
    intervalTime = 2000;
    difficultyIncreased = false;
    createBoard();
    gameInterval = setInterval(showStar, intervalTime);
}

createBoard();
gameInterval = setInterval(showStar, intervalTime);

document.addEventListener("keydown", (event) => {
    const key = parseInt(event.key);
    if (key >= 1 && key <= 9) {
        hitStar(document.querySelector(`.slot[data-key="${key}"]`));
    }
});

});

