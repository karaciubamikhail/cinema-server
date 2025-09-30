/**
 * Цвета плашек фильмов для сеансов (взяты из MoviePlate.module.css)
 */
const SEANCES_COLORS_ARR = [
  '#caff85',
  '#85ff89',
  '#85ffd3',
  '#85e2ff',
  '#8599ff',
  '#ba85ff',
  '#ff85fb',
  '#ff85b1',
  '#ffa285',
];

/**
 * Имена модалок для секции "Сетка сеансов"
 */
const SEANCES_SCHEME_MODAL_NAMES = {
  'Добавить фильм': 'ModalMovieAdd',
  'Редактировать фильм': 'ModalMovieEdit',
  'Удалить фильм': 'ModalMovieDelete',
  'Добавить сеанс': 'ModalSeanceAdd',
};

/**
 * Проверка нового сеанса, чтобы не было коллизий времени
 * начала и окончания сеанса с сущ. сеансами
 * @param activeMovieId id фильма для нового сеанса
 * @param seanceStartTime время начала нового сеанса, "ЧЧ:ММ" 24-часовой формат
 * @param seances массив сеансов для выбранного зала
 * @param movies массив фильмов
 * @param getTimeInMinutes функция для преобразования времени начала сеанса в число минут
 */

const newSeanceCheck = (
  activeMovieId,
  seanceStartTime,
  seances,
  movies,
  getTimeInMinutes
) => {
  //сущ. сеансы выбранного зала
  const hallSeances = seances
    ?.map((seance) => ({
      movieId: seance?.movieId,
      startTime: getTimeInMinutes(seance?.startTime),
    }))
    .sort((a, b) => a?.startTime - b?.startTime);
  const newSeanceStartTime = getTimeInMinutes(seanceStartTime); //!
  const newSeanceDuration = parseInt(
    movies?.find((movie) => movie?.movieId === activeMovieId)?.movieDuration
  );
  const newSeanceEndTime = newSeanceStartTime + newSeanceDuration;
  // находим сеансы с временем начала раньше и позже нового (слева/справа)
  const seanceRightIndex = hallSeances?.findIndex(
    (seance) => seance?.startTime >= newSeanceStartTime
  );
  const seanceLeftIndex = hallSeances?.findLastIndex(
    (seance) => seance?.startTime < newSeanceStartTime
  );
  const seanceLeftStartTime =
    seanceLeftIndex >= 0 ? hallSeances[seanceLeftIndex]?.startTime : 0;
  const seanceLeftEndTime =
    seanceLeftIndex >= 0
      ? seanceLeftStartTime +
        parseInt(
          movies?.find(
            (movie) => movie?.movieId === hallSeances[seanceLeftIndex]?.movieId
          )?.movieDuration
        )
      : 0;
  const seanceRightStartTime =
    seanceRightIndex >= 0 ? hallSeances[seanceRightIndex]?.startTime : 24 * 60;
  // если seanceLeftEndTime false, то значит "слева" нет сеансов
  // и проверяем только "правые" сеансы
  const result = seanceLeftEndTime
    ? seanceLeftEndTime < newSeanceStartTime &&
      newSeanceEndTime < seanceRightStartTime
    : newSeanceEndTime < seanceRightStartTime;
  return result;
};

/**
 * Преобразование времени начала сеанса в число минут
 * прошедших от начала дня 00:00 до начала сеанса ЧЧ:ММ
 * @param startTime "ЧЧ:ММ" 24-часовой формат
 */
const getTimeInMinutes = (startTime) =>
  parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);

/**
 * Создание из массива объектов нового массива, упорядоченного по ключу
 * Например, массив пар значений "ряд"-"кресло" можно преобразовать в двумерный массив,
 * где каждая строка - это массив всех "кресел", принадлежащих своему "ряду"
 * @param key имя ключа
 * @param objArr массив объектов
 */
const getTransformedArr = (objArr, key) => {
  const inputArr = objArr;
  const outputArrMap = [];
  for (let i = 0; i < inputArr?.length; i++) {
    if (inputArr.findIndex((el) => el[key] === i) === -1) continue;
    outputArrMap.push({
      [`${key}`]: i,
      objsList: inputArr.filter((el) => el[key] === i),
    });
  }
  return outputArrMap;
};

/**
 * Получение строки для числа минут
 * @param duration число минут
 */
const getMinutesWords = (duration) => {
  let text;
  const str = duration.toString();
  switch (true) {
    case str.at(-1) === '1':
      text = 'а';
      break;

    case str.at(-1) === '2':
    case str.at(-1) === '3':
    case str.at(-1) === '4':
      text = 'ы';
      break;

    default:
      text = '';
      break;
  }
  return text;
};

/**
 * Проверка новой длительности для редактируемого фильма,
 * чтобы не было коллизий времени окончания фильма для сущ. сеансов с этим фильмом
 * @param activeMovieId id редактируемого фильма
 * @param newDuration новая длительнойсть фильма в минутах
 * @param seances массив сеансов
 * @param halls массив залов
 */
const movieNewDurationCheck = (activeMovieId, newDuration, seances, halls) => {
  const resultArr = [];
  const movieHalls = halls.map((hall) => ({
    hallId: hall?.hallId,
    hallName: hall?.hallName,
  }));
  //оставить только залы, в которых есть редактируемый фильм
  const hasMovieHallsIds = new Set(
    seances
      ?.filter((seance) => seance?.movieId === activeMovieId)
      ?.map((seance) => seance?.hallId)
  );
  hasMovieHallsIds?.forEach((hallId) => {
    //все сеансы зала по возрастанию времени начала
    const hallSeances = seances
      ?.filter((seance) => seance?.hallId === hallId)
      ?.map((seance) => ({
        movieId: seance?.movieId,
        startTime: getTimeInMinutes(seance?.startTime),
      }))
      ?.sort((a, b) => a?.startTime - b?.startTime);

    //дальше - проверить, что новый конец фильма не налетает на начало
    //другого фильма, если налетает, то добавляем в setErrorText

    //получили массив начала и окончания сеансов редактируемого фильма:
    const seanceTimes = hallSeances
      ?.filter((seance) => seance?.movieId === activeMovieId)
      ?.map((seance) => ({
        movieId: seance?.movieId,
        startTime: seance?.startTime,
        endTime: seance?.startTime + parseInt(newDuration),
      }));

    //для каждого сеанса редактируемого фильма находим смежный с ним следующий сеанс:
    const checkingsArr = [];
    const hallName = movieHalls?.find(
      (hall) => hall.hallId === hallId
    )?.hallName;
    seanceTimes?.forEach((obj) => {
      const seanceRightIndex = hallSeances?.findIndex(
        (seance) => seance?.startTime > obj.startTime
      );
      const seanceRightStartTime =
        seanceRightIndex >= 0
          ? hallSeances[seanceRightIndex]?.startTime
          : 24 * 60;
      const check = obj.endTime < seanceRightStartTime;
      //если новое время окончания фильма налетает на начало след сеанса, то
      //заносим время сеанса ред фильма в массив, для дальнейшего отображения ошибки
      if (!check) {
        const h = Math.trunc(obj.startTime / 60);
        const m = obj.startTime % 60;
        checkingsArr.push(`${h >= 10 ? h : '0' + h}:${m >= 10 ? m : '0' + m}`);
      }
    });

    // "налетающие" сеансы ред фильма для 1 зала
    const hallResultString = checkingsArr.length
      ? `${hallName} - ${checkingsArr.join(', ')}`
      : '';
    if (hallResultString) resultArr.push(hallResultString);
  });

  //все залы и "налетающие" сеансы
  if (resultArr.length) return resultArr.join(', ');
};

/**
 * Получение массива залов для которых нельзя открыть продажи
 * (не имеют сидений, цен и сеансов)
 * @param seats массив сидений
 * @param seances массив сеансов
 * @param halls массив залов
 */
const getHallsNotReadyArr = (halls, seats, seances) => {
  const hallsReadyCheckedArr = [];
  halls.forEach((hall) => {
    const hallSeats = seats.filter((seat) => seat?.seatHallId === hall?.hallId);
    const hallHasVipSeats = hallSeats?.some((seat) => seat.seatType === '2');
    const hallSeances = seances.filter(
      (seance) => seance?.hallId === hall?.hallId
    );

    if (
      !(
        hall?.hallRows &&
        hall?.hallCols &&
        hall?.hallPriceStandard &&
        (hallHasVipSeats ? (hall?.hallPriceVip ? true : false) : true) &&
        hallSeats.length &&
        hallSeances.length
      )
    )
      hallsReadyCheckedArr.push(hall?.hallName);
  });

  return hallsReadyCheckedArr;
};

/**
 * Получение массива залов с сеансами для отображения в секции "Сетка сеансов"
 * @param movies массив фильмов
 * @param seances массив сеансов
 * @param halls массив залов
 * @param seancesColorsArr Цвета плашек фильмов для сеансов из SEANCES_COLORS_ARR
 */
const getSeancesView = (halls, movies, seances, seancesColorsArr) => {
  const outputArr = [];
  // записываем ид зала, по которому уже отфильтровали сеансы
  const filterId = [];
  seances?.forEach((seance, index) => {
    // если зал еще не был отработан, то продолжаем
    if ((!filterId.includes(seance?.hallId) && index) || index === 0) {
      // оставляем только сеансы одного зала, затем, для каждого сеанса ищем название,
      // длительность и индекс его фильма (для имени, цвета и расположения плашки)
      const objsList = seances
        ?.filter((el) => el?.hallId === seance?.hallId)
        ?.map((seanceObj) => {
          const movie = movies?.find(
            (movie) => movie?.movieId === seanceObj?.movieId
          );
          const movieIndex = movies?.findIndex(
            (movie) => movie?.movieId === seanceObj?.movieId
          );
          const seanceColor = seancesColorsArr[movieIndex];
          // добавляем инфу по фильму к сеансу
          return {
            ...seanceObj,
            movieTitle: movie?.movieTitle,
            movieDuration: movie?.movieDuration,
            seanceColor,
          };
        });
      // формируем выходной массив сеансов для зала
      outputArr.push({
        hall: {
          id: seance.hallId,
          name: halls?.find((el) => el?.hallId === seance?.hallId)?.hallName,
        },
        objsList,
      });
      // записываем ид зала, по которому уже отфильтровали сеансы
      filterId.push(seance?.hallId);
    }
  });
  // залы без сеансов
  const emptyHallsArr = halls
    ?.map((hall) => ({
      hall: {
        id: hall?.hallId,
        name: hall?.hallName,
      },
      objsList: [],
    }))
    ?.filter(
      (hall) => !outputArr?.some((el) => el?.hall?.id === hall?.hall?.id)
    );
  const seancesViewArr = [...outputArr, ...emptyHallsArr];
  return seancesViewArr;
};

/**
 * Получение массива фильмов с требуемыми именами ключей вместо серверных
 * @param extMoviesArr массив фильмов от сервера
 * @param intMoviesArr массив фильмов для клиента
 */
const mapToInternalMovies = (extMoviesArr) => {
  const intMoviesArr = [];
  extMoviesArr.forEach((movie) => {
    intMoviesArr.push({
      movieId: movie.id,
      movieTitle: movie.title,
      movieDescription: movie.description,
      movieDuration: movie.duration_minutes,
      moviePoster: movie.picture,
      movieOrigin: movie.origin,
    });
  });
  return intMoviesArr;
};

/**
 * Получение массива залов с требуемыми именами ключей вместо серверных
 * @param extHallsArr массив залов от сервера
 * @param intHallsArr массив залов для клиента
 */
const mapToInternalHalls = (extHallsArr) => {
  const intHallsArr = [];
  extHallsArr.forEach((hall) => {
    intHallsArr.push({
      hallId: hall.id,
      hallName: hall.name,
      hallRows: hall.total_rows,
      hallCols: hall.total_cols,
      hallPriceStandard: hall.price_standard,
      hallPriceVip: hall.price_vip,
      hallIsStartedSales: hall.is_started_sales,
    });
  });
  return intHallsArr;
};

/**
 * Получение массива сидений с требуемыми именами ключей вместо серверных
 * @param extSeatsArr массив сидений от сервера
 * @param intSeatsArr массив сидений для клиента
 */
const mapToInternalSeats = (extSeatsArr) => {
  const intSeatsArr = [];
  extSeatsArr.forEach((seat) => {
    intSeatsArr.push({
      seatId: seat.id,
      seatHallId: seat.hall_id,
      seatIndexRow: seat.index_row - 1,
      seatIndexCol: seat.index_col - 1,
      seatType: seat.seat_type.toString(),
    });
  });
  return intSeatsArr;
};

/**
 * Получение массива сеансов с требуемыми именами ключей вместо серверных
 * @param extSeancesArr массив сеансов от сервера
 * @param intSeancesArr массив сеансов для клиента
 */
const mapToInternalSeances = (extSeancesArr) => {
  const intSeancesArr = [];
  extSeancesArr.forEach((seance) => {
    intSeancesArr.push({
      seanceId: seance.id,
      hallId: seance.hall_id,
      movieId: seance.movie_id,
      startTime: seance.start_time,
    });
  });
  return intSeancesArr;
};

/**
 * Получение массива сидений с требуемыми именами ключей для сервера
 * @param extSeatsArr массив сидений для сервера
 * @param intSeatsArr массив сидений от клиента
 */
const mapToExternalSeats = (intSeatsArr) => {
  const extSeatsArr = intSeatsArr?.map((seat) => {
    return {
      hall_id: seat?.seatHallId,
      seat_type: seat?.seatType,
      index_row: seat?.seatIndexRow + 1,
      index_col: seat?.seatIndexCol + 1,
    };
  });
  return extSeatsArr;
};

/**
 * Получение массива добавленных сеансов с требуемыми именами ключей для сервера
 * @param extSeancesArr массив сеансов для сервера
 * @param intSeancesArr массив сеансов от клиента
 */
const mapToExternalCreatedSeances = (intSeancesArr) => {
  const extSeancesArr = intSeancesArr?.map((seance) => {
    return {
      hall_id: seance.hallId,
      movie_id: seance.movieId,
      start_time: seance.startTime,
    };
  });
  return extSeancesArr;
};

/**
 * Получение массива удаленных сеансов с требуемыми именами ключей для сервера
 * @param extSeancesArr массив сеансов для сервера
 * @param intSeancesArr массив сеансов от клиента
 */
const mapToExternalRemovedSeances = (intSeancesArr) => {
  const extSeancesArr = intSeancesArr?.map((seance) => {
    return {
      id: seance.seanceId,
    };
  });
  return extSeancesArr;
};

/**
 * Получение исходного размера зала
 * @param activeHall текущий выбранный зал
 */
const initHallSize = (activeHall) => {
  if (!activeHall) return;
  return {
    rows: activeHall?.hallRows || 0,
    cols: activeHall?.hallCols || 0,
  };
};

/**
 * Получение исходного массива сидений зала
 * @param hallSeatsArr массив сидений текущего зала
 * @param hallSize количество сидений (размер) текущего зала
 * @param isOldSize проверка на изменение размера текущего зала
 * @param activeHall текущий выбранный зал
 */
const initSeats = (hallSize, activeHall) => {
  if (!hallSize?.rows || !hallSize?.cols) return;
  const seatsTypeArr = [];
  for (let r = 0; r < hallSize.rows; r++) {
    for (let c = 0; c < hallSize.cols; c++) {
      seatsTypeArr.push({
        seatHallId: activeHall?.hallId,
        seatType: '1',
        seatIndexRow: r,
        seatIndexCol: c,
      });
    }
  }
  return seatsTypeArr;
};

/**
 * Получение исходных цен для зала
 * @param activeHall текущий выбранный зал
 */
const initHallPrices = (activeHall) => {
  if (!activeHall) return;
  return {
    standart: activeHall?.hallPriceStandard ?? 0,
    vip: activeHall?.hallPriceVip ?? 0,
  };
};

export {
  SEANCES_COLORS_ARR,
  SEANCES_SCHEME_MODAL_NAMES,
  newSeanceCheck,
  getTimeInMinutes,
  getTransformedArr,
  getMinutesWords,
  movieNewDurationCheck,
  getHallsNotReadyArr,
  getSeancesView,
  mapToInternalMovies,
  mapToInternalHalls,
  mapToInternalSeats,
  mapToInternalSeances,
  mapToExternalSeats,
  mapToExternalCreatedSeances,
  mapToExternalRemovedSeances,
  initHallSize,
  initSeats,
  initHallPrices,
};
