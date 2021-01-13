// 定义action type
export const ACTION_SET_FROM = 'SET_FROM';
export const ACTION_SET_TO = 'SET_TO';
export const ACTION_SET_IS_CITY_SELECTOR_VISIBLE =
    'SET_IS_CITY_SELECTOR_VISIBLE';
export const ACTION_SET_CURRENT_SELECTING_LEFT_CITY =
    'SET_CURRENT_SELECTING_LEFT_CITY';
export const ACTION_SET_CITY_DATA = 'SET_CITY_DATA';
export const ACTION_SET_IS_LOADING_CITY_DATA = 'SET_IS_LOADING_CITY_DATA';
export const ACTION_SET_IS_DATE_SELECTOR_VISIBLE =
    'SET_IS_DATE_SELECTOR_VISIBLE';
export const ACTION_SET_HIGH_SPEED = 'SET_HIGH_SPEED';
export const ACTION_SET_DEPART_DATE = 'SET_DEPART_DATE';

export function setFrom(from) {
    return {
        type: ACTION_SET_FROM,
        payload: from,
    };
}
export function setTo(to) {
    return {
        type: ACTION_SET_TO,
        payload: to,
    };
}
export function setIsLoadingCityData(isLoadingCityData) {
    return {
        type: ACTION_SET_IS_LOADING_CITY_DATA,
        payload: isLoadingCityData,
    };
}
export function setCityData(cityData) {
    return {
        type: ACTION_SET_CITY_DATA,
        payload: cityData,
    };
}
export function toggleHighSpeed() {
    // 异步action
    return (dispatch, getState) => {
        // 1. 获取旧的值
        const { highSpeed } = getState();
        // 2. 修改
        dispatch({
            type: ACTION_SET_HIGH_SPEED,
            payload: !highSpeed,
        });
    };
}

export function showCitySelector(currentSelectingLeftCity) {
    return dispatch => {
        // 先设置初始值
        dispatch({
            type: ACTION_SET_IS_CITY_SELECTOR_VISIBLE,
            payload: true,
        });
        // 然后将type的值改成传入的值
        dispatch({
            type: ACTION_SET_CURRENT_SELECTING_LEFT_CITY,
            payload: currentSelectingLeftCity,
        });
    };
}
// 隐藏城市选择框
export function hideCitySelector() {
    return {
        type: ACTION_SET_IS_CITY_SELECTOR_VISIBLE,
        payload: false,
    };
}
// 将选择的城市回填
export function setSelectedCity(city) {
    return (dispatch, getState) => {
        const { currentSelectingLeftCity } = getState();

        if (currentSelectingLeftCity) {
            dispatch(setFrom(city));
        } else {
            dispatch(setTo(city));
        }
        // 回填后隐藏城市选择框
        dispatch(hideCitySelector());
    };
}
// 选择的出发地与目的地交换
export function exchangeFromTo() {
    return (dispatch, getState) => {
        const { from, to } = getState();
        dispatch(setFrom(to));
        dispatch(setTo(from));
    };
}

// 日期控件的选择与隐藏
export function showDateSelector() {
    return {
        type: ACTION_SET_IS_DATE_SELECTOR_VISIBLE,
        payload: true,
    };
}
export function hideDateSelector() {
    return {
        type: ACTION_SET_IS_DATE_SELECTOR_VISIBLE,
        payload: false,
    };
}

// 设置选择的日期
export function setDepartDate(departDate) {
    return {
        type: ACTION_SET_DEPART_DATE,
        payload: departDate,
    };
}

// 请求城市数据的异步action
export function fetchCityData() {
    return (dispatch, getState) => {
        const { isLoadingCityData } = getState();
        // 如果已加载则不做任何变化
        if (isLoadingCityData) {
            return;
        }

        // 先判断缓存中的数据是否过期
        const cache = JSON.parse(localStorage.getItem('city_data_cache'));
        if (Date.now() < cache.expires) {
            dispatch(setSelectedCity(cache.data));
            return;
        }

        // 如果未加载，先加isLoadingCityData置为true
        dispatch(setIsLoadingCityData(true));
        // 发送请求
        fetch('/rest/cities?_' + Date.now())
            .then(res => res.json())
            .then(cityData => {
                dispatch(setCityData(cityData));
                // 将请求的数据缓存
                localStorage.setItem(
                    'city_data_cache',
                    JSON.stringify({
                        expires: Date.now() + 60 * 1000,
                        data: cityData,
                    })
                );
                dispatch(setIsLoadingCityData(false));
            })
            .catch(() => {
                dispatch(setIsLoadingCityData(false));
            });
    };
}
