import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaUserAlt } from 'react-icons/fa';
import { FaKey } from 'react-icons/fa';

const TextBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const Text = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  text-align: center;
  font-size: 2.5rem;
  background-color: #ff9632;
  color: var(--color-background);
  width: 70%;
`;

const MiroBlock = styled.div`
  margin-top: 3rem;
  opacity: ${(props) => (props.success ? `20%` : `100%`)};
  z-index: 1;
`;
// icon 위치 이동
const IconBox = styled.div`
  position: absolute;
  transform: ${(props) =>
    `translate(${props.locationX}rem,${props.locationY}rem)`};
  &:focus {
    outline: none;
  }
  z-index: 2;
`;

// icon 크기
const UserIcon = styled(FaUserAlt)`
  position: absolute;
  font-size: 2.5rem;
  color: var(--color-green);
`;

const RowBlock = styled.div`
  margin: -0.3rem;
`;

const MiroRoad = styled.div`
  position: relative;
  display: inline-block;
  width: 5rem;
  height: 5rem;
  border: 0.2rem solid var(--color-dark-green);
  background-color: ${(props) =>
    props.block ? `var(--color-dark-green)` : `var(--color-background)`};
`;

const Key = styled(FaKey)`
  position: absolute;
  margin: 0.8rem;
  font-size: 3rem;
  color: ${(props) =>
    props.success ? `var(--color-background)` : `var(--color-user2)`};
`;

const PopUp = styled(FaKey)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 22rem;
  color: var(--color-user2);
`;

const Mission11 = () => {
  // user ref
  const iconRef = useRef(null);
  const currentRef = useRef(null);

  const [success, setSuccess] = useState(false);
  const [text, setText] = useState('< 길을 따라 열쇠를 찾으세요. >');
  const [move, setMove] = useState(false);

  // map 2중 배열 10*7
  const [miro, setMiro] = useState([
    [0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0],
    [1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0],
    [0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
  ]);

  // 유저 아이콘 좌표설정 및 초기 위치 설정
  const [locationX, setLocationX] = useState(1);
  const [locationY, setLocationY] = useState(6);

  const handleKeyDown = (e) => {
    console.log('x=', locationX, 'y=', locationY);
    let key = e.keyCode;
    switch (key) {
      case 38: // 위
        setLocationY(locationY - 5);
        // console.log(e.getBoundingClientRect().top);
        break;
      case 40: // 아래
        setLocationY(locationY + 5);
        break;
      case 39: // 우
        setLocationX(locationX + 5);
        break;
      case 37: // 좌
        setLocationX(locationX - 5);
        break;
    }
  };

  // user icon focus
  const iconFocus = () => {
    iconRef.current.focus();
  };

  const cantGo = () => {
    // 미로 내 벽 제어
    // if (
    //   // (locationX === 6 && locationY === 1) ||
    //   // (locationX === 16 && locationY === 6) ||
    //   // (locationX === 1 && locationY === 11) ||
    //   // (locationX === 6 && locationY === 1) ||
    //   // (locationX === 21 && locationY === 6) ||
    //   // (locationX === 26 && locationY === 6) ||
    //   // (locationX === 6 && locationY === 11) ||
    //   // (locationX === 16 && locationY === 11) ||
    //   // (locationX === 6 && locationY === 1) ||
    //   // (locationX === 31 && locationY === 11) ||
    //   // (locationX === 6 && locationY === 16) ||
    //   // (locationX === 16 && locationY === 16) ||
    //   // (locationX === 21 && locationY === 16) ||
    //   // (locationX === 31 && locationY === 16) ||
    //   // (locationX === 6 && locationY === 21) ||
    //   // (locationX === 21 && locationY === 26) ||
    //   // (locationX === 26 && locationY === 26) ||
    //   // (locationX === 31 && locationY === 26) ||
    //   // (locationX === 41 && locationY === 1) ||
    //   // (locationX === 51 && locationY === 6) ||
    //   // (locationX === 41 && locationY === 6) ||
    //   // (locationX === 56 && locationY === 11) ||
    //   // (locationX === 41 && locationY === 16) ||
    //   // (locationX === 41 && locationY === 21) ||
    //   // (locationX === 46 && locationY === 21) ||
    //   // (locationX === 31 && locationY === 26) ||
    //   // (locationX === 41 && locationY === 26) ||
    //   // (locationX === 31 && locationY === 26) ||
    //   // (locationX === 16 && locationY === 26) ||
    //   // (locationX === 6 && locationY === 31) ||
    //   // (locationX === 46 && locationY === 31) ||
    //   // (locationX === 51 && locationY === 31) ||
    //   // (locationX === 56 && locationY === 31) ||
    //   // (locationX === 61 && locationY === 31) ||
    //   // (locationX === 61 && locationY === 1) ||
    //   // (locationX === 46 && locationY === 16) ||
    //   // (locationX === 51 && locationY === 16) ||
    //   // (locationX === 56 && locationY === 16) ||
    //   // (locationX === 56 && locationY === 21)
    // ) {
    //   setLocationX(1);
    //   setLocationY(1);
    // }
    // 미로 밖 제어
    if (locationX <= -4 || locationX >= 66) {
      if (locationX <= -4) {
        setLocationX(locationX + 5);
      } else {
        setLocationX(locationX - 5);
      }
    } else if (locationY <= 5 || locationY >= 37) {
      if (locationY <= 5) {
        setLocationY(locationY + 5);
      } else {
        setLocationY(locationY - 5);
      }
    }
  };

  const missionSuccess = () => {
    if (locationX === 51 && locationY === 26) {
      console.log('success');
      setSuccess(true);
      setText('열쇠를 찾았습니다. 다음 미션으로 이동하세요. ');
      // dispatch(swtichMission({ prevMissionId: 10, nextMissionId: 11 }));
    }
  };

  // focus
  useEffect(() => {
    iconFocus();
  }, []);

  // user이동관련
  useEffect(() => {
    //벽 만나면 다시 처음위치로
    cantGo();
    setMove(true);
    setMove(false);
    // 키 위치에 올 시 성공
    missionSuccess();
  }, [locationX, locationY]);

  return (
    <div>
      <IconBox
        locationX={locationX}
        locationY={locationY}
        onKeyDown={handleKeyDown}
        ref={iconRef}
        tabIndex="1"
      >
        <UserIcon />
      </IconBox>
      <TextBox>
        <Text>{text}</Text>
      </TextBox>
      <MiroBlock success={success}>
        {miro.map((row, rowindex) => {
          return (
            <div>
              <RowBlock>
                {row &&
                  row.map((col, colindex) => {
                    // 벽
                    // console.log(rowindex, colindex);

                    if (col === 1) {
                      return <MiroRoad block></MiroRoad>;
                    }
                    // 키
                    else if (rowindex === 4 && colindex === 10) {
                      return (
                        <MiroRoad>
                          <Key success={success} />
                        </MiroRoad>
                      );
                    }
                    // 유저 아이콘
                    else if (rowindex === 0 && colindex === 0) {
                      return (
                        <MiroRoad>
                          {/* <IconBox
                          locationX={locationX}
                          locationY={locationY}
                          onKeyDown={handleKeyDown}
                          ref={iconRef}
                          tabIndex="1"
                        >
                          <UserIcon />
                        </IconBox> */}
                        </MiroRoad>
                      );
                    }
                    // 경로
                    else {
                      return <MiroRoad>{}</MiroRoad>;
                    }
                  })}
              </RowBlock>
            </div>
          );
        })}
      </MiroBlock>
      {success ? (
        <PopUp>
          <Key />
        </PopUp>
      ) : null}
    </div>
  );
};

export default Mission11;
