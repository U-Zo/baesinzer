import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { missionDone } from '../../../modules/user';
import styled, { css, keyframes } from 'styled-components';
import { ImFloppyDisk } from 'react-icons/im';

const MissionBlock = styled.div`
  display: flex;
  flex-direction: row;
  margin: 2rem;
  justify-content: center;
`;
const MissionInfo = styled.div`
  font-size: 4rem;
  color: var(--color-green);
`;
const MissionClear = styled.div`
  font-size: 4rem;
  color: var(--color-red);
  position: absolute;
  text-align: center;
  width: 45rem;
`;
const rotatePacman = keyframes`
  from{
    transform:rotate(0deg);
    }
  to{
    transform:rotate(20deg);
    }
`;
const ImFloppyDiskStyle = styled(ImFloppyDisk)`
  font-size: 5rem;
  margin-left: 1rem;
  &#start {
    display: inline-block;
    animation: ${rotatePacman} 1s ease infinite;
    /* animation: 1s move steps(1, start) infinite; */
    animation-iteration-count: 6;
  }
`;
const MissionGauge = styled.div`
  width: 25rem;
  height: 5rem;
  border: 1px var(--color-green) solid;
  background: linear-gradient(to right, var(--color-green), var(--color-green));
  background-repeat: no-repeat;
  background-size: 0 100%;
  transition: background-size 5s 0s;
  &#start {
    background-size: 100% 100%;
    text-align: center;
  }
`;
const Mission4 = ({ onClose }) => {
  const dispatch = useDispatch();
  const [start, setStart] = useState('');
  const [complete, setComplete] = useState();

  const missionRef = useRef(null);

  setTimeout(() => {
    setStart('start');
  }, 0);

  const timer = () =>
    setTimeout(function () {
      setComplete('파일 다운로드 완료');
      dispatch(missionDone(4));
    }, 6000);
  useEffect(() => {
    missionRef.current = timer();
  }, []);

  useEffect(() => {
    if (complete) {
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  }, [complete]);

  useEffect(() => {
    return () => {
      clearTimeout(missionRef.current);
    };
  }, []);

  return (
    <div>
      {/* <SweepStyle type="submit" value="Send Request" class="sweep"></SweepStyle> */}
      <MissionInfo>Please download data.</MissionInfo>
      <MissionBlock>
        <MissionGauge id={start} />
        <ImFloppyDiskStyle id={start} />
      </MissionBlock>
      <MissionClear id={start}>{complete}</MissionClear>
    </div>
  );
};

export default Mission4;
