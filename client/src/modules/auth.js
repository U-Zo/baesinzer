import * as authAPI from '../lib/api/auth';
import { call, takeLatest, put } from 'redux-saga/effects';
import createRequestSaga, {
  createRequestActionTypes,
} from '../lib/createRequestSaga';
import { createAction } from 'redux-actions';

// const LOGIN = 'auth/LOGIN';
// const LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS';
// const LOGIN_FAILURE = 'auth/LOGIN_FAILURE';
const [LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE] = createRequestActionTypes(
  'auth/LOGIN'
);
// const REGISTER = 'auth_REGISTER';
// const REGISTER_SUCCESS = 'auth_REGISTER_SUCCESS';
// const REGISTER_FAILURE = 'auth_REGISTER_FAILURE';

const [REGISTER, REGISTER_SUCCESS, REGISTER_FAILURE] = createRequestActionTypes(
  'auth/REGISTER'
);
const INITIALIZE_FIELD = 'auth/INITIALIZE_FIELD';
const INITIALIZE_AUTH = 'auth/INITIALIZE_AUTH';

const CHANGE_FIELD = 'LOGIN_CHANGE_FIELD';

export const login = createAction(LOGIN, ({ email, password }) => ({
  email,
  password,
}));

export const register = createAction(REGISTER, ({ email, password }) => ({
  email,
  password,
}));

export const changeField = createAction(
  CHANGE_FIELD,
  ({ form, name, value }) => ({
    form, // register, login
    name, // username, password, passwordConfirm
    value, // 실제 바꾸려는 값
  })
);

export const intializeField = createAction(INITIALIZE_FIELD, (form) => form);

export const intializeAuth = createAction(INITIALIZE_AUTH, () => auth);

const loginSaga = createRequestSaga(LOGIN, authAPI.login);
const registerSaga = createRequestSaga(REGISTER, authAPI.register);

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
        [action.payload]: initialState[action.payload],
      };
    case INITIALIZE_AUTH:
      return {
        ...state,
        auth: null,
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
