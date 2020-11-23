import React from 'react';
import styled from 'styled-components';
function myFunction() {
  var elmnt = document.getElementById('myDIV');
  var y = elmnt.scrollHeight;
  elmnt.scrollTop = y;
}
const RoomBlock = styled.div`
  background-color: var(--color-background);
  border: 0.2rem solid var(--color-green);
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
  position: fixed;
  left: 64%;
  top: 6%;
  font-size: 3rem;
`;

const AllUsersBox = styled.div`
  color: var(--color-green);
  position: relative;
  top: -70%;
  right: 8%;
  background-color: var(--color-background);
  border: 3px solid var(--color-green);
  float: right;
  height: 30rem;
  width: 18rem;
`;
const AllUsers = styled.div`
  color: var(--color-green);
  padding-top: 1rem;
  text-align: center;
  font-size: 1.5rem;
  &#myusername {
    color: var(--color-red);
  }
  & + & {
    margin: 3rem;
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
`;
// ================================================== //
const Message = React.memo(({ username, message }) => {
  return (
    <UserMessage>
      &lt;{username}&gt;<br></br> {message}
    </UserMessage>
  );
});
const Username = ({ username, userNo, mine }) => {
  return (
    <div>
      {username === mine.username && userNo === mine.userNo ? (
        <AllUsers id="myusername">{username}</AllUsers>
      ) : (
        <AllUsers>{username}</AllUsers>
      )}
    </div>
  );
};
const Room = ({
  onSubmit,
  onChange,
  startHandler,
  username,
  userInfo,
  message,
  messageLog,
  usersArray,
  exit,
}) => {
  return (
    <RoomBlock>
      <ChatBlock>
        <Chat>
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

      <form onSubmit={onSubmit}>
        <InputStyle
          type="text"
          name="message"
          onChange={onChange}
          value={message}
        />
        <ButtonStyle>입력</ButtonStyle>
      </form>
      <Code>코드 : 1234</Code>
      <BaesinzerText>Baesinzer</BaesinzerText>
      <AllUsersBox>
        {usersArray &&
          usersArray.map((user, index) => (
            <Username
              key={index}
              username={user.username}
              userNo={user.userNo}
              mine={userInfo}
            />
          ))}
        {userInfo.host && <Start onClick={startHandler}>START</Start>}
        <Exit onClick={exit}>EXIT</Exit>
      </AllUsersBox>
    </RoomBlock>
  );
};

export default Room;
