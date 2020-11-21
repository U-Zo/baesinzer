import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Block = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const AuthBlock = styled.div`
  position: relative;
  margin: 0 auto;
  width: 970px;
  height: 720px;
  border: 2px solid var(--color-green);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: var(--color-background);
`;

const BaesinZerMain = styled.div`
  width: 100%;
  height: 10rem;
  display: flex;
  justify-content: center;
  font-size: 9rem;
  position: absolute;
  top: 15rem;
  font-weight: bolder;
  color: var(--color-green);
`;
const MessageBlock = styled.div`
  width: 100%;
  height: 12rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 5rem;
  font-weight: bolder;
  color: var(--color-green);
  margin-top: 12rem;
  margin-bottom: 6rem;
`;
const MessageStyle = styled.div`
  text-align: center;
  width: 800%;
  height: 12rem;
  font-size: 3rem;
  font-weight: normal;
  color: var(--color-green);
  &.email {
    padding-top: 4rem;
  }
`;
const ButtonStyled = styled.button`
  width: 10rem;
  height: 2rem;
  border-style: none;
  outline: none;
  background-color: var(--color-background);
  color: var(--color-green);
  font-size: 3rem;
  :hover {
    font-weight: bold;
  }
`;
const RegisterSuccess = ({ email, onClick }) => {
  return (
    <Block>
      <AuthBlock>
        <BaesinZerMain>BaesinZer</BaesinZerMain>
        <MessageBlock>
          <MessageStyle>이메일 등록이 완료 되었습니다.</MessageStyle>
          <MessageStyle>이메일을 확인해주십시오.</MessageStyle>
          <MessageStyle className="email">{email}</MessageStyle>
        </MessageBlock>
        <ButtonStyled onClick={onClick}>로그인</ButtonStyled>
      </AuthBlock>
    </Block>
  );
};

export default RegisterSuccess;
