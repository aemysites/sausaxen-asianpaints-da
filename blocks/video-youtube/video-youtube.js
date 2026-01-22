/*
 * Video YouTube Block
 * Show a YouTube video with thumbnail placeholder
 */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function embedYoutube(url, autoplay) {
  const usp = new URLSearchParams(url.search);
  let suffix = '';
  if (autoplay) {
    suffix = '&autoplay=1&mute=0&controls=1';
  }
  let vid = usp.get('v') ? encodeURIComponent(usp.get('v')) : '';
  const embed = url.pathname;
  if (url.origin.includes('youtu.be')) {
    [, vid] = url.pathname.split('/');
  }

  const temp = document.createElement('div');
  temp.innerHTML = `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
      <iframe src="https://www.youtube.com${vid ? `/embed/${vid}?rel=0&v=${vid}${suffix}` : embed}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;"
      allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope; picture-in-picture" allowfullscreen="" scrolling="no" title="Content from Youtube" loading="lazy"></iframe>
    </div>`;
  return temp.children.item(0);
}

const loadVideoEmbed = (block, link, autoplay) => {
  if (block.dataset.embedLoaded === 'true') {
    return;
  }
  const url = new URL(link);
  const embedWrapper = embedYoutube(url, autoplay);
  block.append(embedWrapper);
  embedWrapper.querySelector('iframe').addEventListener('load', () => {
    block.dataset.embedLoaded = true;
  });
};

export default async function decorate(block) {
  const placeholder = block.querySelector('picture');
  let link = block.querySelector('a')?.href;

  // If no anchor found, try to find YouTube URL in text content
  if (!link) {
    const textContent = block.textContent;
    const youtubeMatch = textContent.match(/https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/);
    if (youtubeMatch) {
      link = youtubeMatch[0];
    }
  }

  if (!link) {
    // eslint-disable-next-line no-console
    console.warn('Video block: No video link found');
    return;
  }

  block.textContent = '';
  block.dataset.embedLoaded = false;

  const autoplay = block.classList.contains('autoplay');

  if (placeholder) {
    block.classList.add('placeholder');
    const wrapper = document.createElement('div');
    wrapper.className = 'video-youtube-placeholder';
    wrapper.append(placeholder);

    if (!autoplay) {
      wrapper.insertAdjacentHTML(
        'beforeend',
        '<div class="video-youtube-placeholder-play"><button type="button" title="Play"></button></div>',
      );
      wrapper.addEventListener('click', () => {
        wrapper.remove();
        loadVideoEmbed(block, link, true);
      });
    }
    block.append(wrapper);
  }

  if (!placeholder || autoplay) {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect();
        const playOnLoad = autoplay && !prefersReducedMotion.matches;
        loadVideoEmbed(block, link, playOnLoad);
      }
    });
    observer.observe(block);
  }
}
