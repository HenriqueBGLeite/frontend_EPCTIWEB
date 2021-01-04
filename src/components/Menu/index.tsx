import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FiSearch, FiMenu } from 'react-icons/fi';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import { useHistory } from 'react-router-dom';

import Input from '../Input';

import { useAuth } from '../../hooks/auth';

import { Container, Header } from './style';

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

interface DTOSubModulo {
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
}

const Menu: React.FC = () => {
  const { usuario } = useAuth();
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();
  const [rotinas, setRotinas] = useState<DTORotinas[]>([]);
  const [ativaFiltro, setAtivaFiltro] = useState(false);
  const [rotinasFiltradas, setRotinasFiltradas] = useState<DTORotinas[]>([]);

  useEffect(() => {
    setRotinas(usuario.rotinas as DTORotinas[]);
  }, [usuario]);

  const copyModulo = useCallback((mod: DTORotinas) => {
    return { ...mod };
  }, []);

  const copySubModulo = useCallback((sub: DTOSubModulo) => {
    return { ...sub };
  }, []);

  const filtraRotina = useCallback(
    ({ filtroRotina }) => {
      if (!String(filtroRotina)) {
        setRotinasFiltradas([]);
        setRotinas(usuario.rotinas as DTORotinas[]);
        setAtivaFiltro(false);
      } else {
        setAtivaFiltro(true);

        const filtroRotinas = rotinas.map(copyModulo).filter((mod) => {
          if (mod.submodulo) {
            const filtro = mod.submodulo.map(copySubModulo).filter((sub) => {
              if (sub.rotinas) {
                const filtroRot = sub.rotinas.filter((rot) =>
                  rot.nomerotina
                    .toUpperCase()
                    .includes(filtroRotina.toUpperCase()),
                );

                const array = [] as any; //eslint-disable-line

                filtroRot.map((fi) => array.push(fi));

                const resposta = (sub.rotinas = array).length;
                return resposta;
              }

              return false;
            });

            const array = [] as any; //eslint-disable-line

            filtro.map((fi) => array.push(fi));

            const resposta = (mod.submodulo = array).length;
            return resposta;
          }

          return false;
        });

        setRotinasFiltradas(filtroRotinas);
      }
    },
    [rotinas, copyModulo, copySubModulo, usuario.rotinas],
  );

  const abrirRotina = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        const redirecionar =
          rotinasFiltradas[0].submodulo[0].rotinas[0].acaorotina;

        history.push(`/dashboard${redirecionar}`);
      }
    },
    [rotinasFiltradas, history],
  );
  return (
    <Container base={usuario.base}>
      <div id="lateral">
        <nav className="nav">
          <Header>
            <h3 className="titulo">
              {usuario.nome} - Filial: {usuario.filial}
            </h3>
            <FiMenu />
          </Header>
          <Form ref={formRef} onSubmit={filtraRotina}>
            <Input
              percWidth={80}
              name="filtroRotina"
              icon={FiSearch}
              description="Buscar rotinas"
              style={{ textTransform: 'uppercase' }}
              onChange={(e) => filtraRotina({ filtroRotina: e.target.value })}
              onKeyPress={(e) => abrirRotina(e)}
            />
          </Form>
          {rotinasFiltradas.length > 0 ? (
            <>
              {rotinasFiltradas?.map((modulo) => (
                <Accordion activeIndex={[0]} multiple key={modulo.codmodulo}>
                  <AccordionTab
                    header={`${modulo.codmodulo} - ${modulo.descmodulo}`}
                    key={modulo.codmodulo}
                  >
                    <ul id="modulo" className="box" key={modulo.codmodulo}>
                      {modulo.submodulo.map((submodulo) => (
                        <Accordion
                          activeIndex={[0]}
                          multiple
                          key={submodulo.codsubmodulo}
                        >
                          <AccordionTab
                            header={`${submodulo.codsubmodulo} - ${submodulo.descsubmodulo}`}
                            key={submodulo.codsubmodulo}
                          >
                            <ul
                              id="submodulo"
                              className="box"
                              key={submodulo.codsubmodulo}
                            >
                              {submodulo.rotinas.map((rotina) => (
                                <li key={rotina.codrotina}>
                                  <button
                                    type="button"
                                    onClick={() => history.push(`/dashboard${rotina.acaorotina}`)} //eslint-disable-line
                                  >
                                    {rotina.codrotina} - {rotina.descrotina}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </AccordionTab>
                        </Accordion>
                      ))}
                    </ul>
                  </AccordionTab>
                </Accordion>
              ))}
            </>
          ) : (
            <>
              {!ativaFiltro ? (
                <Accordion multiple>
                  {rotinas?.map((modulo) => (
                    <AccordionTab
                      header={`${modulo.codmodulo} - ${modulo.descmodulo}`}
                      key={modulo.codmodulo}
                    >
                      <ul id="modulo" className="box" key={modulo.codmodulo}>
                        {modulo.submodulo.map((submodulo) => (
                          <Accordion multiple key={submodulo.codsubmodulo}>
                            <AccordionTab
                              header={`${submodulo.codsubmodulo} - ${submodulo.descsubmodulo}`}
                              key={submodulo.codsubmodulo}
                            >
                              <ul
                                id="submodulo"
                                className="box"
                                key={submodulo.codsubmodulo}
                              >
                                {submodulo.rotinas.map((rotina) => (
                                  <li key={rotina.codrotina}>
                                    <button
                                      type="button"
                                      onClick={() => history.push(`/dashboard${rotina.acaorotina}`)} //eslint-disable-line
                                    >
                                      {rotina.codrotina} - {rotina.descrotina}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </AccordionTab>
                          </Accordion>
                        ))}
                      </ul>
                    </AccordionTab>
                  ))}
                </Accordion>
              ) : (
                <h3 className="naoEncontrou">
                  Nenhuma rotina foi encontrada :(
                </h3>
              )}
            </>
          )}
        </nav>
      </div>
    </Container>
  );
};

export default Menu;
