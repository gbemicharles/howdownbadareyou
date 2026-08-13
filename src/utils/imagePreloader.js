/**
 * Preloads and converts all <img> elements inside a DOM container to Base64 Data URLs
 * Ensures html-to-image (toBlob / toPng) ALWAYS embeds Pedro character assets cleanly!
 */
export async function inlineContainerImages(containerElement) {
  if (!containerElement) return;

  const images = Array.from(containerElement.querySelectorAll('img'));

  const conversionPromises = images.map(async (img) => {
    if (!img.src || img.src.startsWith('data:')) return;

    try {
      const response = await fetch(img.src, { cache: 'reload' });
      const blob = await response.blob();
      
      await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          img.src = reader.result;
          resolve();
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      console.warn('[ImagePreloader] Failed to inline image:', img.src, e);
    }
  });

  await Promise.all(conversionPromises);
}
