import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Modal from '../common/Modal';
import { createRoom } from '../../lib/api/rooms';
import styled from 'styled-components';

const Block = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LobbyBlock = styled.div`
  /* position: relative; */
  margin: 0 auto;
  margin-top: 1rem;
  width: 970px;
  height: 720px;
  border: 3px solid var(--color-green);
  /* display: flex; */
  justify-content: center;
  align-items: center;
  background-color: var(--color-background);
`;
const NicknameBox = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 5rem;
`;

const RoomListBox = styled.div`
  margin: 0 auto;
  border: 3px solid var(--color-green);
  width: 50rem;
  height: 40rem;
  margin-top: 3rem;
  overflow-x: hidden;
  overflow-y: auto;
  ::-webkit-scrollbar {
    // 투명 스크롤바
    display: none;
  }
`;

const RoomBox = styled.ul`
  list-style-type: none;
`;

const RoomLi = styled.li`
  margin: 0 auto;
  margin-top: 1.5rem;
  font-size: 3rem;
  text-align: center;
  border: 3px solid var(--color-green);
  height: 4.3rem;
  width: 45rem;
`;

const RoomLink = styled.div`
  li {
    color: var(--color-green);
    text-decoration: none;
    font-size: 2rem;
    cursor: pointer;
  }
`;

const InputNickname = styled.input`
  display: block;
  text-align: center;
  font-size: 2rem;
  background-color: var(--color-background);
  width: 40rem;
  height: 5rem;
  border: 3px solid var(--color-green);
  color: var(--color-green);
  ::placeholder {
    color: var(--color-green);
    font-size: 2em;
  }
  :focus {
    ::placeholder {
      color: transparent;
    }
  }
  :focus {
    outline: none;
  }
`;

const CountSpan = styled.span`
  float: right;
  margin-right: 2rem;
  &#full {
    color: var(--color-red);
  }
`;

const ButtonStyle = styled.button`
  position: relative;
  margin-bottom: 3rem;
  background-color: var(--color-background);
  color: var(--color-green);
  border: 3px solid var(--color-green);
  width: 20rem;
  height: 5rem;
  font-size: 2rem;
  padding: 1rem;
  float: right;
  margin-right: 25rem;
  top: 7rem;
  :focus {
    outline: none;
  }
  :hover {
    font-weight: bold;
  }
`;
const CodeInputStyle = styled.input`
  position: relative;
  text-align: center;
  background-color: var(--color-background);
  color: var(--color-green);
  border: 3px solid var(--color-green);
  width: 20rem;
  height: 5rem;
  /* padding: 1rem; */
  float: left;
  margin-left: 25rem;
  top: 7rem;
  ::placeholder {
    color: var(--color-green);
    font-size: 2em;
  }
  :focus {
    ::placeholder {
      color: transparent;
    }
  }
  :focus {
    outline: none;
  }
`;

const ModalInput = styled.input`
  text-align: center;
  font-size: 2rem;
  background-color: var(--color-background);
  width: 32rem;
  height: 4rem;
  border: 3px solid var(--color-green);
  color: var(--color-green);
  :-webkit-autofill {
    -webkit-text-fill-color: var(--color-green);
  }
  :-webkit-autofill,
  :-webkit-autofill:active {
    transition: background-color 5000s ease-in-out 0s;
  }
  ::placeholder {
    color: var(--color-green);
    font-size: 2rem;
  }
  :focus {
    ::placeholder {
      color: transparent;
    }
  }
  :focus {
    outline: none;
  }
`;
const Buttons = styled.div`
  /* position: absolute; */
  /* left: 20%; */
  margin-top: 4rem;
`;
const MakeRoomButton = styled.button`
  background-color: var(--color-background);
  display: inline-block;
  text-align: center;
  color: var(--color-green);
  border: 2px solid var(--color-green);

  width: 15rem;
  height: 3.5rem;

  :focus {
    outline: none;
  }
  :hover {
    font-weight: bold;
  }
`;

const CancelButton = styled.button`
  background-color: var(--color-background);
  margin-left: 5%;
  text-align: center;
  color: var(--color-green);
  border: 2px solid var(--color-green);
  display: inline-block;
  width: 15rem;
  height: 3.5rem;
  :focus {
    outline: none;
  }
  :hover {
    font-weight: bold;
  }
`;
const ErrorBox = styled.div`
  position: fixed;
  transform: translate(-50%, -50%);
  color: var(--color-red);
  &#닉네임 {
    top: 4%;
    left: 50%;
  }
  &#방제목 {
    top: 19%;
    left: 50%;
  }
`;

const Room = React.memo(({ name, count, onClick }) => {
  console.log(onClick);
  return (
    <RoomLi onClick={onClick}>
      <span>{name}</span>
      {/* 수정 */}
      {count === 6 ? (
        <CountSpan id="full">{count}/6</CountSpan>
      ) : (
        <CountSpan>{count}/6</CountSpan>
      )}
    </RoomLi>
  );
});

const RoomList = ({
  error,
  username,
  loading,
  roomList,
  roomerror,
  changeUsername,
  onClick,
  visible,
  makeRoom,
  onChangeRoomName,
  onJoin,
  type,
}) => {
  if (roomerror) {
    return <div>에러가 발생했습니다.</div>;
  }

  return (
    <Block>
      <LobbyBlock>
        {type === '닉네임' ? <ErrorBox id={type}>{error}</ErrorBox> : null}
        <NicknameBox>
          {username == null ? (
            <InputNickname
              type="text"
              value={username}
              onChange={changeUsername}
              placeholder="NICKNAME"
            />
          ) : (
            <InputNickname
              type="text"
              value={username}
              onChange={changeUsername}
            />
          )}
        </NicknameBox>
        <RoomListBox>
          <RoomBox>
            {!loading &&
              roomList &&
              roomList.map((room) => (
                <RoomLink>
                  <Room
                    onClick={() => onJoin(room.roomCode)}
                    name={room.roomName}
                    count={room.count}
                  />
                </RoomLink>
              ))}
          </RoomBox>
        </RoomListBox>
        {/* modal */}

        <CodeInputStyle type="text" placeholder="CDOE" />
        <ButtonStyle onClick={onClick}>방만들기</ButtonStyle>
        <Modal visible={visible} onClick={onClick}>
          <div>
            <form onSubmit={makeRoom} autoComplete="off">
              {type === '방제목' ? (
                <ErrorBox id={type}>{error}</ErrorBox>
              ) : null}
              <ModalInput
                onChange={onChangeRoomName}
                type="text"
                name="roomName"
                placeholder="방 제목을 입력하세요."
              />
              <br></br>
              <div>
                <Buttons>
                  <MakeRoomButton>방만들기</MakeRoomButton>
                  <CancelButton onClick={onClick}>취소</CancelButton>
                </Buttons>
              </div>
            </form>
          </div>
        </Modal>
      </LobbyBlock>
    </Block>
  );
};

export default RoomList;
