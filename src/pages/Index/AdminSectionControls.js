import React from 'react';
import Button from '../../components/button/Button';
import styles from './AdminSectionControls.module.css';

/**
 * Компонент управления секции
 */

export default function AdminSectionControls({
  disabled,
  cancelHandler,
  submitHandler,
}) {
  const cancelButtonHandler = () => {
    if (disabled?.cancel) return;
    if (cancelHandler) cancelHandler();
  };

  const submitButtonHandler = (event) => {
    event.preventDefault();
    if (disabled?.submit) return;
    if (submitHandler) submitHandler();
  };

  return (
    <fieldset className={`${styles.buttons} ${styles.text_center}`}>
      <Button
        className={`${styles.button} ${styles.button_regular} ${
          disabled?.cancel ? styles.button_disabled : ''
        }`}
        disabled={disabled?.cancel}
        name={'Отмена'}
        handler={cancelButtonHandler}
      />
      <input
        type={'submit'}
        value={'Сохранить'}
        className={`${styles.button} ${styles.button_accent} ${
          disabled?.submit ? styles.button_disabled : ''
        }`}
        disabled={disabled?.submit}
        onClick={submitButtonHandler}
      />
    </fieldset>
  );
}
