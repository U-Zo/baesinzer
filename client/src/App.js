import React from 'react';
import { Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RoomListPage from './pages/RoomListPage';
import RoomPage from './pages/RoomPage';

const App = () => {
  return (
    <>
      <Route path="/" component={LoginPage} exact />
      <Route path="/register" component={RegisterPage} />
      <Route path="/lobby" component={RoomListPage} />
      <Route path="/room/:roomCode" component={RoomPage} />
    </>
  );
};

export default App;
