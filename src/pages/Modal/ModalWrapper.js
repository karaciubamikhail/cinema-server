import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveModal } from '../../store/SliceModal';
import close from '../../img/close.png';
import styles from './ModalWrapper.module.css';

/**
 * Модальное окно, элемент обертки
 */

export default function ModalWrapper({ name, ...props }) {
  const { activeModal, loading } = useSelector((state) => state.modal);
  const isDisabledCloseButton = loading;
  const dispatch = useDispatch();
  const closeButtonHandler = (event) => {
    event.preventDefault();
    if (isDisabledCloseButton) return;
    dispatch(setActiveModal(''));
  };
  const modalClassName = activeModal
    ? `${styles.modal} ${styles.modal__active}`
    : styles.modal;
  return (
    <div className={modalClassName}>
      <div className={styles.modal__container}>
        <div className={styles.modal__content}>
          <div className={styles.modal__header}>
            <h2 className={styles.modal__title}>
              {name}
              <a
                className={styles.modal__dismiss}
                onClick={closeButtonHandler}
                href="/"
              >
                <img src={close} alt="Закрыть" />
              </a>
            </h2>
          </div>
          <div className={styles.modal__wrapper}>
            {props.children(closeButtonHandler)}
          </div>
        </div>
      </div>
    </div>
  );
}
