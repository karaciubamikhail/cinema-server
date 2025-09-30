import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ModalWrapper from './ModalWrapper';
import Loader from '../../components/loader/Loader';
import TextParagraph from '../../components/TextParagraph/TextParagraph';
import { setActiveSeance } from '../../store/SliceConfig';
import { removeSeanceView } from '../../store/SliceView';
import { setActiveModal } from '../../store/SliceModal';
import styles from './ModalWrapper.module.css';

/**
 * Модальное окно удаления сеанса
 */

export default function ModalSeanceDelete() {
  const { activeSeance, movies } = useSelector((state) => state.config);
  const { seancesView } = useSelector((state) => state.view);
  const [isPending, setIsPending] = useState(false);
  const dispatch = useDispatch();
  const seanceMovieId = activeSeance?.movieId;
  const movieTitle = movies.find(
    (movie) => movie?.movieId === seanceMovieId
  )?.movieTitle;
  const viewHasSeance =
    seancesView
      .find((hallObj) => hallObj.hall.id === activeSeance?.hallId)
      ?.objsList?.findIndex(
        (seance) =>
          seance.hallId === activeSeance?.hallId &&
          seance.startTime === activeSeance?.startTime
      ) >= 0;
  const isDisabledSubmit = isPending || !activeSeance || !viewHasSeance;
  const isDisabledCloseButton = isPending;

  const deleteSeanceSubmit = (event) => {
    event.preventDefault();
    if (isDisabledSubmit) return;
    setIsPending(true);
    dispatch(removeSeanceView(activeSeance));
  };

  useEffect(() => {
    if (isPending && !viewHasSeance && activeSeance) {
      dispatch(setActiveSeance(null));
      dispatch(setActiveModal(''));
    }
  }, [dispatch, activeSeance, isPending, viewHasSeance]);

  return (
    <ModalWrapper name={'Снятие с сеанса'}>
      {(closeButtonHandler) => (
        <form acceptCharset="utf-8" onSubmit={deleteSeanceSubmit}>
          {!isDisabledSubmit ? (
            <p className={styles.TextParagraph}>
              Вы действительно хотите снять с сеанса фильм{' '}
              <span>{movieTitle}</span>?
            </p>
          ) : (
            <TextParagraph
              className={`${styles.TextParagraph} ${styles.error}`}
              text={'Отсутствует сеанс для удаления.'}
            />
          )}

          {isPending && (
            <>
              <TextParagraph
                className={`${styles.TextParagraph} ${styles.text_center}`}
                text={'Удаление сеанса...'}
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
              value="Удалить"
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
