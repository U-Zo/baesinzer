import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';
import loading from './loading';
import auth, { authSaga } from './auth';
import user, { userSaga } from './user';
import room, { roomSaga } from './room';
import rooms, { roomListSaga } from './rooms';
import messages from './messages';

const rootReducer = combineReducers({
  loading,
  auth,
  user,
  room,
  rooms,
  messages,
});

export const rootSaga = function* () {
  yield all([authSaga(), userSaga(), roomSaga(), roomListSaga()]);
};

export default rootReducer;
