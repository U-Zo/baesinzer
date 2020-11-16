import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';
import loading from './loading';
import room, { roomSaga } from './room';
import rooms, { roomListSaga } from './rooms';
import messages from './messages';
import user from './user';

const rootReducer = combineReducers({
  loading,
  room,
  rooms,
  user,
  messages,
});

export const rootSaga = function* () {
  yield all([roomSaga(), roomListSaga()]);
};

export default rootReducer;
