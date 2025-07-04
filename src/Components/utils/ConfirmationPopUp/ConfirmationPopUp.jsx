import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./ConfirmationPopup.css";
import CustomDropdown from "../CustomDropdown/CustomDropdown";

const ConfirmationPopup = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  options = [],
  placeholderOption = "Selecciona una opción"
}) => {
  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    if (!isOpen) setSelectedOption("");
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    const estadoBool = selectedOption === "Activar";
    onConfirm(estadoBool);
  };

  return ReactDOM.createPortal(
    <div className="confirmation-popup-overlay">
      <div className="confirmation-popup">
        <p>{message}</p>

        {options.length > 0 && (
          <div className="confirmation-popup-dropdown" style={{margin: '16px 0px'}}>
            <CustomDropdown
              options={options}
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
              placeholderOption={placeholderOption}
            />
          </div>
        )}

        <div className="confirmation-popup-buttons">
          <div className="popup-btns-ctn">
            <button onClick={onClose} className="popup-cancel-button">
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              className="popup-confirm-button"
              disabled={options.length > 0 && !selectedOption}
            >
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