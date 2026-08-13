/**
 * Pedro Character Base64 Preloader & Cache
 * Converts relative Pedro PNG image URLs into Base64 Data URIs at runtime.
 * Ensures html-to-image (toBlob / toPng) ALWAYS embeds Pedro character artwork
 * without network delays, CORS blocking, or missing image bugs in Telegram Mini App!
 */

const PEDRO_PATHS = {
  rockstar: '/assets/pedro/nobg/pedro_rockstar.png',
  rekt: '/assets/pedro/nobg/pedro_rekt.png',
  copium: '/assets/pedro/nobg/pedro_copium.png',
  wizard: '/assets/pedro/nobg/pedro_wizard.png',
  clown: '/assets/pedro/nobg/pedro_clown.png',
  diamond: '/assets/pedro/nobg/pedro_diamond.png',
  rocket: '/assets/pedro/nobg/pedro_rocket.png'
};

const base64Cache = new Map();

/**
 * Preload an image URL and convert it to Base64 Data URI using Canvas
 */
async function urlToBase64(url) {
  if (base64Cache.has(url)) {
    return base64Cache.get(url);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        if (dataUrl && dataUrl.length > 200) {
          base64Cache.set(url, dataUrl);
          resolve(dataUrl);
          return;
        }
      } catch (e) {
        console.warn('[PedroPreloader] Canvas toDataURL failed, falling back to fetch:', e);
      }
      // Fallback: fetch blob
      fetch(url)
        .then(res => res.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.onloadend = () => {
            base64Cache.set(url, reader.result);
            resolve(reader.result);
          };
          reader.onerror = () => resolve(url);
          reader.readAsDataURL(blob);
        })
        .catch(() => resolve(url));
    };

    img.onerror = () => {
      // Fallback to direct fetch
      fetch(url)
        .then(res => res.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.onloadend = () => {
            base64Cache.set(url, reader.result);
            resolve(reader.result);
          };
          reader.onerror = () => resolve(url);
          reader.readAsDataURL(blob);
        })
        .catch(() => resolve(url));
    };

    img.src = url;
  });
}

/**
 * Preload ALL Pedro character images into Base64 cache
 */
export async function preloadPedroImages() {
  const promises = Object.entries(PEDRO_PATHS).map(async ([key, path]) => {
    const dataUrl = await urlToBase64(path);
    return [key, dataUrl];
  });
  const results = await Promise.all(promises);
  return Object.fromEntries(results);
}

/**
 * Get single cached Pedro image or load it on demand
 */
export function getPedroImageSrc(key) {
  const path = PEDRO_PATHS[key] || PEDRO_PATHS.rockstar;
  return base64Cache.get(path) || path;
}
