import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import MissionModal from '../../components/chat/MissionModal';
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
  loadMissions,
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
const map = ['로비', '강의실', '화장실', '보안실', '편의점'];
const complexMissionIds = [10, 20];

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
  const [missions, setMissions] = useState(false);

  // modal
  const [flag, setFlag] = useState(false);
  const [visible, setVisible] = useState(false);
  const [missionVisible, setMissionVisible] = useState(false);
  const [missionId, setMissionId] = useState(0);
  const [killedby, setKilledby] = useState(null);

  // 긴급 회의
  const [meeting, setMeeting] = useState(false);

  // 살해 현장
  const [killLoc, setKillLoc] = useState(-1);

  // 시체 발견
  const [findDead, setFindDead] = useState(false);

  // 이동
  const [movePossible, setMovePossible] = useState(true);
  // 이동 명령 토글
  const [mapInfo, setMapInfo] = useState(false);

  // 살해
  const [killPossible, setKillPossible] = useState(true);
  // 살해 명령 토글
  const [killInfo, setKillInfo] = useState(false);

  // 미션 명령 토글
  const [missionInfo, setMissionInfo] = useState(false);

  // 투표
  const [voted, setVoted] = useState(false);

  // ref
  const moveRef = useRef(null);
  const killRef = useRef(null);
  const voteRef = useRef(null);

  let isConnect = false;

  const onChange = (e) => {
    const value = e.target.value;
    dispatch(changeField(value)); // message에 저장
  };

  const closeModal = () => {
    setVisible(!visible);
  };

  const closeMissionModal = () => {
    setMissionVisible(false);
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

  // 채팅 메시지 보내기
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
      // 이동 명령 토글 활성화 시
      if (mapInfo) {
        setMapInfo(false);
        const mapLocation = parseInt(message.replace(/[^0-9]/g, ''));
        if (mapLocation > 0 && mapLocation <= 5) {
          dispatch(moveLocation(mapLocation));
          dispatch(
            logMessage(userInfo, `${map[mapLocation - 1]}(으)로 이동했다.`)
          );
        } else if (
          (userInfo.baesinzer && message.includes('살해')) ||
          (userInfo.baesinzer && message.includes('kill')) ||
          (userInfo.baesinzer && message.includes('죽'))
        ) {
          dispatch(logMessage(userInfo, `여기서 죽이자.`));
        } else {
          dispatch(logMessage(userInfo, `갈수없는 곳이군...`));
        }
      }

      // 살해 명령 토글 활성화 시
      if (killInfo && userInfo.baesinzer) {
        const userWord = parseInt(message.replace(/[^0-9]/g, ''));
        const usersArray = Object.values(room.users);
        setKillInfo(false);
        if (
          userWord &&
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

      // 미션 명령 토글 활성화 시
      if (missionInfo) {
        setMissionInfo(false);
        const mission = parseInt(message.replace(/[^0-9]/g, ''));
        if (mission) {
          setMissionId(mission);
          setMissionVisible(true);
        }
      }

      if (meeting) {
        // 회의 진행 중 투표 명령
        if (message.includes('투표')) {
          if (!voted) {
            const voteNo = parseInt(message.replace(/[^0-9]/g, ''));
            if (voteNo && voteNo > 0 && voteNo <= room.count) {
              dispatch(vote(voteNo));
              setVoted(true);
              dispatch(logMessage(userInfo, `${voteNo}이(가) 의심스럽다.`));
            }
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
              `1.${map[0]} 2.${map[1]} 3.${map[2]} 4.${map[3]} 5.${map[4]}`
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
          if (killPossible) {
            const usersArray = Object.values(room.users);
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
            }
            if (userList === '') {
              dispatch(
                logMessage(userInfo, '이곳은 죽일 수 있는 사람이 없군..')
              );
            } else {
              dispatch(logMessage(userInfo, userList));
              setKillInfo(true);
            }
          } else {
            dispatch(logMessage(userInfo, '아직 처리할 힘이 없어'));
          }
        } else {
          dispatch(logMessage(userInfo, message));
        }
      } else if (message.includes('/일과')) {
        // 해당 위치의 미션 목록 출력
        if (!missionInfo && !userInfo.baesinzer && userInfo.missionList) {
          const missionOnHere = userInfo.missionList
            .filter(
              (mission) =>
                !mission.done && userInfo.locationId === mission.locationId
            )
            .map((mission) => `${mission.missionId}.${mission.missionName}`)
            .join(' ');

          if (!missionOnHere.length) {
            dispatch(logMessage(userInfo, '여기서 할 일은 없는 것 같아'));
          } else {
            setMissionInfo(true); // 미션 명령 토글 활성화
            dispatch(logMessage(userInfo, '여기서 할 일은'));
            dispatch(logMessage(userInfo, missionOnHere));
          }
        } else {
          dispatch(logMessage(userInfo, message));
        }
      } else if (
        // 신고 명령
        (findDead && message.includes('/신고')) ||
        message.includes('/report')
      ) {
        stompSend('VOTE_START');
      } else if (!mapInfo && !killInfo && !missionInfo) {
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
      } else if (serverMesg.type === 'START') {
        dispatch(logMessage(userInfoServer, serverMesg.message));
        if (!start) {
          setStart(true);
        }
      } else if (serverMesg.type === 'KILL') {
        // 살해 발생된 지역 설정
        setKillLoc(userInfoServer.locationId);
      } else if (serverMesg.type === 'VOTE_START') {
        // 회의 시작
        setMeeting(true);
        setKillInfo(false);
        setMapInfo(false);
        setMissionInfo(false);
        dispatch(logMessage(userInfoServer, serverMesg.message));
        dispatch(logMessage('System', '모든 인원과 통신이 연결되었습니다.'));
      } else if (serverMesg.type === 'VOTE_END') {
        // 회의 종료
        setMeeting(false);
        setVoted(false);
      } else if (serverMesg.type === 'END') {
        // 게임 종료
        dispatch(initializeMessageLog());
        dispatch(logMessage(userInfoServer, serverMesg.message));
        setStart(false);
        setKilledby(null);
        setFlag(false);
        setMissions(false);
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

  // ref 타이머 초기화
  const clear = (id) => {
    window.clearInterval(id.current);
  };

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
        if (Object.values(room.users)[i].kill > 0 && !killedby) {
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

  // 미션 랜덤 선택
  useEffect(() => {
    if (room && room.start) {
      dispatch(initializeMessageLog());
      dispatch(logMessage(system, '실험 시작, 모든 일과를 완수하십시오.'));
      const simpleMissionIds = [];
      while (simpleMissionIds.length < 2) {
        const index = Math.floor(Math.random() * 7) + 1;
        if (!simpleMissionIds.find((num) => num === index)) {
          simpleMissionIds.push(index);
        }
      }

      const complexMissionId = complexMissionIds[Math.floor(Math.random() * 2)];
      dispatch(loadMissions({ simpleMissionIds, complexMissionId }));
      setMissions(true);
    }
  }, [room && room.start]);

  // 미션 정보 동기화
  useEffect(() => {
    if (room && room.start && start && !missionVisible) {
      stompSend('PLAY');
    }
  }, [missions, missionVisible]);

  useEffect(() => {
    if (room && room.start) {
      let t = 3;
      setMovePossible(false);
      moveRef.current = window.setInterval(() => {
        t--;
        console.log(t);
        if (t < 1) {
          clear(moveRef);
          setMovePossible(true);
        }
      }, 1000);

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
              `${userOnMap.username}이(가) 산송장이 되어있다. 신고할까? (명령어: /신고)`
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
            userInfo,
            '지금 여기서 누군가가 살해당했다. 신고할까? (명령어: /신고)'
          )
        );
      } else {
        dispatch(
          logMessage(
            userInfo,
            '누군가 발견하기 전에 먼저 신고할까? (명령어: /신고)'
          )
        );
      }
      setFindDead(true);
      setKillLoc(-1);
    }
  }, [killLoc]);

  useEffect(() => {
    if (meeting && voted) {
      stompSend('VOTE');
    }
  }, [voted]);

  // baesinzer
  useEffect(() => {
    if (userInfo && userInfo.baesinzer) {
      dispatch(logMessage(system, '당신은 BaeSinZer입니다.'));
      dispatch(logMessage(system, '목표: 모든 시민을 처리하십시오.'));
    }
  }, [userInfo && userInfo.baesinzer]);

  // kill 쿨타임
  useEffect(() => {
    if (room && room.start && userInfo && userInfo.baesinzer) {
      let t = 6;
      setKillPossible(false);
      killRef.current = window.setInterval(() => {
        t--;
        console.log(t);
        if (t < 1) {
          clear(killRef);
          setKillPossible(true);
        }
      }, 1000);
    }
  }, [userInfo && userInfo.kill]);

  useEffect(() => {
    if (room && room.start && meeting) {
      let t = 5;
      voteRef.current = window.setInterval(() => {
        t--;
        if (t < 1 && !voted && !userInfo.dead) {
          setTimeout(() => {
            dispatch(vote(-1));
            setVoted(true);
          }, 500 * userInfo.userNo);
          clear(voteRef);
        }
      }, 1000);
    }
  }, [meeting]);

  return (
    <>
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
      <MissionModal
        missionVisible={missionVisible}
        missionId={missionId}
        closeMissionModal={closeMissionModal}
      />
    </>
  );
};

export default withRouter(RoomContainer);
