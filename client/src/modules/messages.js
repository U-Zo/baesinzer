import createActionTypes from '../lib/createActionTypes';
import createRequestSaga from '../lib/createRequestSaga';

// action type 지정
const GET_USERINFO = 'messages/GET_USERINFO';
const CHANGE_FIELD = 'messages/CHANGE_FIELD';
const INITIALIZE_FIELD = 'messages/INITIALIZE_FIELD';
const LOG_MESSAGE = 'messages/LOG_MESSAGE';
const INITIALIZE_MESSAGE_LOG = 'messages/INITIALIZE_MESSAGE_LOG';

const [
  UPDATE_MESSAGE,
  UPDATE_MESSAGE_SUCCESS,
  UPDATE_MESSAGE_FAILURE,
] = createActionTypes('messageLog/UPDATE_MESSAGE');

//action함수 정의
export const getUserInfo = ({
  userNo,
  username,
  locationId,
  hasVoted,
  voteNum,
  missionList,
  dead,
  baesinzer,
}) => ({
  type: GET_USERINFO,
  payload: {
    userNo,
    username,
    locationId,
    hasVoted,
    voteNum,
    missionList,
    dead,
    baesinzer,
  },
});

//
export const changeField = (message) => ({
  type: CHANGE_FIELD,
  payload: {
    message,
  },
});
export const logMessage = (username, message) => ({
  type: LOG_MESSAGE,
  payload: {
    username,
    message,
  },
});
export const initialField = () => ({
  type: INITIALIZE_FIELD,
});
export const initializeMessageLog = () => ({
  type: INITIALIZE_MESSAGE_LOG,
});

//state값 정의
const initialState = {
  userInfo: {},
  messageLog: [],
  message: '',
};

//리듀서 정의
const messages = (state = initialState, action) => {
  switch (action.type) {
    case GET_USERINFO:
      return {
        ...state,
        userInfo: {
          userNo: action.payload.userNo,
          username: action.payload.username,
          locationId: action.payload.locationId,
          hasVoted: action.payload.hasVoted,
          voteNum: action.payload.voteNum,
          missionList: action.payload.missionList,
          dead: action.payload.dead,
          baesinzer: action.payload.baesinzer,
        },
      };
    case CHANGE_FIELD:
      return {
        ...state,
        message: action.payload.message,
      };
    case LOG_MESSAGE:
      return {
        ...state,
        messageLog: state.messageLog.concat({
          message: action.payload.message,
          username: action.payload.username,
        }),
      };
    case INITIALIZE_FIELD:
      return {
        ...state,
        message: initialState.message,
      };
    case INITIALIZE_MESSAGE_LOG:
      return {
        ...state,
        messageLog: initialState.messageLog,
      };
    default:
      return state;
  }
};
export default messages;
