import { combineReducers } from 'redux';
import loading from './loading';
import { all } from 'redux-saga/effects';

const rootReducer = combineReducers({
  loading,
});

export function* rootSaga() {
  yield all([]);
}

export default rootReducer;
