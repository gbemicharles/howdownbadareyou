/**
 * Preloads and converts all <img> elements inside a DOM container to Base64 Data URLs
 * Ensures html-to-image (toBlob / toPng) ALWAYS embeds Pedro character assets cleanly!
 */
export async function inlineContainerImages(containerElement) {
  if (!containerElement) return;

  const images = Array.from(containerElement.querySelectorAll('img'));

  const conversionPromises = images.map(async (img) => {
    if (!img) return;

    // 1. Ensure image element is loaded
    if (!img.complete || img.naturalWidth === 0) {
      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
        setTimeout(resolve, 400);
      });
    }

    // 2. Convert HTTP/HTTPS asset URLs into inline Base64 Data URIs
    if (img.src && !img.src.startsWith('data:')) {
      try {
        const response = await fetch(img.src, { cache: 'reload' });
        const blob = await response.blob();
        
        const dataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });

        if (dataUrl) {
          img.src = dataUrl;
        }
      } catch (e) {
        console.warn('[ImagePreloader] Failed to inline image:', img.src, e);
      }
    }
  });

  await Promise.all(conversionPromises);
  // Warmup delay to allow DOM repaint
  await new Promise(r => setTimeout(r, 150));
}
