document.addEventListener("DOMContentLoaded", function () {
    const gameContainer = document.getElementById("game-container");
    let activeSlot = null;
    let score = 0;
    let misses = 0;
    let gameInterval;
    let gameSpeed = 5000;
    let shouldCountMisses = false;

    const allImage = "https://raw.githubusercontent.com/khalography/Succinct-Game/main/asset/all.png";
    const flappyImage = "https://raw.githubusercontent.com/khalography/Succinct-Game/main/asset/Flappy.png";
    const crisisImage = "https://raw.githubusercontent.com/khalography/Succinct-Game/main/asset/Crisis.png";

    function createBoard() {
        gameContainer.innerHTML = `
            <h1>Succinct</h1>
            <p>Score: <span id="score">0</span> | Misses Left: <span id="misses">20</span></p>
            <div id="game-board">
                <div class="slot" data-key="1"></div>
                <div class="slot" data-key="2"></div>
                <div class="slot" data-key="3"></div>
                <div class="slot" data-key="4"></div>
                <div class="slot" data-key="5"></div>
                <div class="slot" data-key="6"></div>
                <div class="slot" data-key="7"></div>
                <div class="slot" data-key="8"></div>
                <div class="slot" data-key="9"></div>
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

        // Wait for 5 seconds, then randomize again
        setTimeout(() => {
            if (activeSlot && activeSlot.style.backgroundImage.includes(flappyImage)) {
                activeSlot.style.backgroundImage = `url('${allImage}')`;

                if (shouldCountMisses) {
                    misses++;
                    document.getElementById("misses").innerText = 20 - misses;
                    checkGameOver();
                }

                // Show new random star
                showStar();
            }
        }, 5000);
    }

    function hitStar(slot) {
        if (slot === activeSlot && slot.style.backgroundImage.includes(flappyImage)) {
            slot.style.backgroundImage = `url('${crisisImage}')`;
            score++;
            document.getElementById("score").innerText = score;

            if (score >= 1) {
                shouldCountMisses = true; 
            }

            // Increase difficulty every 20 points
            if (score % 20 === 0) {
                gameSpeed = Math.max(800, gameSpeed * 0.9); 
            }

            // Show new star immediately
            setTimeout(showStar, 1000);
        }
    }

    function checkGameOver() {
        if (misses >= 20) {
            gameContainer.innerHTML = `
                <h1>Game Over</h1>
                <h1>Your Score: ${score}</h1>
                <button id="restart-btn">Restart Game</button>
            `;
            document.getElementById("restart-btn").addEventListener("click", restartGame);
        }
    }

    function restartGame() {
        score = 0;
        misses = 0;
        gameSpeed = 5000; 
        shouldCountMisses = false;
        createBoard();
        showStar();
    }

    createBoard();
    showStar(); 

    document.addEventListener("keydown", (event) => {
        const key = parseInt(event.key);
        if (key >= 1 && key <= 9) {
            hitStar(document.querySelector(`.slot[data-key="${key}"]`));
        }
    });
});
