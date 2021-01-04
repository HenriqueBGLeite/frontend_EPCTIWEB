import styled, { keyframes, css } from 'styled-components';
import { shade } from 'polished';
import logoImg from '../../assets/logo.svg';

interface HomologProps {
  homologacao: boolean;
}

export const Container = styled.div`
  height: 100vh;

  display: flex;
  align-items: stretch;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  max-width: 700px;
  margin-left: -60px;
`;

const appearFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0px);
  }
`;

export const AnimationContainer = styled.div<HomologProps>`
  width: 100%;
  height: 50%;
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: center;

  animation: ${appearFromLeft} 1s;

  img {
    width: 100%;
    max-height: 700px;
  }

  @media (max-width: 400px) {
    img {
      width: 100%;
      max-height: 180px;
    }
  }

  form {
    p {
      width: 100%;
      color: #000000;
      font-size: 10px;
      text-align: right;
      margin: 0 10px 10px 0;
      border-radius: 6px;

      ${(props) =>
        props.homologacao &&
        css`
          font-size: 15px;
          font-weight: bold;
          text-align: center;
          color: #ffff;
          background-color: #c84241;
        `}
    }

    width: 60%;
    text-align: center;

    background: transparent;
    border-radius: 10px;
    padding: 0 16px;

    justify-content: space-between;

    div + div {
      margin-top: 8px;
    }
  }
`;

export const Background = styled.div`
  flex: 1;
  background: url(${logoImg}) no-repeat center;
  background-size: 90%;
`;

export const Loanding = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  button {
    background: #c22e2c;
    color: #fff;
    height: 56px;
    border-radius: 10px;
    border: 0;
    padding: 0 16px;
    width: 100%;
    font-weight: bold;
    transition: background-color 0.2s;

    &:hover {
      background: ${shade(0.2, '#c84241')};
    }
  }

  .loading {
    width: 100%;
    height: 56px;
    border-radius: 10px;
    border: 0;
    padding: 0 16px;
    margin-top: 16px;
  }
`;
