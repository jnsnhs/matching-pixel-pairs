const IMG_DIR = "./images";

class Utils {
  static getShuffledArray(array) {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }
  static getSequence(firstNumber, lastNumber) {
    let sequence = [];
    for (let i = firstNumber; i <= lastNumber; i++) {
      sequence.push(i);
    }
    return sequence;
  }
}

class Game {
  constructor(numberOfCards, controller) {
    this.numberOfCards = numberOfCards;
    this.controller = controller;
    this.numberOfTries = 0;
    this.numberOfMatches = 0;
    this.gameContainer = document.getElementById("in-game-screen");
    this.firstChoiceCard = null;
    this.secondChoiceCard = null;
    this.setDebugMode(false);
    this.createCards();
  }
  setDebugMode(isDebugModeOn) {
    this.debugMode = isDebugModeOn;
    if (isDebugModeOn) {
      this.displayDebugInfo();
    }
  }
  isGameOver() {
    return Boolean(this.numberOfMatches == this.numberOfCards / 2);
  }
  getListOfimageUrls(numberOfCards) {
    let imageUrls = [];
    let shuffledCardNumbers = Utils.getShuffledArray(Utils.getSequence(1, 24));
    for (let i = 0; i < numberOfCards / 2; i++) {
      let fileName = `${shuffledCardNumbers[i]}.jpg`;
      imageUrls.push(fileName);
    }
    return Utils.getShuffledArray([...imageUrls, ...imageUrls]);
  }
  createCards() {
    if (document.getElementById("grid-of-cards")) {
      document.getElementById("grid-of-cards").remove();
    }
    let grid = document.createElement("ul");
    grid.classList.add("grid");
    grid.id = "grid-of-cards";
    let listOfimageUrls = this.getListOfimageUrls(this.numberOfCards);
    for (let i = 0; i < this.numberOfCards; i++) {
      let rotationContainer = document.createElement("li");
      rotationContainer.classList.add("rotation-container");
      this.addRandomRotation(rotationContainer);
      let card = document.createElement("div");
      card.classList.add("card");
      let front = document.createElement("div");
      front.classList.add("front");
      front.style.backgroundImage =
      'url("' + IMG_DIR + "/" + listOfimageUrls[i] + '")';
      let back = document.createElement("div");
      back.classList.add("back");
      card.addEventListener("click", () => {
        this.chooseCard(card);
      });
      card.appendChild(back);
      card.appendChild(front);
      rotationContainer.appendChild(card);
      grid.appendChild(rotationContainer);
    }
    this.gameContainer.appendChild(grid);
  }
  addRandomRotation(element) {
    let values = [-0.9, -0.6, -0.3, 0, 0.3, 0.6, 0.9];
    let choice = values[Math.floor(Math.random() * values.length)];
    element.style.transform = `rotateZ(${choice}deg)`;
  }
  chooseCard(clickedCard) {
    let isCardCovered = !clickedCard.classList.contains("uncovered");
    if (!this.firstChoiceCard && isCardCovered) {
      this.firstChoiceCard = clickedCard;
      this.flipCard(clickedCard);
    } else if (!this.secondChoiceCard && isCardCovered) {
      this.numberOfTries++;
      this.secondChoiceCard = clickedCard;
      this.flipCard(clickedCard);
      if (
        this.firstChoiceCard.lastChild.style.backgroundImage ==
        this.secondChoiceCard.lastChild.style.backgroundImage
      ) {
        this.numberOfMatches++;
        this.firstChoiceCard.classList.add("found");
        this.secondChoiceCard.classList.add("found");
        this.firstChoiceCard = null;
        this.secondChoiceCard = null;
      }
    } else if (isCardCovered) {
      this.flipCard(this.firstChoiceCard);
      this.flipCard(this.secondChoiceCard);
      this.firstChoiceCard = null;
      this.secondChoiceCard = null;
      this.firstChoiceCard = clickedCard;
      this.flipCard(clickedCard);
    }
    if (this.debugMode) {
      this.displayDebugInfo();
    }
    if (this.isGameOver()) {
      this.controller.screens.gameOverScreen.updateScreen(
        this.numberOfCards,
        this.numberOfTries,
      );
      this.controller.switchScreen(this.controller.screens.gameOverScreen);
    }
  }
  flipCard(cardElement) {
    if (cardElement.classList.contains("uncovered")) {
      cardElement.classList.remove("uncovered");
      // Replace with class:
      //cardElement.style.transform = "rotateY(0deg)";
    } else {
      cardElement.classList.add("uncovered");
      // Replace with class:
      //cardElement.style.transform = "rotateY(180deg)";
    }
  }
  displayDebugInfo() {
    let debugContainer = document.getElementById("debug");
    if (!debugContainer) {
      debugContainer = document.createElement("div");
      debugContainer.id = "debug";
    }
    debugContainer.innerHTML = `Rounds played: ${this.numberOfTries}<br>`;
    debugContainer.innerHTML += `Game Over: ${this.isGameOver()}`;
    document.body.appendChild(debugContainer);
  }
}

class Screen {
  constructor(screenId) {
    this.controller;
    this.screenId = screenId;
    this.screenContainer = this.createScreen(screenId);
    this.hideScreen();
  }
  setController(controller) {
    this.controller = controller;
  }
  createScreen(screenId) {
    let screen = document.createElement("div");
    screen.classList.add("screen");
    screen.classList.add(screenId);
    screen.id = screenId;
    document.getElementById("matching-pixel-pairs").appendChild(screen);
    return screen;
  }
  clearContent() {
    while (this.screenContainer.firstChild) {
      this.screenContainer.removeChild(this.screenContainer.lastChild);
    }
  }
  fillScreen(htmlContent) {
    this.screenContainer.innerHTML = htmlContent;
  }
  hideScreen() {
    this.screenContainer.style.display = "none";
  }
  showScreen() {
    this.screenContainer.style.display = "initial";
  }
}

class StartGameScreen extends Screen {
  constructor() {
    super("start-game-screen");
    this.createContent();
  }
  createContent() {
    let title = document.createElement("h1");
    title.innerHTML = "Matching Pixel Pairs";
    this.screenContainer.appendChild(title);
    let difficulties = { easy: 4, medium: 24, hard: 48 };
    let mainMenu = document.createElement("div");
    for (let [description, numberOfCards] of Object.entries(difficulties)) {
      let startBtn = document.createElement("button");
      let btnText = document.createTextNode(`${description}`);
      startBtn.appendChild(btnText);
      startBtn.addEventListener("click", () => {
        this.controller.screens.inGameScreen.startNewGame(numberOfCards);
        this.controller.switchScreen(this.controller.screens.inGameScreen);
      });
      mainMenu.appendChild(startBtn);
    }
    this.screenContainer.appendChild(mainMenu);
  }
}

class InGameScreen extends Screen {
  constructor() {
    super("in-game-screen");
  }
  startNewGame(numberOfCards) {
    let game = new Game(numberOfCards, this.controller);
  }
}

class GameOverScreen extends Screen {
  constructor() {
    super("game-over-screen");
    this.numberOfCards;
    this.numberOfTries;
  }
  updateScreen(numberOfCards, numberOfTries) {
    this.numberOfCards = numberOfCards;
    this.numberOfTries = numberOfTries;
    this.clearContent();
    this.createContent();
  }
  createContent() {
    let wellDone = document.createElement("div");
    wellDone.innerHTML = "Well done!";
    let message = document.createElement("div");
    message.innerHTML = `You found ${this.numberOfCards / 2} matches in ${this.numberOfTries} tries.`;
    let newGameBtn = document.createElement("button");
    let btnText = document.createTextNode("New Game");
    newGameBtn.appendChild(btnText);
    newGameBtn.addEventListener("click", () => {
      this.controller.switchScreen(this.controller.screens.startGameScreen);
    });
    this.screenContainer.appendChild(wellDone);
    this.screenContainer.appendChild(message);
    this.screenContainer.appendChild(newGameBtn);
  }
}

class Controller {
  constructor() {
    this.screens = this.setScreens();
    this.attachControllerToScreens();
    this.currentScreen;
  }
  setScreens() {
    let screens = new Object();
    screens["startGameScreen"] = new StartGameScreen();
    screens["inGameScreen"] = new InGameScreen();
    screens["gameOverScreen"] = new GameOverScreen();
    return screens;
  }
  attachControllerToScreens() {
    this.screens.startGameScreen.setController(this);
    this.screens.inGameScreen.setController(this);
    this.screens.gameOverScreen.setController(this);
  }
  switchScreen(nextScreen) {
    nextScreen.showScreen();
    if (this.currentScreen && this.currentScreen != nextScreen) {
      this.currentScreen.hideScreen();
    }
    this.currentScreen = nextScreen;
  }
}

class App {
  constructor() {
    let appContainer = document.getElementById("matching-pixel-pairs");
    if (appContainer) {
      appContainer.classList.add("app-container");
      this.controller = new Controller();
    }
  }
  run() {
    if (this.controller) {
      this.controller.switchScreen(this.controller.screens.startGameScreen);
    }
  }
}

let app = new App();
app.run();
