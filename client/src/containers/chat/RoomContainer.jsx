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
  closeLocation,
  initializeUser,
  kill,
  loadMissions,
  moveLocation,
  tempUser,
  update,
  vote,
} from '../../modules/user';
import map from '../../lib/map';

const sockJS = new SockJS('/ws-stomp'); // 서버의 웹 소켓 주소
const stompClient = (Stomp.Client = Stomp.over(sockJS)); //stomp Client 생성
stompClient.connect();

let subId;
const spaceRegex = /^\s*$/;
const system = {
  userNo: 0,
  username: 'System',
};

const complexMissionIds = [10, 20];

const RoomContainer = ({ match, history }) => {
  const { roomCode } = match.params;

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
  // 상대방 이동 정보
  const [moveLocationInfo, setMoveLocationInfo] = useState({
    locationId: 0,
    message: '',
  });

  // 살해
  const [killPossible, setKillPossible] = useState(true);
  // 살해 명령 토글
  const [killInfo, setKillInfo] = useState(false);

  // 미션 명령 토글
  const [missionInfo, setMissionInfo] = useState(false);
  const [missionDone, setMissionDone] = useState(false);

  // 투표
  const [votePossible, setVotePossible] = useState(true);

  // 방해
  const [disturbancePossible, setDisturbancePossible] = useState(true);
  const [disturbanceInfo, setDisturbanceInfo] = useState(false);
  const [turnOff, setTurnOff] = useState(false);
  const [closePossible, setClosePossible] = useState(false);

  // 각종 시간
  const moveRef = useRef(null);
  const [moveTime, setMoveTime] = useState(5);
  const killRef = useRef(null);
  const [killTime, setKillTime] = useState(15);
  const voteRef = useRef(null);
  const [voteTime, setVoteTime] = useState(100);
  const disturbanceRef = useRef(null);
  const [disturbanceTime, setDisturbanceTime] = useState(60);
  const [turnOffTime, setTurnOffTime] = useState(20);

  // input ref
  const inputRef = useRef(null);

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
    inputRef.current.focus();
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
  const scrollRef = useRef(null);
  const scrollToBottom = () => {
    scrollRef.current.scrollIntoView(-10); // scroll을 항상 아래로 내리기
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
          if (!room.locationList[mapLocation].close) {
            dispatch(moveLocation(mapLocation));
            dispatch(
              logMessage(userInfo, `${map[mapLocation - 1]}(으)로 이동했다.`)
            );
            setMovePossible(false);
          } else {
            dispatch(logMessage(userInfo, '방이 잠겼다..'));
          }
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
          setKillPossible(false);
        } else if (message.includes('이동') || message.includes('move')) {
          dispatch(logMessage(userInfo, '일단 움직이자.'));
        }
      }

      // 미션 명령 토글 활성화 시
      if (missionInfo) {
        setMissionInfo(false);
        const mission = parseInt(message.replace(/[^0-9]/g, ''));
        if (mission) {
          const m = userInfo.missionList.find((m) => m.missionId === mission);
          if (m && !m.done) {
            setMissionId(mission);
            setMissionVisible(true);
            setMissionDone(false);
          }
        }
      }

      // 방해 명령 토글 활성화 시
      if (disturbanceInfo && userInfo.baesinzer) {
        setDisturbanceInfo(false);
        const disturbance = parseInt(message.replace(/[^0-9]/g, ''));
        // 전력 공급 중단
        if (disturbance === 1) {
          stompSend('TURN_OFF');
        }

        if (disturbance === 2) {
          dispatch(logMessage(userInfo, '어디를 잠글까?'));
          dispatch(
            logMessage(
              userInfo,
              `1.${map[0]} 2.${map[1]} 3.${map[2]} 4.${map[3]} 5.${map[4]}`
            )
          );
          setClosePossible(true);
        }
      }

      // 잠금 명령 토글 활성화 시
      if (closePossible && userInfo.baesinzer) {
        setClosePossible(false);
        const closeRoom = parseInt(message.replace(/[^0-9]/g, ''));
        if (closeRoom > 0 && closeRoom <= 5) {
          dispatch(closeLocation(closeRoom));
          dispatch(logMessage(userInfo, `${map[closeRoom - 1]}을(를) 잠갔다.`));
        } else {
          dispatch(logMessage(userInfo, '잠글수 없는 곳이다.'));
        }
      }

      if (meeting) {
        // 회의 진행 중 투표 명령
        // 죽은 상태면 투표 및 채팅 불가
        if (!userInfo.dead) {
          if (message.includes('/투표')) {
            if (votePossible) {
              const voteNo = parseInt(message.replace(/[^0-9]/g, ''));
              if (voteNo && voteNo > 0 && voteNo <= room.count) {
                dispatch(vote(voteNo));
                dispatch(logMessage(userInfo, `${voteNo}이(가) 의심스럽다.`));
                setVotePossible(false);
              }
            }
          } else {
            stompSend('ROOM');
          }
        }
      } else if (message === '/이동' || message === '/move') {
        // 맵 이동 명령
        if (!room.locationList[userInfo.locationId].close) {
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
        } else {
          dispatch(logMessage(userInfo, '방이 잠겼다..!'));
        }
      } else if (
        message.includes('/살해') ||
        message.includes('/kill') ||
        message.includes('/죽')
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
      }
      // 방해 공작
      else if (message.includes('/방해') || message.includes('/disturbance')) {
        if (userInfo && userInfo.baesinzer) {
          if (disturbancePossible) {
            dispatch(logMessage(userInfo, `1.전력 공급 중단 2.방 문 닫기`));
            setDisturbanceInfo(true);
          } else {
            dispatch(
              logMessage(userInfo, `지금은 방해할 수 없어. 조금만 기다리자..`)
            );
          }
        } else {
          dispatch(logMessage(userInfo, message));
        }
      }
      /////////////////
      else if (message.includes('/일과')) {
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
        // 죽은 상태는 신고 불가
        if (!userInfo.dead) {
          stompSend('VOTE_START');
        }
      } else if (
        !mapInfo &&
        !killInfo &&
        !missionInfo &&
        !disturbanceInfo &&
        !closePossible
      ) {
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
    stompClient.subscribe(`/sub/socket/room/${roomCode}`, (data) => {
      // 서버로부터 데이터를 받음
      const serverMesg = JSON.parse(data.body); // 받아온 메세지를 json형태로 parsing
      const userInfoServer = serverMesg.userInfo;

      // userInfo update
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
      } else if (serverMesg.type === 'MOVE') {
        setMoveLocationInfo({
          locationId: userInfoServer.locationId,
          message: serverMesg.message,
        });
      } else if (serverMesg.type === 'KILL') {
        // 살해 발생된 지역 설정
        setKillLoc(userInfoServer.locationId);
      } else if (serverMesg.type === 'VOTE_START') {
        // 회의 시작
        setMeeting(true);
        setKillInfo(false);
        setMapInfo(false);
        setMissionInfo(false);
        setMissionVisible(false);
        setMissionId(0);
        dispatch(logMessage(userInfoServer, serverMesg.message));
        dispatch(
          logMessage(userInfoServer, '모든 인원과 통신이 연결되었습니다.')
        );
      } else if (serverMesg.type === 'VOTE_END') {
        // 회의 종료
        setMeeting(false);
        setVotePossible(true);
      } else if (serverMesg.type === 'TURN_OFF') {
        // 암전 방해
        setTurnOff(true);
        setDisturbancePossible(false);
      } else if (serverMesg.type === 'END') {
        // 게임 종료
        dispatch(initializeMessageLog());
        dispatch(logMessage(userInfoServer, serverMesg.message));
        setStart(false);
        setKilledby(null);
        setFlag(false);
        setMissions(false);
        setVotePossible(true);
        setTurnOff(false);
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
      dispatch(exitRoom());
      dispatch(initializeMessageLog());
      dispatch(initializeUser());
    };
  }, [roomCode]); // roomCode가 바뀌면 새로운 접속

  // ref 타이머 초기화
  const clear = (id) => {
    clearInterval(id.current);
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
        const index = Math.floor(Math.random() * 8) + 1;
        if (!simpleMissionIds.find((num) => num === index)) {
          simpleMissionIds.push(index);
        }
      }

      const complexMissionId = complexMissionIds[Math.floor(Math.random() * 2)];
      dispatch(loadMissions({ simpleMissionIds, complexMissionId }));
      setMissions(true);
    } else {
      clear(disturbanceRef);
    }
  }, [room && room.start]);

  // 미션 정보 동기화
  useEffect(() => {
    if (room && room.start && start) {
      stompSend('PLAY');
    }
  }, [missions, missionDone]);

  useEffect(() => {
    if (userInfo.locationId === undefined) {
      return;
    }

    if (room && room.start) {
      stompSend('MOVE');
      if (findDead) {
        setFindDead(false);
      }

      if (meeting) {
        return;
      }

      const deadList = room.locationList.find(
        (location) => userInfo.locationId === location.locationId
      )?.deadList;

      if (deadList && deadList.length) {
        for (const userOnMap of deadList) {
          setFindDead(true);
          dispatch(
            logMessage(
              userInfo,
              `${userOnMap.username}이(가) 산송장이 되어있다. 신고할까? (명령어: /신고)`
            )
          );
        }
      }
    }
  }, [userInfo && userInfo.locationId]);

  // 이동 정보 출력
  useEffect(() => {
    if ((room && !room.start) || meeting) {
      return;
    }

    // 암전 시 이동 정보 출력 x
    if (userInfo.locationId === moveLocationInfo.locationId && !turnOff) {
      dispatch(logMessage(userInfo, moveLocationInfo.message));
    }
  }, [moveLocationInfo, room && room.start, turnOff]);

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
    if (meeting && !votePossible) {
      stompSend('VOTE');
    }
  }, [votePossible]);

  // baesinzer
  useEffect(() => {
    if (userInfo && userInfo.baesinzer) {
      dispatch(logMessage(system, '당신은 BaeSinZer입니다.'));
      dispatch(logMessage(system, '목표: 모든 시민을 처리하십시오.'));
    }
  }, [userInfo && userInfo.baesinzer]);

  // 이동 쿨타임
  useEffect(() => {
    if (!movePossible && moveTime > 4) {
      let t = 5;
      moveRef.current = setInterval(() => {
        if (t > 1) {
          t--;
          setMoveTime(t);
        } else {
          clear(moveRef);
          setMovePossible(true);
          setMoveTime(5);
        }
      }, 1000);
    }
  }, [movePossible, moveTime]);

  // kill 쿨타임
  useEffect(() => {
    if (!killPossible && killTime > 14) {
      let t = 15;
      killRef.current = setInterval(() => {
        if (t > 1) {
          t--;
          setKillTime(t);
        } else {
          clear(killRef);
          setKillPossible(true);
          setKillTime(15);
        }
      }, 1000);
    }
  }, [killPossible, killTime]);

  // 투표 타임
  useEffect(() => {
    if (meeting) {
      // 암전 해제
      setTurnOff(false);
      let t = 100;
      voteRef.current = setInterval(() => {
        if (t > 0) {
          t--;
          setVoteTime(t);
        } else {
          setTimeout(() => {
            if (votePossible && !userInfo.dead) {
              dispatch(vote(-1));
              setVotePossible(false);
            }
          }, 300 * userInfo.userNo);
          clear(voteRef);
        }
      }, 1000);
    } else {
      clear(voteRef);
    }
  }, [meeting]);

  // 방해 공작 및 암전 쿨 타이머
  useEffect(() => {
    if (!disturbancePossible && disturbanceTime > 59 && turnOffTime > 19) {
      let t = 60; // 방해 쿨 타임 60초
      let _t_off = 20; // 암전 시간 20초

      disturbanceRef.current = setInterval(() => {
        // 방해 쿨타임
        if (t > 1) {
          t--;
          setDisturbanceTime(t);
          console.log('방해 쿨 타임', t);
        } else {
          clear(disturbanceRef);
          setDisturbancePossible(true);
          setDisturbanceTime(60);
        }

        // 암전 시간
        if (_t_off > 1) {
          _t_off--;
          setTurnOffTime(_t_off);
          console.log('userlist암전 ', _t_off, '초 후 암전 끝');
        } else {
          setTurnOff(false);
          setTurnOffTime(20);
        }
      }, 1000);
    }
  }, [disturbancePossible, turnOff]);

  // 방해 - 암전관련 메세지
  useEffect(() => {
    if (room && room.start && turnOff) {
      if (!userInfo.baesinzer) {
        dispatch(
          logMessage(
            system,
            '전등 시스템에 오류가 발생했습니다. 20초 후에 고쳐집니다.'
          )
        );
      } else {
        dispatch(
          logMessage(
            userInfo,
            '시민들의 전력 시스템을 다운시켰어. 복구되기 전에 조용히 시민을 처리하자.'
          )
        );
      }
    } else if (room && room.start && !turnOff) {
      dispatch(logMessage(system, '전력 시스템이 복구되었습니다.'));
    }
  }, [turnOff]);

  // 방 문 닫기
  useEffect(() => {
    if (room && room.start) {
      if (userInfo.closeLocationId !== 0) {
        stompSend('CLOSE_LOCATION');
      }
    }
  }, [userInfo.closeLocationId]);

  return (
    <>
      <Room
        onSubmit={sendMessage}
        onChange={onChange}
        startHandler={startHandler}
        userInfo={userInfo}
        message={message}
        messageLog={messageLog}
        usersArray={
          room &&
          room.locationList.find(
            (location) => userInfo.locationId === location.locationId
          )?.userList
        }
        deadList={
          room &&
          room.locationList.find(
            (location) => userInfo.locationId === location.locationId
          )?.deadList
        }
        exit={exit}
        visible={visible}
        closeModal={closeModal}
        scrollRef={scrollRef}
        killedby={killedby}
        start={room && room.start}
        meeting={meeting}
        voteTime={voteTime}
        movePossible={movePossible}
        moveTime={moveTime}
        killPossible={killPossible}
        killTime={killTime}
        missionList={userInfo && userInfo.missionList}
        inputRef={inputRef}
        turnOff={turnOff}
        disturbancePossible={disturbancePossible}
        disturbanceTime={disturbanceTime}
      />
      <MissionModal
        missionVisible={missionVisible}
        missionId={missionId}
        setMissionDone={setMissionDone}
        closeMissionModal={closeMissionModal}
        username={userInfo.username}
      />
    </>
  );
};

export default withRouter(RoomContainer);
