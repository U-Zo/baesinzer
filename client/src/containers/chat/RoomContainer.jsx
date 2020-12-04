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
import { exitRoom, loadRoomOnMessage } from '../../modules/room';
import {
  initializeUser,
  kill,
  moveLocation,
  tempUser,
  update,
  vote,
} from '../../modules/user';

const sockJS = new SockJS('/ws-stomp'); // 서버의 웹 소켓 주소
const stompClient = (Stomp.Client = Stomp.over(sockJS)); //stomp Client 생성
stompClient.connect();

let subId;
const spaceRegex = /^\s*$/;
const system = {
  userNo: 0,
  username: 'System',
};
// map 정보
const map = ['안방', '화장실', '강의실1', '강의실2', '강의실3', '강의실4'];

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

  // 시작 여부
  const [start, setStart] = useState(false);

  // modal
  const [visible, setVisible] = useState(false);
  const [killedby, setKilledby] = useState();

  // 긴급 회의
  const [meeting, setMeeting] = useState(false);

  // 살해 현장
  const [killLoc, setKillLoc] = useState(-1);

  // 시체 발견
  const [findDead, setFindDead] = useState(false);

  const [flag, setFlag] = useState(false);
  //이동 키워드 작동
  const [mapInfo, setMapInfo] = useState(false);
  const [killPossible, setKillPossible] = useState(false);

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
          roomCode: room.roomCode,
          userInfo,
          message,
        })
      );
  };

  // 게임 시작 이벤트
  const startHandler = () => {
    if (!start) {
      stompSend('START');
      setStart(true);
    }
  };

  // scroll관련
  const scrollRef = useRef();
  const scrollToBottom = () => {
    scrollRef.current.scrollIntoView(0); // scroll을 항상 아래로 내리기
  };

  const sendMessage = (e) => {
    e.preventDefault();

    // 빈 채팅 차단
    if (message === '' || message === '') {
      return;
    } else if (spaceRegex.test(message)) {
      dispatch(initialField());
      return;
    } else if (message.length > 30) {
      dispatch(initialField());
      return;
    }

    // 서버에 정보 전달
    // dispatch로유저 정보를 저장한다.
    // dispatch(logMessage(username, message));
    if (room.start) {
      if (mapInfo) {
        setMapInfo(false);
        const mapLocation = parseInt(message.replace(/[^0-9]/g, ''));
        if (mapLocation > 0 && mapLocation <= 6) {
          dispatch(moveLocation(mapLocation));
          dispatch(
            logMessage(userInfo, `${map[mapLocation - 1]}로(으로) 이동했다.`)
          );
        } else if (
          message.includes('살해') ||
          message.includes('kill') ||
          message.includes('죽')
        ) {
          dispatch(logMessage(userInfo, `여기서 죽이자.`));
        } else {
          dispatch(logMessage(userInfo, `갈수없는 곳이군...`));
        }
      }
      if (killPossible && userInfo.baesinzer) {
        let userWord = parseInt(message.replace(/[^0-9]/g, ''));
        let usersArray = Object.values(room.users);
        setKillPossible(false);
        console.log(userWord);
        console.log(typeof userWord);
        console.log(isNaN(userWord));
        if (
          !isNaN(userWord) &&
          userWord <= usersArray.length &&
          userWord !== userInfo.userNo &&
          userInfo.locationId === usersArray[userWord - 1].locationId
        ) {
          dispatch(kill(userWord));
          dispatch(
            logMessage(
              userInfo,
              `${usersArray[userWord - 1].username}를(을) 처리했다.`
            )
          );
        } else if (message.includes('이동') || message.includes('move')) {
          dispatch(logMessage(userInfo, `일단 움직이자.`));
        }
      }
      if (meeting) {
        // 회의 진행 중 투표 명령
        if (message.includes('투표')) {
          if (!userInfo.hasVoted) {
            const voteNo = parseInt(message.replace(/[^0-9]/g, ''));
            dispatch(vote(voteNo));
            dispatch(logMessage(userInfo, `${voteNo}이(가) 의심스럽다.`));
          }
        } else {
          stompSend('ROOM');
        }
      } else if (message === '이동' || message === 'move') {
        // 맵 이동 명령
        if (movePossible) {
          dispatch(
            logMessage(
              userInfo,
              `1.${map[0]} 2.${map[1]} 3.${map[2]} 4.${map[3]} 5.${map[4]} 6.${map[5]}`
            )
          );
          setMapInfo(true);
          console.log(mapInfo);
        } else {
          dispatch(logMessage(userInfo, '아직 움직일 수 없어..'));
        }
      } else if (
        message.includes('살해') ||
        message.includes('kill') ||
        message.includes('죽')
      ) {
        // 살해 명령
        if (userInfo && userInfo.baesinzer) {
          let usersArray = Object.values(room.users);
          // let userWord = message.split(' ');
          let userList = '';
          for (let i = 0; i < usersArray.length; i++) {
            if (
              userInfo.locationId === usersArray[i].locationId &&
              userInfo.username !== usersArray[i].username &&
              !usersArray[i].dead
            ) {
              userList += `${i + 1}.${usersArray[i].username} `;
            }
            // if (
            //   userWord[1] === usersArray[i].username &&
            //   userInfo.locationId === usersArray[i].locationId
            // ) {
            //   dispatch(kill(usersArray[i].userNo));
            //   dispatch(
            //     logMessage(
            //       userInfo.username,
            //       `${usersArray[i].username}을 처리했다.`
            //     )
            //   );
            // }
          }
          if (userList === '') {
            dispatch(logMessage(userInfo, '이곳은 죽일 수 있는 사람이 없군..'));
          } else {
            dispatch(logMessage(userInfo, userList));
          }
          setKillPossible(true);
        }
      } else if (
        // 신고 명령
        (findDead && message.includes('신고')) ||
        message.includes('report')
      ) {
        stompSend('VOTE_START');
      } else if (!mapInfo && !killPossible) {
        dispatch(logMessage(userInfo, message));
      }
      dispatch(initialField());
    } else {
      stompSend('ROOM');
      dispatch(initialField());
    }
  };

  const exit = () => {
    dispatch(exitRoom());
    dispatch(initializeUser());
  };

  // 서버로부터 메세지를 받아옴
  // 접속했을 때 구독
  const stompSubscribe = () =>
    stompClient.connected &&
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
        dispatch(logMessage(userInfoServer, serverMesg.message)); // 서버로부터 받은 이름으로 messageLog에 추가
      } else if (serverMesg.type === 'KILL') {
        // 살해 발생된 지역 설정
        setKillLoc(userInfoServer.locationId);
      } else if (serverMesg.type === 'VOTE_START') {
        // 회의 시작
        setMeeting(true);
        dispatch(logMessage(userInfoServer, serverMesg.message));
        dispatch(logMessage('System', '모든 인원과 통신이 연결되었습니다.'));
      } else if (serverMesg.type === 'VOTE_END') {
        // 회의 종료
        setMeeting(false);
      } else if (serverMesg.type === 'END') {
        // 게임 종료
        dispatch(initializeMessageLog());
        dispatch(logMessage(userInfoServer, serverMesg.message));
        setStart(false);
        setKilledby(null);
        setFlag(false);
      }
      dispatch(loadRoomOnMessage(serverMesg.room));
    });

  const stompConnection = () =>
    new Promise((resolve, reject) => {
      if (!stompClient.connected) {
        stompClient.connect();
      }
      resolve(stompSubscribe());
    });

  useEffect(() => {
    stompConnection().then((connection) => {
      subId = connection;
      stompSend('JOIN');
    });
    return () => {
      //컴포넌트 끝
      stompClient.connected && subId.unsubscribe();
      stompSend('EXIT');
      //수정
      dispatch(exitRoom());
      dispatch(initializeMessageLog());
      dispatch(initializeUser());
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
    if (room) {
      for (let i = 0; i < Object.values(room.users).length; i++) {
        if (Object.values(room.users)[i].kill > 0) {
          setKilledby(Object.values(room.users)[i].username);
        }
      }
      if (room.start && userInfo.dead) {
        if (!flag) {
          setVisible(true);
          setFlag(true);
        }
      }
    }
  }, [userInfo]);

  useEffect(() => {
    if (room && room.start) {
      dispatch(initializeMessageLog());
    }
  }, [room && room.start]);

  // move
  const id = useRef(null);
  const [movePossible, setMovePossible] = useState(true);
  const clear = () => {
    window.clearInterval(id.current);
  };

  useEffect(() => {
    if (room && room.start) {
      let t = 3;
      if (t === 3) {
        setMovePossible(false);
        id.current = window.setInterval(() => {
          t = t - 1;
          console.log(t);
          if (t < 1) {
            clear();
            setMovePossible(true);
          }
        }, 1000);
      }

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
              userInfo,
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
          logMessage(userInfo, '지금 여기서 누군가가 살해당했다. 신고할까?')
        );
      } else {
        dispatch(logMessage(userInfo, '누군가 발견하기 전에 먼저 신고할까?'));
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
    if (userInfo && userInfo.baesinzer) {
      dispatch(logMessage(system, '당신은 BaeSinZer입니다.'));
      dispatch(logMessage(system, '목표: 무고한 시민을 살해하십시오.'));
    }
  }, [userInfo && userInfo.baesinzer]);

  const [voting, setVoting] = useState(false);
  // kill 쿨타임
  useEffect(() => {
    if (room.start && userInfo.baesinzer) {
      let t = 6;
      if (t === 6) {
        setKillPossible(false);
        id.current = window.setInterval(() => {
          t = t - 1;
          // console.log(t);
          if (t <= 0) {
            clear();
            setKillPossible(true);
          }
        }, 1000);
      }
    }
  }, [userInfo.kill]);

  // useEffect(() => {
  //   if (room.start && meeting) {
  //     setTimeout(() => {
  //       console.log('setTimeout');
  //       if (userInfo.hasVoted === 0) {
  //         console.log('투표안한사람');
  //         console.log(userInfo.username);
  //         dispatch(vote(7));
  //         dispatch(
  //           logMessage(
  //             userInfo.username,
  //             '투표 시간 종료. 기권처리 되었습니다.'
  //           )
  //         );
  //       }
  //     }, 5000);
  //   } else if (room.start && userInfo.hasVoted !== 0) {
  //     console.log('투표 했다.');
  //   }
  // }, [messageLog]);

  const [voteTime, setVoteTime] = useState(false);

  useEffect(() => {
    if (room && room.start && meeting) {
      let t = 5;
      if (t === 5) {
        setVoteTime(true);
        id.current = window.setInterval(() => {
          t = t - 1;
          console.log(t);
          if (t < 1) {
            setVoteTime(false);
          }
        }, 1000);
      }
    }
  });

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
