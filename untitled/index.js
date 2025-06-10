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

    // Starte Gewinn-Animationen
    startVictoryAnimations();
}

/**
 * Startet alle Gewinn-Animationen
 */
function startVictoryAnimations() {
    // Zeige "GEWONNEN!" Text
    showVictoryText();

    // Starte Konfetti
    createConfetti();

    // Starte Feuerwerk
    createFireworks();

    // Erstelle Sterne
    createStars();

    // Regenbogen-Hintergrund
    document.body.classList.add('rainbow-bg');
    setTimeout(() => {
        document.body.classList.remove('rainbow-bg');
    }, 3000);

    // Stats pulsieren lassen
    document.querySelector('.stats').classList.add('stats-pulse');
    setTimeout(() => {
        document.querySelector('.stats').classList.remove('stats-pulse');
    }, 1500);

    // Glitzer-Effekt
    createSparkles();
}

/**
 * Zeigt den animierten Gewinn-Text
 */
function showVictoryText() {
    const victoryText = document.createElement('div');
    victoryText.className = 'victory-text';
    victoryText.textContent = 'GEWONNEN!';
    document.body.appendChild(victoryText);

    setTimeout(() => {
        victoryText.remove();
    }, 2500);
}

/**
 * Erstellt Konfetti-Animationen
 */
function createConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    document.body.appendChild(confettiContainer);

    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffd93d', '#6bcf7f', '#e84393', '#ffd700'];

    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = Math.random() * 10 + 5 + 'px';
            confetti.style.height = confetti.style.width;
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            confetti.style.animationDuration = Math.random() * 2 + 2 + 's';
            confettiContainer.appendChild(confetti);
        }, i * 30);
    }

    setTimeout(() => {
        confettiContainer.remove();
    }, 5000);
}

/**
 * Erstellt Feuerwerk-Animationen
 */
function createFireworks() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffd93d', '#6bcf7f'];

    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight * 0.5;

            // Rakete
            const firework = document.createElement('div');
            firework.className = 'firework';
            firework.style.left = x + 'px';
            firework.style.background = colors[Math.floor(Math.random() * colors.length)];
            document.body.appendChild(firework);

            // Explosion
            setTimeout(() => {
                firework.remove();

                for (let j = 0; j < 20; j++) {
                    const explosion = document.createElement('div');
                    explosion.className = 'firework-explosion';
                    explosion.style.left = x + 'px';
                    explosion.style.top = y + 'px';
                    explosion.style.background = colors[Math.floor(Math.random() * colors.length)];
                    document.body.appendChild(explosion);

                    setTimeout(() => explosion.remove(), 1000);
                }
            }, 1000);
        }, i * 400);
    }
}

/**
 * Erstellt animierte Sterne
 */
function createStars() {
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const star = document.createElement('div');
            star.className = 'star';
            star.innerHTML = '⭐';
            star.style.left = Math.random() * window.innerWidth + 'px';
            star.style.top = Math.random() * window.innerHeight + 'px';
            star.style.fontSize = Math.random() * 20 + 20 + 'px';
            document.body.appendChild(star);

            setTimeout(() => star.remove(), 2000);
        }, i * 100);
    }
}

/**
 * Erstellt Glitzer-Effekte
 */
function createSparkles() {
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = Math.random() * window.innerWidth + 'px';
            sparkle.style.top = Math.random() * window.innerHeight + 'px';
            sparkle.style.boxShadow = '0 0 6px #fff';
            document.body.appendChild(sparkle);

            setTimeout(() => sparkle.remove(), 1000);
        }, i * 50);
    }
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