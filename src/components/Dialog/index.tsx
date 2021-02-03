import React, { useEffect, useState, useCallback } from 'react';
import { FiCheck, FiX, FiPrinter } from 'react-icons/fi';
import { TiWarning } from 'react-icons/ti';
import ReactLoading from 'react-loading';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog as DialogPrime } from 'primereact/dialog';

import { formataReais } from '../../utils/formataValor';
import formataRelatorio from '../../utils/formataRelatorioPdf';

import { useAuth } from '../../hooks/auth';
import { createMessage } from '../Toast';
import api from '../../services/api';
import apiRelatorios from '../../services/relatorios';

import { Container, Footer, Divisor, CheckBox, Loading } from './styles';

interface DialogProps {
  title: string;
  message?: string;
  modeloDialog: 'G' | 'I' | 'E' | 'C';
  tipoSeparacao: 'C' | 'A' | 'P';
  numcar?: number;
  numtranswms?: string;
  executar: Function;
}

interface BoxData {
  codbox: number;
  descricao: string;
}

interface ImpressaoProps {
  mapaSeparacao: boolean;
  etiqueta13: boolean;
  etiqueta20: boolean;
  etiqueta17: boolean;
  mapaSeparacaoAntecipado: boolean;
  etiqueta13Antecipada: boolean;
}

interface CortesDTO {
  codfilial: number;
  numtranswms: number;
  numos: number;
  tipoos: number;
  numpalete: number;
  produto: string;
  qtos: number;
  qtconf: number;
  qtcorte: number;
  qtfaturar: number;
  vlcorte: number;
  vlcorteformatado: string;
  vlcortetotal: number;
  vlcortetotalformatado: string;
}

interface EstornoCarregamento {
  codfilial: number;
  numcar: number;
  numpalete: number;
  numtranswms: number;
  numbox: number;
  numos: number;
  cliente: string;
  tipoos: number;
  produto: string;
}

const Dialog: React.FC<DialogProps> = (props) => {
  const {
    title,
    message,
    modeloDialog,
    tipoSeparacao,
    numcar,
    numtranswms,
    executar,
  } = props;
  const { usuario } = useAuth();

  const [loading, setLoading] = useState(false);
  const [loadingImpEstorno, setLoadingImpEstorno] = useState(false);
  const [action, setAction] = useState(false);
  const [box, setBox] = useState<BoxData[]>([]);
  const [boxSelecionado, setBoxSelecionado] = useState(0);
  const [mapaSeparacao, setMapaSeparacao] = useState(false);
  const [etiqueta13, setEtiqueta13] = useState(false);
  const [etiqueta20, setEtiqueta20] = useState(false);
  const [etiqueta17, setEtiqueta17] = useState(false);
  const [mapaSeparacaoAntecipado, setMapaSeparacaoAntecipado] = useState(false);
  const [etiqueta13Antecipada, setEtiqueta13Antecipada] = useState(false);
  const [cortes, setCortes] = useState<CortesDTO[]>([]);
  const [estornoCarga, setEstornoCarga] = useState<EstornoCarregamento[]>([]);

  useEffect(() => {
    if (tipoSeparacao !== 'C' && modeloDialog === 'G') {
      api
        .get<BoxData[]>(`Rotina9950/BoxFilial/${usuario.filial}`)
        .then((response) => {
          const achouBox = response.data;

          if (achouBox.length > 0) {
            setBox(achouBox);
            document.getElementById('inputBox')?.focus();
          } else {
            createMessage({
              type: 'error',
              message: 'Nenhum box foi encontrado para a filial.',
            });
          }
        })
        .catch((err) => {
          createMessage({
            type: 'error',
            message: `Error: ${err.message}`,
          });
        });
    } else if (modeloDialog === 'C') {
      setLoading(true);
      if (tipoSeparacao === 'C') {
        api
          .get<CortesDTO[]>(`Rotina9950/BuscaCortes/${numcar}/${tipoSeparacao}`)
          .then((response) => {
            const achouCortes = response.data;

            if (achouCortes.length > 0) {
              achouCortes.map((corte) => {
                const valorFormatado = formataReais(corte.vlcorte);
                const valorTotalFormatado = formataReais(corte.vlcortetotal);

                corte.vlcorteformatado = valorFormatado;
                corte.vlcortetotalformatado = valorTotalFormatado;

                return corte;
              });

              setCortes(achouCortes);
              setLoading(false);
            } else {
              createMessage({
                type: 'alert',
                message: `Nenhum corte encontrado para o carregamento: ${numcar}.`,
              });
              setLoading(false);
              document.getElementById('cancelar')?.click();
            }
          })
          .catch((err) => {
            createMessage({
              type: 'error',
              message: `Error: ${err.message}`,
            });
            setLoading(false);
          });
      } else {
        api
          .get<CortesDTO[]>(
            `Rotina9950/BuscaCortes/${numtranswms}/${tipoSeparacao}`,
          )
          .then((response) => {
            const achouCortes = response.data;

            if (achouCortes.length > 0) {
              achouCortes.map((corte) => {
                const valorFormatado = formataReais(corte.vlcorte);
                const valorTotalFormatado = formataReais(corte.vlcortetotal);

                corte.vlcorteformatado = valorFormatado;
                corte.vlcortetotalformatado = valorTotalFormatado;

                return corte;
              });

              setCortes(achouCortes);
              setLoading(false);
            } else {
              createMessage({
                type: 'alert',
                message: `Nenhum corte encontrado para a transação: ${numtranswms}.`,
              });
              setLoading(false);
              document.getElementById('cancelar')?.click();
            }
          })
          .catch((err) => {
            createMessage({
              type: 'error',
              message: `Error: ${err.message}`,
            });
            setLoading(false);
          });
      }
    } else if (modeloDialog === 'E') {
      setLoading(true);
      let valorPesquisa;

      if (tipoSeparacao === 'C') {
        valorPesquisa = numcar;
      } else {
        valorPesquisa = numtranswms;
      }

      const dataPesquisa = {
        tipoPesquisa: tipoSeparacao,
        valorPesquisa,
      };

      api
        .post<EstornoCarregamento[]>(`Rotina9950/BuscaEstorno/`, dataPesquisa)
        .then((response) => {
          const achouEstorno = response.data;

          if (achouEstorno.length > 0) {
            setEstornoCarga(achouEstorno);
            setLoading(false);
          } else {
            createMessage({
              type: 'alert',
              message: `Nenhum registro encontrado para realizar o estorno.`,
            });
            setLoading(false);
            document.getElementById('cancelar')?.click();
          }
        })
        .catch((err) => {
          createMessage({
            type: 'error',
            message: `Error: ${err.message}`,
          });
          setLoading(false);
        });
    }
  }, [tipoSeparacao, modeloDialog, usuario, numcar, numtranswms]);

  const imprimirEstorno = useCallback(async () => {
    try {
      setLoading(true);
      setLoadingImpEstorno(true);

      let params;

      if (tipoSeparacao === 'C') {
        params = {
          app: 'EPCWMS',
          tipousu: 'U',
          matricula: usuario.codigo,
          tamanho: 'G',
          nrorel: 9035,
          pNumcar: numcar,
        };
      } else {
        params = {
          app: 'EPCWMS',
          tipousu: 'U',
          matricula: usuario.codigo,
          tamanho: 'G',
          nrorel: 9035,
          pNumtranswms: numtranswms,
        };
      }

      const response = await apiRelatorios.get('servdw/REL/relatorio', {
        params,
      });

      const relatorio = formataRelatorio(response.data);

      window.open(relatorio);
      setLoadingImpEstorno(false);
      setLoading(false);
    } catch (err) {
      createMessage({
        type: 'error',
        message: `Error: ${err.message}`,
      });
      setLoadingImpEstorno(false);
      setLoading(false);
    }
  }, [numcar, numtranswms, tipoSeparacao, usuario.codigo]);

  const footer = useCallback(() => {
    const propsImpressao = {
      mapaSeparacao,
      etiqueta13,
      etiqueta17,
      etiqueta20,
      mapaSeparacaoAntecipado,
      etiqueta13Antecipada,
    } as ImpressaoProps;

    return (
      <Footer>
        {tipoSeparacao !== 'C' && modeloDialog === 'G' ? (
          <>
            {boxSelecionado > 0 ? (
              <button
                type="submit"
                onClick={() => executar(true, boxSelecionado)}
              >
                <FiCheck /> Confirmar
              </button>
            ) : (
              <button type="button" disabled>
                <FiCheck /> Confirmar
              </button>
            )}
            <button type="button" onClick={() => executar(false)}>
              <FiX /> Cancelar
            </button>
          </>
        ) : (
          <>
            {modeloDialog === 'I' ? (
              <>
                <button
                  type="submit"
                  onClick={() => executar(true, propsImpressao)}
                >
                  <FiCheck /> Confirmar
                </button>
                <button type="button" onClick={() => executar(false)}>
                  <FiX /> Cancelar
                </button>
              </>
            ) : (
              <>
                {modeloDialog === 'E' ? (
                  <button type="button" onClick={() => imprimirEstorno()}>
                    <FiPrinter /> Imprimir
                  </button>
                ) : (
                  <> </>
                )}
                <button type="submit" onClick={() => executar(true)}>
                  <FiCheck /> Confirmar
                </button>
                <button
                  id="cancelar"
                  type="button"
                  onClick={() => executar(false)}
                >
                  <FiX /> Cancelar
                </button>
              </>
            )}
          </>
        )}
      </Footer>
    );
  }, [
    executar,
    tipoSeparacao,
    boxSelecionado,
    modeloDialog,
    mapaSeparacao,
    etiqueta13,
    etiqueta17,
    etiqueta20,
    mapaSeparacaoAntecipado,
    etiqueta13Antecipada,
    imprimirEstorno,
  ]);

  const filtraImpressao = useCallback(
    (campo: string): void => {
      if (campo === 'M13') {
        if (mapaSeparacao !== true) {
          setMapaSeparacao(true);
        } else {
          setMapaSeparacao(false);
        }
      } else if (campo === 'E13') {
        if (etiqueta13 !== true) {
          setEtiqueta13(true);
        } else {
          setEtiqueta13(false);
        }
      } else if (campo === 'E17') {
        if (etiqueta17 !== true) {
          setEtiqueta17(true);
        } else {
          setEtiqueta17(false);
        }
      } else if (campo === 'E20') {
        if (etiqueta20 !== true) {
          setEtiqueta20(true);
        } else {
          setEtiqueta20(false);
        }
      } else if (campo === 'M13A') {
        if (mapaSeparacaoAntecipado !== true) {
          setMapaSeparacaoAntecipado(true);
        } else {
          setMapaSeparacaoAntecipado(false);
        }
      } else if (campo === 'E13A') {
        if (etiqueta13Antecipada !== true) {
          setEtiqueta13Antecipada(true);
        } else {
          setEtiqueta13Antecipada(false);
        }
      }
    },
    [
      mapaSeparacao,
      etiqueta13,
      etiqueta17,
      etiqueta20,
      mapaSeparacaoAntecipado,
      etiqueta13Antecipada,
    ],
  );

  return (
    <DialogPrime
      header={
        modeloDialog === 'C' || modeloDialog === 'E' ? //eslint-disable-line
        ( //eslint-disable-line
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '30px',
              color: 'red',
            }}
          >
            <TiWarning style={{ marginRight: '6px' }} /> {title}
          </div>
        ) : (
          title
        )
      } //eslint-disable-line
      visible
      style={
        modeloDialog === 'C' || modeloDialog === 'E'
          ? { width: '70vw', fontWeight: 'bold', fontSize: '16px' }
          : { width: '30vw', fontWeight: 'bold', fontSize: '16px' }
      }
      onHide={() => setAction(action)}
      blockScroll
      footer={footer()}
      closable={false}
    >
      <Container>
        {tipoSeparacao !== 'C' && modeloDialog === 'G' ? (
          <>
            <p>{message}</p>
            <input
              type="number"
              id="inputBox"
              name="listaBox"
              list="listaBox"
              className="inputBox"
              onChange={(e) => setBoxSelecionado(Number(e.target.value))}
            />
            <datalist id="listaBox">
              {box.map((lista) => (
                <option key={lista.codbox} value={lista.codbox}>
                  {lista.descricao}
                </option>
              ))}
            </datalist>
          </>
        ) : (
          <>
            {modeloDialog === 'I' ? (
              <>
                <CheckBox>
                  {tipoSeparacao !== 'A' ? (
                    <>
                      <h1>Separação Carga/Pedido</h1>
                      <label htmlFor="mapaSeparacao">
                        <input
                          id="mapaSeparacao"
                          name="mapaSeparacao"
                          type="checkbox"
                          checked={mapaSeparacao}
                          onChange={() => filtraImpressao('M13')}
                        />
                        Mapa Separação (E.T.)
                      </label>
                      <label htmlFor="etiqueta13">
                        <input
                          id="etiqueta13"
                          name="etiqueta13"
                          type="checkbox"
                          checked={etiqueta13}
                          onChange={() => filtraImpressao('E13')}
                        />
                        Etiqueta O.S. tipo 13 (E.T.)
                      </label>
                      <Divisor />
                      <label htmlFor="etiqueta17">
                        <input
                          id="etiqueta17"
                          name="etiqueta17"
                          type="checkbox"
                          checked={etiqueta17}
                          onChange={() => filtraImpressao('E17')}
                        />
                        Etiqueta O.S. tipo 17 (Pulmão Box)
                      </label>
                      <Divisor />
                      <label htmlFor="etiqueta20">
                        <input
                          id="etiqueta20"
                          name="etiqueta20"
                          type="checkbox"
                          checked={etiqueta20}
                          onChange={() => filtraImpressao('E20')}
                        />
                        Etiqueta O.S. tipo 20 (Caixaria)
                      </label>
                      {tipoSeparacao === 'C' ? (
                        <>
                          <Divisor />
                          <h1>Separação Antecipada</h1>
                          <label htmlFor="mapaSeparacaoAntecipado">
                            <input
                              id="mapaSeparacaoAntecipado"
                              name="mapaSeparacaoAntecipado"
                              type="checkbox"
                              checked={mapaSeparacaoAntecipado}
                              onChange={() => filtraImpressao('M13A')}
                            />
                            Mapa de separação (E.T. - Antecipado)
                          </label>
                          <label htmlFor="etiqueta13Antecipado">
                            <input
                              id="etiqueta13Antecipado"
                              name="etiqueta13Antecipado"
                              type="checkbox"
                              checked={etiqueta13Antecipada}
                              onChange={() => filtraImpressao('E13A')}
                            />
                            Etiqueta O.S. tipo 13 (Antecipado)
                          </label>
                        </>
                      ) : (
                        <> </>
                      )}
                    </>
                  ) : (
                    <>
                      <h1>Separação Antecipada</h1>
                      <label htmlFor="mapaSeparacaoAntecipado">
                        <input
                          id="mapaSeparacaoAntecipado"
                          name="mapaSeparacaoAntecipado"
                          type="checkbox"
                          checked={mapaSeparacaoAntecipado}
                          onChange={() => filtraImpressao('M13A')}
                        />
                        Mapa de separação (E.T. - Antecipado)
                      </label>
                      <label htmlFor="etiqueta13Antecipado">
                        <input
                          id="etiqueta13Antecipado"
                          name="etiqueta13Antecipado"
                          type="checkbox"
                          checked={etiqueta13Antecipada}
                          onChange={() => filtraImpressao('E13A')}
                        />
                        Etiqueta O.S. tipo 13 (Antecipado)
                      </label>
                    </>
                  )}
                </CheckBox>
              </>
            ) : (
              <>
                {modeloDialog === 'C' ? (
                  <>
                    {!loading ? (
                      <>
                        {numcar !== undefined ? (
                          <DataTable
                            header={
                              cortes.length > 0
                                ? `Cortes da carga: ${numcar}. Valor total de corte: ${cortes[0].vlcortetotalformatado}`
                                : `Cortes da carga: ${numcar}.`
                            }
                            value={cortes}
                            scrollable
                            scrollHeight="200px"
                            style={{ width: '100%' }}
                          >
                            <Column
                              field="codfilial"
                              header="Filial"
                              style={{ width: '40px' }}
                              bodyStyle={{ textAlign: 'right' }}
                            />
                            <Column
                              field="numtranswms"
                              header="Transação"
                              style={{ width: '80px' }}
                              bodyStyle={{ textAlign: 'right' }}
                            />
                            <Column
                              field="numos"
                              header="Núm. O.S."
                              style={{ width: '70px' }}
                              bodyStyle={{ textAlign: 'right' }}
                            />
                            <Column
                              field="tipoos"
                              header="Tipo O.S."
                              style={{ width: '55px' }}
                              bodyStyle={{ textAlign: 'right' }}
                            />
                            <Column
                              field="numpalete"
                              header="Palete"
                              style={{ width: '55px' }}
                              bodyStyle={{ textAlign: 'right' }}
                            />
                            <Column
                              field="produto"
                              header="Produto"
                              style={{ width: '220px' }}
                            />
                            <Column
                              field="qtos"
                              header="Qt. O.S."
                              style={{ width: '40px' }}
                              bodyStyle={{ textAlign: 'right' }}
                            />
                            <Column
                              field="qtconf"
                              header="Qt. Conf."
                              style={{ width: '40px' }}
                              bodyStyle={{ textAlign: 'right' }}
                            />
                            <Column
                              field="qtcorte"
                              header="Qt. Corte"
                              style={{ width: '45px' }}
                              bodyStyle={{ textAlign: 'right' }}
                            />
                            <Column
                              field="qtfaturar"
                              header="Qt. Fat."
                              style={{ width: '40px' }}
                              bodyStyle={{ textAlign: 'right' }}
                            />
                            <Column
                              field="vlcorteformatado"
                              header="Vl. Corte"
                              style={{ width: '80px' }}
                              bodyStyle={{ textAlign: 'right' }}
                            />
                          </DataTable>
                        ) : (
                          <DataTable
                            header={
                              cortes.length > 0
                                ? `Cortes da transação: ${numtranswms}. Valor total de corte: ${cortes[0].vlcortetotalformatado}`
                                : `Cortes da transação: ${numtranswms}.`
                            }
                            value={cortes}
                            scrollable
                            scrollHeight="200px"
                            style={{ width: '100%' }}
                          >
                            <Column
                              field="codfilial"
                              header="Filial"
                              style={{ width: '40px' }}
                              bodyStyle={{ textAlign: 'right' }}
                            />
                            <Column
                              field="numtranswms"
                              header="Transação"
                              style={{ width: '80px' }}
                              bodyStyle={{ textAlign: 'right' }}
                            />
                            <Column
                              field="numos"
                              header="Núm. O.S."
                              style={{ width: '70px' }}
                              bodyStyle={{ textAlign: 'right' }}
                            />
                            <Column
                              field="tipoos"
                              header="Tipo O.S."
                              style={{ width: '55px' }}
                              bodyStyle={{ textAlign: 'right' }}
                            />
                            <Column
                              field="numpalete"
                              header="Palete"
                              style={{ width: '55px' }}
                              bodyStyle={{ textAlign: 'right' }}
                            />
                            <Column
                              field="produto"
                              header="Produto"
                              style={{ width: '220px' }}
                            />
                            <Column
                              field="qtos"
                              header="Qt. O.S."
                              style={{ width: '40px' }}
                              bodyStyle={{ textAlign: 'right' }}
                            />
                            <Column
                              field="qtconf"
                              header="Qt. Conf."
                              style={{ width: '40px' }}
                              bodyStyle={{ textAlign: 'right' }}
                            />
                            <Column
                              field="qtcorte"
                              header="Qt. Corte"
                              style={{ width: '45px' }}
                              bodyStyle={{ textAlign: 'right' }}
                            />
                            <Column
                              field="qtfaturar"
                              header="Qt. Fat."
                              style={{ width: '40px' }}
                              bodyStyle={{ textAlign: 'right' }}
                            />
                            <Column
                              field="vlcorteformatado"
                              header="Vl. Corte"
                              style={{ width: '80px' }}
                              bodyStyle={{ textAlign: 'right' }}
                            />
                          </DataTable>
                        )}
                      </>
                    ) : (
                      <Loading>
                        <ReactLoading
                          className="loading"
                          type="spokes"
                          width="100px"
                          color="#c22e2c"
                        />
                        <h1>Carregando cortes, aguarde...</h1>
                      </Loading>
                    )}
                  </>
                ) : (
                  <>
                    {modeloDialog === 'E' ? (
                      <>
                        {!loading ? (
                          <DataTable
                            header="Registros relacionados para o estorno"
                            value={estornoCarga}
                            scrollable
                            scrollHeight="200px"
                            style={{ width: '100%' }}
                          >
                            <Column
                              field="codfilial"
                              header="Filial"
                              style={{ width: '35px' }}
                              bodyStyle={{ textAlign: 'right' }}
                            />
                            <Column
                              field="numcar"
                              header="Carga"
                              style={{ width: '70px' }}
                              bodyStyle={{ textAlign: 'right' }}
                            />
                            <Column
                              field="numpalete"
                              header="Palete"
                              style={{ width: '55px' }}
                              bodyStyle={{ textAlign: 'right' }}
                            />
                            <Column
                              field="numtranswms"
                              header="Transação"
                              style={{ width: '70px' }}
                              bodyStyle={{ textAlign: 'right' }}
                            />
                            <Column
                              field="numbox"
                              header="Box"
                              style={{ width: '65px' }}
                              bodyStyle={{ textAlign: 'right' }}
                            />
                            <Column
                              field="numos"
                              header="Núm. O.S."
                              style={{ width: '65px' }}
                              bodyStyle={{ textAlign: 'right' }}
                            />
                            <Column
                              field="cliente"
                              header="Cliente"
                              style={{ width: '190px' }}
                            />
                            <Column
                              field="tipoos"
                              header="Tipo O.S."
                              style={{ width: '55px' }}
                              bodyStyle={{ textAlign: 'right' }}
                            />
                            <Column
                              field="produto"
                              header="Produto"
                              style={{ width: '200px' }}
                            />
                          </DataTable>
                        ) : (
                          <Loading>
                            <ReactLoading
                              className="loading"
                              type="spokes"
                              width="100px"
                              color="#c22e2c"
                            />
                            {loadingImpEstorno ? (
                              <h1>
                                Imprimindo relatório de estorno, aguarde...
                              </h1>
                            ) : (
                              <h1>
                                Carregando relatório de estorno, aguarde...
                              </h1>
                            )}
                          </Loading>
                        )}
                      </>
                    ) : (
                      <p>{message}</p>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
      </Container>
    </DialogPrime>
  );
};

export default Dialog;
