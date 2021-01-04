import styled, { css } from 'styled-components';

interface Base {
  base: string;
}

export const Container = styled.div<Base>`
  max-height: 80vh;

  #lateral {
    padding: 0 50px 0 0;
    -moz-transition: all 0.5s ease;
    -webkit-transition: all 0.5s ease;
    -o-transition: all 0.5s ease;
    transition: all 0.5s ease;
    transition-delay: 500ms;

    font-size: 1.2em;

    ${(props) =>
      (props.base === 'EPOCA' || props.base === 'EPOCATST') &&
      css`
        background: #c22e2c;
        background-image: -moz-linear-gradient(135deg, rgb(3, 8, 12), #c22e2c);
        background-image: -webkit-linear-gradient(
          135deg,
          rgb(3, 8, 12),
          #c22e2c
        );
        background-image: -o-linear-gradient(135deg, rgb(3, 8, 12), #c22e2c);
        background-image: -ms-linear-gradient(135deg, rgb(3, 8, 12), #c22e2c);
        background-image: linear-gradient(135deg, rgb(3, 8, 12), #c22e2c);
      `}

    ${(props) =>
      props.base === 'MRURAL' &&
      css`
        background: #005129;
        background-image: -moz-linear-gradient(135deg, rgb(3, 8, 12), #005129);
        background-image: -webkit-linear-gradient(
          135deg,
          rgb(3, 8, 12),
          #005129
        );
        background-image: -o-linear-gradient(135deg, rgb(3, 8, 12), #005129);
        background-image: -ms-linear-gradient(135deg, rgb(3, 8, 12), #005129);
        background-image: linear-gradient(135deg, rgb(3, 8, 12), #005129);
      `}

    overflow: scroll;

    ::-webkit-scrollbar {
      width: 0px;
      background: transparent;
    }

    width: 350px;
    z-index: 1000;
    position: fixed;
    height: 100vh;
    top: 0;
    left: -310px;

    form {
      width: 100%;
      margin: 0px 16px 16px 16px;

      div {
        color: #878787 !important;
        border-color: #878787 !important;

        input {
          color: #fff !important;
        }
      }
    }
  }

  #lateral:before {
    z-index: 1000;
    font-size: 10em;
    color: white;
    position: fixed;
    left: 4px;
    top: 45px;
  }

  #lateral:hover:before,
  #lateral:focus:before {
    left: -400px;
    transition-delay: 300ms;
  }

  #lateral:hover,
  #lateral:focus,
  #lateral:active {
    -moz-transform: translate(308px, 0);
    -webkit-transform: translate(308px, 0);
    -o-transform: translate(308px, 0);
    transform: translate(308px, 0);
    padding-right: 0;
    position: fixed;
    transition-delay: 0ms;
  }

  #lateral .box {
    list-style-type: none;
    margin-bottom: 0.5em;
    padding-bottom: 0.5em;
    margin-left: 8px;

    button {
      background: transparent;
      border: none;
      width: 100%;
      text-align: left;
      font-size: 1em;
      color: #fff;
      border-bottom: 3px solid rgb(155, 155, 155);
    }

    li {
      list-style-type: none;
      margin: 8px 8px 8px 8px;
    }
  }

  @media (max-width: 500px) {
    body {
      margin-left: 0;
      background-size: 100% 28em !important;
    }

    #lateral {
      padding: 0;
      -moz-transition: all 0.5s ease;
      -webkit-transition: all 0.5s ease;
      -o-transition: all 0.5s ease;
      transition: all 0.5s ease;
      font-size: 1.2em;
      height: 100%;
      width: 100%;
      position: static;
      top: 0;
      left: 0;
    }

    #lateral:before {
      z-index: 1000;
      width: 0;
      text-align: center;
      content: '';
      font-size: 0;
      color: white;
      position: static;
      top: 0;
      left: 0;
      display: inline-block;
    }

    #lateral:hover,
    #lateral:focus {
      overflow: scroll;
      -moz-transform: none;
      -webkit-transform: none;
      -o-transform: none;
      transform: none;
    }
  }

  .naoEncontrou {
    margin: 0px 16px 16px 16px;
    font-size: 20px;
  }
`;

export const Header = styled.div`
  width: 110%;
  margin: 10px 15px;
  display: flex;
  justify-content: space-between;

  .titulo {
    display: inline-block;
    font-weight: bold;
    font-size: 1.2em;
    font-style: normal;
    padding-bottom: 0.2em;
    margin: 16px 0 8px 16px;
    color: rgb(255, 255, 255);
    border-bottom: 4px solid rgb(155, 155, 155);
  }

  svg {
    width: 30px;
    height: 30px;
  }
`;
