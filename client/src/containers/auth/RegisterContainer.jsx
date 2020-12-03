import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AuthForm from '../../components/auth/AuthForm';
import {
  changeField,
  register,
  intializeField,
  intializeAuth,
} from '../../modules/auth';
import { chkEmail } from '../../modules/check';
import { withRouter } from 'react-router-dom';
import RegisterSuccess from '../../components/auth/RegisterSuccess';

const RegisterContainer = ({ history }) => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const dispatch = useDispatch();
  const { form, auth, authError, loading } = useSelector(
    ({ auth, loading }) => ({
      form: auth.register,
      auth: auth.auth,
      authError: auth.authError,
      loading: loading['auth/REGISTER'],
    })
  );

  const onChange = (e) => {
    const { name, value } = e.target;
    dispatch(changeField({ form: 'register', name, value }));
  };

  const onClick = () => {
    dispatch(intializeAuth());
    history.push('/');
  };
  const onSubmit = (e) => {
    const { email, password, passwordConfirm } = form;
    e.preventDefault();
    if ([email, password, passwordConfirm].includes('')) {
      setError('빈 칸을 모두 입력하세요');
      return;
    } else if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    } else if (password.length < 6) {
      setError('비밀번호는 6글자 이상으로 작성해주세요.');
      return;
    } else if (!chkEmail(email)) {
      setError('올바른 이메일 형식이 아닙니다');
      return;
    }

    dispatch(register({ email, password }));
  };

  useEffect(() => {
    dispatch(intializeField('register'));
  }, [dispatch]);

  useEffect(() => {
    if (authError) {
      // 계정이 존재할 때
      if (
        error !== '빈 칸을 모두 입력하세요' &&
        error !== '비밀번호가 일치하지 않습니다.' &&
        error !== '올바른 이메일 형식이 아닙니다' &&
        error !== '비밀번호가 너무 짧습니다'
      ) {
        setError('이미 존재하는 계정입니다.');
      }

      // 기타 이유
      return;
    }
  }, [authError, error]);

  useEffect(() => {
    if (auth) {
      setSuccess('회원가입 성공');
    }
  }, [auth]);

  // useEffect(() => {
  //   if (auth) {
  //     history.push('/login');
  //     try {
  //     } catch (e) {
  //       console.log('localStorage is not working');
  //     }
  //   }
  // }, [history, auth]);

  return auth ? (
    <RegisterSuccess email={form.email} onClick={onClick} />
  ) : (
    <AuthForm
      type="회원가입"
      form={form}
      onChange={onChange}
      onSubmit={onSubmit}
      error={error}
      success={success}
      loading={loading}
    />
  );
};

export default withRouter(RegisterContainer);
