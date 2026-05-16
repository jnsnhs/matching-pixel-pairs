const IMG_DIR_CARDS = "./pixelpairs/images/cards/";
const IMG_DIR_BUTTONS = "./pixelpairs/images/buttons/"
const IMG_DIR_BACKGROUNDS = "./pixelpairs/images/backgrounds/"
const IMG_DIR_TEXT = "./pixelpairs/images/text/"

class Helper {
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
  constructor(numberOfCards) {
    this.numberOfCards = numberOfCards;
    this.numberOfTries = 0;
    this.numberOfMatches = 0;
    this.gameContainer = document.getElementById("in-game-screen");
    this.firstChoiceCard = null;
    this.secondChoiceCard = null;
    this.createCards();
  }
  setController(controller) {
    this.controller = controller;
  }
  isGameOver() {
    return Boolean(this.numberOfMatches == this.numberOfCards / 2);
  }
  getListOfimageUrls(numberOfCards) {
    let imageUrls = [];
    let shuffledCardNumbers = Helper.getShuffledArray(
      Helper.getSequence(1, 24));
    for (let i = 0; i < numberOfCards / 2; i++) {
      let fileName = `${shuffledCardNumbers[i]}.png`;
      imageUrls.push(fileName);
    }
    return Helper.getShuffledArray([...imageUrls, ...imageUrls]);
  }
  createCards() {
    if (document.getElementById("grid-of-cards")) {
      document.getElementById("grid-of-cards").remove();
    }
    let grid = document.createElement("ul");
    grid.classList.add("grid");
    switch (this.numberOfCards) {
      case 12:
        grid.classList.add("easy");
        break;
      case 24:
        grid.classList.add("medium");
        break;
      case 48:
        grid.classList.add("hard");
        break;
      default:
        break;
    }
    grid.id = "grid-of-cards";
    let listOfimageUrls = this.getListOfimageUrls(this.numberOfCards);
    for (let i = 0; i < this.numberOfCards; i++) {
      let rotationContainer = document.createElement("li");
      rotationContainer.classList.add("rotation-container");
      this.addRandomRotationToCard(rotationContainer);
      let card = document.createElement("div");
      card.classList.add("card");
      let front = document.createElement("div");
      front.classList.add("front");
      front.style.backgroundImage =
        'url("' + IMG_DIR_CARDS + `${listOfimageUrls[i]}")`;
      let back = document.createElement("div");
      back.classList.add("back");
      card.addEventListener("click", () => {this.pickCard(card);});
      card.appendChild(back);
      card.appendChild(front);
      rotationContainer.appendChild(card);
      grid.appendChild(rotationContainer);
    }
    this.gameContainer.appendChild(grid);
  }
  addRandomRotationToCard(element) {
    let values = [-0.9, -0.6, -0.3, 0, 0.3, 0.6, 0.9];
    let choice = values[Math.floor(Math.random() * values.length)];
    element.style.transform = `rotateZ(${choice}deg)`;
  }
  pickCard(clickedCard) {
    let isImgHidden = !clickedCard.classList.contains("imgVisible");
    if (isImgHidden && !this.firstChoiceCard) {
      this.firstChoiceCard = clickedCard;
      this.flipCard(clickedCard);
    } else if (isImgHidden && !this.secondChoiceCard) {
      this.secondChoiceCard = clickedCard;
      this.flipCard(clickedCard);
      this.numberOfTries++;
      if (
        this.firstChoiceCard.lastChild.style.backgroundImage ==
        this.secondChoiceCard.lastChild.style.backgroundImage
      ) {
        this.numberOfMatches++;
        this.firstChoiceCard = null;
        this.secondChoiceCard = null;
      }
    } else if (isImgHidden) {
      this.flipCard(this.firstChoiceCard);
      this.flipCard(this.secondChoiceCard);
      this.firstChoiceCard = null;
      this.secondChoiceCard = null;
      this.firstChoiceCard = clickedCard;
      this.flipCard(clickedCard);
    }
    if (this.isGameOver()) {
      this.switchToGameOverScreen();
    }
  }
  flipCard(cardElement) {
    if (cardElement.classList.contains("imgVisible")) {
      cardElement.classList.remove("imgVisible");
      cardElement.classList.add("imgHidden");
    } else {
      cardElement.classList.remove("imgHidden");
      cardElement.classList.add("imgVisible");
    }
  }
  switchToGameOverScreen() {
    this.controller.screens.gameOverScreen.updateScreen();
    this.controller.switchScreen(this.controller.screens.gameOverScreen);
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
    this.numberOfCards;
    this.selectDifficulty("normal", 24);
  }
  createContent() {
    let screenContent = document.createElement("div");
    screenContent.classList.add("screen-content");
    screenContent.appendChild(this.getTitleText());
    screenContent.appendChild(this.getDifficultyButtons());
    screenContent.appendChild(this.getStartButton());
    this.screenContainer.appendChild(screenContent);
  }
  getDifficultyButtons() {
    let difficulties = { easy: 12, normal: 24, hard: 48 };
    let difficultySettings = document.createElement("menu");
    for (let [description, numberOfCards] of Object.entries(difficulties)) {
      let diffLevelBtn = document.createElement("img");
      diffLevelBtn.classList.add("difficulty-button");
      diffLevelBtn.id = `${description}-difficulty-btn`;
      diffLevelBtn.src = IMG_DIR_BUTTONS + `${description}.png`;
      diffLevelBtn.addEventListener("click", () => {
        this.selectDifficulty(description, numberOfCards);
      });
      difficultySettings.appendChild(diffLevelBtn);
    }
    return difficultySettings;
  }
  getTitleText() {
    let title = document.createElement("img");
    title.src = IMG_DIR_TEXT + "title.png";
    title.classList.add("title");
    return title;
  }
  getStartButton() {
    let startBtn = document.createElement("img");
    startBtn.classList.add("start-button");
    startBtn.src = IMG_DIR_BUTTONS + "start_game_button.png";
    startBtn.addEventListener("click", () => {
      this.controller.screens.inGameScreen.startNewGame(this.numberOfCards);
      this.controller.switchScreen(this.controller.screens.inGameScreen);
    });
    return startBtn;
  }
  selectDifficulty(level, numberOfCards) {
    document.getElementById("easy-difficulty-btn").classList.remove("selected");
    document
      .getElementById("normal-difficulty-btn")
      .classList.remove("selected");
    document.getElementById("hard-difficulty-btn").classList.remove("selected");
    document
      .getElementById(`${level}-difficulty-btn`)
      .classList.add("selected");
    this.numberOfCards = numberOfCards;
  }
}

class InGameScreen extends Screen {
  constructor() {
    super("in-game-screen");
  }
  startNewGame(numberOfCards) {
    let game = new Game(numberOfCards);
    game.setController(this.controller);
  }
}

class GameOverScreen extends Screen {
  constructor() {
    super("game-over-screen");
    this.createContent();
  }
  updateScreen() {
    this.clearContent();
    this.createContent();
  }
  createContent() {
    let screenContent = document.createElement("div");
    screenContent.classList.add("screen-content");
    screenContent.appendChild(this.getMessageText());
    screenContent.appendChild(this.getNewGameBtn());
    this.screenContainer.appendChild(screenContent);
  }
  getNewGameBtn() {
    let newGameBtn = document.createElement("img");
    newGameBtn.classList.add("again-button");
    newGameBtn.src = IMG_DIR_BUTTONS + "play_again_golden.png";
    newGameBtn.addEventListener("click", () => {
      this.controller.switchScreen(this.controller.screens.startGameScreen);
    });
    return newGameBtn;
  }
  getMessageText() {
    let wellDone = document.createElement("img");
    wellDone.src = IMG_DIR_TEXT + "well_done.png";
    wellDone.classList.add("well-done");
    return wellDone;
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
