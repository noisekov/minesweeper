/* eslint-disable */

import { createElement } from '../modules/create-node.js';
import { Minesweeper } from '../modules/app.js';

const createLevelMinesweeper = () => {
  const wrapper = document.querySelector('.wrapper');
  wrapper.append(createElement('div', 'settings'));
  const settings = document.querySelector('.settings');
  settings.append(createElement('div', 'level'));
  settings.append(createElement('div', 'settings__img'));
  const level = document.querySelector('.level');
  const settingsImg = document.querySelector('.settings__img');
  settingsImg.onclick = (evt) => {
    if (evt.target.closest('.settings__img')) {
      level.classList.toggle('level--active');
    }
  };
  level.append(createElement('span', 'level__close'));
  const levelClose = document.querySelector('.level__close');
  levelClose.onclick = (evt) => {
    if (evt.target.closest('.level__close')) {
      level.classList.toggle('level--active');
    }
  };
  level.append(createElement('label', 'level__label', 'easy (10 x 10)'));
  level.append(createElement('label', 'level__label', 'medium (15 x 15)'));
  level.append(createElement('label', 'level__label', 'hard (25 x 25)'));

  const levelLabel = document.querySelectorAll('.level__label');
  levelLabel.forEach(label => label.append(createElement('input', 'level__radio')));

  level.append(createElement('div', 'level__range-wrapper'));
  const levelRangeWrap = document.querySelector('.level__range-wrapper');
  levelRangeWrap.append(createElement('input', 'level__range'));
  const levelRange = document.querySelector('.level__range');
  levelRange.setAttribute('type', 'range');
  levelRange.setAttribute('min', '10');
  levelRange.setAttribute('max', '99');
  levelRange.addEventListener('input', changeRange);

  levelRangeWrap.append(createElement('span', 'level__range-value', `Set mine ${levelRange.value}`));
  const levelRangeVal = document.querySelector('.level__range-value');

  function changeRange (evt) {
    levelRangeVal.innerText = `Set mine ${evt.target.value}`;
  }
  level.append(createElement('button', 'level__save', 'Change level'));
  const levelSave = document.querySelector('.level__save');
  levelSave.onclick = (evt) => {
    if (evt.target.closest('.level__save')) {
      level.classList.toggle('level--active');
    }
  };
};
createLevelMinesweeper();

const levelCheckbox = document.querySelectorAll('.level__radio');
levelCheckbox.forEach((input, i) => {
  input.setAttribute('type', 'radio');
  input.setAttribute('name', 'level');
  input.id = i + 1;
});

let minesweeperEl;
window.addEventListener('DOMContentLoaded', () => {
  minesweeperEl = new Minesweeper(10, 10);
})

const settingsSave = document.querySelector('.level__save');
settingsSave.addEventListener('click', () => settings());

function settings () {
  const levelCheckbox = document.querySelectorAll('.level__radio');
  const levelRange = document.querySelector('.level__range');

  levelCheckbox.forEach((input) => {
    if (input.checked) {
      const minesweeperWrap = document.querySelector('.minesweeper-wrap');
      const results = document.querySelector('.results');
      const gameSave = document.querySelector('.game-save');
      const continueGame = document.querySelector('.continue-game');
      minesweeperEl = null;
      minesweeperWrap.remove();
      gameSave.remove();
      results.remove();
      continueGame.remove();

      if (input.id == 1) {
        minesweeperEl = new Minesweeper(10, +levelRange.value);
      }
      if (input.id == 2) {
        minesweeperEl = new Minesweeper(15, +levelRange.value);
      }
      if (input.id == 3) {
        minesweeperEl = new Minesweeper(25, +levelRange.value);
      }
    }
  })
}
