import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ModalWrapper from './ModalWrapper';
import Loader from '../../components/loader/Loader';
import TextParagraph from '../../components/TextParagraph/TextParagraph';
import { createSeanceView } from '../../store/SliceView';
import {
  SEANCES_COLORS_ARR,
  getTimeInMinutes,
  newSeanceCheck,
} from '../../api/helpers';
import styles from './ModalWrapper.module.css';

/**
 * Модальное окно добавления сеанса
 */

export default function ModalSeanceAdd() {
  const { activeMovieId, movies, halls } = useSelector((state) => state.config);
  const { seancesView } = useSelector((state) => state.view);
  const [isPending, setIsPending] = useState(false);
  const [errorText, setErrorText] = useState(false);
  const [newSeance, setNewSeance] = useState({
    hall: halls[0]?.hallId,
    'start-time': '',
  });
  const dispatch = useDispatch();
  const activeMovieIndex = movies?.findIndex(
    (movie) => movie?.movieId === activeMovieId
  );
  const movieTitle = movies[activeMovieIndex]?.movieTitle;
  const movieDuration = movies[activeMovieIndex]?.movieDuration;

  const isDisabledSubmit =
    isPending ||
    errorText ||
    !halls?.length ||
    !activeMovieId ||
    !newSeance['start-time'] ||
    !newSeance?.hall;
  const isDisabledCloseButton = isPending;

  const hallOptionElements = halls?.map((hall, index) => (
    <option
      key={hall?.hallId}
      value={hall?.hallId}
      defaultselected={index === 0 ? 'true' : ''}
    >
      {hall?.hallName}
    </option>
  ));

  function onChangeHandler({ target }) {
    setErrorText('');
    const { name, value } = target;
    const seanceHallId = name === 'hall' ? value : newSeance?.hall;
    const seanceStartTime =
      name === 'start-time' ? value : newSeance['start-time'];
    const seances = seancesView?.find(
      (viewObj) => viewObj?.hall?.id === parseInt(seanceHallId)
    )?.objsList;
    if (seances?.length) {
      const result = newSeanceCheck(
        activeMovieId,
        seanceStartTime,
        seances,
        movies,
        getTimeInMinutes
      );
      if (!result) {
        setErrorText(
          'Создание сеанса с указанным временем начала невозможно, пока сеанс пересекается с другими. Время начала должно быть не раньше, чем окончится предыдущий сеанс и не позже, чем начнется следующий сеанс.'
        );
      }
    }
    if (!seances?.length) {
      if (
        getTimeInMinutes(seanceStartTime) + parseInt(movieDuration) >
        24 * 60
      ) {
        setErrorText('Создание сеанса с указанным временем начала невозможно.');
      }
    }
    setNewSeance((prev) => ({ ...prev, [name]: value }));
  }

  const addSeanceSubmit = (event) => {
    event.preventDefault();
    if (isDisabledSubmit) return;
    setIsPending(true);
    const seanceColor = SEANCES_COLORS_ARR[activeMovieIndex];
    dispatch(
      createSeanceView({
        hallId: parseInt(newSeance.hall),
        startTime: newSeance['start-time'],
        movieId: activeMovieId,
        movieTitle,
        movieDuration,
        seanceColor,
      })
    );
  };

  useEffect(() => {
    // проверка, что сеанс добавлен
    if (!isPending) return;
    const viewHasSeance =
      seancesView
        ?.find((viewObj) => viewObj?.hall?.id === parseInt(newSeance.hall))
        ?.objsList?.findIndex((seance) => {
          return (
            seance.movieId === activeMovieId &&
            getTimeInMinutes(seance.startTime) ===
              getTimeInMinutes(newSeance['start-time'])
          );
        }) >= 0;
    if (isPending && viewHasSeance) {
      setNewSeance((prev) => ({ ...prev, 'start-time': '' }));
      setIsPending(false);
    }
  }, [dispatch, activeMovieId, isPending, newSeance, seancesView]);

  return (
    <ModalWrapper name={'Добавление сеанса'}>
      {(closeButtonHandler) => (
        <form acceptCharset="utf-8" onSubmit={addSeanceSubmit}>
          <p className={styles.TextParagraph}>
            Добавление сеанса для фильма <span>{movieTitle}</span>
          </p>
          <label className={`${styles.label} ${styles.label_fullsize}`}>
            Название зала
            <select
              name="hall"
              required
              disabled={isPending}
              className={styles.input}
              onChange={onChangeHandler}
            >
              {hallOptionElements}
            </select>
          </label>

          <label className={`${styles.label} ${styles.label_fullsize}`}>
            Время начала
            <input
              type="time"
              value={newSeance['start-time']}
              name="start-time"
              required
              disabled={isPending}
              className={styles.input}
              onChange={onChangeHandler}
            />
          </label>

          {errorText && (
            <TextParagraph
              text={errorText}
              className={`${styles.TextParagraph} ${styles.error}`}
            />
          )}

          {isPending && (
            <>
              <TextParagraph
                className={`${styles.TextParagraph} ${styles.text_center}`}
                text={'Создание сеанса...'}
              />
              <Loader />
            </>
          )}

          <div
            aria-label="buttons-group"
            className={`${styles.buttons} ${styles.text_center}`}
          >
            <input
              type="submit"
              value="Добавить"
              disabled={isDisabledSubmit}
              className={`${styles.button} ${styles.button_accent} ${
                isDisabledSubmit ? styles.button_disabled : ''
              }`}
            />

            <button
              type="reset"
              disabled={isDisabledCloseButton}
              className={`${styles.button} ${styles.button_regular} ${
                isDisabledCloseButton ? styles.button_disabled : ''
              }`}
              onClick={closeButtonHandler}
            >
              Отменить
            </button>
          </div>
        </form>
      )}
    </ModalWrapper>
  );
}
