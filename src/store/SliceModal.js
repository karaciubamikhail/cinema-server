import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeModal: '',
  loading: false,
  error: null,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setActiveModal(state, action) {
      state.activeModal = action.payload;
    },
    setModalRequest(state) {
      state.loading = true;
      state.error = null;
    },
    setModalRequestSuccess(state) {
      state.loading = false;
      state.error = null;
    },
    setModalRequestFailed(state, action) {
      state.loading = false;
      state.error = `Произошла ошибка. Пожалуйста, повторите еще раз.`;
    },
  },
});

export const {
  setActiveModal,
  setModalRequest,
  setModalRequestSuccess,
  setModalRequestFailed,
} = modalSlice.actions;

export default modalSlice.reducer;
