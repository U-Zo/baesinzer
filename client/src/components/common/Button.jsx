import React from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

const buttonStyle = css``;

const StyledButton = styled.button`
  ${buttonStyle}
`;

const StyledLink = styled(Link)`
  ${buttonStyle}
`;

const Button = (props) => {
  return props.to ? <StyledLink {...props} /> : <StyledButton {...props} />;
};

export default Button;
