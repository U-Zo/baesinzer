import { createAction, handleActions } from 'redux-actions';
import createRequestSaga, {
  createRequestActionTypes,
} from '../lib/createRequestSaga';
import * as roomsAPI from '../lib/api/rooms';
import { takeLatest } from 'redux-saga/effects';

const [
  CREATE_ROOM,
  CREATE_ROOM_SUCCESS,
  CREATE_ROOM_FAILURE,
] = createRequestActionTypes('room/CREATE_ROOM');

const [
  LOAD_ROOM,
  LOAD_ROOM_SUCCESS,
  LOAD_ROOM_FAILURE,
] = createRequestActionTypes('room/LOAD_ROOM');

const [
  EXIT_ROOM,
  EXIT_ROOM_SUCCESS,
  EXIT_ROOM_FAILURE,
] = createRequestActionTypes('room/EXIT_ROOM');

export const createRoom = createAction(CREATE_ROOM, (roomName) => ({
  roomName,
}));

export const loadRoom = createAction(LOAD_ROOM, ({ roomId }) => ({
  roomId,
}));

export const exitRoom = createAction(EXIT_ROOM);

const createRoomSaga = createRequestSaga(CREATE_ROOM, roomsAPI.createRoom);
const loadRoomSaga = createRequestSaga(LOAD_ROOM, roomsAPI.loadRoom);
const exitRoomSaga = createRequestSaga(EXIT_ROOM, roomsAPI.getRoomList);

export function* roomSaga() {
  yield takeLatest(CREATE_ROOM, createRoomSaga);
  yield takeLatest(LOAD_ROOM, loadRoomSaga);
  yield takeLatest(EXIT_ROOM, exitRoomSaga);
}

const initialState = {
  room: null,
  error: null,
};

const room = handleActions(
  {
    [CREATE_ROOM_SUCCESS]: (state, { payload: room }) => ({
      ...state,
      room,
      createError: null,
    }),
    [CREATE_ROOM_FAILURE]: (state, { payload: error }) => ({
      ...state,
      room: null,
      error,
    }),
    [LOAD_ROOM_SUCCESS]: (state, { payload: room }) => ({
      ...state,
      room,
      error: null,
    }),
    [LOAD_ROOM_FAILURE]: (state, { payload: { error } }) => ({
      ...state,
      room: null,
      error,
    }),
    [EXIT_ROOM_SUCCESS]: (state) => ({
      ...state,
      room: null,
    }),
    [EXIT_ROOM_FAILURE]: (state, { payload: { error } }) => ({
      ...state,
      error,
    }),
  },
  initialState
);

export default room;
