/**
 * Telegram Mini App Native Haptic Feedback Helper
 * Triggers native vibration on mobile devices for native app feel
 */
export function triggerHaptic(type = 'impact', style = 'medium') {
  try {
    const tg = window.Telegram?.WebApp;
    if (!tg || !tg.HapticFeedback) return;

    if (type === 'impact') {
      tg.HapticFeedback.impactOccurred(style);
    } else if (type === 'notification') {
      tg.HapticFeedback.notificationOccurred(style);
    } else if (type === 'selection') {
      tg.HapticFeedback.selectionChanged();
    }
  } catch (e) {
    // Ignore if not in Telegram or unsupported
  }
}
