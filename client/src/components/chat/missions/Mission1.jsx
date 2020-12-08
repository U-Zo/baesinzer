import React from 'react';
import { useDispatch } from 'react-redux';
import { missionDone } from '../../../modules/user';

const Mission1 = ({ onClose }) => {
  const dispatch = useDispatch();

  const onClick = () => {
    dispatch(missionDone(1));
  };

  return (
    <div>
      <button onClick={onClick}>미션완료</button>
      <button onClick={onClose}>닫기</button>
    </div>
  );
};

export default Mission1;
