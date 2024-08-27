const cards = document.querySelectorAll(".memory-card");
const attemptsElement = document.getElementById("attempts");
const scoreElement = document.getElementById("score");
const timeElement = document.getElementById("time");
const restartButton = document.getElementById("restart-button");

   let gameState = {
  firstCard: null,
  secondCard: null,
  isBoardLocked: false,
  attemptsCount: 0,
  scoreCount: 0,
  matchedPairs: 0,
  timer: {
    startTime: null,
    intervalId: null,
    elapsedTime: 0,
  },
};

const maxAttempBeforePenalty=10;

// Oyun başlangıcı
(function initGame() {
  shuffleCards();
  reattachCardListeners();
})();

function shuffleCards() {
  cards.forEach((card) => {
    card.style.order = Math.floor(Math.random() * cards.length);
  });
}
// Kartlara tıklama olayını yeniden ekler
function reattachCardListeners() {
  cards.forEach((card) => card.addEventListener("click", handleCardFlip));
}

function startTimer() {
  gameState.timer.startTime = Date.now();
  gameState.timer.intervalId = setInterval(() => {
    gameState.timer.elapsedTime = Math.floor(
      (Date.now() - gameState.timer.startTime) / 1000
    );
    timeElement.textContent = gameState.timer.elapsedTime;
  }, 1000);
}

function stopTimer() {
  clearInterval(gameState.timer.intervalId);
}


function handleCardFlip() {
  if (gameState.isBoardLocked || this === gameState.firstCard) return;

  this.classList.add("flip");

  if (!gameState.firstCard) {
    gameState.firstCard = this;
    
    }else {
    gameState.secondCard = this;

    checkForMatch();
  }
  if (gameState.attemptsCount === 0 && gameState.scoreCount === 0) {
    startTimer();}
}

function checkForMatch() {
  const isMatch =
    gameState.firstCard.dataset.framework ===
    gameState.secondCard.dataset.framework;
    gameState.isBoardLocked = true;
    
  if (isMatch) {
    gameState.firstCard.removeEventListener("click", handleCardFlip);
    gameState.secondCard.removeEventListener("click", handleCardFlip);
    resetBoardState();
    
    gameState.matchedPairs++;
    gameState.scoreCount+=100;
    scoreElement.textContent = gameState.scoreCount; 
    
    if (isGameWon()) {
      
      endGame();
    }
  
  } else {
    unflipCards();
  }
  checkForScorePenalty();
  gameState.attemptsCount++;
 attemptsElement.textContent = gameState.attemptsCount;
 
  //en son skorla bir şeyi çarp puanı öyle bul, 5er veya 10ar puan artsın skor değeri,scorecount++ ve attemptscount++'ı checkforscore'a ekle.
}


function checkForScorePenalty(){
  if (gameState.attemptsCount>maxAttempBeforePenalty) {
    gameState.scoreCount = Math.max(gameState.scoreCount - 10, 0);
    scoreElement.textContent=gameState.scoreCount;
  }
}

function unflipCards() {
  setTimeout(() => {
    gameState.firstCard.classList.remove("flip");
    gameState.secondCard.classList.remove("flip");
    resetBoardState();
  }, 1500);
  
}

function resetBoardState() {
  gameState.firstCard = null;
  gameState.secondCard = null;
  gameState.isBoardLocked = false;
}

function isGameWon() {
  return gameState.matchedPairs === cards.length / 2;
}

function endGame() {
  stopTimer();
  const finalScore = Math.floor(((gameState.scoreCount/gameState.timer.elapsedTime)/gameState.attemptsCount*10)*100);
  setTimeout(() => {
    alert(
      `Tebrikler! \n Skorunuz: 5000 üzerinden ${finalScore}\n ${gameState.attemptsCount} denemede oyunu ${gameState.timer.elapsedTime} saniyede bitirdiniz.`
    );
  }, 500);
  setTimeout(() => {
    restartGame();
  }, 3000);
}
//buraya oyun başlasın mo başlamasın mı ekle.


function restartGame() {
  stopTimer();
  resetGameState();
  resetDisplayedElements();
  shuffleCards();
  reattachCardListeners();
}

function resetGameState() {
  gameState = {
    firstCard: null,
    secondCard: null,
    isBoardLocked: false,
    attemptsCount: 0,
    scoreCount: 0,
    matchedPairs: 0,
    timer: {
      startTime: null,
      intervalId: null,
      elapsedTime: 0,
    },
  };
}

// Ekrandaki elemanları sıfırlar
function resetDisplayedElements() {
  attemptsElement.textContent = 0;
  scoreElement.textContent = 0;
  timeElement.textContent = 0;
  cards.forEach((card) => card.classList.remove("flip"));
}

restartButton.addEventListener("click", restartGame);


