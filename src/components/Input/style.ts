import styled, { css } from 'styled-components';

import Tooltip from '../Tooltip';

interface ContainerProps {
  isFocused: boolean;
  isFilled: boolean;
  isErrored: boolean;
  isDisabled?: boolean;
  width: number;
  widthPx?: number;
  marginRight: number;
}

export const Container = styled.div<ContainerProps>`
  border-radius: 10px;
  padding: 3px;

  ${(props) =>
    props.widthPx === undefined &&
    css`
      width: 100%;
    `}

  border: 2px solid #878787;
  color: #666360;

  ${(props) =>
    props.isDisabled &&
    css`
      background: #bfbfc7;
    `}

  display: flex;
  align-items: center;

  ${(props) =>
    props.width &&
    css`
      width: ${props.width}%;
    `}

  ${(props) =>
    props.widthPx &&
    css`
      width: ${props.widthPx}px;
    `}

  ${(props) =>
    props.isErrored &&
    css`
      border-color: #c53030;
    `}

  ${(props) =>
    props.isFocused &&
    css`
      color: #005129;
      border-color: #005129;
    `}

  ${(props) =>
    props.isFilled &&
    css`
      color: #005129;
    `}

  input {
    flex: 1;
    width: 100%;
    background: transparent;
    border: 0;
    color: #333;

    &::placeholder {
      color: #878787;
    }
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active  {
      -webkit-box-shadow: 0 0 0 30px #dcdce6 inset;
              box-shadow: 0 0 0 30px #dcdce6 inset;
  }

  svg {
    margin-right: 16px;

    ${(props) =>
      props.marginRight &&
      css`
        margin-right: ${props.marginRight}px;
      `}
  }

  .label-float{
    width: 100%;
    position: relative;
    padding-top: 13px;
  }

  .label-float input {
    flex: 1;
    width: 100%;
    background: transparent;
    border: 0;
    color: #333;
    font-size: 16px;
    transition: all .3s ease-out;
  }

  .label-float input::placeholder{
    color:transparent;
  }

  .label-float label{
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    color: #878787;
    margin-top: 10px;
    transition: all .3s ease-out;
    -webkit-transition: all .3s ease-out;
    -moz-transition: all .3s ease-out;
  }

  .label-float input:focus + label,

  .label-float input:not(:placeholder-shown) + label {
      font-size: 10px;
      margin-top: 0;
      color: #878787;
  }
`;

export const Error = styled(Tooltip)`
  height: 20px;
  margin-left: 16px;

  svg {
    margin: 0;
  }

  span {
    background: #c53030;
    color: #fff;

    &::before {
      border-color: #c53030 transparent;
    }
  }
`;
