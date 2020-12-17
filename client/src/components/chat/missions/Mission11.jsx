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

// icon 크기
const UserIcon = styled(FaUserAlt)`
  font-size: 2.5rem;
  color: var(--color-green);
`;

const RowBlock = styled.div`
  margin: -0.3rem;
  display: flex;
`;

const MiroRoad = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 5rem;
  height: 5rem;
  border: 0.2rem solid var(--color-dark-green);
  background-color: ${(props) =>
    props.block ? `var(--color-dark-green)` : `var(--color-background)`};
`;

const Key = styled(FaKey)`
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
  const mapRef = useRef(null);

  const [success, setSuccess] = useState(false);
  const [text, setText] = useState('< 길을 따라 열쇠를 찾으세요. >');

  // map 2중 배열 13 * 7
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
  const [locationX, setLocationX] = useState(0);
  const [locationY, setLocationY] = useState(0);

  const handleKeyDown = (e) => {
    const key = e.keyCode;

    switch (key) {
      case 38: // 위
        if (locationY - 1 >= 0 && miro[locationY - 1][locationX] === 0) {
          setLocationY(locationY - 1);
        }
        break;
      case 40: // 아래
        if (locationY + 1 < 7 && miro[locationY + 1][locationX] === 0) {
          setLocationY(locationY + 1);
        }
        break;
      case 39: // 우
        if (locationX + 1 < 13 && miro[locationY][locationX + 1] === 0) {
          setLocationX(locationX + 1);
        }
        break;
      case 37: // 좌
        if (locationX - 1 >= 0 && miro[locationY][locationX - 1] === 0) {
          setLocationX(locationX - 1);
        }
        break;
    }
  };

  useEffect(() => {
    if (locationX === 9 && locationY === 5) {
      setSuccess(true);
    }
  }, [locationX, locationY]);

  useEffect(() => {
    if (success) {
      setSuccess(true);
      setText('열쇠를 찾았습니다. 다음 미션으로 이동하세요. ');
      // dispatch(swtichMission({ prevMissionId: 10, nextMissionId: 11 }));
    }
  }, [success]);

  useEffect(() => {
    mapRef.current.focus();
  }, []);

  return (
    <div
      style={{ outline: 'none' }}
      onKeyDown={handleKeyDown}
      ref={mapRef}
      autofocus
      tabIndex="1"
    >
      <TextBox>
        <Text>{text}</Text>
      </TextBox>
      <MiroBlock success={success}>
        {miro.map((col, colIndex) => {
          return (
            <div>
              <RowBlock>
                {col.map((row, rowIndex) => {
                  // 벽
                  if (row) {
                    return <MiroRoad block />;
                  }

                  // 통로
                  if (!row) {
                    if (rowIndex === locationX && colIndex === locationY) {
                      return (
                        <MiroRoad>
                          <UserIcon />
                        </MiroRoad>
                      );
                    }

                    if (rowIndex === 9 && colIndex === 5) {
                      return (
                        <MiroRoad>
                          <Key success={success} />
                        </MiroRoad>
                      );
                    }
                  }

                  return <MiroRoad />;
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
