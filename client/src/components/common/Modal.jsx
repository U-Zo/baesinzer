import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
const ModalBlock = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: fixed;
  border: 3px solid green;
  height: 200px;
  width: 250px;
  padding: 15px;
  background-color: white;
  > .hh {
    margin-bottom: 10px;
  }
`;
const ModalFooter = styled.div`
  margin-top: 10px;
  > .b {
    border: none;
    background: green;
  }
`;

/**
 * visble은 useState를 사용해서 설정, onClick할때 true <-> false 교체되게 만든다
 * chileren은 Modal버튼을 눌렀을때 나타나는 component
 */
const Modal = ({ visible, onClick, children }) => {
  return (
    visible && (
      <ModalBlock>
        {children}
        <ModalFooter>
          <button class="b" onClick={onClick}>
            닫기
          </button>
        </ModalFooter>
      </ModalBlock>
    )
  );
};

export default Modal;
