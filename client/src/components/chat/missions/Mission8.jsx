import React, { useEffect, useRef, useState } from 'react';
import { ImQrcode } from 'react-icons/im';
import { useDispatch } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import { missionDone } from '../../../modules/user';

const MissionBlock = styled.div`
  opacity: ${(props) => (props.change ? `20%` : `100%`)};
`;

const TitleBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  font-size: 4rem;
  background-color: #ff9632;
  color: var(--color-background);
  width: 100%;
`;

const Title = styled.div``;

const QrCodeBox = styled.div`
  display: inline;
  float: left;
  width: 20rem;
  height: 20rem;
  flex-direction: row;
`;

const ImQrcodeStyle = styled(ImQrcode)`
  border: 0.2rem solid;
  padding: 1rem;
  width: 100%;
  height: 100%;
  border-color: ${(props) =>
    props.success ? `var(--color-red)` : `var(--color-green)`};
`;

// loading keyframe
const qrCheckLoading = keyframes`
  from{
    transform:rotate(0deg);
  }
  to{
    transform:rotate(360deg);
  }
`;

const Loader = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1rem solid var(--color-background);
  border-top: 1rem solid var(--color-green);
  border-radius: 50%;
  width: 5rem;
  height: 5rem;
  animation: ${qrCheckLoading} 3s steps(10, end);
`;

const TextBox = styled.div`
  font-size: 2.5rem;
  margin-left: 4rem;
  width: 27rem;
  line-height: 3.5rem;
  text-align: right;
`;

const Text = styled.div``;
const QrBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 3rem;
`;

const Square = styled.div`
  position: absolute;
  width: 20rem;
  height: 20rem;
  border: 0.5rem solid var(--color-red);
  transform: translate(21rem, -21rem);
  transform: ${(props) =>
    `translate(${props.locationX}rem,${props.locationY}rem)`};
  &:focus {
    outline: none;
  }
`;

const Mission8 = ({ onClose, username, setMissionDone }) => {
  const dispatch = useDispatch();

  // Mission
  const [success, setSuccess] = useState(false);
  const [texts, setTexts] = useState([
    '빨간 박스를 옮겨',
    'QR 체크를 완료하시오.',
    '(방향키 이용)',
  ]);

  // loading
  const [change, setChange] = useState(false);

  // square 좌표
  const [locationX, setLocationX] = useState(31);
  const [locationY, setLocationY] = useState(-20);

  // square ref
  const arrowRef = useRef(null);

  // 방향키 핸들러
  const handleKeyDown = (e) => {
    let key = e.keyCode;
    switch (key) {
      case 38: // 위
        setLocationY(locationY - 1);
        break;
      case 40: // 아래
        setLocationY(locationY + 1);
        break;
      case 39: // 우
        setLocationX(locationX + 1);
        break;
      case 37: // 좌
        setLocationX(locationX - 1);
        break;
    }
    // 모달창 밖으로 나가면 원위치로
    if (locationX < -8 || locationX > 39) {
      setLocationX(28);
    }
    if (locationY <= -40 || locationY >= -7) {
      setLocationY(-21);
    }
    // qr 인증 박스를 감싸면 success
    if (
      -1 <= locationX &&
      locationX <= 1 &&
      -21 <= locationY &&
      locationY <= -19
    ) {
      setSuccess(true);
      dispatch(missionDone(8));
      setMissionDone(true);
      // qr 인증 후 로딩 애니메이션 띄우기
      setChange(true);
      setTimeout(() => {
        setChange(false);
        setTexts([username + '님', '인증되었습니다.']);
      }, 3000);
    }
  };

  // square focus
  const divFocus = () => {
    arrowRef.current.focus();
  };

  // focus
  useEffect(() => {
    divFocus();
  }, []);

  // 인증 완료 후 2초 뒤에 모달창 down
  useEffect(() => {
    if (success) {
      setTimeout(() => {
        onClose();
      }, 5000);
    }
  }, [success]);

  return (
    <div>
      <MissionBlock change={change}>
        <TitleBox>
          <Title>출석(QR) 체크</Title>
        </TitleBox>

        <QrBlock>
          <QrCodeBox>
            <ImQrcodeStyle />
          </QrCodeBox>
          <TextBox>
            {texts.map((text) => (
              <Text>{text}</Text>
            ))}
          </TextBox>
        </QrBlock>
        {success ? (
          <Square locationX={locationX} locationY={locationY}></Square>
        ) : (
          <Square
            locationX={locationX}
            locationY={locationY}
            onKeyDown={handleKeyDown}
            ref={arrowRef}
            tabIndex="1"
          ></Square>
        )}
      </MissionBlock>
      {change ? <Loader /> : null}
    </div>
  );
};

export default Mission8;
