// import React from 'react';
// import './customDropdown.css'; 

// const CustomDropdown = ({
//   options = [],
//   value,
//   onChange,
//   name,
//   id,
//   placeholderOption = null, 
//   placeholderDisabled = true
// }) => {
//   return (
//     <select
//       value={value}
//       onChange={onChange}
//       name={name}
//       id={id}
//       className="custom-dropdown"
//     >
//       {placeholderOption !== null && (
//         <option value="" disabled={placeholderDisabled}>
//           {placeholderOption}
//         </option>
//       )}

//       {options.map((option, index) => {
//         const isObject = typeof option === 'object' && option !== null;
//         const val = isObject ? String(option.value) : String(option);
//         const label = isObject ? (option.label ?? String(option.value)) : String(option);

//         return (
//           <option key={index} value={val}>
//             {label}
//           </option>
//         );
//       })}
//     </select>
//   );
// };

// export default CustomDropdown;

import React from 'react';
import './customDropdown.css';

const CustomDropdown = ({
  options = [],
  value,
  onChange,
  name,
  id,
  placeholderOption = 'Selecciona una opción',
  placeholderDisabled = true
}) => {

  const toOptionTuple = (option) => {
    if (typeof option === 'object' && option !== null) {
      const val = option.value ?? '';
      const label = option.label ?? String(val);
      return [String(val), label];
    }
    return [String(option), String(option)];
  };

  return (
    <select
      value={value}
      onChange={onChange}
      name={name}
      id={id}
      className="custom-dropdown"
    >
      {placeholderOption !== null && (
        <option value="" disabled={placeholderDisabled}>
          {placeholderOption}
        </option>
      )}

      {options.map((option, index) => {
        const [val, label] = toOptionTuple(option);
        return (
          <option key={index} value={val}>
            {label}
          </option>
        );
      })}
    </select>
  );
};

export default CustomDropdown;
