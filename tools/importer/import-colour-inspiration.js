/* eslint-disable */
/* global WebImporter */

import cardsTextureParser from './parsers/cards-texture.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import asianpaintsCleanupTransformer from './transformers/asianpaints-cleanup.js';

const parsers = {
  'cards-texture': cardsTextureParser,
  'accordion-faq': accordionFaqParser,
};

const transformers = [asianpaintsCleanupTransformer];

const PAGE_TEMPLATE = {
  name: 'colour-inspiration',
  blocks: [
    { name: 'cards-texture', instances: ['.whychooseus-wraper'] },
    { name: 'accordion-faq', instances: ['.faq'] }
  ]
};

function executeTransformers(hookName, element, payload) {
  transformers.forEach((fn) => { try { fn(hookName, element, payload); } catch (e) { console.error(e); } });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach(blockDef => {
    blockDef.instances.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        pageBlocks.push({ name: blockDef.name, selector, element });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;
    executeTransformers('beforeTransform', main, payload);
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
    pageBlocks.forEach(block => {
      const parser = parsers[block.name];
      if (parser) { try { parser(block.element, { document, url, params }); } catch (e) { console.error(e); } }
    });
    executeTransformers('afterTransform', main, payload);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
    const path = WebImporter.FileUtils.sanitizePath(new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''));
    return [{ element: main, path, report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map(b => b.name) } }];
  }
};
