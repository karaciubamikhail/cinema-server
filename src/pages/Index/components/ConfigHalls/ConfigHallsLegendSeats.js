import React from 'react';
import styles from './ConfigHallsLegendSeats.module.css';

/*
 * Компонент легенды секции "Конфигурация залов"
 */

export default function ConfigHallsLegendSeats() {
  return (
    <div className={styles.legend}>
      <span className={`${styles.chair} ${styles.chair_standart}`} /> — обычные
      кресла
      <span className={`${styles.chair} ${styles.chair_vip}`} /> — VIP кресла
      <span className={`${styles.chair} ${styles.chair_disabled}`} /> —
      заблокированные (нет кресла)
      <p className={styles.hint}>
        Чтобы изменить вид кресла, нажмите по нему левой кнопкой мыши
      </p>
    </div>
  );
}
