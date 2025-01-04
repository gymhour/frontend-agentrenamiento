import React from 'react';
import './customInput.css'; 

const CustomInput = ({ type = 'text', placeholder, value, onChange, required = false, width = '300px' }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      style={{ width }}
      className="custom-input"
    />
  );
};

export default CustomInput;