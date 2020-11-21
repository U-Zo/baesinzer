import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

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
const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  list-style: none;
  font-size: 1.5rem;
  position: relative;
  margin-bottom: 3rem;
  margin-top: 20rem;
`;
const InputStyled = styled.input`
  margin-bottom: 1.5rem;
  width: 30rem;
  height: 1.5rem;
  padding: 2rem;
  padding-left: 1rem;
  font-size: 2.5rem;
  letter-spacing: 0.1rem;
  border: 1.5px solid var(--color-green);
  color: var(--color-green);
  outline: none;
  background-color: var(--color-background);

  :-webkit-autofill {
    -webkit-text-fill-color: var(--color-green);
  }
  :-webkit-autofill,
  :-webkit-autofill:active {
    transition: background-color 5000s ease-in-out 0s;
  }

  ::placeholder {
    color: var(--color-green);
    font-size: 2rem;
  }
  :focus {
    ::placeholder {
      color: transparent;
    }
  }
`;
const ButtonStyled = styled.button`
  width: 10rem;
  height: 2rem;
  border-style: none;
  outline: none;
  background-color: var(--color-background);
  color: var(--color-green);
  font-size: 2rem;
  padding: 0;
  :hover {
    font-weight: bold;
  }
`;

const ButtonBlock = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: baseline;
  margin-top: 3rem;
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

const Footer = styled.div`
  a {
    color: var(--color-green);
    text-decoration: none;
    font-size: 2rem;
    width: 10rem;
    height: 2rem;
    padding-right: 1.5rem;
    cursor: default;
    :hover {
      font-weight: bold;
    }
  }
`;
const ErrorBlock = styled.div`
  color: var(--color-red);
  position: absolute;
  font-size: 2.5rem;
  &#로그인 {
    padding-bottom: 13rem;
  }
  &#회원가입 {
    padding-bottom: 15rem;
  }
`;
const LoadingBlock = styled.div`
  color: var(--color-red);
  font-size: 2.5rem;
`;

const AuthForm = ({
  success,
  form,
  type,
  onSubmit,
  onChange,
  error,
  loading,
}) => {
  return (
    <Block>
      <AuthBlock>
        <BaesinZerMain>BaesinZer</BaesinZerMain>
        {error && <ErrorBlock id={type}>{error}</ErrorBlock>}
        {success && <ErrorBlock id={type}>{success}</ErrorBlock>}
        <StyledForm onSubmit={onSubmit}>
          <InputStyled
            type="text"
            name="email"
            placeholder="이메일"
            onChange={onChange}
            value={form.email}
          />
          <InputStyled
            type="password"
            name="password"
            placeholder="비밀번호"
            onChange={onChange}
            value={form.password}
          />
          {type === '회원가입' ? (
            <InputStyled
              type="password"
              name="passwordConfirm"
              placeholder="비밀번호 확인"
              onChange={onChange}
              value={form.passwordConfirm}
            />
          ) : null}
          {loading && <LoadingBlock>로딩중...</LoadingBlock>}
          <ButtonBlock>
            <ButtonStyled>{type}</ButtonStyled>
            {type === '로그인' ? (
              <Footer>
                <Link to="/register">회원가입</Link>
              </Footer>
            ) : (
              <Footer>
                <Link to="/">로그인</Link>
              </Footer>
            )}
          </ButtonBlock>
        </StyledForm>
      </AuthBlock>
    </Block>
  );
};

export default AuthForm;
