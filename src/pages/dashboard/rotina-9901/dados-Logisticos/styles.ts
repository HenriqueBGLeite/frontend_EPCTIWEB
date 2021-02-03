import styled, { css } from 'styled-components';
import { shade } from 'polished';

interface AjustaWidth {
  percWidth: number;
}

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
    .tab2,
    .tab3,
    .tab4 {
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
  #tab2:checked ~ section .tab2,
  #tab3:checked ~ section .tab3,
  #tab4:checked ~ section .tab4 {
    display: block;
  }

  #tab1:checked ~ nav .tab1,
  #tab2:checked ~ nav .tab2,
  #tab3:checked ~ nav .tab3,
  #tab4:checked ~ nav .tab4 {
    color: #c22e2c;
  }

  #tab1:checked ~ nav .tab1,
  #tab2:checked ~ nav .tab2,
  #tab3:checked ~ nav .tab3,
  #tab4:checked ~ nav .tab4 {
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

  .personalizado {
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    background: #c22e2c;
    color: #fff;
    height: 30px;
    border-radius: 10px;
    border: 0;
    width: 10%;
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

  .nenhumDadoTabela {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 20.5%;
    color: #333333;
    font-weight: bold;

    border: 3px solid #c8c8c8;
    border-radius: 8px;
    background-color: #dcdce6;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  }
`;

export const Content = styled.div`
  display: flex;
  flex-wrap: wrap;

  form {
    width: 100%;
    display: flex;
    flex-wrap: wrap;

    div + div {
      margin-left: 8px;
    }
  }

  .p-datatable-scrollable-header {
    font-size: 12px !important;
    border-top-left-radius: 10px !important;
    border-top-right-radius: 10px !important;
  }

  .p-datatable-scrollable-body {
    font-size: 12px !important;
    border-bottom-left-radius: 10px !important;
    border-bottom-right-radius: 10px !important;
  }
`;

export const Fieldset = styled.fieldset`
  width: 100%;
  padding: 6px;
  border-radius: 10px;
  margin: 6px 0 6px 0;

  legend {
    padding: 0 6px;
    color: #000000;
  }

  .wrap {
    display: flex;
    flex-wrap: wrap;
    margin-top: -6px;

    div + div {
      margin: 6px 0 0 6px;
    }

    div {
      margin-top: 6px;
    }

    datalist + div {
      margin-left: 8px;
    }
  }
`;

export const FieldsetDados = styled.fieldset<AjustaWidth>`
  ${(props) =>
    props.percWidth &&
    css`
      width: ${props.percWidth}%;
    `}

  padding: 6px;
  border-radius: 10px;
  margin: 6px 0 6px 0;

  legend {
    padding: 0 6px;
    color: #000000;
  }

  .wrapDados {
    display: flex;
    flex-wrap: wrap;
    margin-top: -6px;

    div + div {
      margin: 6px 0 0 6px;
    }

    div {
      margin-top: 6px;
    }
  }
`;

export const CheckRadio = styled.div<AjustaWidth>`
  border-radius: 10px;
  padding: 0px 4px;

  border: 2px solid #878787;

  ${(props) =>
    props.percWidth &&
    css`
      width: ${props.percWidth}%;
    `}

  @media (max-width: 1600px) {
    font-size: 12px;
  }

  margin-right: 0% !important;

  div + div {
    margin-left: 1% !important;
  }

  h1 {
    font-size: 20px;
    text-align: center;

    @media (max-width: 1600px) {
      font-size: 16px;
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

  #itens {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  }
`;

export const CheckBox = styled.div<AjustaWidth>`
  display: flex;
  flex-direction: column;
  margin-right: 4px;

  ${(props) =>
    props.percWidth &&
    css`
      width: ${props.percWidth}%;
    `}

  label {
    display: flex;
    align-items: center;
    justify-content: left;
    color: #666360;
    font-size: 18px;

    border-bottom: 2px solid #878787;

    @media (max-width: 1600px) {
      font-size: 14px;
    }

    input {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 4px;

      @media (max-width: 1600px) {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
`;

export const Loanding = styled.div`
  display: flex;

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

    svg {
      margin-right: 8px;
    }
  }

  button + button {
    margin-left: 5px;
  }
`;
