import React from 'react';
import styles from './ConfigHallsList.module.css';

/**
 * Компонент список залов раздела "Конфигурация залов"
 */
export default function ConfigHallsList({ className, hallsArr, ...props }) {
  return <ul className={styles.selectors_box}>{props.children(hallsArr)}</ul>;
}
