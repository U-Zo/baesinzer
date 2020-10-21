import React from 'react';
import styled from 'styled-components';

const ResponsiveBlock = styled.div`
  width: 1200px;
  margin: 0 auto;

  @media (max-width: 1200px) {
    width: 1024px;
  }

  @media (max-width: 1024px) {
    width: 768px;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Responsive = ({ children, ...props }) => {
  return <ResponsiveBlock {...props}>{children}</ResponsiveBlock>;
};

export default Responsive;
