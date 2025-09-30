import React from 'react';
import styles from './ConfigHallsSchemeSeat.module.css';

/**
 * Компонент элемента ряда кресел кинозала
 */

export default function ConfigHallsSchemeSeat({
  className,
  seat,
  seatsTypeHandler,
  ...props
}) {
  const { seatType } = seat;
  let titleTypeString,
    classTypeString = '';
  if (seatType.toString() === '1') {
    titleTypeString = ',Тип:стандарт';
    classTypeString = styles.chair_standart;
  }
  if (seatType.toString() === '2') {
    titleTypeString = ',Тип:VIP';
    classTypeString = styles.chair_vip;
  }
  if (seatType.toString() !== '1' && seatType.toString() !== '2') {
    titleTypeString = ',Тип:нет кресла';
    classTypeString = styles.chair_disabled;
  }

  return (
    <span
      title={`Ряд:${seat?.seatIndexRow},Место:${seat?.seatIndexCol}${titleTypeString}`}
      className={`${styles.chair} ${classTypeString}`}
      onClick={() => seatsTypeHandler(seat)}
    />
  );
}
