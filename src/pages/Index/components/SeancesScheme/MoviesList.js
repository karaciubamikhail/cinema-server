import React from 'react';
import styles from './MoviesList.module.css';

/**
 * Компонент список фильмов раздела "Сетка сеансов"
 */
export default function MoviesList({ className, movies, ...props }) {
  return <div className={styles.movies}>{props.children(movies)}</div>;
}
