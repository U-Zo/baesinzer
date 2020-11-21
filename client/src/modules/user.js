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
const SET_USERNAME = 'user/SET_USERNAME';
const LOGOUT = 'user/LOGOUT';
const MOVE_LOCATION = 'user/MOVE_LOCATION'; // 맵 이동 액션 타입
const VOTE = 'user/VOTE'; // 투표 액션 타입
const KILL = 'uaer/KILL';

export const tempUser = createAction(TEMP_USER, (userInfo) => userInfo);
export const check = createAction(CHECK);
export const logout = createAction(LOGOUT);
export const setUsername = createAction(SET_USERNAME, (username) => username);
export const moveLocation = createAction(
  MOVE_LOCATION,
  (locationId) => locationId
);
export const vote = createAction(VOTE, (userNo) => userNo);
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
    [SET_USERNAME]: (state, { payload: username }) => ({
      ...state,
      userInfo: {
        ...state.userInfo,
        username,
      },
    }),
    [MOVE_LOCATION]: (state, { payload: locationId }) => ({
      ...state,
      userInfo: {
        ...state.userInfo,
        locationId,
      },
    }),
    [VOTE]: (state, { payload: userNo }) => ({
      ...state,
      userInfo: {
        ...state.userInfo,
        hasVoted: userNo,
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
