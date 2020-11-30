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
  vote,
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
  const [killedby, setKilledby] = useState();

  // 긴급 회의
  const [meeting, setMeeting] = useState(false);

  // 살해 현장
  const [killLoc, setKillLoc] = useState(-1);

  // 시체 발견
  const [findDead, setFindDead] = useState(false);

  const [flag, setFlag] = useState(true);

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

  // 게임 시작 이벤트
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
      if (meeting) {
        // 회의 진행 중 투표 명령
        if (message.includes('투표')) {
          if (!userInfo.hasVoted) {
            const voteNo = parseInt(message.replace(/[^0-9]/g, ''));
            dispatch(vote(voteNo));
            dispatch(
              logMessage(userInfo.username, `${voteNo}이(가) 의심스럽다.`)
            );
          }
        } else {
          stompSend('ROOM');
        }
      } else if (message.includes('이동') || message.includes('move')) {
        // 맵 이동 명령
        const mapLocation = parseInt(message.replace(/[^0-9]/g, ''));
        dispatch(moveLocation(mapLocation));
        dispatch(logMessage(userInfo.username, `${mapLocation}으로 이동했다.`));
      } else if (
        message.includes('살해') ||
        message.includes('kill') ||
        message.includes('죽')
      ) {
        // 살해 명령
        if (userInfo && userInfo.baesinzer) {
          let usersArray = Object.values(room.users);
          let userWord = message.split(' ');
          for (let i = 0; i < usersArray.length; i++) {
            if (
              userWord[1] === usersArray[i].username &&
              userInfo.locationId === usersArray[i].locationId
            ) {
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
      } else if (
        // 신고 명령
        (findDead && message.includes('신고')) ||
        message.includes('report')
      ) {
        stompSend('VOTE_START');
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
        serverMesg.type === 'VOTE' ||
        serverMesg.type === 'EXIT'
      ) {
        dispatch(logMessage(userInfoServer.username, serverMesg.message)); // 서버로부터 받은 이름으로 messageLog에 추가
      } else if (serverMesg.type === 'KILL') {
        // 살해 발생된 지역 설정
        setKillLoc(userInfoServer.locationId);
      } else if (serverMesg.type === 'VOTE_START') {
        // 회의 시작
        setMeeting(true);
        dispatch(logMessage(userInfoServer.username, serverMesg.message));
        dispatch(logMessage('System', '모든 인원과 통신이 연결되었습니다.'));
      } else if (serverMesg.type === 'VOTE_END') {
        // 회의 종료
        setMeeting(false);
      } else if (serverMesg.type === 'END') {
        // 게임 종료
        dispatch(initializeMessageLog());
        dispatch(logMessage(userInfoServer.username, serverMesg.message));
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
    // baesinzer로부터 죽음 모달 pop
    for (let i = 0; i < Object.values(room.users).length; i++) {
      if (Object.values(room.users)[i].kill > 0) {
        setKilledby(Object.values(room.users)[i].username);
      }
    }
    if (room && room.start && userInfo.dead) {
      if (flag) {
        setVisible(true);
        setFlag(false);
      }
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
      if (findDead) {
        setFindDead(false);
      }

      if (meeting) {
        return;
      }

      const userList = Object.values(room.users);
      for (const userOnMap of userList) {
        if (userInfo.locationId === userOnMap.locationId && userOnMap.dead) {
          setFindDead(true);
          dispatch(
            logMessage(
              userInfo.username,
              `${userOnMap.username}이(가) 산송장이 되어있다. 신고할까?`
            )
          );

          break;
        }
      }
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

  // 살해 현장 목격
  useEffect(() => {
    if (killLoc !== -1 && userInfo.locationId === killLoc) {
      if (!userInfo.baesinzer) {
        dispatch(
          logMessage(
            userInfo.username,
            '지금 여기서 누군가가 살해당했다. 신고할까?'
          )
        );
      } else {
        dispatch(
          logMessage(userInfo.username, '누군가 발견하기 전에 먼저 신고할까?')
        );
      }
      setFindDead(true);
      setKillLoc(-1);
    }
  }, [killLoc]);

  useEffect(() => {
    if (meeting) {
      stompSend('VOTE');
    }
  }, [userInfo && userInfo.hasVoted]);

  // baesinzer
  useEffect(() => {
    if (userInfo.baesinzer) {
      dispatch(logMessage('System', '당신은 BaeSinZer입니다.'));
      dispatch(logMessage('System', '목표: 무고한 시민을 살해하십시오.'));
    }
  }, [userInfo && userInfo.baesinzer]);

  return (
    <Room
      onSubmit={sendMessage}
      onChange={onChange}
      startHandler={startHandler}
      userInfo={userInfo}
      message={message}
      messageLog={messageLog}
      usersArray={room && Object.values(room.users)}
      exit={exit}
      visible={visible}
      closeModal={closeModal}
      scrollRef={scrollRef}
      killedby={killedby}
    />
  );
};

export default withRouter(RoomContainer);
