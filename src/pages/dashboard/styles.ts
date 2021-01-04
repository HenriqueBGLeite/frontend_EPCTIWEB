import styled from 'styled-components';

export const Container = styled.div`
  height: 90vh;
  display: flex;

  align-items: center;
  justify-content: center;
`;

export const Content = styled.div`
  width: 50%;

  @media (max-width: 2100px) {
    width: 65%;
  }
`;
