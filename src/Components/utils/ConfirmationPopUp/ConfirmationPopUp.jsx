import React from "react";
import "./ConfirmationPopup.css"; 

const ConfirmationPopup = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;

    return (
        <div className="confirmation-popup-overlay">
            <div className="confirmation-popup">
                <p>{message}</p>
                <div className="confirmation-popup-buttons">
                <button onClick={onClose} className="cancel-button">Cancelar</button>
                    <button onClick={onConfirm} className="confirm-button">Confirmar</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationPopup;
