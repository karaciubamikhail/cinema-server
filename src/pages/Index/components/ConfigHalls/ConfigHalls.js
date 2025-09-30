import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveHall } from '../../../../store/SliceConfig';
import AdminSection from '../../AdminSection';
import Loader from '../../../../components/loader/Loader';
import ConfigHallsList from './ConfigHallsList';
import ConfigHallsHall from './ConfigHallsHall';
import ConfigHallsLegendQty from './ConfigHallsLegendQty';
import ConfigHallsLegendSeats from './ConfigHallsLegendSeats';
import ConfigHallsScheme from './ConfigHallsScheme';
import ConfigHallsSchemeRowSeats from './ConfigHallsSchemeRowSeats';
import ConfigHallsSchemeSeat from './ConfigHallsSchemeSeat';
import AdminSectionControls from '../../AdminSectionControls';
import TextParagraph from '../../../../components/TextParagraph/TextParagraph';
import {
  getTransformedArr,
  initHallSize,
  initSeats,
} from '../../../../api/helpers';
import { fetchPostHallSize, fetchPostSeats } from '../../../../api/index';
import styles from './ConfigHalls.module.css';

/**
 * Компонент 'Конфигурация залов'
 */

export default function ConfigHalls() {
  const {
    halls,
    seats,
    activeHallId,
    startSales,
    loading,
    error: { global: initError, hallsSection: sectionError },
  } = useSelector((state) => state.config);
  const [hallSize, setHallSize] = useState({ rows: 0, cols: 0 });
  const [seatsType, setSeatsType] = useState([]);
  const hasHallSize = !!parseInt(hallSize?.rows) && !!parseInt(hallSize?.cols);
  const activeHall = halls?.find(
    (hall) => activeHallId?.configHalls === hall?.hallId
  );
  const hallSeatsArr = seats?.filter(
    (seat) => seat?.seatHallId === activeHall?.hallId
  );
  const isOldSize = hallSeatsArr?.length
    ? hallSize?.rows === activeHall?.hallRows &&
      hallSize?.cols === activeHall?.hallCols
    : false;
  const isOldSeats = hallSeatsArr?.length
    ? hallSeatsArr?.length === seatsType?.length &&
      hallSeatsArr?.every((el) => {
        const seatsTypeEl = seatsType?.find(
          (seat) => el?.seatId === seat?.seatId
        );
        return (
          seatsTypeEl &&
          el?.seatIndexRow === seatsTypeEl?.seatIndexRow &&
          el?.seatIndexCol === seatsTypeEl?.seatIndexCol &&
          el?.seatType === seatsTypeEl?.seatType.toString()
        );
      })
    : false;
  const dispatch = useDispatch();

  const hallSizeHandler = ({ target }) => {
    const { name, value } = target;
    const size = parseInt(value.trim());
    if (!size || isNaN(size) || startSales || loading) return;
    if (hallSize[name] === size) return;
    setHallSize((prevSize) => {
      return { ...prevSize, [name]: size };
    });
  };

  const seatsTypeHandler = (seat) => {
    if (startSales || loading) return;
    setSeatsType((prevSeatsType) => {
      return prevSeatsType.map((prevSeat) =>
        prevSeat.seatIndexRow === seat?.seatIndexRow &&
        prevSeat.seatIndexCol === seat?.seatIndexCol
          ? {
              ...prevSeat,
              seatType:
                parseInt(prevSeat.seatType) + 1 > 2
                  ? '0'
                  : parseInt(prevSeat.seatType) + 1,
            }
          : prevSeat
      );
    });
  };

  const hallSelectHandler = (hallId) => {
    if (startSales || loading) return;
    if (hallId !== activeHallId?.configHalls)
      dispatch(setActiveHall({ section: 'configHalls', hallId }));
  };

  //init hallsize
  useEffect(() => {
    if (!halls?.length || !activeHall) return;
    const initHallSizeObj = initHallSize(activeHall);
    setHallSize(initHallSizeObj);
  }, [halls?.length, activeHall]);

  //init seats
  useEffect(() => {
    if (!hallSize?.rows || !hallSize?.cols || !activeHall) return;
    if (isOldSize) return setSeatsType(hallSeatsArr);
    if (!isOldSize) {
      const initSeatsArr = initSeats(hallSize, activeHall);
      setSeatsType(initSeatsArr);
    }
  }, [hallSize?.rows, hallSize?.cols, activeHall, hallSeatsArr?.length]);

  const mapToInternalSeatsArr = getTransformedArr(seatsType, 'seatIndexRow');
  const isDisabledSubmit =
    startSales ||
    loading ||
    initError ||
    !halls?.length ||
    !activeHallId?.configHalls ||
    !hasHallSize ||
    (isOldSize && isOldSeats);

  const isDisabledCancel =
    loading ||
    (isOldSize && isOldSeats) ||
    (!hallSize?.rows && !hallSize?.cols);

  const cancelHandler = () => {
    if (isDisabledCancel) return;
    const initHallSizeObj = initHallSize(activeHall);
    setHallSize(initHallSizeObj);
    const initSeatsArr = initSeats(hallSize, activeHall);
    setSeatsType(initSeatsArr);
  };

  const submitHandler = () => {
    if (isDisabledSubmit) return;
    if (!isOldSize && !isOldSeats) {
      return dispatch(
        fetchPostHallSize({ activeHallId: activeHallId?.configHalls, hallSize })
      ).then(() => {
        dispatch(
          fetchPostSeats({
            activeHallId: activeHallId?.configHalls,
            seatsType,
          })
        );
      });
    }
    if (!isOldSeats) {
      dispatch(
        fetchPostSeats({
          activeHallId: activeHallId?.configHalls,
          seatsType,
        })
      );
    }
  };

  return (
    <AdminSection name={'Конфигурация залов'}>
      {!loading ? (
        <>
          {!initError ? (
            <>
              {halls?.length ? (
                <>
                  <TextParagraph
                    className={`${styles.TextParagraph} ${
                      startSales ? styles.error : ''
                    }`}
                    text={
                      startSales
                        ? 'Для возможности конфигурирования залов сначала необходимо остановить продажи билетов'
                        : 'Выберите зал для конфигурации:'
                    }
                  />
                  <ConfigHallsList className={''} hallsArr={halls}>
                    {(hallsArr) =>
                      hallsArr?.map((hall, index) => (
                        <ConfigHallsHall
                          key={index}
                          className={''}
                          hall={hall}
                          disabled={loading}
                          isDefaultChecked={
                            hall.hallId === activeHallId?.configHalls
                          }
                          hallSelectHandler={hallSelectHandler}
                        >
                          {null}
                        </ConfigHallsHall>
                      ))
                    }
                  </ConfigHallsList>
                  <TextParagraph
                    className={styles.TextParagraph}
                    text={'Укажите количество рядов и мест:'}
                  />
                  <ConfigHallsLegendQty
                    hallSize={hallSize}
                    disabled={loading}
                    hallSizeHandler={hallSizeHandler}
                  />
                  {!hasHallSize && (
                    <TextParagraph
                      className={styles.TextParagraph}
                      text={
                        'Для продолжения требуется указать количество рядов и мест!'
                      }
                    />
                  )}
                  {hasHallSize && (
                    <>
                      <TextParagraph
                        className={styles.TextParagraph}
                        text={
                          'Теперь вы можете указать виды кресел на схеме зала:'
                        }
                      />
                      <ConfigHallsLegendSeats />
                      <ConfigHallsScheme
                        className={''}
                        seats={mapToInternalSeatsArr}
                      >
                        {(seats) =>
                          seats?.map((seatsRow, index) => (
                            <ConfigHallsSchemeRowSeats
                              className={''}
                              key={index}
                              seatsRow={seatsRow}
                            >
                              {(seatsRow) =>
                                seatsRow?.objsList?.map((seat, index) => (
                                  <ConfigHallsSchemeSeat
                                    className={''}
                                    key={index}
                                    seat={seat}
                                    seatsTypeHandler={seatsTypeHandler}
                                  />
                                ))
                              }
                            </ConfigHallsSchemeRowSeats>
                          ))
                        }
                      </ConfigHallsScheme>
                    </>
                  )}
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
