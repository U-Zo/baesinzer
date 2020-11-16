import { Route } from 'react-router-dom';
import RoomListPage from './pages/RoomListPage';
import RoomContainer from './containers/chat/RoomContainer';
import { check } from './modules/user';

const App = () => {
  return (
    <>
      {/* checkmethod를 통해 토큰에서 userinfo에 저장시켜준다. */}

      <Route path="/lobby" component={RoomListPage} />
      <Route path="/room/:roomId" component={RoomContainer} />
    </>
  );
};

export default App;
