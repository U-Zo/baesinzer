import React, { useEffect, useRef, useState } from 'react';
import {
  FaThermometerEmpty,
  FaThermometerQuarter,
  FaThermometerHalf,
  FaThermometerThreeQuarters,
  FaThermometerFull,
} from 'react-icons/fa';
import { FiThermometer } from 'react-icons/fi';
import { AiOutlineAlignRight, AiOutlineCaretLeft } from 'react-icons/ai';
import { BsFiles } from 'react-icons/bs';
import styled from 'styled-components';
import { missionDone } from '../../../modules/user';
import { useDispatch } from 'react-redux';

const CodeBlock = styled.div`
  border: 0.2rem solid var(--color-green);
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 6rem;
  line-height: 3rem;
  font-size: 2.4rem;
  justify-content: space-around;
`;

const RedSpan = styled.span`
  color: var(--color-red);
`;

const ThermometerBlock = styled.div`
  font-size: 20rem;
  border: 0.2rem solid var(--color-green);
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  padding: 3rem;
  width: 55rem;
  line-height: 3rem;
  justify-content: space-around;
  align-items: center;
  #complete {
    font-size: 2rem;
  }
  #measure {
    font-size: 3rem;
  }
`;

const TemperatureLine = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 7rem;
  color: var(--color-red);
  position: absolute;
  left: 21rem;
  top: 17rem;
`;

const ArrowIcon = styled.div`
  position: absolute;
  left: 5.5rem;
  display: flex;
  font-size: 4rem;
  top: ${(props) => props.locationY}rem;
  transform: ${(props) => `translateY(${props.locationY}rem)`};
  :focus {
    outline: none;
  }
  #temperature {
    font-size: 2rem;
  }
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: row;
  list-style: none;
`;

const InputStyled = styled.input`
  width: 6rem;
  height: 3rem;
  color: var(--color-green);
  outline: none;
  padding-left: 1rem;
  background-color: var(--color-background);
  border: 1.5px solid var(--color-background);
  :-webkit-autofill {
    -webkit-text-fill-color: var(--color-green);
  }
  :-webkit-autofill,
  :-webkit-autofill:active {
    transition: background-color 5000s ease-in-out 0s;
  }
  ::placeholder {
    color: var(--color-green);
  }
  :focus {
    ::placeholder {
      color: transparent;
    }
  }
`;
const Mission22 = ({ onClose, username, setMissionDone }) => {
  const [error, setError] = useState(false);
  const [agree, setAgree] = useState(null);
  const [measure, setMeasure] = useState(false);
  const [icon, setIcon] = useState(0);
  const [complete, setComplete] = useState(false);
  const [temperature, setTemperature] = useState(24.5);
  const [locationY, setLocationY] = useState(1.8);

  const iconRef = useRef(null);
  const arrowRef = useRef(null);

  const dispatch = useDispatch();
  //동의 비동의 입력시 값 저장
  const onChange = (e) => {
    setAgree(e.target.value);
  };

  //동의 할때만 온도체크 실행
  const onSubmit = (e) => {
    e.preventDefault();
    if (agree === 'y' || agree === 'Y') {
      setMeasure(true);
      let t = 1;
      //온도계 그림 변경
      iconRef.current = setInterval(() => {
        if (t < 6) {
          setIcon(t);
          t++;
        } else if (t === 6) {
          setIcon(3);
          setComplete(true);
          clearInterval(iconRef);
          t++;
        }
      }, 500);
    } else {
      setError(true);
    }
  };

  //키보드 눌렀을때 온도 체크 화살표 움직임
  const handleKeyDown = (e) => {
    let key = e.keyCode;
    if (temperature !== 36.5) {
      switch (key) {
        case 38: // 위
          if (temperature < 36.5) {
            setLocationY(locationY - 0.75);
            setTemperature(temperature + 4);
          }
          break;
        case 40: // 아래
          if (temperature > 24.5) {
            setLocationY(locationY + 0.75);
            setTemperature(temperature - 4);
          }
          break;
      }
    }
  };

  //키보드 눌러 온도가 36.5가 되면 2초후에 미션완료& 닫기
  useEffect(() => {
    if (temperature === 36.5) {
      dispatch(missionDone(22));
      setMissionDone(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  }, [temperature]);

  return (
    <div>
      {measure ? (
        <ThermometerBlock>
          {icon === 0 ? <FiThermometer /> : null}
          {icon === 1 ? <FaThermometerEmpty /> : null}
          {icon === 2 ? <FaThermometerQuarter /> : null}
          {icon === 3 ? <FaThermometerHalf /> : null}
          {icon === 4 ? <FaThermometerThreeQuarters /> : null}
          {icon === 5 ? <FaThermometerFull /> : null}
          {complete ? (
            <div id="complete">
              온도 측정이 완료.
              <div>키보드를 움직여 정확한</div>
              <div> 온도를 측정해 주세요.</div>
              <TemperatureLine>
                <AiOutlineAlignRight />
                <ArrowIcon
                  temperature={temperature}
                  locationY={locationY}
                  ref={arrowRef}
                  onKeyDown={handleKeyDown}
                  tabIndex="1"
                  autofocus="autofocus"
                >
                  <AiOutlineCaretLeft />
                  <div id="temperature">{temperature}</div>
                </ArrowIcon>
              </TemperatureLine>
              {temperature === 36.5 ? (
                <RedSpan color="green">온도 측정 완료</RedSpan>
              ) : (
                <RedSpan>정상 체온이 아닙니다.</RedSpan>
              )}
            </div>
          ) : (
            <div id="measure">온도를 측정중 입니다.</div>
          )}
        </ThermometerBlock>
      ) : (
        <CodeBlock>
          <p>
            안녕하세요 <RedSpan>{username}</RedSpan>님
          </p>
          <p>체온 측정을 도와 드리겠습니다.</p>
          <StyledForm onSubmit={onSubmit}>
            <div>동의하십니까? </div>
            <div>Y/N</div>
            <InputStyled
              type="text"
              onChange={onChange}
              autoFocus="autoFocus"
            />
          </StyledForm>
          {error ? <RedSpan>동의 없이 진행이 불가능합니다.</RedSpan> : null}
        </CodeBlock>
      )}
    </div>
  );
};

export default Mission22;
