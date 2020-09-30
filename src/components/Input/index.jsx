import React from "react";
import "./index.css";

const Input = ({ name, type, onChange, value, error }) => (
  <div className="container">
    <span>{name}</span>
    <input
      value={value}
      style={{
        borderColor: error && "red",
      }}
      type={type}
      placeholder={name}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default Input;
