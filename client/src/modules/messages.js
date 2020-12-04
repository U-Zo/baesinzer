// action type 지정
const CHANGE_FIELD = 'messages/CHANGE_FIELD';
const INITIALIZE_FIELD = 'messages/INITIALIZE_FIELD';
const LOG_MESSAGE = 'messages/LOG_MESSAGE';
const INITIALIZE_MESSAGE_LOG = 'messages/INITIALIZE_MESSAGE_LOG';

export const changeField = (message) => ({
  type: CHANGE_FIELD,
  payload: {
    message,
  },
});

export const logMessage = (userInfo, message) => ({
  type: LOG_MESSAGE,
  payload: {
    userInfo,
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
  messageLog: [],
  message: '',
};

//리듀서 정의
const messages = (state = initialState, action) => {
  switch (action.type) {
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
          userInfo: {
            userNo: action.payload.userInfo.userNo,
            username: action.payload.userInfo.username,
          },
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
