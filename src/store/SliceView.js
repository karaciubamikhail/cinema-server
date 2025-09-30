import { createSlice, current } from '@reduxjs/toolkit';

const initialState = {
  seancesView: [],
  seancesCreated: [],
  seancesRemoved: [],
};

const viewSlice = createSlice({
  name: 'view',
  initialState,
  reducers: {
    setSeancesView(state, action) {
      state.seancesView = action.payload;
    },
    cancelSeancesView(state) {
      state.seancesCreated = [];
      state.seancesRemoved = [];
    },
    createSeanceView(state, action) {
      const { hallId, startTime } = action.payload;
      const seanceExistIndex = state.seancesCreated.findIndex(
        (seance) => seance.hallId === hallId && seance.startTime === startTime
      );
      if (seanceExistIndex === -1) {
        // если нет такого сеанса
        state.seancesCreated.push(action.payload);
      }
      if (seanceExistIndex >= 0) {
        // если есть такой сеанс, то заменим его на новый
        state.seancesCreated.splice(seanceExistIndex, 1, action.payload);
      }
      const seanceRemoveIndex = state.seancesRemoved.findIndex(
        (seance) => seance.hallId === hallId && seance.startTime === startTime
      );
      if (seanceRemoveIndex >= 0) {
        state.seancesRemoved.splice(seanceRemoveIndex, 1);
      }
      // т.к. новый сеанс проверяется на коллизии, то по идее не должно возникнуть случая,
      // когда сеанс из того же зала с тем же временем начала не удален из seancesView
      //индекс зала в архиве:
      const seanceViewHallIndex = state.seancesView.findIndex((viewArrObj) => {
        return viewArrObj.hall.id === hallId;
      });
      // добавляем сеанс:
      state.seancesView[seanceViewHallIndex]?.objsList?.push(action.payload);
    },
    removeSeanceView(state, action) {
      const { hallId, startTime, seanceId } = action.payload;
      const seanceExistIndex = state.seancesCreated.findIndex(
        (seance) => seance.hallId === hallId && seance.startTime === startTime
      );
      if (seanceExistIndex >= 0) {
        state.seancesCreated.splice(seanceExistIndex, 1);
      }
      if (seanceId) {
        const seanceRemoveIndex = state.seancesRemoved.findIndex(
          (seance) => seance.seanceId === seanceId
        );
        if (seanceRemoveIndex === -1) {
          state.seancesRemoved.push(action.payload);
        }
      }
      //индекс зала в архиве:
      const seanceViewHallIndex = state.seancesView.findIndex((viewArrObj) => {
        return viewArrObj.hall.id === hallId;
      });
      //индекс сеанса в архиве objsList зала:
      const seanceViewObjsListSeanceIndex = state.seancesView[
        seanceViewHallIndex
      ]?.objsList?.findIndex((seance) => seance.startTime === startTime);
      // удаляем искомый сеанс:
      state.seancesView[seanceViewHallIndex]?.objsList?.splice(
        seanceViewObjsListSeanceIndex,
        1
      );
    },
  },
});

export const {
  setSeancesView,
  cancelSeancesView,
  createSeanceView,
  removeSeanceView,
} = viewSlice.actions;

export default viewSlice.reducer;
