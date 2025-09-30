import { configureStore } from '@reduxjs/toolkit';
import configReducer from './SliceConfig';
import modalReducer from './SliceModal';
import viewReducer from './SliceView';

const store = configureStore({
  reducer: {
    config: configReducer,
    modal: modalReducer,
    view: viewReducer,
  },
});

export default store;
