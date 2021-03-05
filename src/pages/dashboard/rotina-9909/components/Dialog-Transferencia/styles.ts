import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  form {
    width: 100%;
    display: flex;
    flex-wrap: wrap;

    h3 {
      font-weight: bold;
    }

    div {
      margin: 6px 0.3%;
    }
  }

  p {
    margin: 6px 0.5%;
  }
`;

export const Footer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;

  button {
    width: 30% !important;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    background: #c22e2c;
    color: #fff;
    height: 30px;
    border-radius: 10px;
    border: 0;
    margin: 0;
    font-weight: bold;
    font-size: 16px;
    transition: background-color 0.2s;

    &:hover {
      background: ${shade(0.2, '#c84241')};
    }

    &:disabled {
      background: #de6d79;
      color: #fff;
    }

    &:focus {
      color: #de6d79;
    }

    svg {
      margin-right: 8px;
    }
  }

  button + button {
    margin-left: 5px;
  }
`;

export const Divisor = styled.div`
  width: 100%;
  margin: 6px 0;
  border-bottom: 3px solid;
  border-color: #d7d7d6;
`;
