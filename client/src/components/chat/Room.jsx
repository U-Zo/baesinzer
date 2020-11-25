import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import Modal from '../common/Modal';
const RoomBlock = styled.div`
  background-color: var(--color-background);
  border: 3px solid var(--color-green);
  margin: 0 auto;
  margin-top: 1rem;
  width: 97rem;
  height: 72rem;
`;
const ChatBlock = styled.div`
  width: 58rem;
  height: 56rem;
  margin-left: 3rem;
  margin-top: 5rem;
  background-color: var(--color-background);
  /* border: 0.2rem solid var(--color-green); */
  border: 3px solid var(--color-green);
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  /* scroll-margin-top: 2rem; */

  ::-webkit-scrollbar {
    width: 2rem;
    height: 80%;
  }
  ::-webkit-scrollbar-track {
    background-color: var(--color-background);
  }
  ::-webkit-scrollbar-thumb {
    background: var(--color-dark-green);
  }
  ::-webkit-scrollbar-thumb:hover {
    background: var(--color-green);
  }
  ::-webkit-scrollbar-button {
    display: none;
  }
`;

const InputStyle = styled.input`
  margin-left: 3rem;
  bottom: 0;
  display: inline;
  width: 53rem;
  height: 3.5rem;
  color: var(--color-green);
  background-color: var(--color-background);
  border: 3px solid var(--color-green);

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
const ButtonStyle = styled.button`
  bottom: 0;
  right: 0;
  width: 5rem;
  height: 3.5rem;
  color: var(--color-green);
  background-color: var(--color-background);
  border: 3px solid var(--color-green);
  :focus {
    outline: none;
  }
  :hover {
    font-weight: bold;
  }
`;

const Chat = styled.ul`
  font-size: 1.8rem;
  color: var(--color-green);
  list-style-type: none;
`;

const UserMessage = styled.li`
  margin-left: 0.5rem;
  & + & {
    margin-top: 2.5rem;
  }
`;

const Code = styled.div`
  margin-left: 3rem;
  margin-top: 2rem;
  padding: 0.3rem 1rem;
  display: inline-block;
  font-size: 2rem;
  color: var(--color-green);
  border: 3px solid var(--color-green);
`;

const BaesinzerText = styled.div`
  color: var(--color-green);
  position: relative;
  left: 125%;
  top: -85%;
  transform: translate(-50%, -50%);
  font-size: 3rem;
  &#배신저 {
    color: var(--color-red);
  }
`;

const AllUsersBox = styled.div`
  color: var(--color-green);
  position: relative;
  top: -80%;
  right: 8%;
  background-color: var(--color-background);
  border: 3px solid var(--color-green);
  float: right;
  height: 30rem;
  width: 18rem;
`;

const AllUsers = styled.div`
  padding-top: 2.3rem;
  text-align: center;
  font-size: 2rem;
  /* &#myusername {
    color: var(--color-red);
  } */
  &#color1 {
    color: #fb4d51;
  }
  &#color2 {
    color: #f5fa4e;
  }
  &#color3 {
    color: #00d9ff;
  }
  &#color4 {
    color: #00cc00;
  }
  &#color5 {
    color: #bb00bb;
  }
  &#color6 {
    color: #7a68df;
  }
  & + & {
    margin: 5rem;
  }
`;
const Start = styled.button`
  position: absolute;
  width: 18rem;
  height: 4rem;
  font-size: 3rem;
  left: 50%;
  top: 140%;
  background-color: var(--color-background);
  border: 3px solid var(--color-green);
  color: var(--color-green);
  transform: translate(-50%, -50%);
  :focus {
    outline: none;
  }
  :hover {
    font-weight: bold;
  }
`;
const Exit = styled.button`
  position: absolute;
  width: 18rem;
  height: 4rem;
  font-size: 3rem;
  left: 50%;
  top: 160%;
  background-color: var(--color-background);
  border: 3px solid var(--color-green);
  color: var(--color-green);
  transform: translate(-50%, -50%);
  :focus {
    outline: none;
  }
  :hover {
    font-weight: bold;
  }
`;

const ModalText = styled.div`
  color: var(--color-green);
`;
const ModalButton = styled.button`
  background-color: var(--color-background);
  border: 3px solid var(--color-green);
  color: var(--color-green);
  :focus {
    outline: none;
  }
  :hover {
    font-weight: bold;
  }
`;
// ================================================== //
const Message = React.memo(({ username, message }) => {
  return (
    <UserMessage>
      &lt;{username}&gt;<br></br> {message}
    </UserMessage>
  );
});
const Username = ({ username, userNo }) => {
  return (
    <div>
      {/* {username === mine.username && userNo === mine.userNo ? (
        <AllUsers  id="myusername">{username}</AllUsers>
      ) : (
        <AllUsers>{username}</AllUsers>
      )} */}
      <AllUsers id={'color' + userNo}>{username}</AllUsers>
    </div>
  );
};
const Room = ({
  onSubmit,
  onChange,
  startHandler,
  userInfo,
  message,
  messageLog,
  usersArray,
  exit,
  visible,
  closeModal,
  scrollRef,
  baesinzer,
}) => {
  return (
    <RoomBlock>
      <ChatBlock>
        <Chat ref={scrollRef}>
          {messageLog &&
            messageLog.map((message, index) => (
              <Message
                key={index}
                username={message.username}
                message={message.message}
              />
            ))}
        </Chat>
      </ChatBlock>

      <form onSubmit={onSubmit} autoComplete="off">
        <InputStyle
          type="text"
          name="message"
          onChange={onChange}
          value={message}
          autocomplete="off"
        />
        <ButtonStyle>입력</ButtonStyle>
      </form>
      <Code>코드 : 1234</Code>
      <BaesinzerText id={baesinzer}>Baesinzer</BaesinzerText>
      <AllUsersBox>
        {usersArray &&
          usersArray.map((user, index) => (
            <Username
              key={index}
              username={user.username}
              userNo={user.userNo}
            />
          ))}
        {userInfo.host && <Start onClick={startHandler}>START</Start>}
        <Exit onClick={exit}>EXIT</Exit>
      </AllUsersBox>
      <Modal visible={visible}>
        <ModalText>죽음</ModalText>
        <ModalButton onClick={closeModal}>확인</ModalButton>
      </Modal>
    </RoomBlock>
  );
};

export default Room;
