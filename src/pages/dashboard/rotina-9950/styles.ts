import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  display: flex;
  flex-wrap: wrap;

  align-items: center;
  justify-content: left;
  margin-left: 3.3em;
`;

export const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  width: 100%;

  form {
    width: 99%;
    display: flex;
    flex-wrap: wrap;

    text-align: center;

    background: transparent;
    border-radius: 10px;
    padding: 8px 8px;

    justify-content: space-between;

    .multiSelect {
      width: 15%;
      border-radius: 10px;
      padding: 3px;
      background: transparent;
      border: 2px solid #878787;
      color: #666360;
      padding: 3px;
    }

    .p-multiselect-trigger {
      border-radius: 10px;
      background: transparent;
    }
  }

  .p-datatable-scrollable-header,
  .p-datatable-scrollable-body,
  .p-datatable-scrollable-footer {
    font-size: 10px !important;
  }

  .styleInputBox {
    flex: 1;
    width: 95%;
    background: transparent;
    border-radius: 10px;
    border: 2px solid #878787;
    text-align: center;
    color: #333;
  }
`;

export const Divisor = styled.div`
  width: 100%;
  margin: 4px 0;
  border-bottom: 3px solid;
`;

export const Button = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    background: #c22e2c;
    color: #fff;
    height: 30px;
    border-radius: 10px;
    border: 0;
    width: 14%;
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

export const CheckRadio = styled.div`
  border-radius: 10px;
  padding: 2px;

  border: 2px solid #878787;
  width: 18%;

  @media (max-width: 1600px) {
    font-size: 12px;
  }

  margin-left: 2px;
  margin-right: 2px;

  h1 {
    font-size: 24px;

    @media (max-width: 1600px) {
      font-size: 20px;
    }

    border-bottom: 2px solid;
    color: #666360;
    font-weight: bold;
    margin-bottom: 8px;
  }

  label + label {
    margin-left: 6px;
  }

  label {
    color: #666360;
    font-size: 18px;

    @media (max-width: 1600px) {
      font-size: 14px;
    }

    input {
      margin-right: 4px;
    }
  }
`;

export const CheckBox = styled.div`
  width: 6%;
  display: flex;
  flex-direction: column;
  margin-left: 2px;
  margin-right: 4px;

  label {
    display: flex;
    align-items: left;
    justify-content: left;
    color: #666360;
    font-size: 18px;

    border-bottom: 2px solid #878787;

    @media (max-width: 1600px) {
      font-size: 14px;
    }

    input {
      margin-top: 6px;
      margin-right: 4px;

      @media (max-width: 1600px) {
        margin-top: 3px;
        margin-right: 4px;
      }
    }
  }
`;

export const Loading = styled.div`
  display: flex;

  align-items: center;
  justify-content: center;
  flex-direction: column;

  .loading {
    border-radius: 10px;
    border: 0;
    padding: 0 16px;
    margin-top: 16px;
  }

  h1 {
    margin-top: 40px;
    color: #666360;
    font-weight: 'bold';
  }
`;
