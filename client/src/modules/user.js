import { createAction, handleActions } from 'redux-actions';
import { takeLatest } from 'redux-saga/effects';
import createRequestSaga, {
  createRequestActionTypes,
} from '../lib/createRequestSaga';
import * as authAPI from '../lib/api/auth';

const TEMP_USER = 'auth/TEMP_SET_USER';

const [CHECK, CHECK_SUCCESS, CHECK_FAILURE] = createRequestActionTypes(
  'user/CHECK'
);
const SET_USERINFO = 'user/SET_USERINFO';
const LOGOUT = 'user/LOGOUT';
const KILL = 'uaer/KILL';

export const tempUser = createAction(TEMP_USER, (userInfo) => userInfo);
export const check = createAction(CHECK);
export const logout = createAction(LOGOUT);
export const setUserinfo = createAction(SET_USERINFO, (username) => username);

export const kill = createAction(KILL, (userNo) => userNo);

const checkSaga = createRequestSaga(CHECK, authAPI.check);

export function* userSaga() {
  yield takeLatest(CHECK, checkSaga);
}

const initialState = {
  userInfo: null,
  error: null,
};

const user = handleActions(
  {
    [TEMP_USER]: (state, { payload: userInfo }) => ({
      ...state,
      userInfo,
      error: null,
    }),
    [CHECK_SUCCESS]: (state, { payload: userInfo }) => ({
      ...state,
      userInfo,
      error: null,
    }),
    [CHECK_FAILURE]: (state, { payload: error }) => ({
      ...state,
      userInfo: null,
      error,
    }),
    [LOGOUT]: () => ({
      initialState,
    }),
    [SET_USERINFO]: (state, { payload: username }) => ({
      ...state,
      userInfo: {
        ...state.userInfo,
        username,
      },
    }),
    [KILL]: (state, { payload: userNo }) => ({
      ...state,
      userInfo: {
        ...state.userInfo,
        kill: userNo,
      },
    }),
  },
  initialState
);

export default user;
