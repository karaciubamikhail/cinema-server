import React from 'react';
import styles from './Header.module.css';
/**
 * Хедер
 */
export default function Header() {
  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.header_title}>
          Идём<span>в</span>кино
        </h1>
        <span className={styles.header__subtitle}>Администраторррская</span>
      </header>
    </>
  );
}
