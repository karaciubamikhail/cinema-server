import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveHall } from '../../../../store/SliceConfig';
import AdminSection from '../../AdminSection';
import Loader from '../../../../components/loader/Loader';
import TextParagraph from '../../../../components/TextParagraph/TextParagraph';
import ConfigPricesHallsList from './ConfigPricesHallsList';
import ConfigPricesHall from './ConfigPricesHall';
import ConfigPricesSeatsLegendStandart from './ConfigPricesSeatsLegendStandart';
import ConfigPricesSeatsLegendVip from './ConfigPricesSeatsLegendVip';
import AdminSectionControls from '../../AdminSectionControls';
import { fetchPostHallPrices } from '../../../../api/index';
import { initHallPrices } from '../../../../api/helpers';
import styles from './ConfigPrices.module.css';

/**
 * Компонент 'Конфигурация цен'
 */

export default function ConfigPrices({ ...props }) {
  const {
    halls,
    seats,
    activeHallId,
    startSales,
    loading,
    error: { global: initError, pricesSection: sectionError },
  } = useSelector((state) => state.config);
  const [hallPrices, setHallPrices] = useState({ standart: 0, vip: 0 });
  const dispatch = useDispatch();
  const activeHall = halls?.find(
    (hall) => activeHallId?.configPrices === hall?.hallId
  );
  const hallHasVipSeats = seats?.some((seat) => seat.seatType === '2');
  const isOldPrices =
    !activeHall?.hallPriceStandard && !activeHall?.hallPriceVip
      ? true
      : hallPrices?.standart === activeHall?.hallPriceStandard &&
        (hallHasVipSeats ? hallPrices?.vip === activeHall?.hallPriceVip : true);
  const isDisabledCancel = loading || isOldPrices;
  const isDisabledSubmit =
    loading ||
    initError ||
    startSales ||
    isOldPrices ||
    !halls?.length ||
    !activeHallId?.configPrices ||
    !hallPrices.standart ||
    !(hallHasVipSeats ? (hallPrices.vip ? true : false) : true);

  const hallPricesHandler = ({ target }) => {
    const { name, value } = target;
    const price = parseInt(value.trim());
    if (
      !price ||
      isNaN(price) ||
      hallPrices[name] === price ||
      loading ||
      startSales
    )
      return;

    setHallPrices((prevSize) => {
      return { ...prevSize, [name]: price };
    });
  };

  const hallSelectHandler = (hallId) => {
    if (loading || startSales) return;
    if (hallId !== activeHallId?.configPrices)
      dispatch(setActiveHall({ section: 'configPrices', hallId }));
  };

  const submitHandler = () => {
    if (isDisabledSubmit) return;
    dispatch(
      fetchPostHallPrices({
        activeHallId: activeHallId?.configPrices,
        ...hallPrices,
      })
    );
  };

  const cancelHandler = () => {
    if (isDisabledCancel) return;
    const initHallPricesObj = initHallPrices(activeHall);
    setHallPrices(initHallPricesObj);
  };

  useEffect(() => {
    if (!halls?.length || !activeHall) return;
    const initHallPricesObj = initHallPrices(activeHall);
    setHallPrices(initHallPricesObj);
  }, [halls?.length, activeHall]);

  return (
    <AdminSection className={''} name={'Конфигурация цен'}>
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
                  <ConfigPricesHallsList className={''} hallsArr={halls}>
                    {(hallsArr) =>
                      hallsArr.map((hall, index) => (
                        <ConfigPricesHall
                          key={index}
                          className={''}
                          hall={hall}
                          disabled={loading || startSales}
                          isDefaultChecked={
                            hall.hallId === activeHallId?.configPrices
                          }
                          hallSelectHandler={hallSelectHandler}
                        >
                          {null}
                        </ConfigPricesHall>
                      ))
                    }
                  </ConfigPricesHallsList>
                  <TextParagraph
                    className={styles.TextParagraph}
                    text={'Установите цены для типов кресел:'}
                  />
                  <ConfigPricesSeatsLegendStandart
                    disabled={loading || startSales}
                    hallPrices={hallPrices}
                    hallPricesHandler={hallPricesHandler}
                  />
                  <ConfigPricesSeatsLegendVip
                    disabled={loading || startSales}
                    hallPrices={hallPrices}
                    hallPricesHandler={hallPricesHandler}
                  />
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
