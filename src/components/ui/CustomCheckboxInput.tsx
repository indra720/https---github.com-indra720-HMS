import React from 'react';

interface CustomCheckboxInputProps {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomCheckboxInput: React.FC<CustomCheckboxInputProps> = ({ checked, onChange }) => {
  return (
    <label className="inline-flex items-center justify-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />

      <span
        className={`
          w-4 h-4
          rounded-full
          border-2
          flex items-center justify-center
          ${checked ? 'bg-[#02ff01] border-[#02ff01]' : 'border-gray-400'}
        `}
      >
        {checked && (
          <svg
            viewBox="0 0 16 16"
            className="w-3 h-3 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <polyline points="3,8 6,11 13,4" />
          </svg>
        )}
      </span>
    </label>
  );
};

export default CustomCheckboxInput;
