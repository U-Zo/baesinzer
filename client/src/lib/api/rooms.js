import client from './client';
export const getRoomList = () => client.get('/api/room');

// export const createRoom = ({ roomName }) =>
//   client.post('/api/room', { roomName });

export const createRoom = (roomName) => client.post(`/api/room`, { roomName });

export const loadRoom = (roomCode) => client.get(`/api/room/${roomCode}`);
