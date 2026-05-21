const board = document.getElementById("gameBoard");

const movesText = document.getElementById("moves");
const matchesText = document.getElementById("matches");
const timerText = document.getElementById("timer");
const streakText = document.getElementById("streakText");

const themeSelect = document.getElementById("themeSelect");

const winPopup = document.getElementById("winPopup");
const finalStats = document.getElementById("finalStats");

// ---------- THEMES ----------
const themes = {
    animals: ["🐶","🐱","🐸","🦊","🐵","🐼","🐯","🐨","🐰","🦁"],
    cars: ["🚗","🚓","🏎️","🚙","🚕","🚘","🚖","🚔","🚐","🚚"],
    flags: ["🇿🇦","🇺🇸","🇯🇵","🇧🇷","🇫🇷","🇮🇳","🇨🇦","🇩🇪","🇬🇧","🇦🇺"],
    marvel: ["🦸","🛡️","⚡","🕷️","🔨","💚","🏹","🤖","🧠","🔥"]
};

// ---------- GAME STATE ----------
let level = 1;

let moves = 0;
let matches = 0;
let streak = 0;

let firstCard = null;
let secondCard = null;

let lockBoard = false;

let cards = [];

let timer = 0;
let timerInterval = null;

// ---------- TIMER ----------
function startTimer() {

    clearInterval(timerInterval);

    timer = 0;
    timerText.innerText = timer;

    timerInterval = setInterval(() => {
        timer++;
        timerText.innerText = timer;
    }, 1000);
}

// ---------- LEVEL SYSTEM ----------
function getPairs(level) {
    return Math.min(4 + level, 10);
}

// ---------- CREATE BOARD ----------
function createBoard() {

    board.innerHTML = "";

    const theme = themeSelect.value;

    let pool = [...themes[theme]];

    let pairs = getPairs(level);

    let selected = pool.slice(0, pairs);

    cards = [...selected, ...selected];

    cards.sort(() => Math.random() - 0.5);

    // responsive grid
    if (pairs <= 6) {
        board.style.gridTemplateColumns = "repeat(4, 1fr)";
    } else {
        board.style.gridTemplateColumns = "repeat(5, 1fr)";
    }

    cards.forEach(emoji => {

        const card = document.createElement("div");

        card.className = "card";

        card.dataset.emoji = emoji;

        card.innerText = "";

        card.addEventListener("click", flipCard);

        board.appendChild(card);
    });

    startTimer();
}

// ---------- FLIP ----------
function flipCard() {

    if (lockBoard) return;

    if (this === firstCard) return;

    this.classList.add("flipped");
    this.innerText = this.dataset.emoji;

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;

    moves++;
    movesText.innerText = moves;

    checkMatch();
}

// ---------- CHECK MATCH ----------
function checkMatch() {

    const match =
        firstCard.dataset.emoji === secondCard.dataset.emoji;

    if (match) {

        streak++;
        streakText.innerText = `🔥 Streak x${streak}`;

        handleMatch();

    } else {

        streak = 0;
        streakText.innerText = `🔥 Streak x0`;

        unflipCards();
    }
}

// ---------- MATCH ----------
function handleMatch() {

    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);

    matches++;

    matchesText.innerText = matches;

    resetTurn();

    // LEVEL COMPLETE
    if (matches === cards.length / 2) {

        clearInterval(timerInterval);

        setTimeout(() => {

            finalStats.innerHTML = `
                🎉 Level ${level} Complete!<br><br>
                Moves: ${moves}<br>
                Time: ${timer}s<br>
                Streak: ${streak}
            `;

            winPopup.style.display = "flex";

        }, 500);
    }
}

// ---------- WRONG MATCH ----------
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

// ---------- RESET TURN ----------
function resetTurn() {

    [firstCard, secondCard] = [null, null];

    lockBoard = false;
}

// ---------- NEXT LEVEL ----------
window.nextLevel = function () {

    level++;

    moves = 0;
    matches = 0;
    streak = 0;

    movesText.innerText = 0;
    matchesText.innerText = 0;
    streakText.innerText = "🔥 Streak x0";

    winPopup.style.display = "none";

    createBoard();
};

// ---------- RESTART GAME ----------
window.restartGame = function () {

    level = 1;

    moves = 0;
    matches = 0;
    streak = 0;

    movesText.innerText = 0;
    matchesText.innerText = 0;
    streakText.innerText = "🔥 Streak x0";

    winPopup.style.display = "none";

    createBoard();
};

// ---------- THEME CHANGE ----------
themeSelect.addEventListener("change", restartGame);

// ---------- START ----------
restartGame();