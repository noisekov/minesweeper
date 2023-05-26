/* eslint-disable */
import { createElement } from '../modules/create-node.js';

const createTheme = () => {
  const body = document.querySelector('body');
  body.append(createElement('div', 'theme'));
  const theme = document.querySelector('.theme');
  theme.append(createElement('select', 'theme__select'));
  const select = document.querySelector('.theme__select');
  select.append(createElement('option', 'theme__option--white', 'White theme'));
  select.append(createElement('option', 'theme__option--black', 'Black theme'));
  const optionWhite = document.querySelector('.theme__option--white');
  const optionBlack = document.querySelector('.theme__option--black');
  optionWhite.value = 'light';
  optionBlack.value = 'dark';
};
createTheme();

const htmlEl = document.getElementsByTagName('html')[0];
const select = document.querySelector('.theme__select');

select.addEventListener("change", function(){
  toggleTheme(select.value);
});

const toggleTheme = (theme = 'light') => {
  htmlEl.dataset.theme = theme;
}
toggleTheme();
