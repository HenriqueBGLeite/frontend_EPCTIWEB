import styled, { css } from 'styled-components';
import Tooltip from '../Tooltip';

interface ContainerProps {
  isFocused: boolean;
  isFilled: boolean;
  isErrored: boolean;
  width: number;
  marginRight: number;
}

export const Container = styled.div<ContainerProps>`
  border-radius: 10px;
  padding: 4px 3px;
  width: 100%;

  border: 2px solid #878787;
  color: #666360;

  display: flex;
  align-items: center;

  ${(props) =>
    props.width &&
    css`
      width: ${props.width}%;
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


  select {
    flex: 1;
    width: 100%;
    background: transparent;
    border: none;
    border-radius: 8px;
    color: #333;

    option {
      border: none;
      background: #dcdce6;
    }
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

  .label-float select {
    flex: 1;
    width: 100%;
    background: transparent;
    border: 0;
    color: #333;
    font-size: 16px;
    transition: all .3s ease-out;
  }

  .label-float select::placeholder{
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

  .label-float select:focus + label,

  .label-float select:not(:placeholder-shown) + label {
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
