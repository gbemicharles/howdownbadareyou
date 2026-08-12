/**
 * Telegram Mini App (TMA) Integration Helper
 * Detects Telegram WebApp environment, triggers haptic feedback, expands viewport,
 * and configures Telegram theme colors.
 */

export function initTelegramWebApp() {
  if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    
    // Expand to full viewport inside Telegram
    try {
      tg.expand();
      tg.ready();

      // Configure theme colors
      if (tg.setHeaderColor) tg.setHeaderColor('#090a0f');
      if (tg.setBackgroundColor) tg.setBackgroundColor('#090a0f');
    } catch (e) {}

    return tg;
  }
  return null;
}

export function triggerTelegramHaptic(type = 'medium') {
  if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    if (tg.HapticFeedback) {
      try {
        if (type === 'success') tg.HapticFeedback.notificationOccurred('success');
        else if (type === 'warning') tg.HapticFeedback.notificationOccurred('warning');
        else tg.HapticFeedback.impactOccurred(type);
      } catch (e) {}
    }
  }
}

export function isInsideTelegramWebApp() {
  return typeof window !== 'undefined' && !!(window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData);
}
