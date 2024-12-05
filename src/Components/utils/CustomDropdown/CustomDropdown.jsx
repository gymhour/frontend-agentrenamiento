import React from 'react';
import './customDropdown.css'; 

const CustomDropdown = ({ options = [], value, onChange }) => {
  return (
    <select 
      value={value} 
      onChange={onChange} 
      className="custom-dropdown"
    >
      <option value="" disabled>
        Selecciona una opción
      </option>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default CustomDropdown;
