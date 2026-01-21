var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-colour-inspiration.js
  var import_colour_inspiration_exports = {};
  __export(import_colour_inspiration_exports, {
    default: () => import_colour_inspiration_default
  });

  // tools/importer/parsers/cards-texture.js
  function parse(element, { document }) {
    const cells = [];
    let cards = element.querySelectorAll('.card, .feature-card, .item, [class*="card"]');
    if (cards.length === 0) cards = element.querySelectorAll(".why-choose-item, .choose-item, > div");
    if (cards.length === 0) cards = element.querySelectorAll(".image-item, .grid-item, a");
    cards.forEach((card) => {
      const row = [];
      const img = card.querySelector("img");
      if (img && img.src) {
        const imgEl = document.createElement("img");
        imgEl.src = img.src;
        imgEl.alt = img.alt || "";
        row.push(imgEl);
      }
      const title = card.querySelector("h3, h4, .title, .card-title, strong");
      if (title) row.push(title.textContent.trim());
      const desc = card.querySelector("p, .description, .card-text");
      if (desc && desc !== title) row.push(desc.textContent.trim());
      if (row.length > 0) cells.push(row);
    });
    if (cells.length > 0) {
      const block = WebImporter.Blocks.createBlock(document, { name: "Cards", cells });
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/accordion-faq.js
  function parse2(element, { document }) {
    const cells = [];
    let faqItems = element.querySelectorAll(".each-container, .js-faqDropDown, .faq-item");
    if (faqItems.length === 0) faqItems = element.querySelectorAll('.accordion-item, [class*="accordion"], details');
    if (faqItems.length === 0) {
      const questions = element.querySelectorAll(".question, .faq-question, dt, h3, h4");
      const answers = element.querySelectorAll(".answer, .faq-answer, dd, p");
      questions.forEach((q, i) => {
        const row = [q.textContent.trim()];
        if (answers[i]) row.push(answers[i].textContent.trim());
        if (row[0]) cells.push(row);
      });
    } else {
      faqItems.forEach((item) => {
        const question = item.querySelector('.question, .faq-question, h3, h4, summary, [class*="question"]');
        const answer = item.querySelector('.answer, .faq-answer, p, [class*="answer"]');
        if (question) {
          const row = [question.textContent.trim()];
          if (answer) row.push(answer.textContent.trim());
          cells.push(row);
        }
      });
    }
    if (cells.length > 0) {
      const block = WebImporter.Blocks.createBlock(document, { name: "Accordion", cells });
      element.replaceWith(block);
    }
  }

  // tools/importer/transformers/asianpaints-cleanup.js
  function transform(hookName, element, payload) {
    if (hookName !== "beforeTransform") return;
    element.querySelectorAll("script, style, nav, footer, header, .header, .footer, .navigation").forEach((el) => el.remove());
    element.querySelectorAll('[style*="display: none"], [style*="display:none"], .hidden').forEach((el) => el.remove());
    element.querySelectorAll('.popup, .modal, [class*="popup"], [class*="modal"]').forEach((el) => el.remove());
    element.querySelectorAll('.share-buttons, .social-share, [class*="share"]').forEach((el) => el.remove());
    element.querySelectorAll('.cookie-notice, .cookie-banner, [class*="cookie"]').forEach((el) => el.remove());
    element.querySelectorAll('.chat-widget, [class*="chat"], #chat').forEach((el) => el.remove());
  }

  // tools/importer/import-colour-inspiration.js
  var parsers = {
    "cards-texture": parse,
    "accordion-faq": parse2
  };
  var transformers = [transform];
  var PAGE_TEMPLATE = {
    name: "colour-inspiration",
    blocks: [
      { name: "cards-texture", instances: [".whychooseus-wraper"] },
      { name: "accordion-faq", instances: [".faq"] }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    transformers.forEach((fn) => {
      try {
        fn(hookName, element, payload);
      } catch (e) {
        console.error(e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        document.querySelectorAll(selector).forEach((element) => {
          pageBlocks.push({ name: blockDef.name, selector, element });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances`);
    return pageBlocks;
  }
  var import_colour_inspiration_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(e);
          }
        }
      });
      executeTransformers("afterTransform", main, payload);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, ""));
      return [{ element: main, path, report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) } }];
    }
  };
  return __toCommonJS(import_colour_inspiration_exports);
})();
