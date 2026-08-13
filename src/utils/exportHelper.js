import { toBlob } from 'html-to-image';
import { inlineContainerImages } from './imagePreloader.js';

/**
 * Fail-proof DOM container to PNG Blob exporter
 * Solves WebKit / Telegram WebView SVG <foreignObject> async image decoding bug
 * by combining img.decode() GPU warming with a two-pass rasterization loop.
 */
export async function exportElementToBlob(containerElement, options = {}) {
  if (!containerElement) return null;

  // 1. Ensure fonts are ready
  if (document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch (e) {}
  }

  // 2. Inline all <img> tags inside the target container to Base64 Data URIs
  await inlineContainerImages(containerElement);

  // 3. Force native GPU image decoding for all <img> elements
  const images = Array.from(containerElement.querySelectorAll('img'));
  await Promise.all(
    images.map(async (img) => {
      if (img.decode) {
        try {
          await img.decode();
        } catch (e) {}
      }
    })
  );

  const defaultOpts = {
    cacheBust: false,
    pixelRatio: 2,
    backgroundColor: '#090a0f',
    ...options
  };

  // 4. Pass 1: Warmup call to prime WebKit SVG memory cache
  try {
    await toBlob(containerElement, defaultOpts);
  } catch (e) {}

  // 5. Brief pause to ensure rasterizer buffer is filled
  await new Promise(r => setTimeout(r, 120));

  // 6. Pass 2: Final pristine Blob capture
  return await toBlob(containerElement, defaultOpts);
}
