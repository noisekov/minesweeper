/* eslint-disable */
const createElement = (tag, className, text = '', column, row) => {
  const node = document.createElement(`${tag}`);
  node.className = `${className}`;
  node.innerText = `${text}`;
  if (column && row) {
    node.dataset.column = column;
    node.dataset.row = row;
  }
  return node;
};

const createMainField = () => {
  const body = document.querySelector('body');
  body.append(createElement('div', 'container'));
  const container = document.querySelector('.container');
  container.append(createElement('div', 'wrapper'));
}
export { createElement, createMainField };