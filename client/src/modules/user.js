import { createAction, handleActions } from 'redux-actions';
import { takeLatest } from 'redux-saga/effects';
import createRequestSaga, {
  createRequestActionTypes,
} from '../lib/createRequestSaga';
import * as authAPI from '../lib/api/auth';
import { complexMissions, simpleMissions } from '../lib/missions';

const TEMP_USER = 'auth/TEMP_SET_USER';
const [CHECK, CHECK_SUCCESS, CHECK_FAILURE] = createRequestActionTypes(
  'user/CHECK'
);
const SET_USERNAME = 'user/SET_USERNAME';
const LOGOUT = 'user/LOGOUT';
const LOAD_MISSIONS = 'user/LOAD_MISSIONS';
const MOVE_LOCATION = 'user/MOVE_LOCATION'; // 맵 이동 액션 타입
const MISSION_DONE = 'user/MISSION_DONE'; // 미션 성공
const VOTE = 'user/VOTE'; // 투표 액션 타입
const KILL = 'uaer/KILL';
const UPDATE = 'user/UPDATE';
const INITIALIZE_USER = 'user/INITIALIZE_USER';

export const tempUser = createAction(TEMP_USER, (userInfo) => userInfo);
export const check = createAction(CHECK);
export const logout = createAction(LOGOUT);
export const setUsername = createAction(SET_USERNAME, (username) => username);
export const loadMissions = createAction(
  LOAD_MISSIONS,
  ({ simpleMissionIds, complexMissionId }) => {
    console.log(simpleMissionIds, complexMissionId);
    const simpleMissionList = simpleMissionIds.map((id) =>
      simpleMissions.find((mission) => mission.missionId === id)
    );
    return [
      ...simpleMissionList,
      complexMissions.find((mission) => mission.missionId === complexMissionId),
    ];
  }
);
export const moveLocation = createAction(
  MOVE_LOCATION,
  (locationId) => locationId
);
export const missionDone = createAction(MISSION_DONE, (missionId) => missionId);
export const vote = createAction(VOTE, (userNo) => userNo);
export const kill = createAction(KILL, (userNo) => userNo);
export const update = createAction(UPDATE, (userInfo) => userInfo);
export const initializeUser = createAction(INITIALIZE_USER);

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
    [UPDATE]: (state, { payload: userInfo }) => ({
      ...state,
      userInfo,
      error: null,
    }),
    [CHECK_SUCCESS]: (state, { payload: userInfo }) => ({
      ...state,
      userInfo,
      error: null,
    }),
    [CHECK_FAILURE]: (state, { payload: error }) => {
      localStorage.removeItem('userInfo');
      return { ...state, userInfo: null, error };
    },
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
    [INITIALIZE_USER]: (state) => ({
      ...state,
      userInfo: {
        username: state.userInfo.username,
      },
    }),
    [LOAD_MISSIONS]: (state, { payload: missions }) => ({
      ...state,
      userInfo: {
        ...state.userInfo,
        missionList: missions,
      },
    }),
    [MOVE_LOCATION]: (state, { payload: locationId }) => ({
      ...state,
      userInfo: {
        ...state.userInfo,
        locationId,
      },
    }),
    [MISSION_DONE]: (state, { payload: missionId }) => ({
      ...state,
      userInfo: {
        ...state.userInfo,
        missionList: state.userInfo.missionList.map((mission) =>
          missionId === mission.missionId ? { ...mission, done: true } : mission
        ),
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
