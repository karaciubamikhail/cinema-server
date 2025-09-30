import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ModalWrapper from './ModalWrapper';
import Loader from '../../components/loader/Loader';
import TextParagraph from '../../components/TextParagraph/TextParagraph';
import { fetchPostMovieDelete } from '../../api/index';
import styles from './ModalWrapper.module.css';

/**
 * Модальное окно удаления фильма
 */

export default function ModalMovieDelete() {
  const { loading, error } = useSelector((state) => state.modal);
  const { activeMovieId, movies, seances } = useSelector(
    (state) => state.config
  );
  const dispatch = useDispatch();
  const isDisabledSubmit = loading || !movies.length || !activeMovieId;
  const isDisabledCloseButton = loading;
  const movieTitle = movies.find(
    (movie) => movie?.movieId === activeMovieId
  )?.movieTitle;
  const movieHasSeances =
    seances?.filter((seance) => seance?.movieId === activeMovieId)?.length > 0;

  const deleteMovieSubmit = (event) => {
    event.preventDefault();
    if (isDisabledSubmit) return;
    dispatch(fetchPostMovieDelete(activeMovieId));
  };

  return (
    <ModalWrapper name={'Удаление фильма'}>
      {(closeButtonHandler) => (
        <form acceptCharset="utf-8" onSubmit={deleteMovieSubmit}>
          {!isDisabledSubmit ? (
            <p className={styles.TextParagraph}>
              Вы действительно хотите удалить фильм <span>{movieTitle}</span>?
            </p>
          ) : (
            !loading && (
              <TextParagraph
                text={'Ошибка. Отсутствует фильм для удаления.'}
                className={`${styles.TextParagraph} ${styles.error}`}
              />
            )
          )}

          {movieHasSeances ? (
            <TextParagraph
              className={`${styles.TextParagraph} ${styles.error}`}
              text={
                'Внимание: также будут удалены все сеансы, созданные для этого фильма!'
              }
            />
          ) : null}

          {error && (
            <TextParagraph
              text={error}
              className={`${styles.TextParagraph} ${styles.error}`}
            />
          )}

          {loading && (
            <>
              <TextParagraph
                className={`${styles.TextParagraph} ${styles.text_center}`}
                text={'Удаление фильма...'}
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
