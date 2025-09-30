import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  halls: [],
  activeHallId: { hallsManagement: '', configHalls: '', configPrices: '' },
  seats: [],
  movies: [],
  activeMovieId: '',
  seances: [],
  activeSeance: null,
  startSales: true,
  loading: false,
  error: {
    global: null,
    seatsSection: null,
    pricesSection: null,
    seancesSection: null,
    salesSection: null,
  },
  token: null,
};
const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setActiveHall(state, action) {
      state.activeHallId = {
        ...state.activeHallId,
        [action.payload.section]: action.payload.hallId,
      };
    },
    setActiveMovie(state, action) {
      state.activeMovieId = action.payload;
    },
    setActiveToken(state, action) {
      state.token = action.payload;
    },
    setActiveSeance(state, action) {
      state.activeSeance = action.payload;
    },
    getMoviesRequest(state) {
      state.loading = true;
      state.error.global = null;
    },
    getMoviesRequestSuccess(state, action) {
      state.loading = false;
      state.movies = action.payload;
    },
    getMoviesRequestFailed(state) {
      state.loading = false;
      state.error.global = `Произошла ошибка. Пожалуйста, перезагрузите страницу.`;
    },
    getHallsRequest(state) {
      state.loading = true;
      state.error.global = null;
    },
    getHallsRequestSuccess(state, action) {
      state.loading = false;
      state.halls = action.payload;
      state.activeHallId.configHalls = action.payload[0]?.hallId;
      state.activeHallId.configPrices = action.payload[0]?.hallId;
    },
    getHallsRequestFailed(state, action) {
      state.loading = false;
      state.error.global = `Произошла ошибка. Пожалуйста, перезагрузите страницу.`;
    },
    getSeatsRequest(state) {
      state.loading = true;
      state.error.global = null;
    },
    getSeatsRequestSuccess(state, action) {
      state.loading = false;
      state.seats = action.payload;
    },
    getSeatsRequestFailed(state, action) {
      state.loading = false;
      state.error.global = action.payload;
    },
    getSeancesRequest(state) {
      state.loading = true;
      state.error.global = null;
    },
    getSeancesRequestSuccess(state, action) {
      state.loading = false;
      state.seances = action.payload;
    },
    getSeancesRequestFailed(state) {
      state.loading = false;
      state.error.global = `Произошла ошибка. Пожалуйста, перезагрузите страницу.`;
    },
    postPricesRequest(state) {
      state.loading = true;
      state.error.pricesSection = null;
    },
    postPricesRequestSuccess(state, action) {
      state.loading = false;
      state.error.pricesSection = null;
    },
    postPricesRequestFailed(state) {
      state.loading = false;
      state.error.pricesSection =
        'Произошла ошибка. Пожалуйста, повторите еще раз.';
    },
    postSeatsRequest(state) {
      state.loading = true;
      state.error.seatsSection = null;
    },
    postSeatsRequestSuccess(state, action) {
      state.loading = false;
      state.error.seatsSection = null;
    },
    postSeatsRequestFailed(state) {
      state.loading = false;
      state.error.seatsSection =
        'Произошла ошибка. Пожалуйста, повторите еще раз.';
    },
    postSeancesRequest(state) {
      state.loading = true;
      state.error.seatsSection = null;
    },
    postSeancesRequestSuccess(state, action) {
      state.loading = false;
      state.error.seatsSection = null;
    },
    postSeancesRequestFailed(state, action) {
      console.log('SliceConfig_postSeatsRequestFailed_error: ', action.payload);
      state.loading = false;
      state.error.seatsSection =
        'Произошла ошибка. Пожалуйста, повторите еще раз.';
    },
    postHallSizeRequest(state) {
      state.loading = true;
      state.error.seatsSection = null;
    },
    postHallSizeRequestSuccess(state) {
      state.loading = false;
      state.error.seatsSection = null;
    },
    postHallSizeRequestFailed(state) {
      state.loading = false;
      state.error.seatsSection =
        'Произошла ошибка. Пожалуйста, повторите еще раз.';
    },
    postShowtimeRequest(state) {
      state.loading = true;
      state.error.seancesSection = null;
    },
    postShowtimeRequestSuccess(state) {
      state.loading = false;
      state.error.seancesSection = null;
    },
    postShowtimeRequestFailed(state) {
      state.loading = false;
      state.error.seancesSection =
        'Произошла ошибка. Пожалуйста, повторите еще раз.';
    },
    postStartSalesRequest(state) {
      state.loading = true;
      state.error.salesSection = null;
    },
    postStartSalesRequestSuccess(state) {
      state.loading = false;
      state.error.salesSection = null;
    },
    postStartSalesRequestFailed(state, action) {
      console.log(
        'SliceConfig_postStartSalesRequestFailed_error: ',
        action.payload
      );
      state.loading = false;
      state.error.salesSection =
        'Произошла ошибка. Пожалуйста, повторите еще раз.';
    },
    postTokenCreateRequest(state) {
      state.loading = true;
      state.error.global = null;
    },
    postTokenCreateRequestSuccess(state, action) {
      state.loading = false;
      state.error.global = null;
      state.token = action.payload;
    },
    postTokenCreateRequestFailed(state) {
      state.loading = false;
      state.error.global = `Произошла ошибка. Пожалуйста, повторите еще раз.`;
    },
    getStartSalesRequest(state) {
      state.loading = true;
      state.error.global = null;
    },
    getStartSalesRequestSuccess(state, action) {
      state.loading = false;
      state.error.global = null;
      state.startSales = action.payload;
    },
    getStartSalesRequestFailed(state) {
      state.loading = false;
      state.error.global = `Произошла ошибка. Пожалуйста, перезагрузите страницу.`;
    },
  },
});

export const {
  getStartSalesRequest,
  getStartSalesRequestSuccess,
  getStartSalesRequestFailed,
  getSeancesRequest,
  getSeancesRequestSuccess,
  getSeancesRequestFailed,
  getSeatsRequest,
  getSeatsRequestSuccess,
  getSeatsRequestFailed,
  getHallsRequest,
  getHallsRequestSuccess,
  getHallsRequestFailed,
  getMoviesRequest,
  getMoviesRequestSuccess,
  getMoviesRequestFailed,
  postPricesRequest,
  postPricesRequestSuccess,
  postPricesRequestFailed,
  postSeatsRequest,
  postSeatsRequestSuccess,
  postSeatsRequestFailed,
  postSeancesRequest,
  postSeancesRequestSuccess,
  postSeancesRequestFailed,
  postHallSizeRequest,
  postHallSizeRequestSuccess,
  postHallSizeRequestFailed,
  postShowtimeRequest,
  postShowtimeRequestSuccess,
  postShowtimeRequestFailed,
  postStartSalesRequest,
  postStartSalesRequestSuccess,
  postStartSalesRequestFailed,
  postTokenCreateRequest,
  postTokenCreateRequestSuccess,
  postTokenCreateRequestFailed,
  setActiveHall,
  setActiveMovie,
  setActiveSeance,
  setActiveToken,
} = configSlice.actions;

export default configSlice.reducer;
