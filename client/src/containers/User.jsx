import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { check, logout } from '../modules/user';

const User = () => {
  const { auth } = useSelector(({ auth }) => ({
    auth: auth.auth,
  }));

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(check());
  }, [auth]);

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <div>
      <button onClick={logoutHandler}>로그아웃</button>
    </div>
  );
};

export default User;
