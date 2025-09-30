import React from 'react';
import styles from './HallsManagementHallsList.module.css';

/**
 * Компонент список залов раздела "Управление залами"
 */
export default function HallsManagementHallsList({
  className,
  hallsArr,
  ...props
}) {
  return <ul className={styles.list}>{props.children(hallsArr)}</ul>;
}
