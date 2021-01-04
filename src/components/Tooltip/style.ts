import styled from 'styled-components';

export const Container = styled.div`
  position: relative;

  span {
    width: 160px;
    padding: 8px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    opacity: 0;
    transition: opacity 0.4s;
    visibility: hidden;

    position: absolute;
    bottom: calc(100% + 12px);
    left: 99%;
    transform: translateX(-100%);
    color: #312e38;

    &::before {
      content: '';
      border-style: solid;
      border-color: transparent;
      border-width: 6px 6px 0 6px;
      top: 100%;
      position: absolute;
      left: 99%;
      transform: translateX(-100%);
    }
  }

  &:hover span {
    opacity: 1;
    visibility: visible;
  }
`;
