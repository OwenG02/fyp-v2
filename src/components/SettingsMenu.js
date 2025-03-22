import React from 'react';

export function SettingsMenu({ isVisible, onClose }) {
  if (!isVisible) return null;

  return (
    <div className="settings-menu">
      <h2>Settings</h2>
      <button onClick={onClose}>Close</button>
    </div>
  );
}