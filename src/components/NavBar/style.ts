import styled, { css } from 'styled-components';

interface Base {
  base: string;
}

export const Container = styled.div<Base>`
  flex: 1;
  height: 100vh;
  max-height: 40px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  ${(props) =>
    (props.base === 'EPOCA' || props.base === 'EPOCATST' || 'TESTEOCI') &&
    css`
      background: #c22e2c;
      background-image: -moz-linear-gradient(135deg, rgb(3, 8, 12), #c22e2c);
      background-image: -webkit-linear-gradient(135deg, rgb(3, 8, 12), #c22e2c);
      background-image: -o-linear-gradient(135deg, rgb(3, 8, 12), #c22e2c);
      background-image: -ms-linear-gradient(135deg, rgb(3, 8, 12), #c22e2c);
      background-image: linear-gradient(135deg, rgb(3, 8, 12), #c22e2c);
    `}

  ${(props) =>
    props.base === 'MRURAL' &&
    css`
      background: #005129;
      background-image: -moz-linear-gradient(135deg, rgb(3, 8, 12), #005129);
      background-image: -webkit-linear-gradient(135deg, rgb(3, 8, 12), #005129);
      background-image: -o-linear-gradient(135deg, rgb(3, 8, 12), #005129);
      background-image: -ms-linear-gradient(135deg, rgb(3, 8, 12), #005129);
      background-image: linear-gradient(135deg, rgb(3, 8, 12), #005129);
    `}

  button {
    display: flex;
    margin-left: 10px;
    margin-right: 10px;
    align-items: center;
    text-decoration: none;
    border: 0;
    background: transparent;
    color: #fff;
    transition: color 0.2s;

    &:hover {
      color: #666;
    }

    svg {
      margin-right: 6px;
    }
  }
`;

export const TituloRotina = styled.div`
  font-size: 25px;
`;
