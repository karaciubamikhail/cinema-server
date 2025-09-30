import React from 'react';
import { useDispatch } from 'react-redux';
import { setActiveHall } from '../../../../store/SliceConfig';
import { setActiveModal } from '../../../../store/SliceModal';
import Button from '../../../../components/button/Button';
import styles from './HallsManagementHall.module.css';

/**
 * Компонент зал раздела "Управление залами"
 */

export default function HallsManagementHall({
  className,
  hall,
  disabled,
  ...props
}) {
  const dispatch = useDispatch();
  const buttonHandler = () => {
    if (disabled) return;
    dispatch(
      setActiveHall({ section: 'hallsManagement', hallId: hall.hallId })
    );
    dispatch(setActiveModal('ModalHallDelete'));
  };
  return (
    <li>
      {hall.hallName}
      <Button
        className={`${styles.button} ${styles.button_trash} ${
          disabled ? styles.button_disabled : ''
        }`}
        disabled={disabled}
        handler={buttonHandler}
      />
    </li>
  );
}
