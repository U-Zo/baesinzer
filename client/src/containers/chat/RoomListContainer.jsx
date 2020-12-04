import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import RoomList from '../../components/chat/RoomList';
import { createRoom, exitRoom, loadRoom } from '../../modules/room';
import { loadRooms, unloadRooms } from '../../modules/rooms';
import { setUsername } from '../../modules/user';

const RoomListContainer = ({ history }) => {
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);
  const [roomName, setRoomName] = useState();
  const [type, setType] = useState();
  const { userInfo, loading, roomList, roomError, room } = useSelector(
    ({ loading, rooms, user, room }) => ({
      loading: loading['roomList/GET_ROOM_LIST'],
      roomList: rooms.roomList,
      //확인---- username을 userinfo로 받아오는 것으로 수정ㅇ
      userInfo: user.userInfo,
      roomError: rooms.error,
      room: room.room,
    })
  );
  const dispatch = useDispatch();

  const changeUsername = (e) => {
    const inputUsername = e.target.value;
    // if (inputUsername.length > 8) {
    //   setType('닉네임');
    //   setError('닉네임이 너무 깁니다.');
    // } else if (inputUsername <= 8) {
    //   setError('');
    // }
    dispatch(setUsername(inputUsername));
  };

  // start modal option
  const onClick = () => {
    //수정-----
    if (userInfo.username === null || userInfo.username === '') {
      setVisible(false);
      setType('닉네임');
      setError('닉네임을 입력하세요.');
    } else if (userInfo.username.length > 8) {
      setType('닉네임');
      setError('닉네임이 너무 깁니다.');
    } else setVisible(!visible);
    setTimeout(function () {
      setError(null);
    }, 2000);
  };

  const onJoin = (roomId) => {
    if (!userInfo.username) {
      setType('닉네임');
      setError('닉네임을 입력하세요.');
      setTimeout(function () {
        setError(null);
      }, 2000);
    } else {
      dispatch(loadRoom({ roomId }));
    }
  };

  const onChangeRoomName = (e) => {
    const roomname = e.target.value;
    setRoomName(roomname);
  };

  const makeRoom = (e) => {
    e.preventDefault();
    if (roomName == null) {
      setError('방 제목을 입력하세요.');
      setType('방제목');
      setTimeout(function () {
        setError(null);
      }, 2000);
    }

    dispatch(createRoom(roomName));
  };

  const onRefresh = () => {
    if (!loading) {
      dispatch(loadRooms());
    }
  };

  // end modal option

  useEffect(() => {
    dispatch(loadRooms());
    return () => dispatch(unloadRooms());
  }, [dispatch]);

  useEffect(() => {
    if (room) {
      if (room.count === 6) {
        dispatch(loadRooms());
        dispatch(exitRoom());
        setType('인원');
        setError('방이 가득 찼습니다.');
        setVisible(true);
      } else {
        history.push(`/room/${room.roomCode}`);
      }
    }
  }, [room, history]); //방만들기 하면, 그 방으로 이동!

  useEffect(() => {
    if (!userInfo) {
      history.push('/');
    }
  }, [userInfo]);

  return (
    <RoomList
      userInfo={userInfo}
      loading={loading}
      roomError={roomError}
      roomList={roomList}
      changeUsername={changeUsername}
      onClick={onClick}
      visible={visible}
      makeRoom={makeRoom}
      onChangeRoomName={onChangeRoomName}
      onRefresh={onRefresh}
      type={type}
      error={error}
      onJoin={onJoin}
    />
  );
};

export default withRouter(RoomListContainer);
