import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import { missionDone } from '../../../modules/user';
import Modal from '../../common/Modal';
import { GrGamepad } from 'react-icons/gr';
import { IoGameControllerOutline } from 'react-icons/io5';

const MissionBlock = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  #bold {
    font-weight: bold;
  }
`;

const Title = styled.div`
  display: flex;
  flex-direction: row;
  margin: 2rem;
  justify-content: center;
  font-size: 4rem;
`;

const SubTitle = styled.div`
  color: var(--color-red);
  display: flex;
  flex-direction: row;
  justify-content: center;
  font-size: 2rem;
`;

const SuccessModal = styled(Modal)`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 2rem;
  width: auto;
  height: auto;
  padding: 2rem;
`;

const SpaceBar = styled.div`
  width: 25rem;
  height: 4rem;
  padding: 0.5rem;
  font-size: 2rem;
  text-align: center;
  color: var(--color-green);
  font-weight: ${(props) => (props.twinkle ? `bold` : `null`)};
  border: 0.5rem solid;
  border-color: ${(props) =>
    props.twinkle ? `var(--color-green)` : `var(--color-dark-green)`};
`;

const SpacebarBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin: 5rem;
  &:focus {
    outline: none;
  }
`;

const GageBlock = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: 5rem;
  width: 58rem;
  height: 4rem;
`;

const GageBox = styled.div`
  width: 100%;
  height: 100%;
  /* padding-right: 0.4rem; */
  border: ${(props) =>
    props.success
      ? `0.3rem solid var(--color-red)`
      : `0.3rem dashed var(--color-green)`};
`;
const GageBar = styled.div`
  border: 1.5rem solid var(--color-dark-green);
  background-color: var(--color-dark-green);
  margin: 0.3rem;
  width: ${(props) => `${props.count * 5.2 - 10}%`};
`;

const Mission7 = ({ onClose, setMissionDone }) => {
  // div focus
  const missionRef = useRef();

  // mission complete
  const [success, setSuccess] = useState(null);

  // spacebar count
  const [count, setCount] = useState(2);

  // spacebar handle
  const [twinkle, setTwinkle] = useState(false);

  // game console change
  const [change, setChange] = useState(false);

  const dispatch = useDispatch();

  // user가 스페이스바 혹은 엔터를 10회 칠 경우 미션 성공
  const handleKeyDown = () => {
    setTwinkle(false);
    setCount(count + 1);
    if (count >= 20) {
      setSuccess(true);
      dispatch(missionDone(7));
      setMissionDone(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } else if (count < 20) {
      setSuccess(false);
    }
  };

  const handleKeyUp = () => {
    setTwinkle(true);
  };

  // onKeyPress를 먹는 div에 항상 focus될 수 있도록
  const divFocus = () => {
    missionRef.current.focus();
  };
  useEffect(() => {
    divFocus();

    //확인
    let t = 10;
    setInterval(() => {
      t--;
      if (t % 2 === 0) {
        setChange(false);
      } else {
        setChange(true);
      }
    }, 500);
  }, []);

  return (
    <MissionBlock>
      <Title>
        {change ? (
          <IoGameControllerOutline />
        ) : (
          <IoGameControllerOutline
            style={{ color: 'var(--color-dark-green)' }}
          />
        )}
        &nbsp;Mini Game&nbsp;
        {!change ? (
          <IoGameControllerOutline />
        ) : (
          <IoGameControllerOutline
            style={{ color: 'var(--color-dark-green)' }}
          />
        )}
      </Title>
      <SubTitle>&lt;스페이스바를 눌러 게이지를 채우세요.&gt;</SubTitle>

      <GageBlock>
        <GageBox success={success}>
          <GageBar count={count} />
        </GageBox>
      </GageBlock>
      <div>
        {success ? (
          <SpacebarBox>
            <SpaceBar>SPACE&nbsp; BAR</SpaceBar>
          </SpacebarBox>
        ) : (
          <SpacebarBox
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            ref={missionRef}
            tabIndex="1"
          >
            {twinkle ? (
              <SpaceBar>SPACE&nbsp;BAR</SpaceBar>
            ) : (
              <SpaceBar twinkle>SPACE&nbsp;BAR</SpaceBar>
            )}
          </SpacebarBox>
        )}
      </div>
      {success && <SuccessModal visible={success}>미니게임 완료</SuccessModal>}
    </MissionBlock>
  );
};

export default Mission7;
