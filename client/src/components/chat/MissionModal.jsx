import React from 'react';
import styled from 'styled-components';
import Modal from '../common/Modal';
import Mission1 from './missions/Mission1';
import Mission2 from './missions/Mission2';

const MissionModalBlock = styled(Modal)`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 70rem;
  height: 50%;
  color: var(--color-green);
`;

const MissionModalCloseButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  border: 0.2rem solid var(--color-green);
  color: var(--color-green);
  background-color: inherit;
  outline: none;
  font-size: 2rem;
  padding: 1rem;
  cursor: pointer;
`;

const MissionModal = ({ missionVisible, missionId, closeMissionModal }) => {
  return (
    <MissionModalBlock visible={missionVisible}>
      {missionId === 1 && <Mission1 onClose={closeMissionModal} />}
      {missionId === 2 && <Mission2 onClose={closeMissionModal} />}
      <MissionModalCloseButton onClick={closeMissionModal}>
        X
      </MissionModalCloseButton>
    </MissionModalBlock>
  );
};

export default MissionModal;
