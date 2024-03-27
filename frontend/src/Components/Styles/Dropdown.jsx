// Dropdown.jsx
import React, { useState } from "react";

const Dropdown = ({ label, id, options, selectedValue, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleDropdownChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="mb-4 relative">
      <label
        htmlFor={id}
        className={`absolute transition-all duration-300 ${
          (isFocused || selectedValue) ? "text-sm text-white -top-6 left-1" : "top-2 left-3 text-gray-500 text-xs md:text-sm lg:text-sm"
        }`}
      >
        {label}
      </label>
      <select
        id={id}
        className="p-2 border rounded w-full outline-none text-gray-500 bg-white"
        autoComplete="off"
        value={selectedValue}
        onChange={handleDropdownChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <option value="" disabled hidden={!selectedValue}>
          {label}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
