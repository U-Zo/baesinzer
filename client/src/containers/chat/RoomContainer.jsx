import { getSuggestedQuery } from '@testing-library/react';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import Room from '../../components/chat/Room';
import {
  changeField,
  initialField,
  logMessage,
  initializeMessageLog,
} from '../../modules/messages';
import { exitRoom, loadRoom } from '../../modules/room';
import {
  check,
  kill,
  moveLocation,
  tempUser,
  update,
} from '../../modules/user';

const sockJS = new SockJS('http://localhost:8080/ws-stomp'); // 서버의 웹 소켓 주소
const stompClient = (Stomp.Client = Stomp.over(sockJS)); //stomp Client 생성
stompClient.connect(); // 서버에 접속

const RoomContainer = ({ match, history }) => {
  const { roomId } = match.params;
  const dispatch = useDispatch();

  const { userInfo, message, messageLog, room } = useSelector(
    ({ user, messages, room }) => ({
      userInfo: user.userInfo,
      message: messages.message,
      messageLog: messages.messageLog,
      room: room.room,
    })
  );

  // modal
  const [visible, setVisible] = useState(false);
  const [baesinzer, setBaesinzer] = useState();
  const [killedby, setKilledby] = useState();

  let isConnect = false;

  const onChange = (e) => {
    const value = e.target.value;
    dispatch(changeField(value)); // message에 저장
  };

  const closeModal = () => {
    setVisible(!visible);
  };

  const stompSend = (type) => {
    stompClient.connected &&
      stompClient.send(
        '/pub/socket/message',
        {},
        JSON.stringify({
          type,
          roomCode: roomId,
          userInfo,
          message,
        })
      );
  };

  const startHandler = () => {
    stompSend('START');
  };

  // scroll관련
  const scrollRef = useRef();
  const scrollToBottom = () => {
    scrollRef.current.scrollIntoView(0); // scroll을 항상 아래로 내리기
  };

  const sendMessage = (e) => {
    e.preventDefault();

    // 서버에 정보 전달
    // dispatch로유저 정보를 저장한다.
    // dispatch(logMessage(username, message));
    if (room.start) {
      if (message.includes('이동') || message.includes('move')) {
        const mapLocation = parseInt(message.replace(/[^0-9]/g, ''));
        dispatch(moveLocation(mapLocation));
        dispatch(logMessage('System', `${mapLocation}으로 이동했다.`));
      } else if (
        message.includes('살해') ||
        message.includes('kill') ||
        message.includes('죽')
      ) {
        if (userInfo.baesinzer) {
          setKilledby(userInfo.username);
          let usersArray = Object.values(room.users);
          let userWord = message.split(' ');
          for (let i = 0; i < usersArray.length; i++) {
            if (userWord[1] === usersArray[i].username) {
              dispatch(kill(usersArray[i].userNo));
              dispatch(
                logMessage(
                  userInfo.username,
                  `${usersArray[i].username}을 처리했다.`
                )
              );
            }
          }
        }
      } else {
        dispatch(logMessage(userInfo.username, message));
      }
      dispatch(initialField());
    } else {
      stompSend('ROOM');
      dispatch(initialField());
    }
  };

  const exit = () => {
    dispatch(exitRoom());
  };

  // 서버로부터 메세지를 받아옴
  // 접속했을 때 구독

  const stompSubscribe = () =>
    stompClient.subscribe(`/sub/socket/room/${roomId}`, (data) => {
      // 서버로부터 데이터를 받음
      const serverMesg = JSON.parse(data.body); // 받아온 메세지를 json형태로 parsing
      const userInfoServer = serverMesg.userInfo;

      // 수정 userInfo update
      if (!isConnect && serverMesg.type === 'JOIN') {
        dispatch(tempUser(userInfoServer));
        isConnect = true;
      }

      // 메세지 정보 받기
      if (
        serverMesg.type === 'ROOM' ||
        serverMesg.type === 'JOIN' ||
        serverMesg.type === 'EXIT'
      ) {
        dispatch(logMessage(userInfoServer.username, serverMesg.message)); // 서버로부터 받은 이름으로 messageLog에 추가
      }
      dispatch(loadRoom({ roomId }));
    });

  const stompConnection = () =>
    new Promise((resolve, reject) => {
      if (!stompClient.connected) {
        resolve(stompClient.connect({}, stompSubscribe));
      } else {
        resolve(stompSubscribe());
      }
    });

  useEffect(() => {
    let subId;
    stompConnection().then((connection) => {
      subId = connection;
      dispatch(loadRoom({ roomId }));
      stompSend('JOIN');
    });
    return () => {
      //컴포넌트 끝
      stompSend('EXIT');
      //수정
      dispatch(exitRoom());
      stompClient.connected && subId.unsubscribe();
      dispatch(initializeMessageLog());
      dispatch(check());
    };
  }, [roomId]); // roomId가 바뀌면 새로운 접속

  useEffect(() => {
    if (!room) {
      history.push(`/lobby`); // room의 정보가 null이면(exit), lobby로 이동
    }
  }, [room, history]);

  useEffect(() => {
    if (room) {
      for (const key in room.users) {
        if (parseInt(key) === parseInt(userInfo.userNo)) {
          dispatch(update(room.users[key]));
        }
      }
    }
  }, [room]);

  // dead 시 모달창 띄우기
  useEffect(() => {
    if (room && room.start && userInfo.dead) {
      setVisible(true);
    }
  }, [userInfo]);

  useEffect(() => {
    if (room && room.start) {
      dispatch(initializeMessageLog());
    }
  }, [room && room.start]);

  // move
  useEffect(() => {
    if (room && room.start) {
      stompSend('PLAY');
    }
  }, [userInfo && userInfo.locationId]);

  // scroll
  useEffect(() => {
    scrollToBottom();
  }, [messageLog]);

  // kill
  useEffect(() => {
    if (userInfo && userInfo.baesinzer) {
      stompSend('KILL');
    }
  }, [userInfo && userInfo.kill]);

  // baesinzer
  useEffect(() => {
    if (userInfo.baesinzer) {
      setBaesinzer('배신저');
    }
    for (let i = 0; i < Object.values(room.users).length; i++) {
      if (Object.values(room.users)[i].kill > 0) {
        setKilledby(Object.values(room.users)[i].username);
      }
    }
  }, [userInfo.baesinzer, room.users]);
  return (
    <Room
      onSubmit={sendMessage}
      onChange={onChange}
      startHandler={startHandler}
      userInfo={userInfo}
      message={message}
      messageLog={messageLog}
      usersArray={room && Object.values(room.users)} // json형태를 배열로 변환
      exit={exit}
      visible={visible}
      closeModal={closeModal}
      scrollRef={scrollRef}
      baesinzer={baesinzer}
      killedby={killedby}
    />
  );
};

export default withRouter(RoomContainer);
