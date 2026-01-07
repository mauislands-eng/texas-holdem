const suits = ["♠", "♥", "♦", "♣"];
const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

let deck = [];
let stage = 0;

const playerCardsDiv = document.getElementById("player-cards");
const botCardsDiv = document.getElementById("bot-cards");
const communityCardsDiv = document.getElementById("community-cards");
const statusText = document.getElementById("status");

const dealBtn = document.getElementById("deal-btn");
const nextBtn = document.getElementById("next-btn");

function createDeck() {
  deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ value, suit });
    }
  }
  deck.sort(() => Math.random() - 0.5);
}

function drawCard() {
  return deck.pop();
}

function renderCard(card, hidden = false) {
  const div = document.createElement("div");
  div.className = "card";
  div.textContent = hidden ? "🂠" : `${card.value}${card.suit}`;
  return div;
}

function resetTable() {
  playerCardsDiv.innerHTML = "";
  botCardsDiv.innerHTML = "";
  communityCardsDiv.innerHTML = "";
  stage = 0;
}

dealBtn.addEventListener("click", () => {
  resetTable();
  createDeck();

  // Deal player
  playerCardsDiv.appendChild(renderCard(drawCard()));
  playerCardsDiv.appendChild(renderCard(drawCard()));

  // Deal bot (hidden)
  botCardsDiv.appendChild(renderCard(drawCard(), true));
  botCardsDiv.appendChild(renderCard(drawCard(), true));

  statusText.textContent = "Cards dealt. Click Next Stage.";
  nextBtn.disabled = false;
  dealBtn.disabled = true;
});

nextBtn.addEventListener("click", () => {
  stage++;

  if (stage === 1) {
    // Flop
    for (let i = 0; i < 3; i++) {
      communityCardsDiv.appendChild(renderCard(drawCard()));
    }
    statusText.textContent = botDecision();
  } 
  else if (stage === 2) {
    // Turn
    communityCardsDiv.appendChild(renderCard(drawCard()));
    statusText.textContent = botDecision();
  } 
  else if (stage === 3) {
    // River
    communityCardsDiv.appendChild(renderCard(drawCard()));
    statusText.textContent = botDecision();
  } 
  else {
    // Showdown
    revealBotCards();
    statusText.textContent = determineWinner();
    nextBtn.disabled = true;
    dealBtn.disabled = false;
  }
});

function botDecision() {
  const actions = ["Bot checks.", "Bot calls.", "Bot bets."];
  return actions[Math.floor(Math.random() * actions.length)];
}

function revealBotCards() {
  botCardsDiv.innerHTML = "";
  botCardsDiv.appendChild(renderCard(drawCard()));
  botCardsDiv.appendChild(renderCard(drawCard()));
}

function determineWinner() {
  return Math.random() > 0.5
    ? "You win the hand! 🎉"
    : "Bot wins the hand 🤖";
}
