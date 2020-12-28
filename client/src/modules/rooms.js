import { createAction, handleActions } from 'redux-actions';
import createRequestSaga, {
  createRequestActionTypes,
} from '../lib/createRequestSaga';
import * as roomsAPI from '../lib/api/rooms';
import { takeLatest } from 'redux-saga/effects';

const [
  LOAD_ROOMS,
  LOAD_ROOMS_SUCCESS,
  LOAD_ROOMS_FAILURE,
] = createRequestActionTypes('rooms/LOAD_ROOMS');

const UNLOAD_ROOM_LIST = 'rooms/UNLOAD_ROOM_LIST';

export const loadRooms = createAction(LOAD_ROOMS);
export const unloadRooms = createAction(UNLOAD_ROOM_LIST);

const initialState = {
  roomList: [],
  error: null,
};

const getRoomsSaga = createRequestSaga(LOAD_ROOMS, roomsAPI.getRoomList);

export function* roomListSaga() {
  yield takeLatest(LOAD_ROOMS, getRoomsSaga);
}

const rooms = handleActions(
  {
    [LOAD_ROOMS_SUCCESS]: (state, { payload: roomList }) => ({
      ...state,
      roomList, // 기존 것은 없애야한다.
    }),
    [LOAD_ROOMS_FAILURE]: (state, { payload: error }) => ({
      ...state,
      error: error,
    }),
    [UNLOAD_ROOM_LIST]: () => initialState,
  },
  initialState
);

export default rooms;
