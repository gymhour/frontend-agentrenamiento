// ConfirmationPopup.jsx
import React from "react";
import ReactDOM from "react-dom";
import "./ConfirmationPopup.css";

const ConfirmationPopup = ({ isOpen, onClose, onConfirm, message, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="confirmation-popup-overlay">
      <div className="confirmation-popup">
        <p>{message}</p>
        {children}
        <div className="confirmation-popup-buttons">
          <div className="popup-btns-ctn">
            <button onClick={onClose} className="popup-cancel-button">
              Cancelar
            </button>
            <button onClick={onConfirm} className="popup-confirm-button">
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmationPopup;