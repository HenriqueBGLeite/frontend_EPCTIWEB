import styled, { css } from 'styled-components';
import { shade } from 'polished';

interface DTOLoading {
  forncedor?: boolean;
}

export const Container = styled.div`
  margin-left: 3.3em;
  margin-top: 0.5em;

  .p-datatable-scrollable-header {
    font-size: 12px !important;
  }

  .p-datatable-scrollable-body {
    font-size: 12px !important;
  }
`;

export const Content = styled.div`
  display: flex;

  align-items: center;
  justify-content: center;
  margin-bottom: 8px;

  form {
    width: 80%;
    display: flex;
    flex-wrap: wrap;

    div + div {
      margin-left: 4px;
    }

    .multiSelect {
      width: 35%;
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

    .p-multiselect-items-wrapper {
      max-height: 200px;
      width: 500px !important;
    }
  }
`;

export const Button = styled.div`
  width: 12%;
  display: flex;
  flex-wrap: wrap;

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    background: #c22e2c;
    color: #fff;
    border-radius: 10px;
    border: 0;
    width: 100%;
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

export const Loanding = styled.div<DTOLoading>`
  display: flex;

  align-items: center;
  justify-content: center;
  flex-direction: column;

  ${(props) =>
    props.forncedor &&
    css`
      flex-direction: row;
    `}

  .loading {
    width: 100%;
    height: 56px;
    border-radius: 10px;
    border: 0;
    padding: 0 16px;
    margin-top: 16px;
  }

  .loadingFornecedores {
    width: 100%;
    height: 10px;
    border-radius: 10px;
    border: 0;
    padding: 0 16px;
    margin-top: 10px;
  }

  h1 {
    margin-top: 40px;
    color: #666360;
    font-weight: 'bold';
  }

  p {
    color: #666360;
  }
`;
