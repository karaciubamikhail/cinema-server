import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AdminSection from '../../AdminSection';
import Loader from '../../../../components/loader/Loader';
import Button from '../../../../components/button/Button';
import TextParagraph from '../../../../components/TextParagraph/TextParagraph';
import { getHallsNotReadyArr } from '../../../../api/helpers';
import { fetchPostStartSales } from '../../../../api/index';
import styles from './StartSales.module.css';

/**
 * Компонент 'Открыть продажи'
 */

export default function StartSales({ className, ...props }) {
  const {
    movies,
    halls,
    seances,
    seats,
    startSales,
    loading,
    error: { global: initError, salesSection: sectionError },
  } = useSelector((state) => state.config);
  const dispatch = useDispatch();
  const hallsNotReadyArr = getHallsNotReadyArr(halls, seats, seances);
  const isDisabledSubmit =
    !movies?.length ||
    !halls?.length ||
    !seances?.length ||
    hallsNotReadyArr?.length ||
    loading ||
    initError ||
    sectionError;
  const hallsNotReadyElement = hallsNotReadyArr?.map((hallName) => (
    <TextParagraph
      key={hallName}
      className={styles.TextParagraph}
      text={`- ${hallName}`}
    />
  ));
  const startSalesSubmit = (event) => {
    event.preventDefault();
    if (isDisabledSubmit) return;
    dispatch(fetchPostStartSales());
  };
  return (
    <AdminSection
      className={''}
      name={startSales ? 'Остановить продажи' : 'Открыть продажи'}
    >
      {!loading ? (
        <>
          {!initError ? (
            <>
              {!isDisabledSubmit && !startSales ? (
                <p className={styles.TextParagraph}>Всё готово, теперь можно:</p>
              ) : (
                !startSales && (
                  <>
                    <TextParagraph
                      className={`${styles.TextParagraph} ${styles.error}`}
                      text={`Для открытия продаж билетов нужно завершить конфигурирование залов${
                        hallsNotReadyElement.length ? ':' : '.'
                      }`}
                    />
                    {hallsNotReadyElement}
                  </>
                )
              )}
            </>
          ) : (
            <TextParagraph
              className={`${styles.TextParagraph} ${styles.error}`}
              text={initError}
            />
          )}

          {sectionError && (
            <TextParagraph
              className={`${styles.TextParagraph} ${styles.error}`}
              text={sectionError}
            />
          )}

          <Button
            name={
              startSales
                ? 'Остановить продажи билетов'
                : 'Открыть продажи билетов'
            }
            disabled={startSales ? false : isDisabledSubmit}
            className={`${styles.button} ${styles.button_accent} ${
              isDisabledSubmit ? styles.button_disabled : ''
            }`}
            handler={startSalesSubmit}
          />
        </>
      ) : (
        <>
          <TextParagraph className={styles.TextParagraph} text={'Загрузка...'} />
          <Loader />
        </>
      )}
    </AdminSection>
  );
}
