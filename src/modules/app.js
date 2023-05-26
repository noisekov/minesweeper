/* eslint-disable */
import { createElement, createMainField } from '../modules/create-node.js';

createMainField();

class Minesweeper {

  constructor(field, mine) {
    this.row = field;
    this.column = field;
    this.mine = mine;
    this.allField = [];
    this.mapElNearMine = [];
    this.mineField = new Set();
    this.youAreWin = false;
    this.gameOver = false;
    this.firstClick = true;
    this.refreshInterval = null;
    this.mineLeft = 0;
    this.sound = true;
    this.objColor = {
      1 : 'Red',
      2 : 'Blue',
      3 : 'Green',
      4 : 'Indigo',
      5 : 'Brown',
      6 : 'DeepPink',
      7 : 'DarkSlateGray',
      8 : 'MediumPurple',
    }
    this.countClick = 0;
    this.countFlag = 0;
    this.countTimer = 0;
    this.startApp();
  }

  startApp() {
    this.initField();
    this.createMenu();
    this.initResults();
    this.saveGame();
  }

  initField() {
    const wrapper = document.querySelector('.wrapper');
    wrapper.append(createElement('div', 'minesweeper-wrap'));
    const minesweeperWrap = document.querySelector('.minesweeper-wrap');
    minesweeperWrap.append(createElement('div', 'minesweeper'));
    const minesweeper = document.querySelector('.minesweeper');
    minesweeper.style.gridTemplateColumns = `repeat(${this.row} , 1fr)`;
    let count = 0;
    for (let i = 1; i <= this.row; i += 1) {
      const row = [];
      for (let j = 1; j <= this.column; j += 1) {
          count += 1;
          row.push(`${count}`);
          minesweeper.append(createElement('button', `box ${count}`, '', `${j}`, `${i}`));
      }
      this.allField.push(row);
    }
    wrapper.onclick = (evt) => {
      this.click(evt);
      this.reloadCountMenu();
      if (!this.gameOver) {
        if (evt.target.closest('.box') && !evt.target.closest('.box').classList.contains('is-here')) {
          this.openBox(evt.target.closest('.box'));
        }
      }
    };
    wrapper.oncontextmenu = (evt) => {
      this.markMine(evt);
      this.countFlags();
    };
  }

  initMine(firstElementClick) {
    const minesweeper = document.querySelector('.minesweeper');
    while (this.mineField.size < this.mine) {
      let newRandomValue = Math.floor(Math.random() * (minesweeper.children.length - 0) + 0);
      if (newRandomValue !== firstElementClick) {
        this.mineField.add(newRandomValue);
      }
    }
    [...this.mineField].forEach(mine => {
      minesweeper.children[mine].classList.add('boomb');
    });
  }

  initResults() {
    const wrapper = document.querySelector('.wrapper');
    wrapper.append(createElement('div', 'results'));
    const results = document.querySelector('.results');
    results.append(createElement('h1', 'results__title', 'Results'));
    results.append(createElement('ol', 'results__items'));

    const resultsItems = document.querySelector('.results__items');

    for (let i = 1; i <= 10; i += 1) {
      let valueLoccalStorage = localStorage.getItem(`resultsGameMinesweeper ${i}`)
      if (valueLoccalStorage) {
        resultsItems.prepend(createElement('li', 'results__item', `${valueLoccalStorage}`));
      }
    }
  }

  saveGame() {
    const wrapper = document.querySelector('.wrapper');
    wrapper.append(createElement('div', 'game-save'));
    const gameSave = document.querySelector('.game-save');
    gameSave.setAttribute('title', 'Save game');
    gameSave.onclick = () => { this.saveStateGameNow() };

    wrapper.append(createElement('button', 'continue-game', 'Continue'));
    const continueGame = document.querySelector('.continue-game');
    continueGame.setAttribute('title', 'Game continue');
    continueGame.onclick = () => { this.continueState() };
  }

  saveStateGameNow() {
    const minesweeper = document.querySelector('.minesweeper');
    localStorage.setItem('noisekov-Minesweeper-HTML', `${minesweeper.innerHTML}`);
    localStorage.setItem('noisekov-Minesweeper-column', `${this.column}`);
    localStorage.setItem('noisekov-Minesweeper-countClick', `${this.countClick}`);
    localStorage.setItem('noisekov-Minesweeper-countFlag', `${this.countFlag}`);
    localStorage.setItem('noisekov-Minesweeper-countTimer', `${this.countTimer}`);
    localStorage.setItem('noisekov-Minesweeper-firstClick', `${this.firstClick}`);
    localStorage.setItem('noisekov-Minesweeper-gameOver', `${this.gameOver}`);
    localStorage.setItem('noisekov-Minesweeper-mine', `${this.mine}`);
    localStorage.setItem('noisekov-Minesweeper-youAreWin', `${this.youAreWin}`);
    localStorage.setItem('noisekov-Minesweeper-row', `${this.row}`);
    localStorage.setItem('noisekov-Minesweeper-sound', `${this.sound}`);
    localStorage.setItem('noisekov-Minesweeper-mineLeft', `${this.mineLeft}`);
    localStorage.setItem('noisekov-Minesweeper-mapElNearMine', `${JSON.stringify(this.mapElNearMine)}`);
    localStorage.setItem('noisekov-Minesweeper-mineField', `${JSON.stringify([...this.mineField])}`);
  }

  continueState() {
    const countClick = localStorage.getItem('noisekov-Minesweeper-countClick');
    const countFlag = localStorage.getItem('noisekov-Minesweeper-countFlag');
    const countTimer = localStorage.getItem('noisekov-Minesweeper-countTimer');
    const firstClick = localStorage.getItem('noisekov-Minesweeper-firstClick');
    const gameOver = localStorage.getItem('noisekov-Minesweeper-gameOver');
    const mine = localStorage.getItem('noisekov-Minesweeper-mine');
    const youAreWin = localStorage.getItem('noisekov-Minesweeper-youAreWin');
    const row = localStorage.getItem('noisekov-Minesweeper-row');
    const sound = localStorage.getItem('noisekov-Minesweeper-sound');
    const mineLeft = localStorage.getItem('noisekov-Minesweeper-mineLeft');
    const mapElNearMine = localStorage.getItem('noisekov-Minesweeper-mapElNearMine');
    const mineField = localStorage.getItem('noisekov-Minesweeper-mineField');
    const HTML = localStorage.getItem('noisekov-Minesweeper-HTML');

    const minesweeperWrap = document.querySelector('.minesweeper-wrap');
    const results = document.querySelector('.results');
    const gameSave = document.querySelector('.game-save');
    const continueGame = document.querySelector('.continue-game');
    minesweeperWrap.remove();
    gameSave.remove();
    results.remove();
    continueGame.remove();
    new Minesweeper (+row, +mine);
    const minesweeper = document.querySelector('.minesweeper');

    minesweeper.innerHTML = HTML;
    this.mapElNearMine = JSON.parse(mapElNearMine);
    this.countClick = +countClick;
    this.countFlag = +countFlag;
    this.countTimer = +countTimer;
    this.firstClick = JSON.parse(firstClick);
    this.gameOver = JSON.parse(gameOver);
    this.youAreWin = JSON.parse(youAreWin);
    this.sound = JSON.parse(sound);
    this.mineLeft = +mineLeft;
    this.mineField = new Set(JSON.parse(mineField));
    const countFlaginGame = document.querySelector('.menu__count-flag');
    countFlaginGame.innerText = this.countFlag;
    const countMine = document.querySelector('.menu__count-mine');
    countMine.innerText = this.mineLeft - this.countFlag;
    const timer = document.querySelector('.menu__time');
    timer.innerText = this.countTimer;
    this.refreshInterval = setInterval(() => {
        this.countTimer += 1;
        timer.innerText = `${this.countTimer}`;
    }, 1000);

    const wrapper = document.querySelector('.wrapper');

    wrapper.onclick = (evt) => {
      this.click(evt);
      this.reloadCountMenu();
      if (!this.gameOver) {
        if (evt.target.closest('.box') && !evt.target.closest('.box').classList.contains('is-here')) {
          this.openBox(evt.target.closest('.box'));
        }
      }
    };
    wrapper.oncontextmenu = (evt) => {
      this.markMine(evt);
      this.countFlags();
    };
  }

  saveResults(timeCounter, clicks) {
    const resultsItem = document.querySelectorAll('.results__item');
    if (localStorage.length === 10) {
      for (let i = 1; i <= 9; i += 1) {
        localStorage.setItem(`resultsGameMinesweeper ${i}`, localStorage.getItem(`resultsGameMinesweeper ${i+1}`));
      }
      localStorage.removeItem(`resultsGameMinesweeper ${10}`);
      localStorage.setItem(`resultsGameMinesweeper ${resultsItem.length}`, `Time ${timeCounter} sec, and ${clicks} moves.`);
    } else {
      localStorage.setItem(`resultsGameMinesweeper ${resultsItem.length}`, `Time ${timeCounter} sec, and ${clicks} moves.`);
    }
  }

  countFlags() {
    const minesweeper = document.querySelector('.minesweeper');
    const countFlag = document.querySelector('.menu__count-flag');

    this.countFlag = 0;

    Array.from(minesweeper.children).forEach((box) => {
      if (box.classList.contains('is-here')) {
        this.countFlag += 1;
      }
    })
    countFlag.innerText = this.countFlag;
    this.counterMineLeft();
  }

  click(evt) {
    if (!this.gameOver && !this.youAreWin) {
      if (evt.target.closest('.box') && !evt.target.closest('.box').classList.contains('is-here')) {
        if (!evt.target.closest('.box').classList.contains('current')) {
          if (this.sound) {
            const clickSound = new Audio('./assets/click.wav');
            clickSound.play();
          }
          this.countClick += 1;
        }
        evt.target.closest('.box').classList.add('current');
        if (this.firstClick) {
          this.firstClick = false;
          this.startTimer();
          const firstElem = +evt.target.closest('.box').classList[1] - 1;
          this.initMine(firstElem);
          this.countMineAround();
        }
        this.counterMineLeft();
        if (evt.target.closest('.box').classList.contains('boomb')) {
          this.gameOver = true;
          const minesweeper = document.querySelector('.minesweeper');
          Array.from(minesweeper.children).forEach((box) => {
            if (box.classList.contains('boomb')) {
              box.classList.add('current');
            }
          })
          this.finishGame();
        }
        this.winGame();
      }
    }
    if (evt.target.closest('.menu__start')) {
      this.startAgain();
    }
  }

  countMineAround() {
    const minesweeper = document.querySelector('.minesweeper');
    if (this.mapElNearMine.length === 0) {
      Array.from(minesweeper.children).forEach((box) => {
        if (box.classList.contains('boomb')) {
          this.mapElNearMine.push(`${+box.dataset.column + 1} ${+box.dataset.row + 1}`);
          this.mapElNearMine.push(`${+box.dataset.column - 1} ${+box.dataset.row - 1}`);
          this.mapElNearMine.push(`${+box.dataset.column + 1} ${+box.dataset.row - 1}`);
          this.mapElNearMine.push(`${+box.dataset.column - 1} ${+box.dataset.row + 1}`);
          this.mapElNearMine.push(`${+box.dataset.column} ${+box.dataset.row + 1}`);
          this.mapElNearMine.push(`${+box.dataset.column} ${+box.dataset.row - 1}`);
          this.mapElNearMine.push(`${+box.dataset.column + 1} ${+box.dataset.row}`);
          this.mapElNearMine.push(`${+box.dataset.column - 1} ${+box.dataset.row}`);
        }
      })

      this.mapElNearMine.forEach(val => {
        Array.from(minesweeper.children).forEach((box) => {
            if (+box.dataset.column === +val.split(' ')[0]
              && +box.dataset.row === +val.split(' ')[1]
              && !box.classList.contains('boomb')) {
                let textInnerBox = +box.innerText;
                textInnerBox += 1;
                box.innerText = textInnerBox;
                box.classList.add(`${this.objColor[+box.innerText]}`);
            }
        })
      })
    }
  }

  markMine(evt) {
    evt.preventDefault();
    if (evt.target.closest('.box') && !evt.target.closest('.box').classList.contains('current') && !this.firstClick) {
      if (evt.target.closest('.box').classList.contains('is-here')) {
        evt.target.closest('.box').classList.remove('is-here');
      } else {
        if (this.sound) {
          const clickSound = new Audio('./assets/flag.wav');
          clickSound.play();
        }
        evt.target.closest('.box').classList.add('is-here');
      }
    }
  }

  //need to add another class MENU
  createMenu() {
    const minesweeperWrap = document.querySelector('.minesweeper-wrap');
    minesweeperWrap.prepend(createElement('div', 'menu'));
    const menu = document.querySelector('.menu');
    menu.append(createElement('div', 'menu__count-click'));
    menu.append(createElement('div', 'menu__count-mine'));
    menu.append(createElement('div', 'menu__count-flag'));
    menu.append(createElement('div', 'menu__time'));
    menu.append(createElement('button', 'menu__start'));
    const countMenu = document.querySelector('.menu__count-click');
    countMenu.innerText = this.countClick;
    const timer = document.querySelector('.menu__time');
    timer.innerText = this.countFlag;
    const countFlag = document.querySelector('.menu__count-flag');
    countFlag.innerText = 0;
    const start = document.querySelector('.menu__start');
    start.innerText = 'New game';
    const countMine = document.querySelector('.menu__count-mine');
    countMine.innerText = this.mineLeft;

    menu.append(createElement('button', 'menu__toggle-sound'));
    const menuBtnSound = document.querySelector('.menu__toggle-sound');
    menuBtnSound.classList.add('on');
    menuBtnSound.onclick = () => this.toggleSound();
  }

  counterMineLeft() {
    const minesweeper = document.querySelector('.minesweeper');
    const countMine = document.querySelector('.menu__count-mine');

    this.mineLeft = 0;
    Array.from(minesweeper.children).forEach((box) => {
      if (box.classList.contains('boomb')) {
        this.mineLeft += 1;
      }
    })
    countMine.innerText = this.mineLeft - this.countFlag;
  }

  toggleSound() {
    const menuBtnSound = document.querySelector('.menu__toggle-sound');
    if (this.sound) {
      menuBtnSound.classList.add('off');
      menuBtnSound.classList.remove('on');
      this.sound = false;
    } else {
      menuBtnSound.classList.add('on');
      menuBtnSound.classList.remove('off');
      this.sound = true;
    }
  }

  reloadCountMenu() {
    const countMenu = document.querySelector('.menu__count-click');
    countMenu.innerText = this.countClick;
  }

  startTimer() {
    const timer = document.querySelector('.menu__time');
    this.refreshInterval = setInterval(() => {
      this.countTimer += 1;
      timer.innerText = `${this.countTimer}`;
    }, 1000);
  }

  startAgain() {
    this.allField = [];
    this.mapElNearMine = [];
    this.mineField = new Set();
    this.youAreWin = false;
    this.gameOver = false;
    this.firstClick = true;
    clearInterval(this.refreshInterval);
    this.countClick = 0;
    this.countTimer = 0;
    this.countFlag = 0;
    this.mineLeft = 0;
    const countMine = document.querySelector('.menu__count-mine');
    countMine.innerText = 0;
    const countFlag = document.querySelector('.menu__count-flag');
    countFlag.innerText = 0;
    const minesweeper = document.querySelector('.minesweeper');
    const menutime = document.querySelector('.menu__time');
    menutime.innerText = 0;
    const results = document.querySelector('.results');
    results.remove();
    this.initResults();
    Array.from(minesweeper.children).forEach((box) => {
      box.classList.value = Array.from(box.classList).splice(0, 2).join(' ');
      box.innerText = '';
      box.style.color = '';
      const modal = document.querySelector('.modal');
      if (modal) {
        modal.remove();
      }
    })
  }

  winGame() {
    const minesweeper = document.querySelector('.minesweeper');
    const win = Array.from(minesweeper.children).every((box) => {
      return box.classList.contains('current') ||  box.classList.contains('boomb');
    })

    if (win && this.youAreWin === false) {
      this.youAreWin = true;
      clearInterval(this.refreshInterval);
      if (this.sound) {
        const winnerSound = new Audio('./assets/winner.wav');
        winnerSound.play();
      }
      const container = document.querySelector('.container');
      container.append(createElement('div', 'modal', `Hooray! You found all mines in ${this.countTimer} seconds and ${this.countClick} moves!`));
      const modal = document.querySelector('.modal');
      modal.append(createElement('button', 'modal__btn', `Ok`));
      const modalBtn = document.querySelector('.modal__btn');
      modalBtn.onclick = () => modal.remove();
      const resultsItems = document.querySelector('.results__items');

      if (resultsItems.children.length < 10) {
        resultsItems.append(createElement('li', 'results__item',));
      }
      this.saveResults(this.countTimer, this.countClick);
    }
  }

  openBox(evt) {
    const minesweeper = document.querySelector('.minesweeper');

    Array.from(minesweeper.children).filter((box) => {
      if (evt.dataset.column === `${+box.dataset.column + 1}` &&
      evt.dataset.row === `${+box.dataset.row + 1}` && evt.innerText === '') {
        if (!box.classList.contains('boomb')
        && !box.classList.contains('is-here')
        && !box.classList.contains('current')) {
          box.classList.add('current');
          this.openBox(box);
        } else if (typeof +box.innerText === 'number'
        && !box.classList.contains('boomb')
        && !box.classList.contains('is-here')){
          box.classList.add('current');
        }
      } else if (evt.dataset.column === `${+box.dataset.column - 1}` &&
      evt.dataset.row === `${+box.dataset.row - 1}` && evt.innerText === '') {
        if (!box.classList.contains('boomb')
        && !box.classList.contains('is-here')
        && !box.classList.contains('current')) {
          box.classList.add('current');
          this.openBox(box);
        } else if (typeof +box.innerText === 'number'
        && !box.classList.contains('boomb')
        && !box.classList.contains('is-here')){
          box.classList.add('current');
        }
      } else if (evt.dataset.column === `${+box.dataset.column + 1}` &&
      evt.dataset.row === `${+box.dataset.row - 1}` && evt.innerText === '') {
        if (!box.classList.contains('boomb')
        && !box.classList.contains('is-here')
        && !box.classList.contains('current')) {
          box.classList.add('current');
          this.openBox(box);
        } else if (typeof +box.innerText === 'number'
        && !box.classList.contains('boomb')
        && !box.classList.contains('is-here')){
          box.classList.add('current');
        }
      } else if (evt.dataset.column === `${+box.dataset.column - 1}` &&
      evt.dataset.row === `${+box.dataset.row + 1}` && evt.innerText === '') {
        if (!box.classList.contains('boomb')
        && !box.classList.contains('is-here')
        && !box.classList.contains('current')) {
          box.classList.add('current');
          this.openBox(box);
        } else if (typeof +box.innerText === 'number'
        && !box.classList.contains('boomb')
        && !box.classList.contains('is-here')){
          box.classList.add('current');
        }
      } else if (evt.dataset.column === box.dataset.column &&
      evt.dataset.row === `${+box.dataset.row + 1}` && evt.innerText === '') {
        if (!box.classList.contains('boomb')
        && !box.classList.contains('is-here')
        && !box.classList.contains('current')) {
          box.classList.add('current');
          this.openBox(box);
        } else if (typeof +box.innerText === 'number'
        && !box.classList.contains('boomb')
        && !box.classList.contains('is-here')){
          box.classList.add('current');
        }
      } else if (evt.dataset.column === `${+box.dataset.column + 1}` &&
      evt.dataset.row === box.dataset.row && evt.innerText === '') {
        if (!box.classList.contains('boomb')
        && !box.classList.contains('is-here')
        && !box.classList.contains('current')) {
          box.classList.add('current');
          this.openBox(box);
        } else if (typeof +box.innerText === 'number'
        && !box.classList.contains('boomb')
        && !box.classList.contains('is-here')){
          box.classList.add('current');
        }
      } else if (evt.dataset.column === `${+box.dataset.column - 1}` &&
      evt.dataset.row === box.dataset.row && evt.innerText === '') {
        if (!box.classList.contains('boomb')
        && !box.classList.contains('is-here')
        && !box.classList.contains('current')) {
          box.classList.add('current');
          this.openBox(box);
        } else if (typeof +box.innerText === 'number'
        && !box.classList.contains('boomb')
        && !box.classList.contains('is-here')){
          box.classList.add('current');
        }
      } else if (evt.dataset.column === box.dataset.column &&
      evt.dataset.row === `${+box.dataset.row - 1}` && evt.innerText === '') {
        if (!box.classList.contains('boomb')
        && !box.classList.contains('is-here')
        && !box.classList.contains('current')) {
          box.classList.add('current');
          this.openBox(box);
        } else if (typeof +box.innerText === 'number'
        && !box.classList.contains('boomb')
        && !box.classList.contains('is-here')){
          box.classList.add('current');
        }
      }
    })
    this.winGame();
  }

  finishGame() {
    if (this.sound) {
      const loseSound = new Audio('./assets/lose.mp3');
      loseSound.play();
    }
    clearInterval(this.refreshInterval);
    const container = document.querySelector('.container');
    container.append(createElement('div', 'modal', 'Game over. Try again!'));
    const modal = document.querySelector('.modal');
    modal.append(createElement('button', 'modal__btn', `Ok`));
    const modalBtn = document.querySelector('.modal__btn');
    modalBtn.onclick = () => modal.remove();
  }
}
export { Minesweeper };