// Emoji-Symbole für die Karten
const symbols = ['🎨', '🎭', '🎪', '🎯', '🎲', '🎸', '🎺', '🎻'];

// Spielvariablen
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let startTime = null;
let timerInterval = null;
let isProcessing = false;

/**
 * Initialisiert ein neues Spiel
 */
function initGame() {
    // Reset alle Variablen
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    startTime = null;
    clearInterval(timerInterval);

    // Reset UI-Elemente
    document.getElementById('timer').textContent = '0';
    document.getElementById('moves').textContent = '0';
    document.getElementById('pairs').textContent = '0';
    document.getElementById('gameOver').classList.remove('show');

    // Erstelle Kartenarray (jedes Symbol zweimal)
    const cardSymbols = [...symbols, ...symbols];

    // Mische die Karten
    shuffleArray(cardSymbols);

    // Erstelle das Spielbrett
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';

    cardSymbols.forEach((symbol, index) => {
        const card = createCard(symbol, index);
        cards.push(card);
        gameBoard.appendChild(card.element);
    });
}

/**
 * Erstellt eine Karte mit dem gegebenen Symbol
 * @param {string} symbol - Das Symbol für die Karte
 * @param {number} index - Der Index der Karte
 * @returns {Object} Kartenobjekt mit Element und Eigenschaften
 */
function createCard(symbol, index) {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.dataset.index = index;
    cardElement.dataset.symbol = symbol;

    cardElement.innerHTML = `
        <div class="card-face card-front">?</div>
        <div class="card-face card-back">${symbol}</div>
    `;

    cardElement.addEventListener('click', () => flipCard(cardElement));

    return {
        element: cardElement,
        symbol: symbol,
        isFlipped: false,
        isMatched: false
    };
}

/**
 * Dreht eine Karte um
 * @param {HTMLElement} cardElement - Das Kartenelement
 */
function flipCard(cardElement) {
    const index = parseInt(cardElement.dataset.index);
    const card = cards[index];

    // Verhindere ungültige Klicks
    if (isProcessing || card.isFlipped || card.isMatched) {
        return;
    }

    // Starte Timer beim ersten Klick
    if (!startTime) {
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 100);
    }

    // Drehe Karte um
    cardElement.classList.add('flipped');
    card.isFlipped = true;
    flippedCards.push(card);

    // Prüfe auf Paar wenn zwei Karten umgedreht sind
    if (flippedCards.length === 2) {
        moves++;
        document.getElementById('moves').textContent = moves;
        checkForMatch();
    }
}

/**
 * Prüft ob die zwei umgedrehten Karten übereinstimmen
 */
function checkForMatch() {
    isProcessing = true;
    const [card1, card2] = flippedCards;

    if (card1.symbol === card2.symbol) {
        // Übereinstimmung gefunden
        setTimeout(() => {
            card1.element.classList.add('matched');
            card2.element.classList.add('matched');
            card1.isMatched = true;
            card2.isMatched = true;

            matchedPairs++;
            document.getElementById('pairs').textContent = matchedPairs;

            flippedCards = [];
            isProcessing = false;

            // Prüfe ob Spiel beendet
            if (matchedPairs === 8) {
                endGame();
            }
        }, 500);
    } else {
        // Keine Übereinstimmung - Karten wieder umdrehen
        setTimeout(() => {
            card1.element.classList.remove('flipped');
            card2.element.classList.remove('flipped');
            card1.isFlipped = false;
            card2.isFlipped = false;

            flippedCards = [];
            isProcessing = false;
        }, 1000);
    }
}

/**
 * Aktualisiert die Zeitanzeige
 */
function updateTimer() {
    if (startTime) {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        document.getElementById('timer').textContent = elapsed;
    }
}

/**
 * Beendet das Spiel und zeigt die Ergebnisse
 */
function endGame() {
    clearInterval(timerInterval);
    const finalTime = Math.floor((Date.now() - startTime) / 1000);

    document.getElementById('finalTime').textContent = finalTime;
    document.getElementById('finalMoves').textContent = moves;
    document.getElementById('gameOver').classList.add('show');
}

/**
 * Mischt ein Array mit dem Fisher-Yates Algorithmus
 * @param {Array} array - Das zu mischende Array
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Initialisiere das Spiel beim Laden der Seite
window.addEventListener('DOMContentLoaded', initGame);