import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveModal } from '../../../../store/SliceModal';
import { setSeancesView, cancelSeancesView } from '../../../../store/SliceView';
import { setActiveMovie, setActiveSeance } from '../../../../store/SliceConfig';
import AdminSection from '../../AdminSection';
import Loader from '../../../../components/loader/Loader';
import Button from '../../../../components/button/Button';
import TextParagraph from '../../../../components/TextParagraph/TextParagraph';
import MoviesList from './MoviesList';
import MoviePlate from './MoviePlate';
import SeancesList from './SeancesList';
import SeancesHalls from './SeancesHalls';
import SeancesMovie from './SeancesMovie';
import AdminSectionControls from '../../AdminSectionControls';
import {
  SEANCES_COLORS_ARR,
  SEANCES_SCHEME_MODAL_NAMES,
  getSeancesView,
} from '../../../../api/helpers';
import { fetchPostSeances } from '../../../../api/index';
import styles from './SeancesScheme.module.css';

/**
 * Компонент 'Сетка сеансов'
 */

export default function SeancesScheme() {
  const {
    movies,
    seances,
    halls,
    startSales,
    loading,
    error: { global: initError, seancesSection: sectionError },
  } = useSelector((state) => state.config);
  const { seancesView, seancesCreated, seancesRemoved } = useSelector(
    (state) => state.view
  );
  const [movieControls, setMovieControls] = useState();
  const dispatch = useDispatch();
  const maxMoviesLimit = movies ? !(movies?.length < 9) : false;
  const seancesViewArr = getSeancesView(
    halls,
    movies,
    seances,
    SEANCES_COLORS_ARR
  );
  const isDisabledCancel =
    loading || (!seancesCreated?.length && !seancesRemoved?.length);
  const isDisabledSubmit =
    startSales ||
    loading ||
    initError ||
    !halls?.length ||
    !movies?.length ||
    (!seancesCreated?.length && !seancesRemoved?.length);
  const isDisabledMovies = startSales || loading || initError;

  const buttonModalHandler = (event, name) => {
    if (startSales || loading) return;
    dispatch(setActiveModal(SEANCES_SCHEME_MODAL_NAMES[name]));
  };

  const seanceDeleteHandler = (seance) => {
    if (startSales || loading) return;
    dispatch(setActiveSeance(seance));
    dispatch(setActiveModal('ModalSeanceDelete'));
  };

  const showControlsHandler = (movieId) => {
    if (startSales || loading) return;
    dispatch(setActiveMovie(movieId));
    setMovieControls((prev) => (prev === movieId ? 0 : movieId));
  };

  useEffect(() => {
    dispatch(setSeancesView(seancesViewArr));
  }, [dispatch, halls, movies, seances]);

  const submitHandler = () => {
    if (isDisabledSubmit) return;
    dispatch(fetchPostSeances()).then(dispatch(cancelSeancesView()));
  };

  const cancelHandler = () => {
    if (isDisabledCancel) return;
    dispatch(setSeancesView(seancesViewArr));
    dispatch(cancelSeancesView());
  };

  return (
    <AdminSection className={''} name={'Сетка сеансов'}>
      {!loading ? (
        <>
          {!initError ? (
            <>
              {halls?.length ? (
                <>
                  <div className={styles.TextParagraph}>
                    {startSales ? (
                      <TextParagraph
                        className={`${styles.TextParagraph} ${styles.error}`}
                        text={
                          'Для возможности создания или удаления залов необходимо сначала остановить продажи билетов'
                        }
                      />
                    ) : null}
                    <Button
                      name={'Добавить фильм'}
                      disabled={isDisabledMovies || maxMoviesLimit}
                      className={`${styles.button} ${styles.button_accent} ${
                        isDisabledMovies || maxMoviesLimit
                          ? styles.button_disabled
                          : ''
                      }`}
                      handler={buttonModalHandler}
                    />
                    {maxMoviesLimit ? (
                      <TextParagraph
                        className={`${styles.TextParagraph} ${styles.error}`}
                        text={
                          'Достигнут лимит на максимальное количество фильмов - 9 шт.'
                        }
                      />
                    ) : null}
                  </div>
                  {movies?.length ? (
                    <TextParagraph
                      className={styles.TextParagraph}
                      text={
                        'Нажмите на иконку фильма для редактирования или добавления сеанса:'
                      }
                    />
                  ) : null}
                  <MoviesList className={''} movies={movies}>
                    {(movies) =>
                      movies?.map((movie, index) => (
                        <MoviePlate
                          key={index}
                          disabled={isDisabledMovies}
                          movie={movie}
                          movieControls={movieControls}
                          className={''}
                          showControlsHandler={showControlsHandler}
                          buttonHandler={buttonModalHandler}
                        >
                          {null}
                        </MoviePlate>
                      ))
                    }
                  </MoviesList>
                  {seances?.length ? (
                    <TextParagraph
                      className={styles.TextParagraph}
                      text={'Нажмите на иконку сеанса, чтобы удалить его:'}
                    />
                  ) : null}
                  <SeancesList className={''} halls={seancesView}>
                    {(halls) =>
                      halls?.map((hall, index) => (
                        <SeancesHalls key={index} className={''} hall={hall}>
                          {(hall) =>
                            hall?.objsList?.map((seance) => (
                              <SeancesMovie
                                key={seance.startTime}
                                seance={seance}
                                className={''}
                                seanceDeleteHandler={seanceDeleteHandler}
                              >
                                {null}
                              </SeancesMovie>
                            ))
                          }
                        </SeancesHalls>
                      ))
                    }
                  </SeancesList>

                  {sectionError && (
                    <TextParagraph
                      className={`${styles.TextParagraph} ${styles.error}`}
                      text={sectionError}
                    />
                  )}
                  <AdminSectionControls
                    disabled={{
                      submit: isDisabledSubmit,
                      cancel: isDisabledCancel,
                    }}
                    submitHandler={submitHandler}
                    cancelHandler={cancelHandler}
                  />
                </>
              ) : (
                <TextParagraph
                  className={styles.TextParagraph}
                  text={
                    'Для возможности конфигурирования сначала создайте зал в разделе "Управление залами'
                  }
                />
              )}
            </>
          ) : (
            <TextParagraph
              className={`${styles.TextParagraph} ${styles.error}`}
              text={initError}
            />
          )}
        </>
      ) : (
        <>
          <TextParagraph
            className={`${styles.TextParagraph} ${styles.text_center}`}
            text={'Загрузка...'}
          />
          <Loader />
        </>
      )}
    </AdminSection>
  );
}
