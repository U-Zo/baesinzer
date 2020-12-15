import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { AiFillLock } from 'react-icons/ai';
import { FaKey } from 'react-icons/fa';
import { GiDoorHandle, GiBookshelf } from 'react-icons/gi';
import { useDispatch } from 'react-redux';
import { missionDone } from '../../../modules/user';
import Modal from '../../common/Modal';

const MissionBlock = styled.div`
  width: 100%;
  display: flex;
  flex-grow: 1;
  padding: 2rem;
  justify-content: space-around;
  position: relative;
`;

const MessageBox = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
`;

const Key = styled.div`
  position: absolute;
  font-size: 3rem;
  color: var(--color-user2);
  transform: ${(props) =>
    `translate(${props.locationX}rem,${props.locationY}rem)`};

  &:focus {
    outline: none;
  }
`;

const LockerBlock = styled.div`
  display: flex;
  width: 30rem;
  height: 100%;
  border: 0.4rem solid var(--color-green);
  align-items: center;
  font-size: 5rem;
  overflow: hidden;
`;

const Locker = styled.div`
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
`;

const DoorBlock = styled.div`
  transform: ${(props) => `translateX(${props.locationDoor}rem)`};
  height: 100%;
  display: flex;
  align-items: center;
  border-left: 2px solid var(--color-dark-green);
  width: 100%;
  z-index: 10;
  background-color: black;

  &:focus {
    outline: none;
  }
`;

const Books = styled.div`
  position: absolute;
  font-size: 20rem;
  border-bottom: 2px solid;
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

const Mission12 = ({ onClose }) => {
  const [locationX, setLocationX] = useState(3);
  const [locationY, setLocationY] = useState(1);
  const [locationDoor, setLocationDoor] = useState(1);
  const [message, setMessage] = useState('방향키로 열쇠를 자물쇠로 옮기세요.');
  const [docking, setDocking] = useState(false);
  const [success, setSuccess] = useState(false);
  const keyRef = useRef(null);
  const doorRef = useRef(null);

  const dispatch = useDispatch();

  const onKeyDown = (e) => {
    switch (e.keyCode) {
      case 38: // 위
        if (locationY - 1 > 0) {
          setLocationY(locationY - 1);
        }
        break;
      case 40: // 아래
        if (locationY + 1 < 38) {
          setLocationY(locationY + 1);
        }
        break;
      case 39: // 우
        if (locationX + 1 < 29) {
          setLocationX(locationX + 1);
        }
        break;
      case 37: // 좌
        if (locationX - 1 > 2) {
          setLocationX(locationX - 1);
        }
        break;
    }
  };

  const onOpenDoor = (e) => {
    if (e.keyCode === 39) {
      if (locationDoor + 1 > 28) {
        dispatch(missionDone(12));
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setLocationDoor(locationDoor + 1);
      }
    }
  };

  useEffect(() => {
    keyRef.current.focus();
  }, []);

  useEffect(() => {
    if (locationX === 3 && locationY === 19) {
      setDocking(true);
      setMessage('오른쪽 방향키를 눌러 문을 여세요.');
    }
  }, [locationX, locationY]);

  useEffect(() => {
    if (docking) {
      doorRef.current.focus();
    }
  }, [docking]);

  return (
    <>
      <MissionBlock>
        {!docking && (
          <Key
            ref={keyRef}
            onKeyDown={onKeyDown}
            locationX={locationX}
            locationY={locationY}
            tabIndex="1"
          >
            <FaKey />
          </Key>
        )}
        <MessageBox>{message}</MessageBox>
        <LockerBlock>
          {!docking ? (
            <AiFillLock />
          ) : (
            <Locker>
              <Books>
                <GiBookshelf />
              </Books>
              <DoorBlock
                ref={doorRef}
                onKeyDown={onOpenDoor}
                locationDoor={locationDoor}
                tabIndex="1"
              >
                <GiDoorHandle />
              </DoorBlock>
            </Locker>
          )}
        </LockerBlock>
      </MissionBlock>
      {success && (
        <SuccessModal visible={success}>사물함 열기 완료</SuccessModal>
      )}
    </>
  );
};

export default Mission12;
