import React from 'react';
import styles from './ConfigHallsSchemeRowSeats.module.css';
/**
 * Компонент ряда кресел страницы кинозала
 */
export default function ConfigHallsSchemeRowSeats({
  className,
  seatsRow,
  ...props
}) {
  return <div className={styles.row}>{props.children(seatsRow)}</div>;
}
