import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  margin-left: 3.3em;
  margin-top: 0.5em;

  & > input,
  section > div {
    display: none;
  }

  margin: auto;

  ul {
    flex: 1;
    list-style: none;
    margin-left: 3.3em;
    padding: 0;

    li {
      cursor: pointer;

      label {
        cursor: pointer;

        svg {
          margin-right: 6px;
        }
      }

      button {
        float: left;
        padding: 10px 10.6px;
        font-size: 15px;
        border: 0;
        font-weight: bold;
        background: $unactiveColor;
        color: #444;
        margin-right: 8px;
        margin-top: 0.5em;

        &:hover {
          background: $unactiveHoverColor;
        }
        &:active {
          background: $activeColor;
        }
      }
      &:not(:last-child) button {
        border-right-width: 0;
      }
    }
  }

  section {
    clear: both;
    margin-left: 3.3em;
    margin-right: 1em;

    .tab1,
    .tab2 {
      padding: 6px;
      border: 2px solid #878787;
      border-radius: 10px;
      border-top-left-radius: 0px;

      h2 {
        margin: 0;
        font-family: 'Raleway';
        letter-spacing: 1px;
        color: #34495e;
      }
    }
  }

  #tab1:checked ~ section .tab1,
  #tab2:checked ~ section .tab2 {
    display: block;
  }

  #tab1:checked ~ nav .tab1,
  #tab2:checked ~ nav .tab2 {
    color: #c22e2c;
  }

  #tab1:checked ~ nav .tab1,
  #tab2:checked ~ nav .tab2 {
    button {
      background: #c84241;
      color: #fff;
      position: relative;

      &:after {
        content: '';
        display: block;
        position: absolute;
        height: 2px;
        width: 100%;
        background: $activeColor;
        left: 3.3em;
        bottom: -1px;
      }
    }
  }
`;

export const Content = styled.div`
  display: flex;
  flex-wrap: wrap;

  margin-bottom: 8px;

  form {
    width: 100%;
    display: flex;
    flex-wrap: wrap;

    div + div {
      margin-left: 4px;
    }
  }

  .p-datatable-scrollable-header,
  .p-datatable-scrollable-body,
  .p-datatable-scrollable-footer {
    font-size: 11px !important;
  }

  .styleEndSelecionado {
    color: #fff !important;
    background-color: #28a428 !important;
  }
`;

export const FieldsetTable = styled.fieldset`
  width: 49.8%;
  padding: 6px;
  border-radius: 10px;
  margin: 6px 0 6px 0;

  legend {
    padding: 0 6px;
    color: #000000;
  }
`;

export const ButtonPesquisa = styled.div`
  width: 15%;
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

export const Button = styled.div`
  margin-bottom: 8px;
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
    width: 15%;
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

export const Loanding = styled.div`
  display: flex;
  width: 100%;

  align-items: center;
  justify-content: center;
  flex-direction: column;

  .loading {
    width: 100%;
    height: 56px;
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

  p {
    color: #666360;
  }
`;
