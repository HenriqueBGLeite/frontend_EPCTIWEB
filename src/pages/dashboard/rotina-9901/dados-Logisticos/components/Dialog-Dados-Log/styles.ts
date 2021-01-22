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

    div {
      margin: 6px 0.5%;
    }

    .pesquisarButton {
      width: 12% !important;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      background: #c22e2c;
      color: #fff;
      border-radius: 10px;
      border: 0;
      margin: 6px 0.5%;
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
  }

  p {
    margin: 6px 0.5%;
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

export const Tabela = styled.div`
  margin: 6px 0%;

  .p-datatable-scrollable-header-box,
  .p-datatable-scrollable-header,
  .p-datatable-scrollable-body,
  .p-datatable-scrollable-wrapper,
  .p-datatable-scrollable-footer,
  .p-datatable-scrollable-view,
  .p-datatable-scrollable-footer-box,
  .p-datatable-virtual-scroller,
  .p-datatable,
  .p-component,
  .p-datatable-scrollable,
  .p-datatable-header,
  .p-datatable-hoverable-rows {
    margin: 0% !important;
  }
`;

export const Footer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;

  .footerButton {
    width: 20% !important;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    background: #c22e2c;
    color: #fff;
    height: 40px;
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

export const CheckBox = styled.div`
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

export const Loading = styled.div`
  display: flex;

  align-items: center;
  justify-content: center;
  flex-direction: column;

  .loading {
    width: 100%;
    height: 56px;
    border-radius: 10px;
    border: 0;
    padding: 0 8px;
    margin-top: 16px;
  }

  h1 {
    margin-top: 38px;
    font-size: 12px;
    color: #666360;
    font-weight: 'bold';
  }
`;
