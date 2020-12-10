import React, { useRef, useEffect } from 'react';
import styled, { css } from 'styled-components';
import map from '../../lib/map';
import user from '../../modules/user';
import Modal from '../common/Modal';

const Block = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const RoomBlock = styled.div`
  position: relative;
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
  display: flex;
  flex-direction: column;
`;

const ContentBlock = styled.div`
  height: 11rem;
  border-bottom: 0.2rem solid var(--color-green);
`;

const VoteTimeBlock = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  padding: 1rem;
  font-size: 2rem;
  color: var(--color-green);
`;

const WorkBoard = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  padding: 1rem;
  color: var(--color-green);
  flex-wrap: wrap;
  align-items: baseline;
  flex-direction: column;
`;

const WorkBoardLeft = styled.div``;

const WorkBoardRight = styled.div`
  border-left: 0.2rem solid var(--color-green);
  height: 100%;
  padding: 1rem;
`;

const InputStyle = styled.input`
  margin-left: 3rem;
  padding-left: 1rem;
  bottom: 0;
  display: inline;
  width: 53rem;
  height: 4rem;
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
  height: 4rem;
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
  padding: 1rem;
  overflow-y: scroll;
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

const UserMessage = styled.li`
  & + & {
    margin-top: 1.5rem;
  }

  .userName {
    ${({ userNo }) => {
      if (userNo === 1) {
        return css`
          color: var(--color-user1);
        `;
      } else if (userNo === 2) {
        return css`
          color: var(--color-user2);
        `;
      } else if (userNo === 3) {
        return css`
          color: var(--color-user3);
        `;
      } else if (userNo === 4) {
        return css`
          color: var(--color-user4);
        `;
      } else if (userNo === 5) {
        return css`
          color: var(--color-user5);
        `;
      } else if (userNo === 6) {
        return css`
          color: var(--color-user6);
        `;
      }
    }}
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
  position: relative;
  left: 126%;
  top: -85%;
  transform: translate(-50%, -50%);
  font-size: 3rem;
  color: ${(props) =>
    props.baesinzer ? 'var(--color-red)' : 'var(--color-green)'};
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
  padding-top: 2rem;
  text-align: center;
  font-size: 2.5rem;
  letter-spacing: 0.3rem;
  &#dead1 {
    color: var(--color-user1);
    text-decoration: line-through;
  }
  &#dead2 {
    color: var(--color-user2);
    text-decoration: line-through;
  }
  &#dead3 {
    color: var(--color-user3);
    text-decoration: line-through;
  }
  &#dead4 {
    color: var(--color-user4);
    text-decoration: line-through;
  }
  &#dead5 {
    color: var(--color-user5);
    text-decoration: line-through;
  }
  &#dead6 {
    color: var(--color-user6);
    text-decoration: line-through;
  }
  &#user1 {
    color: var(--color-user1);
  }
  &#user2 {
    color: var(--color-user2);
  }
  &#user3 {
    color: var(--color-user3);
  }
  &#user4 {
    color: var(--color-user4);
  }
  &#user5 {
    color: var(--color-user5);
  }
  &#user6 {
    color: var(--color-user6);
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
  top: 158.5%;
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

const NewModal = styled(Modal)`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const ModalText = styled.div`
  font-size: 2.3rem;
  color: var(--color-green);
`;

const ModalButton = styled.button`
  margin-top: 5rem;
  width: 18rem;
  height: 4rem;
  font-size: 3rem;
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

const Message = React.memo(({ userInfo, message }) => {
  return (
    <UserMessage userNo={userInfo.userNo}>
      <div className="userName">&lt;{userInfo.username}&gt;</div>
      <div>{message}</div>
    </UserMessage>
  );
});

const Username = ({ username, userNo, dead }) => {
  return (
    <div>
      {dead ? (
        <AllUsers id={'dead' + userNo}>{username}</AllUsers>
      ) : (
        <AllUsers id={'user' + userNo}>
          {userNo}.{username}
        </AllUsers>
      )}
    </div>
  );
};

const MissionBlock = styled.div`
  & + & {
    margin-top: 0.5rem;
  }

  ${(props) =>
    props.done &&
    css`
      text-decoration: line-through;
    `}
`;

const Mission = ({ locationId, missionName, done }) => {
  return (
    <MissionBlock done={done}>
      {map[locationId - 1]}: {missionName}
    </MissionBlock>
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
  killedby,
  start,
  meeting,
  voteTime,
  missionList,
  movePossible,
  moveTime,
  killPossible,
  killTime,
}) => {
  return (
    <Block>
      <RoomBlock>
        <ChatBlock>
          {start && (
            <ContentBlock>
              {meeting ? (
                <VoteTimeBlock>투표 남은 시간: {voteTime}</VoteTimeBlock>
              ) : (
                missionList && (
                  <WorkBoard>
                    <WorkBoardLeft>
                      <MissionBlock>
                        {userInfo && userInfo.baesinzer
                          ? '가짜 임무'
                          : '오늘 할 일'}
                      </MissionBlock>
                      {missionList.map((mission) => (
                        <Mission
                          locationId={mission.locationId}
                          missionName={mission.missionName}
                          done={mission.done}
                        />
                      ))}
                    </WorkBoardLeft>
                    <WorkBoardRight>
                      <div>쿨타임</div>
                      <div>이동: {movePossible ? 'Ready' : `${moveTime}s`}</div>
                      {userInfo && userInfo.baesinzer && (
                        <div>
                          살해: {killPossible ? 'Ready' : `${killTime}s`}
                        </div>
                      )}
                    </WorkBoardRight>
                  </WorkBoard>
                )
              )}
            </ContentBlock>
          )}
          <Chat>
            {messageLog &&
              messageLog.map((message, index) => (
                <Message
                  key={index}
                  userInfo={message.userInfo}
                  message={message.message}
                />
              ))}
            <div ref={scrollRef}></div>
          </Chat>
        </ChatBlock>

        <form onSubmit={onSubmit} autoComplete="off">
          <InputStyle
            type="text"
            name="message"
            onChange={onChange}
            value={message}
            autocomplete="off"
            maxLength="30"
            autoFocus
          />
          <ButtonStyle>입력</ButtonStyle>
        </form>
        <Code>코드 : 1234</Code>
        {userInfo && userInfo.baesinzer ? (
          <BaesinzerText baesinzer>Baesinzer</BaesinzerText>
        ) : (
          <BaesinzerText>Baesinzer</BaesinzerText>
        )}
        <AllUsersBox>
          {usersArray &&
            usersArray.map(
              (user, index) =>
                user.locationId === userInfo.locationId && (
                  <Username
                    key={index}
                    username={user.username}
                    userNo={user.userNo}
                    dead={user.dead}
                  />
                )
            )}
          {userInfo && userInfo.host && (
            <Start onClick={startHandler}>START</Start>
          )}
          <Exit onClick={exit}>EXIT</Exit>
        </AllUsersBox>
        <NewModal visible={visible}>
          <ModalText>윽.. [ {killedby} ].. 널 믿었는데.. </ModalText>
          <ModalButton onClick={closeModal}>CLOSE</ModalButton>
        </NewModal>
      </RoomBlock>
    </Block>
  );
};

export default Room;
