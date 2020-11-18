import { call, put, takeLatest } from 'redux-saga/effects';
import * as authAPI from '../lib/api/auth';
import axios from 'axios';
const CHECK = 'user/CHECK';
const CHECK_SUCCESS = 'user/CHECK_SUCCESS';
const CHECK_FAILURE = 'user/CHECK_FAILURE';

const LOGOUT = 'user/LOGOUT';

export const check = () => ({
  type: CHECK,
});

function* checkSaga() {
  console.log('check 실행//?');
  try {
    const response = yield call(() => authAPI.check());
    yield put({
      type: CHECK_SUCCESS,
      payload: response.data,
      meta: response,
    });
  } catch (e) {
    yield put({
      type: CHECK_FAILURE,
      payload: e,
      error: true,
    });
  }
}
function* logoutSaga() {
  console.log('logout');
  const response = yield call(() => axios.get('/api/auth/logout'));
  yield put({
    type: LOGOUT,
    payload: response.data,
  });
}
export function* userSaga() {
  yield takeLatest(CHECK, checkSaga);
  yield takeLatest(LOGOUT, logoutSaga);
}

export const logout = () => ({
  type: LOGOUT,
});

const initialState = {
  userInfo: null,
  error: null,
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case CHECK_SUCCESS:
      return {
        ...state,
        userInfo: action.payload,
        error: null,
      };
    case CHECK_FAILURE:
      return {
        ...state,
        userInfo: null,
        error: action.payload,
      };
    case LOGOUT:
      return {
        ...state,
        userInfo: action.payload,
        error: null,
      };
    default:
      return state;
  }
};

export default user;
