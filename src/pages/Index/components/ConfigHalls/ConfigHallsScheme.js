import React from 'react';
import styles from './ConfigHallsScheme.module.css';

/*
 * Компонент схемы зала секции "Конфигурация залов"
 */

export default function ConfigHallsScheme({ seats, ...props }) {
  return (
    <div className={styles.hall}>
      <div className={styles.hall_wrapper}>{props.children(seats)}</div>
    </div>
  );
}
