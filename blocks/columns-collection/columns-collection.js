export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-collection-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pics = col.querySelectorAll('picture');
      if (pics.length > 0) {
        // Check if column is primarily images (has pictures and minimal text content)
        const hasHeading = col.querySelector('h1, h2, h3, h4, h5, h6');
        const textContent = col.textContent.trim();
        const isSingleImageWithMinimalText = pics.length === 1 && textContent.length < 50;
        const isImageColumn = !hasHeading && (pics.length > 1 || isSingleImageWithMinimalText);

        if (isImageColumn) {
          col.classList.add('columns-collection-img-col');
          // Wrap pictures in a grid container if multiple images
          if (pics.length > 1) {
            const gridWrapper = document.createElement('div');
            gridWrapper.className = 'columns-collection-img-grid';
            pics.forEach((pic) => {
              const wrapper = document.createElement('div');
              wrapper.className = 'columns-collection-img-item';
              pic.parentNode.insertBefore(wrapper, pic);
              wrapper.appendChild(pic);
              gridWrapper.appendChild(wrapper);
            });
            col.innerHTML = '';
            col.appendChild(gridWrapper);
          }
        }
      }
    });
  });
}
