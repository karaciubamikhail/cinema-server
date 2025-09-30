import React from 'react';
import { getTimeInMinutes } from '../../../../api/helpers';
import styles from './SeancesMovie.module.css';

/**
 * Компонент карточка фильма списка фильмов раздела "Сетка сеансов"
 */

export default function SeancesMovie({
  className,
  seance,
  seanceDeleteHandler,
  ...props
}) {
  const { seanceColor, movieTitle, movieDuration, startTime } = seance;
  const inlineStyles = {
    width: `${parseInt(movieDuration) / 2}px`,
    left: `${getTimeInMinutes(startTime) / 2}px`,
    backgroundColor: `${seanceColor}`,
  };
  return (
    <div
      title={'Удалить сеанс'}
      className={`${styles.seances_movie} ${className}`}
      style={inlineStyles}
      onClick={() => seanceDeleteHandler(seance)}
    >
      <p className={styles.seances_movie_title}>{movieTitle}</p>
      <p className={styles.seances_movie_start}>{startTime}</p>
    </div>
  );
}
