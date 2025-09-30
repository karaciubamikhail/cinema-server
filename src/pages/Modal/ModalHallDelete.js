import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ModalWrapper from './ModalWrapper';
import Loader from '../../components/loader/Loader';
import TextParagraph from '../../components/TextParagraph/TextParagraph';
import { fetchPostHallDelete } from '../../api/index';
import styles from './ModalWrapper.module.css';

/**
 * Модальное окно удаления зала
 */

export default function ModalHallDelete() {
  const { loading, error } = useSelector((state) => state.modal);
  const { activeHallId, halls, seances } = useSelector((state) => state.config);
  const dispatch = useDispatch();
  const isDisabledSubmit =
    loading || !halls?.length || !activeHallId?.hallsManagement;
  const isDisabledCloseButton = loading;
  const hallName = halls?.find(
    (hall) => hall?.hallId === activeHallId?.hallsManagement
  )?.hallName;
  const hallHasSeances =
    seances?.filter(
      (seance) => seance?.hallId === activeHallId?.hallsManagement
    )?.length > 0;

  const deleteHallSubmit = (event) => {
    event.preventDefault();
    if (isDisabledSubmit) return;
    dispatch(fetchPostHallDelete(activeHallId?.hallsManagement));
  };

  return (
    <ModalWrapper name={'Удаление зала'}>
      {(closeButtonHandler) => (
        <form acceptCharset="utf-8" onSubmit={deleteHallSubmit}>
          {!isDisabledSubmit ? (
            <p className={styles.TextParagraph}>
              Вы действительно хотите удалить зал <span>{hallName}</span>?
            </p>
          ) : (
            !loading && (
              <TextParagraph
                className={`${styles.TextParagraph} ${styles.error}`}
                text={'Ошибка. Отсутствует зал для удаления.'}
              />
            )
          )}

          {hallHasSeances ? (
            <TextParagraph
              className={`${styles.TextParagraph} ${styles.error}`}
              text={
                'Внимание: также будут удалены все сеансы, созданные для этого зала!'
              }
            />
          ) : null}

          {loading && (
            <>
              <TextParagraph
                className={`${styles.TextParagraph} ${styles.text_center}`}
                text={'Удаление зала...'}
              />
              <Loader />
            </>
          )}

          {error && (
            <TextParagraph
              className={`${styles.TextParagraph} ${styles.error}`}
              text={error}
            />
          )}

          <div
            aria-label="buttons-group"
            className={`${styles.buttons} ${styles.text_center}`}
          >
            <input
              className={`${styles.button} ${styles.button_accent} ${
                isDisabledSubmit ? styles.button_disabled : ''
              }`}
              type="submit"
              value="Удалить"
              disabled={isDisabledSubmit}
            />

            <button
              className={`${styles.button} ${styles.button_regular} ${
                isDisabledCloseButton ? styles.button_disabled : ''
              }`}
              type="reset"
              disabled={isDisabledCloseButton}
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
