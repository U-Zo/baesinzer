import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const AuthBlock = styled.div`
  position: relative;
  margin: 0 auto;
  width: 970px;
  height: 720px;
  border: 2px solid #00ff66;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #131314;
`;

const BaesinZerMain = styled.div`
  width: 100%;
  height: 12rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3rem;
  font-weight: bolder;
  color: #00ff66;
`;
const MessageBlock = styled.div`
  width: 100%;
  height: 12rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 3rem;
  font-weight: bolder;
  color: #00ff66;
  margin: 2rem 0rem 2rem 0rem;
`;
const MessageStyle = styled.div`
  text-align: center;
  width: 800%;
  height: 12rem;
  font-size: 2rem;
  font-weight: normal;
  color: #00ff66;
  &.email {
    padding-top: 4rem;
  }
`;
const Footer = styled.div`
  a {
    color: #00ff66;
    text-decoration: none;
    font-size: 2rem;
    cursor: default;
    :hover {
      font-weight: bold;
    }
  }
`;
const RegisterSuccess = ({ email }) => {
  return (
    <AuthBlock>
      <BaesinZerMain>BaesinZer</BaesinZerMain>
      <MessageBlock>
        <MessageStyle>이메일 등록이 완료 되었습니다.</MessageStyle>
        <MessageStyle>이메일을 확인해주십시오.</MessageStyle>
        <MessageStyle className="email">{email}</MessageStyle>
      </MessageBlock>
      <Footer>
        <Link to="/login">로그인</Link>
      </Footer>
    </AuthBlock>
  );
};

export default RegisterSuccess;
