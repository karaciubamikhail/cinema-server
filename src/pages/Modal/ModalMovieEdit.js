import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ModalWrapper from './ModalWrapper';
import Loader from '../../components/loader/Loader';
import TextParagraph from '../../components/TextParagraph/TextParagraph';
import { movieNewDurationCheck } from '../../api/helpers';
import { fetchPostMovieEdit } from '../../api/index';
import styles from './ModalWrapper.module.css';

/**
 * Модальное окно редактирования фильма
 */

export default function ModalMovieEdit() {
  const { loading, error } = useSelector((state) => state.modal);
  const { activeMovieId, movies, halls, seances } = useSelector(
    (state) => state.config
  );
  const activeMovie = movies.find((movie) => movie?.movieId === activeMovieId);
  const [movieParams, setMovieParams] = useState({
    title: activeMovie?.movieTitle,
    info: activeMovie?.movieDescription,
    duration: activeMovie?.movieDuration,
    origin: activeMovie?.movieOrigin,
    poster: activeMovie?.moviePoster,
  });
  const [posterFile, setPosterFile] = useState();
  const [isPosterLoading, setIsPosterLoading] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [posterErrorText, setPosterErrorText] = useState('');
  const dispatch = useDispatch();
  const isDisabledSubmit =
    errorText ||
    loading ||
    isPosterLoading ||
    !movieParams?.title ||
    !movieParams?.info ||
    !movieParams?.duration ||
    !movieParams?.origin;
  const isDisabledCloseButton = loading;
  const isDisabledPosterControls = loading || isPosterLoading;
  const onChangeHandler = ({ target }) => {
    setErrorText('');
    const { name, value } = target;
    //если длительность меняется, то надо проверить, не налетает ли
    //окончание фильма на следующий сеанс во всех залах, где есть этот фильм
    //если налетает, то длительность не меняем и выдаем предупреждение
    //о том, что сначала надо удалить фильм из всех сеансов, а потом уже
    //менять длительность (увеличивать в этом случае)
    //проверка:
    const movieDuration = movies?.find(
      (movie) => movie?.movieId === activeMovieId
    )?.movieDuration;
    if (name === 'duration') {
      if (value && parseInt(value) > parseInt(movieDuration)) {
        const errorText = movieNewDurationCheck(
          activeMovieId,
          value,
          seances,
          halls
        );
        if (errorText)
          setErrorText(
            `Новая продолжительность фильма не может быть сохранена,
              так как появляются коллизии с последующими сеансами.
              Для сохранения новой продолжительности фильма необходимо сначала удалить сеансы с данным фильмом,
              которые могут приводить к коллизиям, для следующих залов:
              ${errorText}`
          );
      }

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
      if (srcString.startsWith('data:image')) {
        setPosterFile(reader.result.toString());
        setMovieParams((prev) => ({ ...prev, poster: null }));
      }
      if (!srcString.startsWith('data:image'))
        setPosterErrorText(
          'Произошла ошибка при загрузке постера, пожалуйста, попробуйте еще раз.'
        );
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

  const editMovieSubmit = (event) => {
    event.preventDefault();
    if (isDisabledSubmit) return;
    const formData = new FormData();
    formData.append('_method', 'PATCH');
    formData.append('title', movieParams?.title);
    formData.append('origin', movieParams?.origin);
    if (movieParams?.poster)
      // выше в onChangeFileHandler делаем movieParams.poster=null,
      // поэтому, когда добавлен новый постер, по этому if будет false
      // если picture = 'текст' - постер на сервере не изменится
      formData.append('picture', movieParams?.poster);
    if (event.target.poster?.files?.length)
      // если picture = файл - постер будет сохранен на сервере
      formData.append('picture', event.target?.poster?.files[0]);
    if (!event.target.poster?.files?.length && !movieParams?.poster)
      // если picture = '' - постер, если он есть на сервере будет удален
      formData.append('picture', '');
    formData.append('description', movieParams?.info);
    formData.append('duration_minutes', movieParams?.duration?.toString());
    dispatch(fetchPostMovieEdit({ activeMovieId, formData }));
  };

  return (
    <ModalWrapper name={'Редактирование фильма'}>
      {(closeButtonHandler) => (
        <form acceptCharset="utf-8" onSubmit={editMovieSubmit}>
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
              placeholder="Например: В далекой-далекой галактике, в тридевятом царстве, тридесятом государстве жили-были старик со старухой..."
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

          {posterFile || movieParams?.poster ? (
            <div className={styles.preview}>
              <img
                className={styles.preview_poster}
                alt="poster preview"
                src={posterFile || movieParams?.poster}
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
                text={'Редактирование фильма...'}
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
            {posterFile || movieParams?.poster ? (
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
              value="Принять изменения"
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
