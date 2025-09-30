import React from 'react';

/**
 * Компонент кнопка
 */
export default function Button({ className, name, disabled, handler }) {
  const buttonHandler = (event, name) => {
    if (handler) handler(event, name);
  };
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={(event) => buttonHandler(event, name)}
    >
      {name}
    </button>
  );
}
