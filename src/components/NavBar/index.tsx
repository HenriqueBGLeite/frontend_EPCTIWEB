import React from 'react';
import { useHistory } from 'react-router-dom';
import { FiLogOut, FiArrowLeft } from 'react-icons/fi';

import { useAuth } from '../../hooks/auth';

import { Container, TituloRotina } from './style';

interface NavBarProps {
  paginaAtual: string;
  caminho: string;
}

const NavBar: React.FC<NavBarProps> = (props) => {
  const history = useHistory();
  const { signOut, usuario, homologacao } = useAuth();
  const { paginaAtual, caminho } = props;
  const validaButtonSair = history.location.pathname;

  return (
    <Container base={usuario.base}>
      <div />
      <TituloRotina>
        {homologacao ? 'HOMOLOGAÇÃO - ' : ''}
        {paginaAtual}
      </TituloRotina>
      {validaButtonSair === '/dashboard' ? (
        <button type="button" onClick={signOut}>
          <FiLogOut />
          Sair
        </button>
      ) : (
        <button type="button" onClick={() => history.push(caminho)}>
          <FiArrowLeft />
          Voltar
        </button>
      )}
    </Container>
  );
};

export default NavBar;
