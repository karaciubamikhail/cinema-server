import React from 'react';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ModalWrapper from './ModalWrapper';
import Loader from '../../components/loader/Loader';
import TextParagraph from '../../components/TextParagraph/TextParagraph';
import { fetchPostHallCreate } from '../../api/index';
import styles from './ModalWrapper.module.css';

/**
 * Модальное окно добавления зала
 */

export default function ModalHallAdd() {
  const { loading, error } = useSelector((state) => state.modal);
  const { halls } = useSelector((state) => state.config);
  const [newHallName, setNewHallName] = useState('');
  const [errorText, setErrorText] = useState('');
  const [isDisabledSubmit, setDisabledSubmit] = useState(true);
  const isDisabledCloseButton = loading;
  const dispatch = useDispatch();

  const addHallNameHandler = ({ target }) => {
    setErrorText('');
    setNewHallName(target.value);
    const trimName = target.value.trim();
    trimName ? setDisabledSubmit(false) : setDisabledSubmit(true);
    if (
      halls.findIndex(
        (hall) => hall.hallName.toLowerCase() === trimName.toLowerCase()
      ) !== -1
    ) {
      setDisabledSubmit(true);
      setErrorText(`Зал с именем ${trimName} уже существует`);
    }
  };

  const addHallSubmit = (event) => {
    event.preventDefault();
    if (isDisabledSubmit || loading) return;
    dispatch(fetchPostHallCreate(newHallName.trim()));
  };

  return (
    <ModalWrapper name={'Добавление зала'}>
      {(closeButtonHandler) => (
        <form acceptCharset="utf-8" onSubmit={addHallSubmit}>
          <label className={`${styles.label} ${styles.label_fullsize}`}>
            Название зала
            <input
              className={styles.input}
              type="text"
              placeholder="Например, &laquo;Зал 1&raquo;"
              name="name"
              required
              value={newHallName}
              disabled={loading}
              onChange={addHallNameHandler}
            />
          </label>

          {errorText && (
            <TextParagraph
              className={`${styles.TextParagraph} ${styles.error}`}
              text={errorText}
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
                text={'Создание зала...'}
              />
              <Loader />
            </>
          )}

          <div
            aria-label="buttons-group"
            className={`${styles.buttons} ${styles.text_center}`}
          >
            <input
              className={`${styles.button} ${styles.button_accent} ${
                isDisabledSubmit || loading ? styles.button_disabled : ''
              }`}
              type="submit"
              value="Добавить зал"
              disabled={isDisabledSubmit || loading}
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
