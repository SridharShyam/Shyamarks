import React, { useState } from 'react';

export const FloatingLabelInput = ({ label, id, value, onChange, className = '', ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== undefined && value !== null && String(value).length > 0;

  return (
    <div className="relative w-full">
      <input
        id={id}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full pt-6 pb-2 px-4 rounded-xl bg-surface-elevated border border-border text-xs text-text-primary focus:border-accent focus:outline-none transition-all ${className}`}
        {...props}
      />
      <label
        htmlFor={id}
        className={`absolute left-4 pointer-events-none transition-all duration-200 font-sans ${
          isFocused || hasValue
            ? 'top-2 text-[10px] font-semibold text-accent uppercase tracking-wider'
            : 'top-3.5 text-xs text-text-muted'
        }`}
      >
        {label}
      </label>
    </div>
  );
};
