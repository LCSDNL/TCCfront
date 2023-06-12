import React from 'react';

const Popup = ({ onClose }) => {
  return (
    <div className="popup">
      <div className="popup-content">
        <h2>Título do Popup</h2>
        <p>Conteúdo do popup</p>
        <button onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
};

export default Popup;
