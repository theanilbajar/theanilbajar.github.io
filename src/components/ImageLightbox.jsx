import { useState, useEffect, useCallback } from 'react';

export default function ImageLightbox({ src, alt, onClose }) {
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose} aria-label="Close lightbox">×</button>
      <img className="lightbox-image" src={src} alt={alt || ''} onClick={e => e.stopPropagation()} />
    </div>
  );
}