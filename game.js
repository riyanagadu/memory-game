const board = document.getElementById("gameBoard");

const movesText = document.getElementById("moves");
const matchesText = document.getElementById("matches");

const restartBtn = document.getElementById("restartBtn");

const winPopup = document.getElementById("winPopup");
const finalStats = document.getElementById("finalStats");

// EMOJIS
const emojis = [
    "🐶","🐱","🐸","🦊",
    "🐵","🐼","🐯","🐨"
];

// DUPLICATE
let cards = [...emojis, ...emojis];

// GAME STATE
let firstCard = null;
let secondCard = null;

let lockBoard = false;

let moves = 0;
let matches = 0;

// SHUFFLE
function shuffleCards() {
    cards.sort(() => Math.random() - 0.5);
}

// CREATE BOARD
function createBoard() {

    board.innerHTML = "";

    shuffleCards();

    cards.forEach(emoji => {

        const card = document.createElement("div");

        card.className = "card";

        card.dataset.emoji = emoji;

        card.innerText = "";

        card.addEventListener("click", flipCard);

        board.appendChild(card);
    });
}

// FLIP
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

// MATCH CHECK
function checkMatch() {

    const match =
        firstCard.dataset.emoji === secondCard.dataset.emoji;

    if (match) {
        handleMatch();
    } else {
        unflipCards();
    }
}

// MATCH FOUND
function handleMatch() {

    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);

    matches++;
    matchesText.innerText = matches;

    resetTurn();

    // WIN
    if (matches === emojis.length) {

        setTimeout(() => {

            finalStats.innerText =
                "Moves: " + moves;

            winPopup.style.display = "flex";

        }, 500);
    }
}

// WRONG MATCH
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

// RESET TURN
function resetTurn() {

    [firstCard, secondCard] = [null, null];

    lockBoard = false;
}

// RESTART
restartBtn.addEventListener("click", restartGame);

function restartGame() {

    moves = 0;
    matches = 0;

    movesText.innerText = moves;
    matchesText.innerText = matches;

    firstCard = null;
    secondCard = null;

    lockBoard = false;

    winPopup.style.display = "none";

    createBoard();
}

// START
createBoard();