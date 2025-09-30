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

export const fetchGetInitEntities = () => (dispatch, getState) => {
  dispatch(fetchGetStartSales()).then(() => {
    const {
      config: {
        error: { global },
      },
    } = getState();
    if (!global)
      dispatch(fetchGetHalls()).then(() => {
        const {
          config: {
            error: { global },
          },
        } = getState();
        if (!global)
          dispatch(fetchGetSeats()).then(() => {
            const {
              config: {
                error: { global },
              },
            } = getState();
            if (!global)
              dispatch(fetchGetMovies()).then(() => {
                const {
                  config: {
                    error: { global },
                  },
                } = getState();
                if (!global) dispatch(fetchGetSeances());
              });
          });
      });
  });
};

/**
 * Загрузка состояния начала продаж
 */
export const fetchGetStartSales = () => (dispatch, getState) => {
  dispatch(getStartSalesRequest());
  const {
    config: { token },
  } = getState();
  return fetch(`${url}/sales`, {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  })
    .then((response) => {
      if (response.status < 200 || response.status >= 300) {
        throw new Error();
      }
      return response.json();
    })
    .then((result) => {
      dispatch(getStartSalesRequestSuccess(result[0]?.start_sales));
    })
    .catch((e) => {
      dispatch(getStartSalesRequestFailed(e?.message));
    });
};

/**
 * Загрузка списка фильмов
 */
export const fetchGetMovies = () => (dispatch, getState) => {
  dispatch(getMoviesRequest());
  const {
    config: { token },
  } = getState();
  return fetch(`${url}/movies`, {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  })
    .then((response) => {
      if (response.status < 200 || response.status >= 300) {
        throw new Error();
      }
      return response.json();
    })
    .then((result) => {
      const intMovies = mapToInternalMovies(result);
      dispatch(getMoviesRequestSuccess(intMovies));
    })
    .catch((e) => {
      dispatch(getMoviesRequestFailed(e.message));
    });
};

/**
 * Загрузка списка залов
 */
export const fetchGetHalls = () => (dispatch, getState) => {
  dispatch(getHallsRequest());
  const {
    config: { token },
  } = getState();
  return fetch(`${url}/halls`, {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  })
    .then((response) => {
      if (response.status < 200 || response.status >= 300) {
        throw new Error();
      }
      return response.json();
    })
    .then((result) => {
      const intHalls = mapToInternalHalls(result);
      dispatch(getHallsRequestSuccess(intHalls));
    })
    .catch((e) => {
      dispatch(getHallsRequestFailed(e.message));
    });
};

/**
 * Загрузка мест в зале
 */
export const fetchGetSeats = () => (dispatch, getState) => {
  dispatch(getSeatsRequest());
  const {
    config: { token },
  } = getState();
  return fetch(`${url}/seats`, {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  })
    .then((response) => {
      if (response.status < 200 || response.status >= 300) {
        throw new Error();
      }
      return response.json();
    })
    .then((result) => {
      const intSeats = mapToInternalSeats(result);
      dispatch(getSeatsRequestSuccess(intSeats));
    })
    .catch((e) => {
      dispatch(getSeatsRequestFailed(e.message));
    });
};

/**
 * Загрузка списка сеансов
 */
export const fetchGetSeances = () => (dispatch, getState) => {
  dispatch(getSeancesRequest());
  const {
    config: { token },
  } = getState();
  return fetch(`${url}/seances`, {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  })
    .then((response) => {
      if (response.status < 200 || response.status >= 300) {
        throw new Error();
      }
      return response.json();
    })
    .then((result) => {
      const intSeances = mapToInternalSeances(result);
      dispatch(getSeancesRequestSuccess(intSeances));
    })
    .catch((e) => {
      dispatch(getSeancesRequestFailed(e.message));
    });
};

/**
 * Создание зала
 */
export const fetchPostHallCreate = (hallName) => (dispatch, getState) => {
  dispatch(setModalRequest());
  const {
    config: { token },
  } = getState();
  return fetch(`${url}/halls`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify({
      name: hallName,
    }),
  })
    .then((result) => {
      if (result.status < 200 || result.status >= 300) {
        throw new Error();
      }
      dispatch(setModalRequestSuccess());
      dispatch(setActiveModal(''));
      dispatch(fetchGetHalls());
    })
    .catch((e) => {
      dispatch(setModalRequestFailed(e.message));
    });
};

/**
 * Удаление зала
 */
export const fetchPostHallDelete = (hallId) => (dispatch, getState) => {
  if (!hallId) return;
  dispatch(setModalRequest());
  const {
    config: { token },
  } = getState();
  return fetch(`${url}/halls/${hallId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify({
      hallId,
    }),
  })
    .then((result) => {
      if (result.status < 200 || result.status >= 300) {
        throw new Error();
      }
      dispatch(setModalRequestSuccess());
      dispatch(setActiveModal(''));
      dispatch(fetchGetHalls());
    })
    .catch((e) => {
      dispatch(setModalRequestFailed(e.message));
    });
};

/**
 * Конфигурация зала
 */
export const fetchPostHallSize = (params) => (dispatch, getState) => {
  dispatch(postHallSizeRequest());
  const { activeHallId, hallSize } = params;
  const {
    config: { token },
  } = getState();
  return fetch(`${url}/halls/${activeHallId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify({
      total_rows: hallSize.rows,
      total_cols: hallSize.cols,
    }),
  })
    .then((result) => {
      if (result.status < 200 || result.status >= 300) {
        throw new Error();
      }
      dispatch(fetchGetHalls()).then(dispatch(postHallSizeRequestSuccess()));
    })
    .catch((e) => {
      dispatch(postHallSizeRequestFailed(e.message));
    });
};

export const fetchPostSeats = (params) => (dispatch, getState) => {
  dispatch(postSeatsRequest());
  const { activeHallId, seatsType } = params;
  const {
    config: { token },
  } = getState();
  const extSeats = mapToExternalSeats(seatsType);
  return fetch(`${url}/seats`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify({
      seats: extSeats,
      hallId: activeHallId,
    }),
  })
    .then((result) => {
      if (result.status < 200 || result.status >= 300) {
        throw new Error();
      }
      dispatch(fetchGetSeats()).then(dispatch(postSeatsRequestSuccess()));
    })
    .catch((e) => {
      dispatch(postSeatsRequestFailed(e.message));
    });
};

/**
 * Конфигурация цен зала
 */
export const fetchPostHallPrices = (params) => (dispatch, getState) => {
  dispatch(postPricesRequest());
  const { activeHallId, standart, vip } = params;
  const {
    config: { token },
  } = getState();
  return fetch(`${url}/halls/${activeHallId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify({
      price_standard: standart,
      price_vip: vip,
    }),
  })
    .then((result) => {
      if (result.status < 200 || result.status >= 300) {
        throw new Error();
      }
      dispatch(fetchGetHalls()).then(dispatch(postPricesRequestSuccess()));
    })
    .catch((e) => {
      dispatch(postPricesRequestFailed(e.message));
    });
};

/**
 * Создание/добавление фильма
 */
export const fetchPostMovieCreate = (params) => (dispatch, getState) => {
  dispatch(setModalRequest());
  const {
    config: { token },
  } = getState();
  return fetch(`${url}/movies`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
    },
    body: params,
  })
    .then((result) => {
      if (result.status < 200 || result.status >= 300) {
        throw new Error();
      }
      dispatch(setModalRequestSuccess());
      dispatch(setActiveModal(''));
      dispatch(fetchGetMovies());
    })
    .catch((e) => {
      dispatch(setModalRequestFailed(e.message));
    });
};

/**
 * Удаление фильма
 */
export const fetchPostMovieDelete = (movieId) => (dispatch, getState) => {
  if (!movieId) return;
  dispatch(setModalRequest());
  const {
    config: { token },
  } = getState();
  return fetch(`${url}/movies/${movieId}`, {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + token,
    },
  })
    .then((result) => {
      if (result.status < 200 || result.status >= 300) {
        throw new Error();
      }
      dispatch(setModalRequestSuccess());
      dispatch(setActiveModal(''));
      dispatch(fetchGetMovies());
    })
    .catch((e) => {
      dispatch(setModalRequestFailed(e.message));
    });
};

/**
 * Редактирование фильма
 */
export const fetchPostMovieEdit = (params) => (dispatch, getState) => {
  if (!params?.activeMovieId) return;
  dispatch(setModalRequest());
  const {
    config: { token },
  } = getState();
  return fetch(`${url}/movies/${params?.activeMovieId}`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
    },
    body: params?.formData,
  })
    .then((result) => {
      if (result.status < 200 || result.status >= 300) {
        throw new Error();
      }
      dispatch(setModalRequestSuccess());
      dispatch(setActiveModal(''));
      dispatch(fetchGetMovies());
    })
    .catch((e) => {
      dispatch(setModalRequestFailed(e.message));
    });
};

/**
 * Создание сетки сеансов
 */
export const fetchPostSeances = () => (dispatch, getState) => {
  const {
    view: { seancesCreated, seancesRemoved },
    config: { token },
  } = getState();
  dispatch(postSeancesRequest());
  const extSeancesRemoved = mapToExternalRemovedSeances(seancesRemoved);
  const extSeancesCreated = mapToExternalCreatedSeances(seancesCreated);
  return fetch(`${url}/seances`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify({
      remove_seances: extSeancesRemoved,
      create_seances: extSeancesCreated,
    }),
  })
    .then((result) => {
      if (result.status < 200 || result.status >= 300) {
        throw new Error();
      }
      dispatch(fetchGetSeances()).then(dispatch(postSeancesRequestSuccess()));
    })
    .catch((e) => {
      dispatch(postSeancesRequestFailed(e.message));
    });
};

/**
 * Открыть/закрыть продажи
 */
export const fetchPostStartSales = () => (dispatch, getState) => {
  const {
    config: { token, startSales },
  } = getState();
  dispatch(postStartSalesRequest());
  return fetch(`${url}/sales/1`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify({
      start_sales: !startSales,
    }),
  })
    .then((result) => {
      if (result.status < 200 || result.status >= 300) {
        throw new Error();
      }
      dispatch(fetchGetStartSales()).then(
        dispatch(postStartSalesRequestSuccess())
      );
    })
    .catch((e) => {
      dispatch(postStartSalesRequestFailed(e.message));
    });
};

export const fetchPostTokenCreate = (loginParams) => (dispatch) => {
  dispatch(postTokenCreateRequest());
  return fetch(`${url}/tokens/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      ...loginParams,
    }),
  })
    .then((response) => {
      if (response.status < 200 || response.status >= 300) {
        throw new Error();
      }
      return response.json();
    })
    .then((result) => {
      dispatch(postTokenCreateRequestSuccess(result.token));
    })
    .catch((e) => {
      dispatch(postTokenCreateRequestFailed(e.message));
    });
};
