import React, { useRef, useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaUserAlt } from 'react-icons/fa';
import { FaKey } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { swtichMission } from '../../../modules/user';
import miros from '../../../lib/miros';
import Modal from '../../common/Modal';

const TextBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  text-align: center;
  font-size: 2.5rem;
  width: 100%;
`;

const Text = styled.div`
  background-color: #ff9632;
  color: var(--color-background);
  /* width: 70%; */
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

const Mission11 = ({ onClose, setMissionDone }) => {
  const mapRef = useRef(null);

  const [success, setSuccess] = useState(false);
  const [texts, setTexts] = useState(['< 길을 따라 열쇠를 찾으세요. >']);

  const dispatch = useDispatch();

  // 미로 랜덤 선택 관련 index 0~3
  const [index, setIndex] = useState(Math.floor(Math.random() * 4));

  const randomChoiceMiro = miros[index];

  // map 2중 배열 13 * 7
  const [miro, setMiro] = useState(randomChoiceMiro);

  // 유저 아이콘 좌표설정 및 초기 위치 설정
  const [locationX, setLocationX] = useState(0);
  const [locationY, setLocationY] = useState(0);

  const handleKeyDown = (e) => {
    const key = e.keyCode;

    // 성공시 방향키 제어 x
    if (!success) {
      switch (key) {
        case 38: // 위
          if (locationY - 1 >= 0) {
            if (miro[locationY - 1][locationX] === 0) {
              setLocationY(locationY - 1);
            } else if (miro[locationY - 1][locationX] === 1) {
              setLocationX(0);
              setLocationY(0);
            }
          }
          break;
        case 40: // 아래
          if (locationY + 1 < 7) {
            if (miro[locationY + 1][locationX] === 0) {
              setLocationY(locationY + 1);
            } else if (miro[locationY + 1][locationX] === 1) {
              setLocationX(0);
              setLocationY(0);
            }
          }
          break;
        case 39: // 우
          if (locationX + 1 < 13) {
            if (miro[locationY][locationX + 1] === 0) {
              setLocationX(locationX + 1);
            } else if (miro[locationY][locationX + 1] === 1) {
              setLocationX(0);
              setLocationY(0);
            }
          }
          break;
        case 37: // 좌
          if (locationX - 1 >= 0) {
            if (miro[locationY][locationX - 1] === 0) {
              setLocationX(locationX - 1);
            } else if (miro[locationY][locationX - 1] === 1) {
              setLocationX(0);
              setLocationY(0);
            }
          }
          break;
      }
    }
  };

  useEffect(() => {
    if (index === 0) {
      if (locationX === 9 && locationY === 5) {
        setSuccess(true);
      }
    } else if (index === 1) {
      if (locationX === 11 && locationY === 0) {
        setSuccess(true);
      }
    } else if (index === 2 || index === 3) {
      if (locationX === 12 && locationY === 6) {
        setSuccess(true);
      }
    }
  }, [locationX, locationY]);

  useEffect(() => {
    if (success) {
      setMissionDone(true);
      dispatch(swtichMission({ prevMissionId: 11, nextMissionId: 12 }));
      setTexts(['< 열쇠를 찾았습니다.　', ' 다음 미션으로 이동하세요. >']); // 배열로 바꾸기
      setTimeout(() => {
        onClose();
      }, 2000);
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
      tabIndex="1"
    >
      <TextBox>
        {texts.map((text) => (
          <Text>{text}</Text>
        ))}
      </TextBox>
      <MiroBlock success={success}>
        {miro &&
          miro.map((col, colIndex) => {
            return (
              <div>
                <RowBlock>
                  {col &&
                    col.map((row, rowIndex) => {
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

                        if (index === 0) {
                          if (rowIndex === 9 && colIndex === 5) {
                            return (
                              <MiroRoad>
                                <Key success={success} />
                              </MiroRoad>
                            );
                          }
                        } else if (index === 1) {
                          if (rowIndex === 11 && colIndex === 0) {
                            return (
                              <MiroRoad>
                                <Key success={success} />
                              </MiroRoad>
                            );
                          }
                        } else if (index === 2 || index === 3) {
                          if (rowIndex === 12 && colIndex === 6) {
                            return (
                              <MiroRoad>
                                <Key success={success} />
                              </MiroRoad>
                            );
                          }
                        }
                      }

                      return <MiroRoad />;
                    })}
                </RowBlock>
              </div>
            );
          })}
      </MiroBlock>
      {success && <SuccessModal visible={success}>열쇠 찾기 완료</SuccessModal>}
    </div>
  );
};

export default Mission11;
