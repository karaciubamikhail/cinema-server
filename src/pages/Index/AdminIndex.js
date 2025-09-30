import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AdminMain from './AdminMain';
import StartSales from './components/StartSales/StartSales';
import HallsManagement from './components/HallsManagement/HallsManagement';
import ConfigPrices from './components/ConfigPrices/ConfigPrices';
import ConfigHalls from './components/ConfigHalls/ConfigHalls';
import SeancesScheme from './components/SeancesScheme/SeancesScheme';
import { fetchGetInitEntities } from '../../api/index';

/**
 * Страница админки
 */

export default function AdminIndex() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchGetInitEntities());
  }, [dispatch]);
  return (
    <>
      <AdminMain>
        <HallsManagement />
        <ConfigHalls />
        <ConfigPrices />
        <SeancesScheme />
        <StartSales />
      </AdminMain>
    </>
  );
}
