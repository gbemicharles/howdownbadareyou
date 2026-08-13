import React, { useState } from 'react';
import { PEDRO_DATA_URIS } from '../assets/pedroDataURIs.js';
import { PEDRO_ASSETS } from '../assets/pedroAssets.js';

export default function PedroCharacter({ pedroKey = 'rockstar', className = '', alt = 'Pedro Raccoon Character' }) {
  const validKey = (pedroKey && (PEDRO_DATA_URIS[pedroKey] || PEDRO_ASSETS[pedroKey])) ? pedroKey : 'rockstar';
  
  const primarySrc = PEDRO_DATA_URIS[validKey] || PEDRO_ASSETS[validKey];
  const secondarySrc = PEDRO_ASSETS[validKey] || PEDRO_DATA_URIS[validKey];

  const [currentSrc, setCurrentSrc] = useState(primarySrc);
  const [hasFailedOnce, setHasFailedOnce] = useState(false);

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
