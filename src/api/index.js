import {
  getStartSalesRequest,
  getStartSalesRequestSuccess,
  getStartSalesRequestFailed,
  getSeatsRequest,
  getSeatsRequestSuccess,
  getSeatsRequestFailed,
  getHallsRequest,
  getHallsRequestSuccess,
  getHallsRequestFailed,
  getMoviesRequest,
  getMoviesRequestSuccess,
  getMoviesRequestFailed,
  getSeancesRequest,
  getSeancesRequestSuccess,
  getSeancesRequestFailed,
  postPricesRequest,
  postPricesRequestSuccess,
  postPricesRequestFailed,
  postHallSizeRequest,
  postHallSizeRequestSuccess,
  postHallSizeRequestFailed,
  postSeatsRequest,
  postSeatsRequestSuccess,
  postSeatsRequestFailed,
  postSeancesRequest,
  postSeancesRequestSuccess,
  postSeancesRequestFailed,
  postStartSalesRequest,
  postStartSalesRequestSuccess,
  postStartSalesRequestFailed,
  postTokenCreateRequest,
  postTokenCreateRequestSuccess,
  postTokenCreateRequestFailed,
} from '../store/SliceConfig';

import {
  setActiveModal,
  setModalRequest,
  setModalRequestSuccess,
  setModalRequestFailed,
} from '../store/SliceModal';

import {
  mapToInternalMovies,
  mapToInternalHalls,
  mapToInternalSeats,
  mapToExternalSeats,
  mapToInternalSeances,
  mapToExternalCreatedSeances,
  mapToExternalRemovedSeances,
} from '../api/helpers';

const url = process.env.REACT_APP_API_URL_DEV;

/**
 * Вспомогательная функция заголовков для fetch
 */
const getAuthHeaders = (token) => ({
  'Content-Type': 'application/json;charset=utf-8',
  Accept: 'application/json',
  ...(token ? { Authorization: 'Bearer ' + token } : {}),
});

/**
 * Инициализация всех сущностей
 */
export const fetchGetInitEntities = () => (dispatch, getState) => {
  dispatch(fetchGetStartSales()).then(() => {
    const { config: { error: { global } } } = getState();
    if (!global)
      dispatch(fetchGetHalls()).then(() => {
        const { config: { error: { global } } } = getState();
        if (!global)
          dispatch(fetchGetSeats()).then(() => {
            const { config: { error: { global } } } = getState();
            if (!global)
              dispatch(fetchGetMovies()).then(() => {
                const { config: { error: { global } } } = getState();
                if (!global) dispatch(fetchGetSeances());
              });
          });
      });
  });
};

/**
 * Получение состояния начала продаж
 */
export const fetchGetStartSales = () => (dispatch, getState) => {
  dispatch(getStartSalesRequest());
  const { config: { token } } = getState();
  return fetch(`${url}/sales`, { headers: getAuthHeaders(token) })
    .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
    .then((data) => dispatch(getStartSalesRequestSuccess(data[0]?.start_sales)))
    .catch((e) => dispatch(getStartSalesRequestFailed(e?.message)));
};

/**
 * Получение фильмов
 */
export const fetchGetMovies = () => (dispatch, getState) => {
  dispatch(getMoviesRequest());
  const { config: { token } } = getState();
  return fetch(`${url}/movies`, { headers: getAuthHeaders(token) })
    .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
    .then((data) => {
      dispatch(getMoviesRequestSuccess(mapToInternalMovies(data)));
    })
    .catch((e) => dispatch(getMoviesRequestFailed(e.message)));
};

/**
 * Получение залов
 */
export const fetchGetHalls = () => (dispatch, getState) => {
  dispatch(getHallsRequest());
  const { config: { token } } = getState();
  return fetch(`${url}/halls`, { headers: getAuthHeaders(token) })
    .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
    .then((data) => dispatch(getHallsRequestSuccess(mapToInternalHalls(data))))
    .catch((e) => dispatch(getHallsRequestFailed(e.message)));
};

/**
 * Получение мест
 */
export const fetchGetSeats = () => (dispatch, getState) => {
  dispatch(getSeatsRequest());
  const { config: { token } } = getState();
  return fetch(`${url}/seats`, { headers: getAuthHeaders(token) })
    .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
    .then((data) => dispatch(getSeatsRequestSuccess(mapToInternalSeats(data))))
    .catch((e) => dispatch(getSeatsRequestFailed(e.message)));
};

/**
 * Получение сеансов
 */
export const fetchGetSeances = () => (dispatch, getState) => {
  dispatch(getSeancesRequest());
  const { config: { token } } = getState();
  return fetch(`${url}/seances`, { headers: getAuthHeaders(token) })
    .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
    .then((data) => dispatch(getSeancesRequestSuccess(mapToInternalSeances(data))))
    .catch((e) => dispatch(getSeancesRequestFailed(e.message)));
};

/**
 * Создание зала
 */
export const fetchPostHallCreate = (hallName) => (dispatch, getState) => {
  dispatch(setModalRequest());
  const { config: { token } } = getState();
  return fetch(`${url}/halls`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ name: hallName }),
  })
    .then((res) => (res.ok ? res : Promise.reject(res.statusText)))
    .then(() => {
      dispatch(setModalRequestSuccess());
      dispatch(setActiveModal(''));
      dispatch(fetchGetHalls());
    })
    .catch((e) => dispatch(setModalRequestFailed(e.message)));
};

/**
 * Удаление зала
 */
export const fetchPostHallDelete = (hallId) => (dispatch, getState) => {
  if (!hallId) return;
  dispatch(setModalRequest());
  const { config: { token } } = getState();
  return fetch(`${url}/halls/${hallId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  })
    .then((res) => (res.ok ? res : Promise.reject(res.statusText)))
    .then(() => {
      dispatch(setModalRequestSuccess());
      dispatch(setActiveModal(''));
      dispatch(fetchGetHalls());
    })
    .catch((e) => dispatch(setModalRequestFailed(e.message)));
};

/**
 * Изменение размеров зала
 */
export const fetchPostHallSize = ({ activeHallId, hallSize }) => (dispatch, getState) => {
  dispatch(postHallSizeRequest());
  const { config: { token } } = getState();
  return fetch(`${url}/halls/${activeHallId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ total_rows: hallSize.rows, total_cols: hallSize.cols }),
  })
    .then((res) => (res.ok ? res : Promise.reject(res.statusText)))
    .then(() => {
      dispatch(fetchGetHalls());
      dispatch(postHallSizeRequestSuccess());
    })
    .catch((e) => dispatch(postHallSizeRequestFailed(e.message)));
};

/**
 * Изменение мест
 */
export const fetchPostSeats = ({ activeHallId, seatsType }) => (dispatch, getState) => {
  dispatch(postSeatsRequest());
  const { config: { token } } = getState();
  return fetch(`${url}/seats`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ hallId: activeHallId, seats: mapToExternalSeats(seatsType) }),
  })
    .then((res) => (res.ok ? res : Promise.reject(res.statusText)))
    .then(() => {
      dispatch(fetchGetSeats());
      dispatch(postSeatsRequestSuccess());
    })
    .catch((e) => dispatch(postSeatsRequestFailed(e.message)));
};

/**
 * Настройка цен
 */
export const fetchPostHallPrices = ({ activeHallId, standart, vip }) => (dispatch, getState) => {
  dispatch(postPricesRequest());
  const { config: { token } } = getState();
  return fetch(`${url}/halls/${activeHallId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ price_standard: standart, price_vip: vip }),
  })
    .then((res) => (res.ok ? res : Promise.reject(res.statusText)))
    .then(() => {
      dispatch(fetchGetHalls());
      dispatch(postPricesRequestSuccess());
    })
    .catch((e) => dispatch(postPricesRequestFailed(e.message)));
};

/**
 * Создание фильма
 */
export const fetchPostMovieCreate = (params) => (dispatch, getState) => {
  dispatch(setModalRequest());
  const { config: { token } } = getState();
  return fetch(`${url}/movies`, {
    method: 'POST',
    headers: token
    ? { Authorization: 'Bearer ' + token }
    : {},
    body: params,
  })
    .then((res) => (res.ok ? res : Promise.reject(res.statusText)))
    .then(() => {
      dispatch(setModalRequestSuccess());
      dispatch(setActiveModal(''));
      dispatch(fetchGetMovies());
    })
    .catch((e) => dispatch(setModalRequestFailed(e.message)));
};

/**
 * Удаление фильма
 */
export const fetchPostMovieDelete = (movieId) => (dispatch, getState) => {
  if (!movieId) return;
  dispatch(setModalRequest());
  const { config: { token } } = getState();
  return fetch(`${url}/movies/${movieId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  })
    .then((res) => (res.ok ? res : Promise.reject(res.statusText)))
    .then(() => {
      dispatch(setModalRequestSuccess());
      dispatch(setActiveModal(''));
      dispatch(fetchGetMovies());
    })
    .catch((e) => dispatch(setModalRequestFailed(e.message)));
};

/**
 * Редактирование фильма
 */
export const fetchPostMovieEdit = ({ activeMovieId, formData }) => (dispatch, getState) => {
  if (!activeMovieId) return;
  dispatch(setModalRequest());
  const { config: { token } } = getState();
  return fetch(`${url}/movies/${activeMovieId}`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: formData,
  })
    .then((res) => (res.ok ? res : Promise.reject(res.statusText)))
    .then(() => {
      dispatch(setModalRequestSuccess());
      dispatch(setActiveModal(''));
      dispatch(fetchGetMovies());
    })
    .catch((e) => dispatch(setModalRequestFailed(e.message)));
};

/**
 * Создание сеансов
 */
export const fetchPostSeances = () => (dispatch, getState) => {
  const { view: { seancesCreated, seancesRemoved }, config: { token } } = getState();
  dispatch(postSeancesRequest());
  return fetch(`${url}/seances`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify({
      remove_seances: mapToExternalRemovedSeances(seancesRemoved),
      create_seances: mapToExternalCreatedSeances(seancesCreated),
    }),
  })
    .then((res) => (res.ok ? res : Promise.reject(res.statusText)))
    .then(() => {
      dispatch(fetchGetSeances());
      dispatch(postSeancesRequestSuccess());
    })
    .catch((e) => dispatch(postSeancesRequestFailed(e.message)));
};

/**
 * Открыть/закрыть продажи
 */
export const fetchPostStartSales = () => (dispatch, getState) => {
  const { config: { token, startSales } } = getState();
  dispatch(postStartSalesRequest());
  return fetch(`${url}/sales/1`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ start_sales: !startSales }),
  })
    .then((res) => (res.ok ? res : Promise.reject(res.statusText)))
    .then(() => {
      dispatch(fetchGetStartSales());
      dispatch(postStartSalesRequestSuccess());
    })
    .catch((e) => dispatch(postStartSalesRequestFailed(e.message)));
};

/**
 * Авторизация (получение токена)
 */
export const fetchPostTokenCreate = (loginParams) => (dispatch) => {
  dispatch(postTokenCreateRequest());
  return fetch(`${url}/tokens/create`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(loginParams),
  })
    .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
    .then((data) => dispatch(postTokenCreateRequestSuccess(data.token)))
    .catch((e) => dispatch(postTokenCreateRequestFailed(e.message)));
};