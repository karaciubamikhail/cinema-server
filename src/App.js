import React, { useEffect } from 'react';
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from './components/header/Header';
import Login from './pages/Login/Login';
import AdminIndex from './pages/Index/AdminIndex';
import ModalSelect from './pages/Modal/ModalSelect';
import useStorage from './hooks/useStorage';
import { setActiveToken } from './store/SliceConfig';

export default function App() {
  const { token: configToken } = useSelector((state) => state.config);
  const [storageToken, setStorageToken] = useStorage(
    localStorage,
    'token',
    false
  );
  const dispatch = useDispatch();

  //если "свежий" токен не равен токену из стоража,
  //надо заменить токен в стораже на "свежий"
  useEffect(() => {
    if (
      (configToken && !storageToken) ||
      (configToken && storageToken && configToken !== storageToken)
    ) {
      setStorageToken(configToken);
    }
    if (!configToken && storageToken) {
      dispatch(setActiveToken(storageToken));
    }
  }, [dispatch, setStorageToken, configToken, storageToken]);

  return (
    <Router>
      {storageToken && configToken ? (
        <>
          <ModalSelect />
          <Header />
          <Routes>
            <Route path="/" element={<AdminIndex />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </Router>
  );
}
