import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled, { css } from 'styled-components';
import { swtichMission } from '../../../modules/user';
import Modal from '../../common/Modal';

const MissionBlock = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const CodeBlock = styled.div`
  border: 0.2rem solid var(--color-green);
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  font-size: 1.8rem;
`;

const inputStyle = css`
  border: none;
  color: var(--color-green);
  background-color: inherit;
  outline: none;
  font-size: 1.8rem;
`;

const StyledInput = styled.input`
  flex-grow: 1;
  ${inputStyle}
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

const loadingArr = ['|', '/', '-', '\\'];

const Mission10 = ({ onClose, setMissionDone }) => {
  const [command, setCommand] = useState('');
  const [success, setSuccess] = useState(false);
  const [consoleLog, setConsoleLog] = useState([
    'BaesinZer Terminal [Version 10.0.18363.1198]',
    '(c) 2020 BaesinZer. All rights reserved.',
    '----------- command',
    'query [item]: 해당 물건이 어디있는지 검색합니다. ex) query key',
  ]);

  const dispatch = useDispatch();

  const onChange = (e) => {
    const { value } = e.target;
    setCommand(value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setConsoleLog(consoleLog.concat(`> ${command}`));
    const operationArr = command.split(' ');
    if (operationArr[0] !== 'query') {
      setConsoleLog(consoleLog.concat(`> ${command}: Unknown command`));
    } else if (operationArr[1] === 'key') {
      let i = 0;
      const interval = setInterval(() => {
        if (i < 80) {
          i++;
          setConsoleLog(
            consoleLog.concat(`querying data... ${loadingArr[i % 4]}`)
          );
        } else {
          console.log(i);
          setConsoleLog(
            consoleLog.concat('item: key, location: bathroom, locationId: 3')
          );
          clearInterval(interval);
          setSuccess(true);
          dispatch(swtichMission({ prevMissionId: 10, nextMissionId: 11 }));
          setMissionDone(true);
          setTimeout(() => {
            onClose();
          }, 2000);
        }
      }, 125);
    } else {
      setConsoleLog(consoleLog.concat(`> ${command}: Unknown item`));
    }
    setCommand('');
  };

  useEffect(() => {
    return () => {
      window.clearInterval();
    };
  }, []);

  return (
    <>
      <MissionBlock>
        <CodeBlock>
          <div>
            {consoleLog.map((message) => (
              <div>{message}</div>
            ))}
          </div>
          <form onSubmit={onSubmit}>
            {'> '}
            <StyledInput
              type="text"
              onChange={onChange}
              value={command}
              autoFocus
            />
          </form>
        </CodeBlock>
      </MissionBlock>
      {success && <SuccessModal visible={success}>열쇠 검색 완료</SuccessModal>}
    </>
  );
};

export default Mission10;
