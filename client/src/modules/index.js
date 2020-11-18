import { combineReducers } from 'redux';
import loading from './loading';
import auth, { authSaga } from './auth';
import user, { userSaga } from './user';
import { all } from 'redux-saga/effects';

const rootReducer = combineReducers({
  loading,
  user,
  auth,
});

export function* rootSaga() {
  yield all([authSaga(), userSaga()]);
}

export default rootReducer;
