import React from "react";
import "./ConfirmationPopup.css"; // Asegúrate de estilizarlo según sea necesario

const ConfirmationPopup = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;

    return (
        <div className="confirmation-popup-overlay">
            <div className="confirmation-popup">
                <p>{message}</p>
                <div className="confirmation-popup-buttons">
                    <button onClick={onConfirm} className="confirm-button">Sí</button>
                    <button onClick={onClose} className="cancel-button">No</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationPopup;
