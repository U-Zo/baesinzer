import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
const ModalBlock = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border: 0.3rem solid var(--color-green);
  height: 25rem;
  width: 45rem;
  padding: 15px;
  //수정
  background-color: var(--color-background);
  position: absolute;
  left: 50%;
  top: 30%;
  transform: translate(-50%, -50%);

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
  return visible && <ModalBlock>{children}</ModalBlock>;
};

export default Modal;
