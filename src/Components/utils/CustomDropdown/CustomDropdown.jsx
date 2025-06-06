import React from 'react';
import './customDropdown.css'; 

const CustomDropdown = ({ options = [], value, onChange, name, id, placeholderOption = 'Selecciona una opción' }) => {
  return (
    <select 
      value={value} 
      onChange={onChange} 
      name={name} 
      id={id}
      className="custom-dropdown"
    >
      <option value="" disabled>
        {
          placeholderOption
        }
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
