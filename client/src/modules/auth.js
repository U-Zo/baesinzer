import * as authAPI from '../lib/api/auth';
import { call, takeLatest, put } from 'redux-saga/effects';

const LOGIN = 'auth/LOGIN';
const LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS';
const LOGIN_FAILURE = 'auth/LOGIN_FAILURE';

const REGISTER = 'auth_REGISTER';
const REGISTER_SUCCESS = 'auth_REGISTER_SUCCESS';
const REGISTER_FAILURE = 'auth_REGISTER_FAILURE';

const INITIALIZE_FIELD = 'auth/INITIALIZE_FIELD ';

const CHANGE_FIELD = 'LOGIN_CHANGE_FIELD';

export const login = ({ email, password }) => ({
  type: LOGIN,
  payload: {
    email,
    password,
  },
});

export const register = ({ email, password }) => ({
  type: REGISTER,
  payload: {
    email,
    password,
  },
});

export const changeField = ({ form, name, value }) => ({
  type: CHANGE_FIELD,
  payload: {
    form,
    name,
    value,
  },
});

export const intializeField = (form) => ({
  type: INITIALIZE_FIELD,
  payload: {
    form,
  },
});

function* loginSaga(action) {
  try {
    const response = yield call(() => authAPI.login(action.payload));
    yield put({
      type: LOGIN_SUCCESS,
      payload: response.data,
      meta: response,
    });
  } catch (e) {
    yield put({
      type: LOGIN_FAILURE,
      payload: e,
      error: true,
    });
  }
}
function* registerSaga(action) {
  try {
    const response = yield call(() => authAPI.register(action.payload));
    yield put({
      type: REGISTER_SUCCESS,
      payload: response.data,
      meta: response,
    });
  } catch (e) {
    yield put({
      type: REGISTER_FAILURE,
      payload: e,
      error: true,
    });
  }
}

export function* authSaga() {
  yield takeLatest(LOGIN, loginSaga);
  yield takeLatest(REGISTER, registerSaga);
}

const initialState = {
  register: {
    email: '',
    password: '',
    passwordConfirm: '',
  },
  login: {
    email: '',
    password: '',
  },
  auth: null,
  authError: null,
};

const auth = (state = initialState, action) => {
  switch (action.type) {
    case INITIALIZE_FIELD:
      return {
        ...state,
        [action.payload.form]: initialState[action.payload.form],
      };

    case CHANGE_FIELD:
      return {
        ...state,
        [action.payload.form]: {
          ...state[action.payload.form],
          [action.payload.name]: action.payload.value,
        },
      };

    case REGISTER_SUCCESS:
      return {
        ...state,
        auth: action.payload,
        authError: null,
      };

    case REGISTER_FAILURE:
      return {
        ...state,
        auth: null,
        authError: action.payload,
      };

    case LOGIN_SUCCESS:
      return {
        ...state,
        auth: action.payload,
        authError: null,
      };

    case LOGIN_FAILURE:
      return {
        ...state,
        auth: null,
        authError: action.payload,
      };

    default:
      return state;
  }
};

export default auth;
