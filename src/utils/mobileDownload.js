/**
 * Save an image blob on mobile (Web Share API → saves to Photos)
 * or fall back to a blob URL download on desktop.
 */
export async function saveImageBlob(blob, filename) {
  // Try Web Share API with files — works on iOS/Android Telegram WebView
  // and saves directly to Photos/Gallery
  if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare) {
    const file = new File([blob], filename, { type: 'image/png' });
    try {
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: filename });
        return true;
      }
    } catch (e) {
      // AbortError = user dismissed the share sheet — treat as success
      if (e.name === 'AbortError') return true;
      // Any other error: fall through to anchor download
    }
  }

  // Desktop fallback: blob URL + anchor click
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return true;
}
