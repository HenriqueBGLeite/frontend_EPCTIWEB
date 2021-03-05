import React, { useEffect, useState, useCallback, useRef } from 'react';
import ReactLoading from 'react-loading';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { FiUser, FiLock, FiHome } from 'react-icons/fi';

import { useAuth } from '../../hooks/auth';
import getValidationErrors from '../../utils/getValidationErros';

import { createMessage } from '../../components/Toast';

import Input from '../../components/Input';
import Select from '../../components/Select';

import {
  Container,
  Content,
  AnimationContainer,
  Background,
  Loanding,
} from './styles';

interface SignInFormData {
  nome: string;
  senha: string;
  base: string;
}

interface BaseLista {
  value: string;
  label: string;
}

const SignIn: React.FC = () => {
  const base = localStorage.getItem('@EpocaWeb:base');
  const formRef = useRef<FormHandles>(null);
  const [baseLista, setBaseLista] = useState<BaseLista[]>([]);

  const { signIn } = useAuth();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setBaseLista([
      {
        value: 'EPOCA',
        label: 'EPOCA',
      },
      {
        value: 'MRURAL',
        label: 'MINAS RURAL',
      },
      {
        value: 'TESTEOCI',
        label: 'EPOCA NUVEM',
      },
      {
        value: 'EPOCATST',
        label: 'EPOCA TESTE',
      },
    ]);
  }, []);

  const handleSubmit = useCallback(
    async (data: SignInFormData) => {
      if (document.activeElement?.tagName === 'BUTTON') {
        setLoading(true);
        try {
          formRef.current?.setErrors({});

          const schema = Yup.object().shape({
            nome: Yup.string().required('Nome do usuário obrigatório.'),
            senha: Yup.string().required('Senha obrigatória.'),
            base: Yup.string().required('Base obrigatória.'),
          });

          await schema.validate(data, {
            abortEarly: false,
          });

          await signIn({
            nome: data.nome,
            senha: data.senha,
            base: data.base,
          });
        } catch (err) {
          if (err instanceof Yup.ValidationError) {
            const errors = getValidationErrors(err);

            formRef.current?.setErrors(errors);

            setLoading(false);
            return;
          }

          createMessage({
            type: 'error',
            message: `Erro ao realizar Login. ${err.message}`,
          });

          formRef.current?.setFieldValue('senha', null);
          document.getElementById('senha')?.focus();
          setLoading(false);
        }
      }
    },
    [signIn],
  );

  const focusCampo = useCallback((event) => {
    if (event.target.id === 'nome' && event.key === 'Enter') {
      document.getElementById('senha')?.focus();
    }
    if (event.target.id === 'senha' && event.key === 'Enter') {
      document.getElementById('entrar')?.focus();
    }
  }, []);

  return (
    <Container>
      <Background />
      <Content>
        <AnimationContainer homologacao={document.location.port === '8203'}>
          <Form ref={formRef} onSubmit={handleSubmit}>
            <p>
              Versão {document.location.port === '8203' ? 'de Homologação' : ''}
              : 05.03.21.01
            </p>
            <Input
              focus
              id="nome"
              name="nome"
              icon={FiUser}
              type="text"
              style={{ textTransform: 'uppercase' }}
              description="Nome do usuário"
              onKeyPress={(e) => focusCampo(e)}
            />
            <Input
              id="senha"
              name="senha"
              icon={FiLock}
              type="password"
              description="Senha do usuário"
              onKeyPress={(e) => focusCampo(e)}
              autoComplete="on"
            />
            <Select id="base" name="base" description="Empresa" icon={FiHome}>
              {baseLista
                .filter((ba) => ba.value === String(base))
                .map((ba) => (
                  <option key={ba.value} value={ba.value}>
                    {ba.label}
                  </option>
                ))}
              {baseLista
                .filter((ba) => ba.value !== String(base))
                .map((ba) => (
                  <option key={ba.value} value={ba.value}>
                    {ba.label}
                  </option>
                ))}
            </Select>

            <Loanding>
              {!loading ? (
                <button id="entrar" type="submit">
                  Entrar
                </button>
              ) : (
                <ReactLoading
                  className="loading"
                  type="spokes"
                  width="100px"
                  color="#c22e2c"
                />
              )}
            </Loanding>
          </Form>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default SignIn;
