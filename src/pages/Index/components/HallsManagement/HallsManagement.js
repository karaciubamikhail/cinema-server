import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveModal } from '../../../../store/SliceModal';
import AdminSection from '../../AdminSection';
import Loader from '../../../../components/loader/Loader';
import HallsManagementHallsList from './HallsManagementHallsList';
import HallsManagementHall from './HallsManagementHall';
import TextParagraph from '../../../../components/TextParagraph/TextParagraph';
import Button from '../../../../components/button/Button';
import styles from './HallsManagement.module.css';

/**
 * Компонент "Управление залами"
 */

export default function HallsManagement() {
  const {
    halls,
    startSales,
    loading,
    error: { global: initError },
  } = useSelector((state) => state.config);
  const dispatch = useDispatch();
  const isDisabled = loading || initError || startSales;
  const buttonHandler = () => {
    if (isDisabled) return;
    dispatch(setActiveModal('ModalHallAdd'));
  };
  return (
    <>
      <AdminSection name={'Управление залами'}>
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
                          ? 'Для возможности создания или удаления залов необходимо сначала остановить продажи билетов'
                          : 'Доступные залы:'
                      }
                    />
                    <HallsManagementHallsList className={''} hallsArr={halls}>
                      {(hallsArr) =>
                        hallsArr.map((hall, index) => (
                          <HallsManagementHall
                            key={index}
                            className={''}
                            hall={hall}
                            disabled={isDisabled}
                          >
                            {null}
                          </HallsManagementHall>
                        ))
                      }
                    </HallsManagementHallsList>
                  </>
                ) : (
                  <TextParagraph
                    className={styles.TextParagraph}
                    text={
                      'Для создания нового зала нажмите кнопку "Создать зал"'
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

            <Button
              className={`${styles.button} ${styles.button_accent} ${
                isDisabled ? styles.button_disabled : ''
              }`}
              name={'Создать зал'}
              disabled={isDisabled}
              handler={buttonHandler}
            />
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
    </>
  );
}
