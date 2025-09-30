import React from 'react';
import Button from '../../../../components/button/Button';
import { getMinutesWords } from '../../../../api/helpers';
import styles from './MoviePlate.module.css';

/**
 * Компонент карточка фильма списка фильмов раздела "Сетка сеансов"
 */

export default function MoviePlate({
  className,
  disabled,
  movie,
  movieControls,
  showControlsHandler,
  buttonHandler,
  ...props
}) {
  const { movieTitle, movieDuration, movieDescription, movieId } = movie;
  const minuteString = movieDuration
    ? `${movieDuration} минут${getMinutesWords(movieDuration)}`
    : '';

  return (
    <div className={styles.movie} onClick={() => showControlsHandler(movieId)}>
      <img
        className={styles.movie_poster}
        alt="poster"
        src={movie.moviePoster}
      />
      <h3 className={styles.movie_title}>{movieTitle}</h3>
      <p className={styles.movie_duration}>{minuteString}</p>
      {movieControls === movieId ? (
        <>
          <p className={styles.TextParagraph}>{movieDescription}</p>
          <Button
            className={`${styles.button} ${styles.button_regular} ${
              disabled ? styles.button_disabled : ''
            }`}
            name={'Редактировать фильм'}
            disabled={disabled}
            handler={buttonHandler}
          />
          <Button
            className={`${styles.button} ${styles.button_regular} ${
              disabled ? styles.button_disabled : ''
            }`}
            name={'Удалить фильм'}
            disabled={disabled}
            handler={buttonHandler}
          />
          <Button
            className={`${styles.button} ${styles.button_regular} ${
              disabled ? styles.button_disabled : ''
            }`}
            name={'Добавить сеанс'}
            disabled={disabled}
            handler={buttonHandler}
          />
        </>
      ) : null}
    </div>
  );
}
