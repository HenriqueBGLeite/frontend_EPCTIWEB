import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  p {
    margin-bottom: 8px;
  }

  .inputBox {
    flex: 1;
    width: 40%;
    background: transparent;
    border-radius: 10px;
    border: 2px solid #878787;
    text-align: center;
    color: #333;
  }

  datalist[id='listaBox'] {
    width: 30%;
    background: transparent !important;
    border: none;
    border-radius: 8px;
    color: #333;
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

export const CheckRadio = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  h1 {
    font-size: 20px;
    font-weight: bold;
    color: #666360;
    margin-bottom: 8px;
    border-bottom: 2px solid #878787;
  }

  label {
    display: flex;
    align-items: left;
    justify-content: left;
    color: #666360;

    input {
      align-items: left;
      justify-content: left;
      border-radius: 10px;
      border: 2px solid #878787;
      margin-top: 5px;
      margin-right: 8px;
    }
  }
`;
