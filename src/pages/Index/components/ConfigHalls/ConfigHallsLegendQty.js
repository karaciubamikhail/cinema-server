import React from 'react';
import styles from './ConfigHallsLegendQty.module.css';

/*
 * Компонент легенды секции "Конфигурация залов"
 */

export default function ConfigHallsLegendQty({
  hallSize,
  disabled,
  hallSizeHandler,
}) {
  return (
    <div className={styles.legend}>
      <label className={styles.label}>
        Рядов, шт
        <input
          type="text"
          name="rows"
          className={styles.input}
          disabled={disabled}
          value={hallSize.rows}
          onChange={hallSizeHandler}
        />
      </label>
      <span className={styles.multiplier}>x</span>
      <label className={styles.label}>
        Мест, шт
        <input
          type="text"
          name="cols"
          className={styles.input}
          disabled={disabled}
          value={hallSize.cols}
          onChange={hallSizeHandler}
        />
      </label>
    </div>
  );
}
