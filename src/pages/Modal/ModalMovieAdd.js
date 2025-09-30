import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ModalWrapper from './ModalWrapper';
import Loader from '../../components/loader/Loader';
import TextParagraph from '../../components/TextParagraph/TextParagraph';
import { fetchPostMovieCreate } from '../../api/index';
import styles from './ModalWrapper.module.css';

/**
 * Модальное окно добавления фильма
 */

export default function ModalMovieAdd() {
  const { loading, error } = useSelector((state) => state.modal);
  const [movieParams, setMovieParams] = useState({
    title: '',
    info: '',
    duration: '',
    origin: '',
    poster: null,
  });
  const [posterFile, setPosterFile] = useState(null);
  const [isPosterLoading, setIsPosterLoading] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [posterErrorText, setPosterErrorText] = useState('');
  const isDisabledSubmit =
    errorText ||
    loading ||
    !movieParams.title ||
    !movieParams.info ||
    !movieParams.duration ||
    !movieParams.origin;
  const isDisabledCloseButton = loading;
  const isDisabledPosterControls = loading || isPosterLoading;
  const dispatch = useDispatch();

  const onChangeHandler = ({ target }) => {
    setErrorText('');
    const { name, value } = target;
    if (name === 'duration') {
      if (!value || parseInt(value) <= 0 || !parseInt(value)) {
        setErrorText(`Продолжительностью фильма должно быть число больше нуля`);
      }
      setMovieParams((prev) => {
        return { ...prev, duration: parseInt(value.trim()) };
      });
    }

    if (name !== 'duration') {
      setMovieParams((prev) => {
        return { ...prev, [name]: value };
      });
    }
  };

  const onChangeFileHandler = (event) => {
    setPosterErrorText('');
    setIsPosterLoading(true);
    const reader = new FileReader();
    reader.readAsDataURL(event.currentTarget.files[0]);
    reader.onloadend = () => {
      const srcString = reader.result.toString();
      if (srcString.startsWith('data:image'))
        setPosterFile(reader.result.toString());
      if (!srcString.startsWith('data:image')) {
        setPosterErrorText(
          'Произошла ошибка при загрузке постера, пожалуйста, попробуйте еще раз.'
        );
      }
      setIsPosterLoading(false);
    };
    reader.onerror = () => {
      setPosterErrorText(
        `Произошла ошибка при загрузке постера ,пожалуйста, попробуйте еще раз. ${reader.error}`
      );
      setIsPosterLoading(false);
    };
  };

  const deletePosterHandler = () => {
    setPosterFile(null);
    setMovieParams((prev) => ({ ...prev, poster: null }));
    setPosterErrorText('');
  };

  const addMovieSubmit = (event) => {
    event.preventDefault();
    if (isDisabledSubmit) return;
    const formData = new FormData();
    formData.append('title', movieParams?.title);
    formData.append('origin', movieParams?.origin);
    if (event.target.poster?.files?.length)
      formData.append('picture', event.target?.poster?.files[0]);
    if (!event.target.poster?.files?.length) formData.append('picture', '');
    formData.append('description', movieParams?.info);
    formData.append('duration_minutes', movieParams?.duration?.toString());
    dispatch(fetchPostMovieCreate(formData));
  };

  return (
    <ModalWrapper name={'Добавление фильма'}>
      {(closeButtonHandler) => (
        <form acceptCharset="utf-8" onSubmit={addMovieSubmit}>
          <label className={`${styles.label} ${styles.label_fullsize}`}>
            Название фильма
            <input
              className={styles.input}
              type="text"
              placeholder="Например, &laquo;Гражданин Кейн&raquo;"
              name="title"
              required
              disabled={loading}
              value={movieParams?.title || ''}
              onChange={onChangeHandler}
            />
          </label>

          <label className={`${styles.label} ${styles.label_fullsize}`}>
            Описание фильма
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              rows="1"
              placeholder="Например, В далекой-далекой галактике, в тридевятом царстве, тридесятом государстве жили-были старик со старухой..."
              name="info"
              required
              disabled={loading}
              value={movieParams?.info || ''}
              onChange={onChangeHandler}
            />
          </label>

          <label className={`${styles.label} ${styles.label_fullsize}`}>
            Длительность фильма (в минутах)
            <input
              className={styles.input}
              type="number"
              placeholder="Например, 90"
              name="duration"
              required
              disabled={loading}
              value={movieParams?.duration || ''}
              onChange={onChangeHandler}
            />
          </label>

          <label className={`${styles.label} ${styles.label_fullsize}`}>
            Страна происхождения
            <input
              className={styles.input}
              type="text"
              placeholder="Например, Россия"
              name="origin"
              required
              disabled={loading}
              value={movieParams?.origin || ''}
              onChange={onChangeHandler}
            />
          </label>

          {posterFile ? (
            <div className={styles.preview}>
              <img
                className={styles.preview_poster}
                alt="poster preview"
                src={posterFile}
              />
            </div>
          ) : null}

          {errorText && (
            <TextParagraph
              className={`${styles.TextParagraph} ${styles.error}`}
              text={errorText}
            />
          )}

          {posterErrorText && (
            <TextParagraph
              className={`${styles.TextParagraph} ${styles.error}`}
              text={posterErrorText}
            />
          )}

          {error && (
            <TextParagraph
              className={`${styles.TextParagraph} ${styles.error}`}
              text={error}
            />
          )}

          {loading && (
            <>
              <TextParagraph
                className={`${styles.TextParagraph} ${styles.text_center}`}
                text={'Создание фильма...'}
              />
              <Loader />
            </>
          )}

          {isPosterLoading && (
            <>
              <TextParagraph
                className={`${styles.TextParagraph} ${styles.text_center}`}
                text={'Загрузка постера...'}
              />
              <Loader />
            </>
          )}

          <div
            aria-label="buttons-group"
            className={`${styles.buttons} ${styles.text_center}`}
          >
            {posterFile ? (
              <button
                type="button"
                className={`${styles.button} ${styles.button_regular} ${
                  isDisabledPosterControls ? styles.button_disabled : ''
                }`}
                disabled={isDisabledPosterControls}
                onClick={deletePosterHandler}
              >
                Удалить постер
              </button>
            ) : null}

            <label className={`${styles.button} ${styles.button_regular}`}>
              Добавить постер
              <input
                className={`${styles['visually-hidden']}`}
                type="file"
                name="poster"
                accept="image/*"
                disabled={isDisabledPosterControls}
                onChange={onChangeFileHandler}
              />
            </label>

            <input
              type="submit"
              value="Добавить фильм"
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
