'use client'
import React from "react";

export default function SortSelector({
  value,
  onChange
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <select
      className="form-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="asc">Precio: menor a mayor</option>
      <option value="desc">Precio: mayor a menor</option>
    </select>
  );
}