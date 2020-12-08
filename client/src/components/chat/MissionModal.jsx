import React from 'react';
import styled from 'styled-components';
import Modal from '../common/Modal';
import Mission1 from './missions/Mission1';

const MissionModalBlock = styled(Modal)`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 60%;
  height: 50%;
  color: var(--color-green);
`;

const MissionModal = ({ missionVisible, missionId, closeMissionModal }) => {
  return (
    <MissionModalBlock visible={missionVisible}>
      {missionId === 1 && <Mission1 onClose={closeMissionModal} />}
    </MissionModalBlock>
  );
};

export default MissionModal;
