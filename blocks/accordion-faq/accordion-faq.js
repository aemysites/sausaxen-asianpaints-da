/*
 * Accordion FAQ Block - Asian Paints Style
 * Transforms FAQ content into expandable details/summary elements
 * Content model: alternating rows of questions and answers
 */

export default function decorate(block) {
  const rows = [...block.children];

  // Clear the block
  block.innerHTML = '';

  // Add CSS counter for numbering
  let questionNumber = 0;

  // Process pairs of rows (question, answer)
  for (let i = 0; i < rows.length; i += 2) {
    const questionRow = rows[i];
    const answerRow = rows[i + 1];

    // Get question text
    const questionText = questionRow ? questionRow.textContent.trim() : '';

    if (questionRow && questionText) {
      questionNumber += 1;

      // Create details element
      const details = document.createElement('details');
      details.className = 'accordion-faq-item';

      // Open first item by default
      if (questionNumber === 1) {
        details.setAttribute('open', '');
      }

      // Create summary with numbered question
      const summary = document.createElement('summary');
      summary.className = 'accordion-faq-item-label';
      summary.textContent = `${questionNumber}. ${questionText}`;
      details.appendChild(summary);

      // Create answer body
      if (answerRow) {
        const body = document.createElement('div');
        body.className = 'accordion-faq-item-body';
        body.innerHTML = answerRow.innerHTML;
        details.appendChild(body);
      }

      block.appendChild(details);
    }
  }
}
