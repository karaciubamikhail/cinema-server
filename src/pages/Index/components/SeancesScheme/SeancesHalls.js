import React from 'react';
import styles from './SeancesHalls.module.css';

/**
 * Компонент список залов раздела "Сетка сеансов"
 */
export default function SeancesHalls({ className, hall, ...props }) {
  return (
    <div className={styles.seances_hall}>
      <h3 className={styles.seances_title}>{hall?.hall?.name}</h3>
      <div className={styles.seances_timeline}>{props.children(hall)}</div>
    </div>
  );
}
