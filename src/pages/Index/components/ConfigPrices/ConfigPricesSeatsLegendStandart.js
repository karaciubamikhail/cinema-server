import React from 'react';
import styles from './ConfigPricesSeatsLegend.module.css';

/**
 * Компонент легенда раздела "Управление залами"
 */

export default function ConfigPricesSeatsLegendStandart({
  disabled,
  hallPrices,
  hallPricesHandler,
}) {
  return (
    <div className={styles.legend}>
      <label className={styles.label}>
        {'Цена, рублей'}
        <input
          type="text"
          className={styles.input}
          name="standart"
          value={hallPrices.standart}
          disabled={disabled}
          onChange={hallPricesHandler}
        />
      </label>
      {'за'}
      <span className={`${styles.chair} ${styles.chair_standart}`} />
      {'обычные кресла'}
    </div>
  );
}
