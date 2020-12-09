import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled, { css } from 'styled-components';
import { missionDone } from '../../../modules/user';
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
  font-size: 2.4rem;
  justify-content: space-around;
`;

const inputStyle = css`
  border: none;
  color: var(--color-green);
  background-color: inherit;
  outline: none;
  font-size: 2rem;
  padding: 1rem;
`;

const StyledForm = styled.form`
  display: flex;
  border: 0.2rem solid var(--color-green);
  ${CodeBlock} + & {
    border-top: none;
  }
`;

const StyledInput = styled.input`
  flex-grow: 1;
  ${inputStyle}
`;

const StyledButton = styled.button`
  ${inputStyle}

  ${StyledInput} + & {
    border-left: 0.2rem solid var(--color-green);
  }
`;

const RedSpan = styled.span`
  color: var(--color-red);
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

const Mission2 = ({ onClose }) => {
  const [answer, setAnswer] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const onChange = (e) => {
    const { value } = e.target;
    setAnswer(value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (answer === 'Hello World') {
      setSuccess(true);
      dispatch(missionDone(2));
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } else {
      setError('정답이 아닙니다.');
    }

    setAnswer('');
  };

  return (
    <>
      <MissionBlock>
        <CodeBlock>
          <div>
            <p>public class Main {'{'}</p>
            <p>
              &nbsp;&nbsp;&nbsp;&nbsp;public static void main(String[] args){' '}
              {'{'}
            </p>
            <p>
              &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
              System.out.println("
              <RedSpan>Hello World</RedSpan>")
            </p>
            <p>
              &nbsp;&nbsp;&nbsp;&nbsp;
              {'}'}
            </p>
            <p>{'}'}</p>
          </div>
          <div>출력 결과가 무엇일까?</div>
          {error && <RedSpan>{error}</RedSpan>}
        </CodeBlock>
        <StyledForm onSubmit={onSubmit}>
          <StyledInput
            type="text"
            onChange={onChange}
            value={answer}
            autoFocus
          />
          <StyledButton>입력</StyledButton>
        </StyledForm>
      </MissionBlock>
      {success && <SuccessModal visible={success}>코딩하기 완료</SuccessModal>}
    </>
  );
};

export default Mission2;
