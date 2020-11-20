import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
const RoomBlock = styled.div`
  background-color: black;
  border: 0.2rem solid var(--color--green);
  width: 970px;
  height: 720px;
  margin: 0 auto;
`;

const MessageLogs = styled.div`
  position: relative;
  display: flex;
  bottom: 0;
`;
const InputStyle = styled.input`
  width: 100%;
`;

const Chat = styled.ul`
  font-size: 1.5rem;
  color: var(--color-green);
`;
const Message = React.memo(({ username, message }) => {
  return (
    <li>
      {username}: {message}
    </li>
  );
});

const Room = ({ onSubmit, onChange, username, message, messageLog, exit }) => {
  return (
    <div>
      <div>
        <Chat>
          {messageLog &&
            messageLog.map((message) => (
              <Message username={message.username} message={message.message} />
            ))}
        </Chat>
      </div>
      <form onSubmit={onSubmit}>
        <input type="text" name="message" onChange={onChange} value={message} />
        <button>보내기</button>
      </form>
      <button>START</button>
      <button onClick={exit}>EXIT</button>
    </div>
  );
};

export default Room;
