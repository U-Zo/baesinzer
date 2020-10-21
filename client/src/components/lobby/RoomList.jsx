import React from 'react';

const Room = (props) => {
  return <li>{props}</li>;
};

const RoomList = ({ rooms }) => {
  return <ul>{rooms && rooms.map((room) => <Room />)}</ul>;
};

export default RoomList;
