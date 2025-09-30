import React, { useState } from 'react';
import styles from './AdminSection.module.css';

/**
 * Компонент секции админки
 */

export default function AdminSection({ className, name, items, ...props }) {
  const [isOpened, setOpened] = useState(false);
  const toggleSection = () => {
    setOpened((prev) => !prev);
  };

  const wrapperClassName =
    name === 'Остановить продажи' || name === 'Открыть продажи'
      ? `${styles.wrapper} ${styles.text_center}`
      : styles.wrapper;

  return (
    <section className={styles.section}>
      <header
        className={`${styles.header} ${
          isOpened ? styles.header_opened : styles.header_closed
        }`}
        onClick={toggleSection}
      >
        <h2 className={styles.title}>{name}</h2>
      </header>
      <div className={wrapperClassName}>{props.children}</div>
    </section>
  );
}
