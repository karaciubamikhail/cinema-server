import React from 'react';
// import styles from './SeancesList.module.css';

/**
 * Компонент список залов раздела "Сетка сеансов"
 */
export default function SeancesList({ className, halls, ...props }) {
  return <div className={''}>{props.children(halls)}</div>;
}
