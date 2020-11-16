import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import RoomList from '../../components/chat/RoomList';
import { createRoom } from '../../modules/room';
import { loadRooms, unloadRooms } from '../../modules/rooms';
import { setUsername } from '../../modules/user';

const RoomListContainer = ({ history }) => {
  const [visible, setVisible] = useState(false);
  const [roomName, setRoomName] = useState();

  const { username, loading, roomList, error, room } = useSelector(
    ({ loading, rooms, user, room }) => ({
      loading: loading['roomList/GET_ROOM_LIST'],
      roomList: rooms.roomList,
      username: user.username,
      error: rooms.error,
      room: room.room,
    })
  );

  const dispatch = useDispatch();

  const changeUsername = (e) => {
    const inputUsername = e.target.value;
    dispatch(setUsername(inputUsername));
  };

  // start modal option
  const onClick = () => {
    setVisible(!visible);
  };
  const onChangeRoomName = (e) => {
    const roomname = e.target.value;
    setRoomName(roomname);
  };
  const makeRoom = (e) => {
    e.preventDefault();
    dispatch(createRoom(roomName));
  };

  // end modal option

  useEffect(() => {
    dispatch(loadRooms());
    return () => dispatch(unloadRooms());
  }, [dispatch]);

  useEffect(() => {
    if (room) {
      console.log(room.roomCode);
      history.push(`/room/${room.roomCode}`);
    }
  }, [room, history]); //방만들기 하면, 그 방으로 이동!

  return (
    <RoomList
      username={username}
      loading={loading}
      error={error}
      roomList={roomList}
      changeUsername={changeUsername}
      onClick={onClick}
      visible={visible}
      makeRoom={makeRoom}
      onChangeRoomName={onChangeRoomName}
    />
  );
};

export default withRouter(RoomListContainer);
