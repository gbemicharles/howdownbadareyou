import React, { useState, useEffect } from 'react';
import { PEDRO_ASSETS } from '../assets/pedroAssets.js';
import { PEDRO_DATA_URIS } from '../assets/pedroDataURIs.js';

export default function PedroCharacter({ pedroKey = 'rockstar', className = '', alt = 'Pedro Raccoon Character' }) {
  const validKey = (pedroKey && (PEDRO_ASSETS[pedroKey] || PEDRO_DATA_URIS[pedroKey])) ? pedroKey : 'rockstar';
  
  // Static fingerprinted Vite assets as primary src for 100% WebKit & Telegram WebView compatibility
  const primarySrc = PEDRO_ASSETS[validKey] || PEDRO_DATA_URIS[validKey];
  const secondarySrc = PEDRO_DATA_URIS[validKey] || PEDRO_ASSETS[validKey];

  const [currentSrc, setCurrentSrc] = useState(primarySrc);
  const [hasFailedOnce, setHasFailedOnce] = useState(false);

  useEffect(() => {
    setCurrentSrc(primarySrc);
    setHasFailedOnce(false);
  }, [validKey, primarySrc]);

  const handleError = () => {
    if (!hasFailedOnce && currentSrc !== secondarySrc) {
      setHasFailedOnce(true);
      setCurrentSrc(secondarySrc);
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      onError={handleError}
      className={`w-full h-full object-contain pointer-events-none ${className}`}
    />
  );
}
