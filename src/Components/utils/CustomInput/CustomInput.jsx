import React, { useState } from 'react';
import './customInput.css'; 
import { ReactComponent as EyeShowIcon } from '../../../assets/icons/ic_eye_show.svg';
import { ReactComponent as EyeHideIcon } from '../../../assets/icons/ic_eye_hide.svg';

const CustomInput = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  width = '300px',
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);

  // Si el input es de tipo password, usamos el estado para alternar
  const inputType = type === 'password' 
    ? (showPassword ? 'text' : 'password') 
    : type;

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className="custom-input-wrapper" style={{ width }}>
      <input
        {...rest}  
        type={inputType}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="custom-input"
      />
      {type === 'password' && (
        <button
          type="button"
          className="password-toggle-btn"
          onClick={togglePasswordVisibility}
          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          {showPassword 
            ? <EyeHideIcon className="eye-icon" /> 
            : <EyeShowIcon className="eye-icon" />
          }
        </button>
      )}
    </div>
  );
};

export default CustomInput;