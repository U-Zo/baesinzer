import React from 'react';
import { Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const App = () => {
  return (
    <>
      <Route path="/" component={LoginPage} exact />
      <Route path="/register" component={RegisterPage} />
    </>
  );
};

export default App;
