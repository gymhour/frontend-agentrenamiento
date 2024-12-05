import React from 'react';
import './customInput.css'; 

const CustomInput = ({ type = 'text', placeholder, value, onChange, required = false }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="custom-input"
    />
  );
};

export default CustomInput;
