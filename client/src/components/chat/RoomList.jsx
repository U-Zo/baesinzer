import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Modal from '../common/Modal';
import { createRoom } from '../../lib/api/rooms';
const Room = React.memo(({ name }) => {
  return (
    <li>
      <div>{name}</div>
    </li>
  );
});

const RoomList = ({
  username,
  loading,
  roomList,
  error,
  changeUsername,
  onClick,
  visible,
  makeRoom,
  onChangeRoomName,
}) => {
  const dispatch = useDispatch();

  if (error) {
    return <div>에러가 발생했습니다.</div>;
  }
  return (
    <div>
      <div>
        <input
          type="text"
          value={username}
          onChange={changeUsername}
          placeholder="닉네임을 입력하세요."
        />
      </div>
      <ul>
        {!loading &&
          roomList &&
          roomList.map((room) => (
            <Link to={`/room/${room.roomCode}`}>
              <Room name={room.roomName} />
            </Link>
          ))}
      </ul>

      {/* modal */}
      <botton onClick={onClick}>방만들기</botton>
      <Modal visible={visible} onClick={onClick}>
        <form onSubmit={makeRoom}>
          <input
            onChange={onChangeRoomName}
            type="text"
            name="roomName"
            placeholder="방 제목을 입력하세요."
          />
          <br></br>

          <button>방만들기</button>
          <button type="reset">취소</button>
        </form>
      </Modal>
    </div>
  );
};

export default RoomList;
