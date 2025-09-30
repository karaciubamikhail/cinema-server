import React from 'react';
import styles from './ConfigPricesHallsList.module.css';

/**
 * Компонент список залов раздела "Конфигурация цен"
 */
export default function ConfigPricesHallsList({
  className,
  hallsArr,
  ...props
}) {
  return <ul className={styles.selectors_box}>{props.children(hallsArr)}</ul>;
}
