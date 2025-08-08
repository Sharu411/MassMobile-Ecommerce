// src/components/ui/select.jsx
import * as React from "react";

export function Select({ value, onChange, placeholder, options = [] }) {
  return (
    <select
      className="border rounded px-3 py-2 w-full text-sm"
      value={value}
      onChange={onChange}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt, index) => (
        <option key={index} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
