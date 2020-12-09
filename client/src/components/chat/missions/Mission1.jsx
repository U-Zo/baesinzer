import { useDispatch } from 'react-redux';
import { missionDone } from '../../../modules/user';
import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { IoFastFoodOutline } from 'react-icons/io5';
import { ImPacman } from 'react-icons/im';
import { GiSmokeBomb } from 'react-icons/gi';
const TextBox = styled.div`
  position: absolute;
  left: 50%;
  top: 30%;
  transform: translate(-50%, -50%);
`;
const EatingSuccess = styled.div`
  font-size: 3rem;
  color: var(--color-red);
`;
const Icongraphic = styled.div`
  color: var(--color-green);
`;

const loading = keyframes`
  from{
    width:0%;
  }
  to{
    width:90%;
    }
  `;

const GageBox = styled.div`
  position: absolute;
  left: 50%;
  top: 80%;
  transform: translate(-50%, -50%);
  width: 80%;
  border: 0.1rem solid var(--color-green);
`;

const GageBar = styled.div`
  margin: 0.2rem;
  background-color: var(--color-green);
  height: 1.2rem;
  animation: ${loading} 10s steps(70, end); //마지막부분 재생속도 점점 느리게
`;

const rotatePacman = keyframes`
  from{
    transform:rotate(0deg);
    }
  to{
    transform:rotate(25deg);
    }
`;
const Pacman = styled.div`
  display: inline-block;
  animation: ${rotatePacman} 0.5s steps(10, end);
  animation-iteration-count: 100;
  font-size: 4rem;
`;

const smallerFood = keyframes`
  from{
    opacity:100%;
    /* font-size:10rem; */
  }
  to{
    opacity:0%;
    /* font-size:8rem; */
  } 
  
`;
const Food = styled.div`
  display: inline-block;
  animation: ${smallerFood} 10s ease-in-out;
  opacity: 0%;
  font-size: 8rem;
`;
const End = styled.div`
  display: inline-block;
  position: absolute;
  left: 55%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 5rem;
  color: var(--color-green);
`;
const Mission1 = ({ onClose }) => {
  const dispatch = useDispatch();

  const [text, setText] = useState(null);
  const missionRef = useRef(null);

  const onClick = () => {
    dispatch(missionDone(1));
  };

  const timer = () =>
    setTimeout(function () {
      setText('밥먹기 완료');
      dispatch(missionDone(1));
    }, 10000);

  useEffect(() => {
    missionRef.current = timer();
  }, []);

  useEffect(() => {
    if (text) {
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  }, [text]);

  useEffect(() => {
    return () => {
      clearTimeout(missionRef.current);
    };
  }, []);

  return (
    <div>
      <TextBox>
        <EatingSuccess>{text}</EatingSuccess>
      </TextBox>

      <div>
        <Icongraphic>
          <Pacman>
            <ImPacman />
          </Pacman>
          {text ? null : (
            <Food>
              <IoFastFoodOutline />
            </Food>
          )}
          {text ? <End>♥</End> : null}
        </Icongraphic>
      </div>

      <div>
        <GageBox>
          <GageBar />
        </GageBox>
      </div>
    </div>
  );
};

export default Mission1;
