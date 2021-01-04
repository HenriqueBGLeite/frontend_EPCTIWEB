import React from 'react';
import logo from '../../assets/logo.svg';

import NavBar from '../../components/NavBar';

import { Container, Content } from './styles';

const Dashboard: React.FC = () => {
  return (
    <>
      <NavBar paginaAtual="MENU PRINCIPAL" caminho="/" />
      <Container>
        <Content>
          <img src={logo} alt="EPOCA LOGO" />
        </Content>
      </Container>
    </>
  );
};

export default Dashboard;
