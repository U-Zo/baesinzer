import React, { useEffect, useLayoutEffect, useState } from 'react';
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
import user, { check, start, tempUser, update } from '../../modules/user';

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
  const [error, setError] = useState();

  let isConnect = false;

  const onChange = (e) => {
    const value = e.target.value;
    dispatch(changeField(value)); //message에 저장
  };

  const startHandler = () => {
    stompClient.send(
      '/pub/socket/message',
      {},
      JSON.stringify({
        type: 'START',
        roomCode: roomId,
        userInfo: userInfo,
        message: message,
      })
    );
  };

  const sendMessage = (e) => {
    e.preventDefault();

    //서버에 정보 전달
    //dispatch로유저 정보를 저장한다.
    // dispatch(logMessage(username, message));
    stompClient.send(
      '/pub/socket/message',
      {},
      JSON.stringify({
        type: 'ROOM',
        roomCode: roomId,
        userInfo: userInfo,
        message: message,
      })
    );
    dispatch(initialField());
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
      console.log(serverMesg);

      const userInfoServer = serverMesg.userInfo;
      console.log(userInfoServer);

      // 수정 userInfo update
      if (!isConnect && serverMesg.type === 'JOIN') {
        console.log(isConnect);
        dispatch(tempUser(userInfoServer));
        isConnect = true;
      }

      //메세지 정보 받기
      dispatch(logMessage(userInfoServer.username, serverMesg.message)); // 서버로부터 받은 이름으로 messageLog에 추가
      dispatch(loadRoom({ roomId }));
    });

  useEffect(() => {
    let sub;
    if (!stompClient.connected) {
      sub = stompClient.connect({}, stompSubscribe);
    } else {
      sub = stompSubscribe();
    }
    dispatch(loadRoom({ roomId }));
    stompClient.send(
      '/pub/socket/message',
      {},
      JSON.stringify({
        type: 'JOIN',
        roomCode: roomId,
        // 수정
        userInfo: userInfo,
        message: message,
      })
    );
    return () => {
      //컴포넌트 끝
      stompClient.send(
        '/pub/socket/message',
        {},
        JSON.stringify({
          type: 'EXIT',
          roomCode: roomId,
          userInfo,
          message: message,
        })
      );
      //수정
      dispatch(exitRoom());
      sub.unsubscribe();
      dispatch(initializeMessageLog());
      dispatch(check());
    };
  }, [roomId]); // roomId가 바뀌면 새로운 접속

  useEffect(() => {
    if (!room) {
      history.push(`/lobby`); //room의 정보가 null이면(exit), lobby로 이동
    }
  }, [room, history]);

  useEffect(() => {
    if (room) {
      for (const key in room.users) {
        if (parseInt(key) === parseInt(userInfo.userNo)) {
          dispatch(update(room.users[key]));
          if (room.users[key].baesinzer) {
            dispatch(logMessage('System', '당신은 BaesinZer입니다.'));
          }
          console.log('업데이트 실행');
        }
      }
    }
  }, [room]);

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
    />
  );
};

export default withRouter(RoomContainer);
