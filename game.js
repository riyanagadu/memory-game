const board = document.getElementById("gameBoard");

const movesText = document.getElementById("moves");
const matchesText = document.getElementById("matches");
const timerText = document.getElementById("timer");

const streakText = document.getElementById("streakText");

const restartBtn = document.getElementById("restartBtn");

const themeSelect = document.getElementById("themeSelect");
const difficultySelect = document.getElementById("difficultySelect");

const winPopup = document.getElementById("winPopup");
const finalStats = document.getElementById("finalStats");

// ---------- THEMES ----------
const themes = {

    animals: [
        "🐶","🐱","🐸","🦊",
        "🐵","🐼","🐯","🐨"
    ],

    cars: [
        "🚗","🚓","🏎️","🚙",
        "🚕","🚘","🚖","🚔"
    ],

    flags: [
        "🇿🇦","🇺🇸","🇯🇵","🇧🇷",
        "🇫🇷","🇮🇳","🇨🇦","🇩🇪"
    ],

    marvel: [
        "🦸","🛡️","⚡","🕷️",
        "🔨","💚","🏹","🤖"
    ]
};

// ---------- GAME ----------
let cards = [];

let firstCard = null;
let secondCard = null;

let lockBoard = false;

let moves = 0;
let matches = 0;

let streak = 0;

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

// ---------- CREATE BOARD ----------
function createBoard() {

    board.innerHTML = "";

    const theme = themeSelect.value;

    let emojis = [...themes[theme]];

    // difficulty
    let pairs = 4;

    if (difficultySelect.value === "medium") {
        pairs = 6;
    }

    if (difficultySelect.value === "hard") {
        pairs = 8;
    }

    emojis = emojis.slice(0, pairs);

    cards = [...emojis, ...emojis];

    cards.sort(() => Math.random() - 0.5);

    // grid
    let columns = 4;

    if (pairs >= 6) columns = 4;
    if (pairs >= 8) columns = 4;

    board.style.gridTemplateColumns =
        `repeat(${columns}, 1fr)`;

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

// ---------- MATCH CHECK ----------
function checkMatch() {

    const match =
        firstCard.dataset.emoji === secondCard.dataset.emoji;

    if (match) {

        streak++;

        streakText.innerText =
            `🔥 Streak x${streak}`;

        handleMatch();

    } else {

        streak = 0;

        streakText.innerText =
            `🔥 Streak x0`;

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

    // WIN
    if (matches === cards.length / 2) {

        clearInterval(timerInterval);

        setTimeout(() => {

            finalStats.innerHTML = `
                🎉 Completed!<br><br>
                Moves: ${moves}<br>
                Time: ${timer}s<br>
                Best Streak: ${streak}
            `;

            winPopup.style.display = "flex";

        }, 500);
    }
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

    }, 800);
}

// ---------- RESET ----------
function resetTurn() {

    [firstCard, secondCard] = [null, null];

    lockBoard = false;
}

// ---------- RESTART ----------
window.restartGame = function () {

    moves = 0;
    matches = 0;
    streak = 0;

    firstCard = null;
    secondCard = null;

    lockBoard = false;

    movesText.innerText = moves;
    matchesText.innerText = matches;

    streakText.innerText =
        `🔥 Streak x0`;

    winPopup.style.display = "none";

    createBoard();
};

restartBtn.addEventListener("click", restartGame);

themeSelect.addEventListener("change", restartGame);
difficultySelect.addEventListener("change", restartGame);

// ---------- START ----------
restartGame();