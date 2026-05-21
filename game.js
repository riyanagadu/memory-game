const board = document.getElementById("gameBoard");

const movesText = document.getElementById("moves");
const matchesText = document.getElementById("matches");

const restartBtn = document.getElementById("restartBtn");

const winPopup = document.getElementById("winPopup");
const finalStats = document.getElementById("finalStats");

// ---------- AUDIO ----------
let audioCtx;

function getAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

function beep(type) {

    const ctx = getAudio();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "flip") {
        osc.frequency.value = 500;
        gain.gain.value = 0.05;
    }

    if (type === "match") {
        osc.frequency.value = 900;
        gain.gain.value = 0.07;
    }

    if (type === "win") {
        osc.frequency.value = 1200;
        gain.gain.value = 0.1;
    }

    osc.type = "sine";

    osc.start();
    osc.stop(ctx.currentTime + 0.12);
}

// unlock mobile audio
document.addEventListener("click", () => {
    getAudio().resume();
}, { once: true });

// ---------- EMOJIS ----------
const allEmojis = [
    "🐶","🐱","🐸","🦊",
    "🐵","🐼","🐯","🐨",
    "🦁","🐷","🐰","🐹",
    "🐻","🐔","🐙","🐧",
    "🐢","🦋","🐞","🐳"
];

// ---------- GAME STATE ----------
let level = 1;

let moves = 0;
let matches = 0;

let firstCard = null;
let secondCard = null;

let lockBoard = false;

let cards = [];

// ---------- HIGH SCORE ----------
let bestScore = localStorage.getItem("memoryBest");
if (!bestScore) bestScore = 9999;

// ---------- CREATE LEVEL ----------
function setupLevel() {

    board.innerHTML = "";

    // FIXED LEVEL PROGRESSION
    let pairs = 4 + (level - 1);

    if (pairs > 10) pairs = 10;

    let selected = allEmojis.slice(0, pairs);

    cards = [...selected, ...selected];

    cards.sort(() => Math.random() - 0.5);

    let columns = pairs >= 8 ? 5 : 4;

    board.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

    cards.forEach(emoji => {

        const card = document.createElement("div");

        card.className = "card";

        card.dataset.emoji = emoji;

        card.innerText = "";

        card.addEventListener("click", flipCard);

        board.appendChild(card);
    });
}

// ---------- FLIP ----------
function flipCard() {

    if (lockBoard) return;

    if (this === firstCard) return;

    this.classList.add("flipped");
    this.innerText = this.dataset.emoji;

    beep("flip");

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;

    moves++;
    movesText.innerText = moves;

    checkMatch();
}

// ---------- MATCH CHECK ----------
function checkMatch() {

    const match =
        firstCard.dataset.emoji === secondCard.dataset.emoji;

    if (match) {
        handleMatch();
    } else {
        unflipCards();
    }
}

// ---------- MATCH ----------
function handleMatch() {

    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);

    beep("match");

    matches++;
    matchesText.innerText = matches;

    resetTurn();

    checkWin();
}

// ---------- WRONG ----------
function unflipCards() {

    lockBoard = true;

    setTimeout(() => {

        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");

        firstCard.innerText = "";
        secondCard.innerText = "";

        resetTurn();

    }, 700);
}

// ---------- RESET ----------
function resetTurn() {

    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

// ---------- WIN (ONLY SYSTEM) ----------
function checkWin() {

    if (matches === cards.length / 2) {

        // save best score
        if (moves < bestScore) {
            bestScore = moves;
            localStorage.setItem("memoryBest", bestScore);
        }

        beep("win");

        setTimeout(() => {

            finalStats.innerHTML = `
                🎉 Level ${level} Complete!<br><br>
                Moves: ${moves}<br>
                Best Score: ${bestScore}
            `;

            winPopup.style.display = "flex";

        }, 300);
    }
}

// ---------- NEXT LEVEL ----------
window.nextLevel = function () {

    level++;

    moves = 0;
    matches = 0;

    firstCard = null;
    secondCard = null;
    lockBoard = false;

    movesText.innerText = 0;
    matchesText.innerText = 0;

    winPopup.style.display = "none";

    setupLevel();
};

// ---------- RESTART ----------
window.restartGame = function () {

    level = 1;

    moves = 0;
    matches = 0;

    firstCard = null;
    secondCard = null;
    lockBoard = false;

    movesText.innerText = 0;
    matchesText.innerText = 0;

    winPopup.style.display = "none";

    setupLevel();
};

// ---------- START ----------
setupLevel();