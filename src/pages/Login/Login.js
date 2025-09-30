import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostTokenCreate } from '../../api/index';
import Loader from '../../components/loader/Loader';
import TextParagraph from '../../components/TextParagraph/TextParagraph';
import styles from './Login.module.css';

/**
 * Страница авторизации
 */

export default function Login() {
  const {
    loading,
    error: { global: initError },
  } = useSelector((state) => state.config);
  const [loginParams, setLoginParams] = useState({
    email: '',
    password: '',
  });
  const dispatch = useDispatch();

  const onChangeHandler = ({ target }) => {
    if (loading) return;
    const { name, value } = target;
    setLoginParams((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const loginFormSubmit = (event) => {
    if (loading) return;
    event.preventDefault();
    if (!loginParams?.email || !loginParams?.password) return;
    dispatch(fetchPostTokenCreate(loginParams));
  };

  return (
    <main>
      <section className={styles.login}>
        <header className={styles.header}>
          <h2 className={styles.title}>Авторизация</h2>
        </header>
        <div className={styles.wrapper}>
          <form acceptCharset="utf-8" onSubmit={loginFormSubmit}>
            <label className={styles.label}>
              E-mail
              <input
                className={styles.input}
                type="mail"
                placeholder="admin@demo.xyz"
                name="email"
                required
                value={loginParams?.email}
                disabled={loading}
                onChange={onChangeHandler}
              />
            </label>
            <label className={styles.label}>
              Пароль
              <input
                className={styles.input}
                type="password"
                placeholder=""
                name="password"
                required
                value={loginParams?.password}
                disabled={loading}
                onChange={onChangeHandler}
              />
            </label>
            {initError && (
              <TextParagraph
                className={`${styles.TextParagraph} ${styles.error}`}
                text={initError}
              />
            )}
            {loading && (
              <>
                <TextParagraph
                  className={`${styles.TextParagraph} ${styles.text_center}`}
                  text={'Авторизация...'}
                />
                <Loader />
              </>
            )}

            <div className="text-center">
              <input
                value="Авторизоваться"
                type="submit"
                disabled={loading}
                className={`${styles.button} ${styles.button_accent} ${
                  loading ? styles.button_disabled : ''
                }`}
              />
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
