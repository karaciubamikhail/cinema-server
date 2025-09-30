import React from 'react';
import styles from './ConfigHallsHall.module.css';

/**
 * Компонент зал раздела "Конфигурация залов"
 */
export default function ConfigHallsHall({
  className,
  hall,
  disabled,
  isDefaultChecked,
  hallSelectHandler,
  ...props
}) {
  return (
    <li onClick={() => hallSelectHandler(hall?.hallId)}>
      <input
        type="radio"
        className={styles.radio}
        name="chairs-hall"
        value={hall?.hallName}
        disabled={disabled}
        defaultChecked={isDefaultChecked}
      />
      <span className={styles.selector}>{hall?.hallName}</span>
    </li>
  );
}
