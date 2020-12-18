import React, { useEffect, useRef, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';

import {
  RiSurgicalMaskLine,
  RiSurgicalMaskFill,
  RiKnifeLine,
  RiScissorsLine,
} from 'react-icons/ri';
import {
  AiFillWallet,
  AiFillShop,
  AiOutlineDollarCircle,
} from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { missionDone } from '../../../modules/user';

const Block = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;
const ItemBlock = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding-bottom: 3rem;
  padding-top: 4rem;
  align-items: flex-end;

  #item {
    font-size: 6rem;
    padding-right: 0.5rem;
  }
  #num {
    font-size: 4rem;
  }
`;
const FormBlock = styled.form`
  display: flex;
  justify-content: center;
  flex-direction: row;
`;

const MissionInfo = styled.div`
  font-size: 4rem;
  color: var(--color-green);
  top: 8rem;
  position: absolute;
`;
const rotatePacman = keyframes`
  0%{
    transform: translateX(5rem);;
    }
    25%{
        transform: translateX(12rem);
    }
    50%{
        transform: translateX(19rem);
    }
    75%{
        transform: translateX(25rem);
    }
  100%{
    transform: translateX(31rem);
    }
`;
const PayBlock = styled.div`
  font-size: 6rem;
  display: flex;
  flex-direction: row;
  width: 40rem;
  justify-content: space-between;
  align-items: flex-end;

  #dollar {
    font-size: 4rem;
    position: absolute;
    animation: ${rotatePacman} 6s;
    animation-iteration-count: 1;
    transform: translateX(31rem);
  }
`;
const ButtonStyled = styled.button`
  width: 8rem;
  height: 2rem;
  border-style: none;
  outline: none;
  background-color: var(--color-background);
  color: var(--color-green);
  font-size: 2rem;
  padding: 0;
  :hover {
    font-weight: bold;
  }
`;

const InputStyled = styled.input`
  width: 4rem;
  height: 2rem;
  border: 1.5px solid var(--color-green);
  color: var(--color-green);
  outline: none;
  text-align: center;

  background-color: var(--color-background);
  :-webkit-autofill {
    -webkit-text-fill-color: var(--color-green);
  }
  :-webkit-autofill,
  :-webkit-autofill:active {
    transition: background-color 5000s ease-in-out 0s;
  }
`;

const AreltBlock = styled.div`
  color: var(--color-red);
  position: absolute;
  font-size: 3rem;
  bottom: 6rem;
`;

const Mission6 = ({ onClose }) => {
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);
  const [itemNo, setItemNo] = useState(null);
  const [complete, setComplete] = useState(null);
  const missionRef = useRef(null);
  const dispatch = useDispatch();

  const onChange = (e) => {
    setItemNo(e.target.value - 1);
    console.log(itemNo);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (productNum[itemNo] === 1) {
      setItem('item');
      setError();
    } else {
      setError('상품을 골라주세요');
    }
  };

  const timer = () =>
    setTimeout(function () {
      setComplete('마스크 사기 완료');
      dispatch(missionDone(6));
    }, 6000);

  useEffect(() => {
    if (item) {
      missionRef.current = timer();
    }
  }, [item]);

  useEffect(() => {
    if (complete) {
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  }, [complete]);

  const product = [];
  const [productNum, setProductNum] = useState([]);

  useEffect(() => {
    while (product.length < 3) {
      const index = parseInt(Math.random() * 3) + 1;
      if (!product.find((num) => num === index)) {
        console.log(product, index);
        product.push(index);
      }

      if (product.length === 3) {
        setProductNum(product);
      }
    }
  }, []);

  return (
    <Block>
      <MissionInfo>마스크사기</MissionInfo>
      {item ? (
        <PayBlock>
          <AiFillWallet />
          <AiOutlineDollarCircle id="dollar" />
          <AiFillShop />
        </PayBlock>
      ) : (
        <div>
          <ItemBlock>
            {productNum.map((num, i) => {
              if (num === 1) {
                return <RiSurgicalMaskLine id="item" />;
              }
              if (num === 2) {
                return <RiKnifeLine id="item" />;
              }
              if (num === 3) {
                return <RiScissorsLine id="item" />;
              }
            })}
          </ItemBlock>
          <FormBlock onSubmit={onSubmit}>
            <InputStyled type="text" onChange={onChange} autoFocus />
            <ButtonStyled>입력</ButtonStyled>
          </FormBlock>
        </div>
      )}
      {error ? <AreltBlock>{error}</AreltBlock> : null}
      {complete ? <AreltBlock>{complete}</AreltBlock> : null}
    </Block>
  );
};

export default Mission6;
