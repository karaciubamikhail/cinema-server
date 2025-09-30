import React from 'react';
import styles from './ConfigPricesHall.module.css';

/**
 * Компонент зал раздела "Конфигурация цен"
 */

export default function ConfigPricesHall({
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
        name="prices-hall"
        value={hall.hallName}
        disabled={disabled}
        defaultChecked={isDefaultChecked}
      />
      <span className={styles.selector}>{hall.hallName}</span>
    </li>
  );
}
