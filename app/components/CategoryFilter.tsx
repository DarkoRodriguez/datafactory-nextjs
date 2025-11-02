'use client'
import React from "react";

export default function CategoryFilter({
  categorias,
  value,
  onChange
}: {
  categorias: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <select
      className="form-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {categorias.map((cat) => (
        <option key={cat} value={cat}>
          {cat === "todos" ? "Todos" : cat}
        </option>
      ))}
    </select>
  );
}