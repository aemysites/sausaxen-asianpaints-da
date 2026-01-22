import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  let stepNum = 1;
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    // Add step number
    const stepNumber = document.createElement('span');
    stepNumber.className = 'cards-steps-number';
    stepNumber.textContent = String(stepNum).padStart(2, '0');
    li.prepend(stepNumber);
    stepNum += 1;

    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.tagName === 'DIV') {
        div.className = 'cards-steps-card-body';
      }
    });
    ul.append(li);
  });
  block.textContent = '';
  block.append(ul);
}
