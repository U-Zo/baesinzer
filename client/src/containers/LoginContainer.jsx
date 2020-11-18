import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { intializeField, login, changeField } from '../modules/auth';
import AuthForm from '../components/auth/AuthForm';
import { chkEmail } from '../modules/check';
import { check } from '../modules/user';

const LoginContainer = () => {
  const { form, auth, authError } = useSelector(({ auth }) => ({
    form: auth.login,
    auth: auth.auth,
    authError: auth.authError,
  }));

  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const onChange = (e) => {
    const { name, value } = e.target;
    console.log(name);
    dispatch(changeField({ form: 'login', name, value }));
  };

  const onSubmit = (e) => {
    const { email, password } = form;
    if (!chkEmail(email)) {
      setError('올바른 이메일 형식이 아닙니다');
    }
    e.preventDefault();
    dispatch(login({ email, password }));
    localStorage.setItem(
      'userInfo',
      JSON.stringify({
        email,
      })
    );
  };

  useEffect(() => {
    dispatch(intializeField('login'));
  }, [dispatch]);

  useEffect(() => {
    if (authError) {
      console.log('오류발생');
      if (error === '올바른 이메일 형식이 아닙니다') {
      } else setError('이메일 인증이 필요합니다');
    }
  }, [authError, error]);

  useEffect(() => {
    dispatch(check());
  }, [auth]);

  return (
    <AuthForm
      type="로그인"
      onChange={onChange}
      onSubmit={onSubmit}
      form={form}
      error={error}
    />
  );
};

export default LoginContainer;
