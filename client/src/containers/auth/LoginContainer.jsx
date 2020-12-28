import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { intializeField, login, changeField } from '../../modules/auth';
import AuthForm from '../../components/auth/AuthForm';
import { chkEmail } from '../../modules/check';
import { check } from '../../modules/user';
import { withRouter } from 'react-router-dom';

const LoginContainer = ({ history }) => {
  const { form, auth, authError, userInfo, loading } = useSelector(
    ({ auth, user, loading }) => ({
      form: auth.login,
      auth: auth.auth,
      authError: auth.authError,
      userInfo: user.userInfo,
      loading: loading['auth/LOGIN'],
    })
  );

  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const onChange = (e) => {
    const { name, value } = e.target;
    dispatch(changeField({ form: 'login', name, value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const { email, password } = form;

    if (!chkEmail(email)) {
      setError('올바른 이메일 형식이 아닙니다');
      return;
    }
    dispatch(login({ email, password }));
  };

  useEffect(() => {
    dispatch(intializeField('login'));
  }, [dispatch]);

  useEffect(() => {
    if (authError) {
      if (authError.response.status === 504) {
        setError('서버와 연결할 수 없습니다.');
      } else {
        setError(authError.response.data.message);
      }
    }
  }, [authError]);

  useEffect(() => {
    if (auth) {
      dispatch(check());
    }
  }, [auth]);

  useEffect(() => {
    if (userInfo) {
      history.push('/lobby');
      try {
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
      } catch (e) {
        console.log('localStorage is not working');
      }
    }
  }, [history, userInfo]);

  return (
    <AuthForm
      type="로그인"
      onChange={onChange}
      onSubmit={onSubmit}
      form={form}
      error={error}
      loading={loading}
    />
  );
};

export default withRouter(LoginContainer);
