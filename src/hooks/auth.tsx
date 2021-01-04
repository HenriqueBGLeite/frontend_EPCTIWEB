import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';

interface AuthState {
  token: string;
  usuario: object;
  homologacao: boolean;
}

interface SignInCredentials {
  nome: string;
  senha: string;
  base: string;
}

interface DTORotinas {
  codmodulo: number;
  descmodulo: string;
  submodulo: [
    {
      codmodulo: number;
      codsubmodulo: number;
      descsubmodulo: string;
      rotinas: [
        {
          codsubmodulo: number;
          codrotina: number;
          descrotina: string;
          acaorotina: string;
          nomerotina: string;
        },
      ];
    },
  ];
}

interface PesquisaMenu {
  listaMenu: {
    menu: DTORotinas[];
  };
}

interface AuthContextData {
  usuario: {
    filial: number;
    codigo: number;
    nome: string;
    base: string;
    acessoSistema: string;
    permiteAltDadosLogisticos: string;
    rotinas: DTORotinas[];
  };
  homologacao: boolean;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState(() => {
    const token = localStorage.getItem('@EpocaWeb:token');
    const usuario = localStorage.getItem('@EpocaWeb:user');

    if (token && usuario) {
      return { token, usuario: JSON.parse(usuario) };
    }

    return {} as AuthState;
  });

  const [baseURL, setBaseURL] = useState(false);

  const signIn = useCallback(async ({ nome, senha, base }) => {
    try {
      if (document.location.port === '8203') setBaseURL(true);

      const response = await api.post('Login/ValidaUsuario/', {
        nome,
        senha,
        base,
      });

      const { erro, warning, mensagemErroWarning } = response.data;

      if (erro === 'N' && warning === 'N') {
        const usuario = response.data;
        const { token } = usuario;

        localStorage.setItem('@EpocaWeb:token', token);
        localStorage.setItem('@EpocaWeb:base', base);

        const responseRotina = await api.get<PesquisaMenu>(
          `Menu/BuscarRotinas/${usuario.codigo}`,
        );

        const achouRotinas = responseRotina.data;

        if (achouRotinas !== undefined) {
          usuario.rotinas = achouRotinas.listaMenu;
        } else {
          throw new Error(
            'Usuário não possui acesso a nenhuma rotina. Entre em contato com a informática.',
          );
        }

        localStorage.setItem('@EpocaWeb:user', JSON.stringify(usuario));
        setData({ token, usuario });
      } else {
        throw new Error(mensagemErroWarning);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@EpocaWeb:token');
    localStorage.removeItem('@EpocaWeb:user');

    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider
      value={{ usuario: data.usuario, homologacao: baseURL, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
