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
  const { form, auth, authError, loading } = useSelector(
    ({ auth, loading }) => ({
      form: auth.register,
      auth: auth.auth,
      authError: auth.authError,
      loading: loading['auth/REGISTER'],
    })
  );

  const dispatch = useDispatch();
  const [error, setError] = useState(null);

  const onChange = (e) => {
    const { name, value } = e.target;
    dispatch(changeField({ form: 'register', name, value }));
  };

  const onClick = () => {
    dispatch(intializeAuth());
    history.push('/');
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const { email, password, passwordConfirm } = form;

    if ([email, password, passwordConfirm].includes('')) {
      setError('빈 칸을 모두 입력하세요');
    } else if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      dispatch(changeField({ form: 'register', name: 'password', value: '' }));
      dispatch(
        changeField({ form: 'register', name: 'passwordConfirm', value: '' })
      );
    } else if (password.length < 6) {
      setError('비밀번호는 6글자 이상이어야 합니다.');
      dispatch(changeField({ form: 'register', name: 'password', value: '' }));
      dispatch(
        changeField({ form: 'register', name: 'passwordConfirm', value: '' })
      );
    } else if (!chkEmail(email)) {
      setError('올바른 이메일 형식이 아닙니다');
    } else {
      dispatch(register({ email, password }));
    }
  };

  useEffect(() => {
    dispatch(intializeField('register'));
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

  return auth ? (
    <RegisterSuccess email={form.email} onClick={onClick} />
  ) : (
    <AuthForm
      type="회원가입"
      form={form}
      onChange={onChange}
      onSubmit={onSubmit}
      error={error}
      loading={loading}
    />
  );
};

export default withRouter(RegisterContainer);
