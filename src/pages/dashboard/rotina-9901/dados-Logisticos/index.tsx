import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  FiPlusSquare,
  FiEdit,
  FiSettings,
  FiPlusCircle,
  FiSave,
  FiPrinter,
  FiTrash2,
  FiRepeat,
  FiPackage,
  FiXOctagon,
} from 'react-icons/fi';
import { useHistory } from 'react-router';
import ReactLoading from 'react-loading';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import getValidationErrors from '../../../../utils/getValidationErros';

import Dialog from './components/Dialog-Dados-Log';
import DialogImpressao from './components/Dialog-Impressao';

import { useAuth } from '../../../../hooks/auth';
import api from '../../../../services/api';
import apiRelatorios from '../../../../services/relatorios';
import formataRelatorio from '../../../../utils/formataRelatorioPdf';
import { createMessage } from '../../../../components/Toast';

import NavBar from '../../../../components/NavBar';
import Input from '../../../../components/Input';
import Select from '../../../../components/Select';
import DialogConfirmacao from '../../../../components/Dialog-Generico';

import {
  Container,
  Content,
  Fieldset,
  FieldsetDados,
  CheckRadio,
  CheckBox,
  Loanding,
  Button,
} from './styles';

interface Produto {
  codprod: number;
  filial: number;
}

interface DataProduto {
  codfilial: number;
  descFilial: string;
  codprod: number;
  descricao: string;
  // Dados do Master
  dun: number;
  embalagemMaster: string;
  codigoFabrica: string;
  unidadeMaster: string;
  qtunitcx: number;
  alturaCx: number;
  larguraCx: number;
  comprimentoCx: number;
  volumeCxM3: number;
  pesoLiqCx: number;
  pesoBrutoCx: number;
  // Dados do Unit
  ean: number;
  embalagem: string;
  unidade: string;
  qtunit: number;
  alturaUn: number;
  larguraUn: number;
  comprimentoUn: number;
  volumeUnM3: number;
  pesoLiqUn: number;
  pesoBrutoUn: number;
  // Parametros Gerais
  tipoNorma: string;
  lastro: number;
  camada: number;
  totPalete: number;
  pesoPalete: number;
  prazoValidade: number;
  percShelfLife: number;
  enderecamentoCubagem: string;
  tipoEndereco: number;
  tipoEstrutura: number;
  caracteristicaProduto: number;
  tipoCarga: number;
  abastecePaleteFechado: string;
  abastecePaleteFechadoCx: string;
  tipoProduto: number;
  expedeCxFechada: string;
  validaCpPkAbastecimento: string;
  usaControleVal: string;
  usaControleValPk: string;
  nivelMinimoAbastecimento: number;
  nivelMaximoAbastecimento: number;
  restricaoBlocado: number;
  usaPulmaoRegulador: string;
  tipoVariacao: string;
  tipoEstoque: string;
  pesoVariavel: string;
  fracionado: string;
  estoquePorLote: string;
  multiplicadorConf: string;
  codFunc?: number;
  // Picking
  picking: [
    {
      codprod: number;
      descricao: string;
      codfilial: number;
      descFilial: string;
      codTipoEndereco: number;
      descTipoEndereco: string;
      codTipoEstrutura: number;
      descTipoEstrutura: string;
      tipoPicking: string;
      codEndereco: number;
      codEnderecoAnterior: number;
      deposito: number;
      rua: number;
      predio: number;
      nivel: number;
      apto: number;
      capacidade: number;
      percPontoReposicao: number;
      pontoReposicao: number;
      permiteTransfPk: string;
      permiteExcluirPk: string;
    },
  ];
  // Endereços de loja
  enderecoLoja: [
    {
      codEndereco: number;
    },
  ];
  // Emb. Auxiliar
  embalagemAuxliar: [
    {
      codprod: number;
      descricao: string;
      codfilial: number;
      descFilial: string;
      codBarra: number;
      embalagem: string;
      unidade: string;
      qtunit: number;
    },
  ];
  // Cod. Barras Alternativo
  codBarrasAlternativo: [
    {
      codprod: number;
      descricao: string;
      codfilial: number;
      descFilial: string;
      codBarra: number;
      embalagem: string;
      unidade: string;
      qtunit: number;
    },
  ];
  enderecosWms: [
    {
      codEndereco: number;
      tipoEndereco: string;
      deposito: number;
      rua: number;
      predio: number;
      nivel: number;
      apto: number;
      qt: number;
    },
  ];
}

interface DataListProduto {
  tipoEndereco: [
    {
      codigo: number;
      descricao: string;
    },
  ];
  tipoEstrutura: [
    {
      codigo: number;
      descricao: string;
    },
  ];
  caracteristicaProduto: [
    {
      codigo: number;
      descricao: string;
    },
  ];
}

interface DataPicking {
  codprod: number;
  descricao: string;
  codfilial: number;
  descFilial: string;
  codTipoEndereco: number;
  tipoEndereco?: number;
  descTipoEndereco: string;
  tipoEstrutura?: number;
  codTipoEstrutura: number;
  descTipoEstrutura: string;
  tipoPicking: string;
  codEndereco: number;
  codEnderecoAnterior: number;
  deposito: number;
  rua: number;
  predio: number;
  nivel: number;
  apto: number;
  capacidade: number;
  percPontoReposicao: number;
  percReposicao?: number;
  pontoReposicao: number;
  permiteTransfPk: string;
  permiteExcluirPk: string;
}

interface DataEndLoja {
  codEndereco: number;
}

interface DataEmbAuxiliar {
  codprod: number;
  descricao: string;
  codfilial: number;
  descFilial: string;
  codBarra: number;
  embalagem: string;
  unidade: string;
  qtunit: number;
}

interface DataCodBarraAlt {
  codprod: number;
  descricao: string;
  codfilial: number;
  descFilial: string;
  codBarra: number;
  embalagem: string;
  unidade: string;
  qtunit: number;
}

interface ImpressaoProps {
  master: boolean;
  venda: boolean;
  auxiliar: boolean;
  alternativo: boolean;
}

interface DTOImpressoes {
  app: 'EPCWMS';
  tipousu: 'U';
  matricula: number;
  tamanho: 'G';
  nrorel: 9041;
  pCodfilial: number;
  pCodprod: number;
  pFiltro: number;
}

const DadosLogistico: React.FC = () => {
  const { usuario } = useAuth();
  const history = useHistory();
  const parametros = history.location.state as Produto;
  const formRefDados = useRef<FormHandles>(null);
  const formRefParametros = useRef<FormHandles>(null);
  const [dataProduto, setDataProduto] = useState<DataProduto>(
    {} as DataProduto,
  );
  const [dataListProduto, setDataListProduto] = useState<DataListProduto>(
    {} as DataListProduto,
  );
  const [pickingSelecionado, setPickingSelecionado] = useState(
    {} as DataPicking,
  );
  const [esconderTabPicking, setEsconderTabPicking] = useState(false);
  const [enderecoLojaSelecionado, setEnderecoLojaSelecionado] = useState(
    {} as DataEndLoja,
  );
  const [esconderTabEndLoja, setEsconderTabEndLoja] = useState(false);
  const [embAuxiliarSelecionada, setEmbAuxiliarSelecionada] = useState(
    {} as DataEmbAuxiliar,
  );
  const [esconderTabEmbAux, setEsconderTabEmbAux] = useState(false);
  const [codBarraAltSelecionado, setCodBarraAltSelecionado] = useState(
    {} as DataCodBarraAlt,
  );
  const [esconderTabCodBarraAlt, setEsconderTabCodBarraAlt] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mensagemLoading, setMensagemLoading] = useState('');
  const [dialogConfirmacao, setDialogConfirmacao] = useState(false);
  const [dialogImpressao, setDialogImpressao] = useState(false);
  const [dialogExclusao, setDialogExclusao] = useState(false);
  const [dialogPicking, setDialogPicking] = useState(false);
  const [dialogTransfPicking, setDialogTransfPicking] = useState(false);
  const [dialogEndLoja, setDialogEndLoja] = useState(false);
  const [dialogEmbAuxiliar, setDialogEmbAuxiliar] = useState(false);
  const [dialogCodBarraAlt, setDialogCodBarraAlt] = useState(false);
  const [tab1Selecionada, setTab1Selecionada] = useState(false);
  const [tab2Selecionada, setTab2Selecionada] = useState(false);
  const [tab3Selecionada, setTab3Selecionada] = useState(false);
  const [tab4Selecionada, setTab4Selecionada] = useState(false);
  const [edicao, setEdicao] = useState(false);

  useEffect(() => {
    setLoading(true);
    setMensagemLoading('Carregando dados do produto, por favor aguarde...');

    api
      .get<DataProduto>(
        `Rotina9901/BuscaDadosProduto/${parametros.filial}/${parametros.codprod}`,
      )
      .then((response) => {
        const produtoRetorno = response.data;

        if (produtoRetorno) {
          if (produtoRetorno.picking.length < 1) {
            setEsconderTabPicking(true);
          }
          if (produtoRetorno.enderecoLoja.length < 1) {
            setEsconderTabEndLoja(true);
          }
          if (produtoRetorno.embalagemAuxliar.length < 1) {
            setEsconderTabEmbAux(true);
          }
          if (produtoRetorno.codBarrasAlternativo.length < 1) {
            setEsconderTabCodBarraAlt(true);
          }

          response.data.codFunc = usuario.codigo;

          setDataProduto(response.data);
          setTab1Selecionada(true);
          setLoading(false);
        } else {
          createMessage({
            type: 'alert',
            message: 'Nenhum produto foi encontrado.',
          });
          history.goBack();
        }
      })
      .catch((err) => {
        createMessage({
          type: 'error',
          message: `Erro: ${err.message}`,
        });
        setLoading(false);
      });

    api
      .get<DataListProduto>(`Rotina9901/BuscaListaDataProduto/`)
      .then((response) => {
        const listaRetorno = response.data as DataListProduto;

        if (listaRetorno) {
          setDataListProduto(listaRetorno);
        } else {
          createMessage({
            type: 'alert',
            message: 'Nenhum produto foi encontrado.',
          });
          history.goBack();
        }
      })
      .catch((err) => {
        createMessage({
          type: 'error',
          message: `Erro: ${err.response.data}`,
        });
      });

    // const impedeReload = (): void => {
    //   window.addEventListener('beforeunload', (event) => {
    //     event.preventDefault();
    //     // Chrome requires returnValue to be set.
    //     event.returnValue = '';
    //   });
    // };

    // impedeReload();
  }, [parametros, history, usuario]);

  const gravarDadosProduto = useCallback(
    async (retorno) => {
      if (retorno) {
        setDialogConfirmacao(false);

        const data = formRefDados.current?.getData();

        try {
          formRefDados.current?.setErrors({});

          const schema = Yup.object().shape({
            dun: Yup.string().required('DUN obrigatório.'),
            codigoFabrica: Yup.string().required('Cód.Fab. obrigatório.'),
            alturaCx: Yup.string().required('Altura da caixa obrigatória.'),
            larguraCx: Yup.string().required('Largura da caixa obrigatória.'),
            comprimentoCx: Yup.string().required(
              'Comprimento da caixa obrigatório.',
            ),
            pesoLiqCx: Yup.string().required('Peso liq. da caixa obrigatório.'),
            pesoBrutoCx: Yup.string().required(
              'Peso bruto da caixa obrigatório.',
            ),
            ean: Yup.string().required('EAN obrigatório.'),
            alturaUn: Yup.string().required('Altura da unidade obrigatória.'),
            larguraUn: Yup.string().required('Largura da unidade obrigatória.'),
            comprimentoUn: Yup.string().required(
              'Comprimento da unidade obrigatório.',
            ),
            pesoLiqUn: Yup.string().required(
              'Peso liq. da unidade obrigatório.',
            ),
            pesoBrutoUn: Yup.string().required(
              'Peso bruto da unidade obrigatório.',
            ),
            lastro: Yup.string().required('Lastro obrigatório.'),
            camada: Yup.string().required('Camada obrigatória.'),
            prazoValidade: Yup.string().required(
              'Prazo de validade obrigatório.',
            ),
            percShelfLife: Yup.string().required('Shelf life obrigatório.'),
          });

          await schema.validate(data, {
            abortEarly: false,
          });

          setLoading(true);
          setMensagemLoading('Gravando as alterações, por favor aguarde...');

          await api
            .post<string>('Rotina9901/GravarAlteracoesCadastro/', dataProduto)
            .then((response) => {
              const retornoGravacao = response.data;

              if (
                retornoGravacao === 'Dados gravados com sucesso!' ||
                retornoGravacao.includes(
                  'O.S. de transferência gerada com sucesso. Número: ',
                ) === true
              ) {
                createMessage({
                  type: 'success',
                  message: retornoGravacao,
                });
                history.goBack();
              } else {
                createMessage({
                  type: 'error',
                  message: retornoGravacao,
                });
                setLoading(false);
              }
            })
            .catch((err) => {
              createMessage({
                type: 'error',
                message: `Erro: ${err.message}`,
              });
              setLoading(false);
            });
        } catch (err) {
          if (err instanceof Yup.ValidationError) {
            const errors = getValidationErrors(err);

            formRefDados.current?.setErrors(errors);

            setLoading(false);
            return;
          }

          createMessage({
            type: 'error',
            message: `Erro: ${err.message}`,
          });
          setLoading(false);
        }
      } else {
        setDialogConfirmacao(false);
      }
    },
    [dataProduto, history],
  );

  const excluiPicking = useCallback(() => {
    const valida = dataProduto.picking
      .filter((pk) => pk.codEndereco !== pickingSelecionado.codEndereco)
      .map((pk) => {
        setDataProduto({
          ...dataProduto,
          picking: [pk],
        });

        return pk;
      });

    if (valida.length === 0) {
      setDataProduto({
        ...dataProduto,
        picking: [{} as DataPicking],
      });
      setEsconderTabPicking(true);
    }

    setPickingSelecionado({} as DataPicking);
  }, [pickingSelecionado, dataProduto]);

  const excluiEndLoja = useCallback(() => {
    const valida = dataProduto.enderecoLoja
      .filter(
        (loja) => loja.codEndereco !== enderecoLojaSelecionado.codEndereco,
      )
      .map((loja) => {
        setDataProduto({
          ...dataProduto,
          enderecoLoja: [loja],
        });

        return loja;
      });

    if (valida.length === 0) {
      setDataProduto({
        ...dataProduto,
        enderecoLoja: [{} as DataEndLoja],
      });
      setEsconderTabEndLoja(true);
    }

    setEnderecoLojaSelecionado({} as DataEndLoja);
  }, [enderecoLojaSelecionado, dataProduto]);

  const excluiEmbAuxiliar = useCallback(() => {
    const arrayEmbalagem = [] as any; //eslint-disable-line

    const valida = dataProduto.embalagemAuxliar
      .filter((emb) => emb.codBarra !== embAuxiliarSelecionada.codBarra)
      .map((emb) => {
        arrayEmbalagem.push(emb);

        return emb;
      });

    setDataProduto({
      ...dataProduto,
      embalagemAuxliar: arrayEmbalagem,
    });

    if (valida.length === 0) {
      setDataProduto({
        ...dataProduto,
        embalagemAuxliar: [{} as DataEmbAuxiliar],
      });

      setEsconderTabEmbAux(true);
    }

    setEmbAuxiliarSelecionada({} as DataEmbAuxiliar);
  }, [embAuxiliarSelecionada, dataProduto]);

  const excluiCodBarraAlt = useCallback(() => {
    const arrayAlternativo = [] as any; //eslint-disable-line

    const valida = dataProduto.codBarrasAlternativo
      .filter((alt) => alt.codBarra !== codBarraAltSelecionado.codBarra)
      .map((alt) => {
        arrayAlternativo.push(alt);

        return alt;
      });

    setDataProduto({
      ...dataProduto,
      codBarrasAlternativo: arrayAlternativo,
    });

    if (valida.length === 0) {
      setDataProduto({
        ...dataProduto,
        codBarrasAlternativo: [{} as DataCodBarraAlt],
      });
      setEsconderTabCodBarraAlt(true);
    }

    setCodBarraAltSelecionado({} as DataCodBarraAlt);
  }, [codBarraAltSelecionado, dataProduto]);

  const validaExclusao = useCallback(
    (retorno: boolean) => {
      if (retorno) {
        setDialogExclusao(false);
        if (pickingSelecionado.codEndereco) {
          excluiPicking();
        }
        if (enderecoLojaSelecionado.codEndereco) {
          excluiEndLoja();
        }
        if (embAuxiliarSelecionada.codBarra) {
          excluiEmbAuxiliar();
        }
        if (codBarraAltSelecionado.codBarra) {
          excluiCodBarraAlt();
        }
      } else {
        setDialogExclusao(false);
        if (pickingSelecionado.codEndereco) {
          setPickingSelecionado({} as DataPicking);
        }
        if (enderecoLojaSelecionado.codEndereco) {
          setEnderecoLojaSelecionado({} as DataEndLoja);
        }
        if (embAuxiliarSelecionada.codBarra) {
          setEmbAuxiliarSelecionada({} as DataEmbAuxiliar);
        }
        if (codBarraAltSelecionado.codBarra) {
          setCodBarraAltSelecionado({} as DataCodBarraAlt);
        }
      }
    },
    [
      pickingSelecionado,
      excluiPicking,
      enderecoLojaSelecionado,
      excluiEndLoja,
      embAuxiliarSelecionada,
      excluiEmbAuxiliar,
      codBarraAltSelecionado,
      excluiCodBarraAlt,
    ],
  );

  const adicionaNovoPicking = useCallback(
    (retorno: boolean, data: DataPicking) => {
      if (retorno) {
        if (!edicao) {
          data.codTipoEndereco = Number(data.tipoEndereco);
          data.codTipoEstrutura = Number(data.tipoEstrutura);
          data.percPontoReposicao = Number(data.percReposicao);

          dataListProduto.tipoEndereco
            .filter((tipo) => tipo.codigo === data.codTipoEndereco)
            .map((tipo) => {
              data.descTipoEndereco = tipo.descricao;

              return tipo;
            });

          dataListProduto.tipoEstrutura
            .filter((tipo) => tipo.codigo === data.codTipoEstrutura)
            .map((tipo) => {
              data.descTipoEstrutura = tipo.descricao;

              return tipo;
            });

          if (
            data.codTipoEndereco &&
            data.codTipoEstrutura &&
            data.capacidade &&
            data.percPontoReposicao &&
            data.pontoReposicao
          ) {
            // Outro endereço do mesmo tipo
            const encontrouOutroEndereco = dataProduto.picking.filter(
              (pk) => pk.tipoPicking === data.tipoPicking,
            );

            // Se for pre picking, tem que ter um endereço de venda
            const verificacaoPrePicking = dataProduto.picking.filter(
              (pk) => pk.tipoPicking === 'V',
            );

            if (encontrouOutroEndereco.length === 0) {
              if (
                verificacaoPrePicking.length === 0 &&
                data.tipoPicking === 'P'
              ) {
                createMessage({
                  type: 'alert',
                  message:
                    'Para cadastrar um pré picking e necessário que exista um picking do tipo VENDA cadastrado.',
                });
                return;
              }

              if (dataProduto.picking[0]?.codEndereco === undefined) {
                dataProduto.picking.splice(0, 1);
              }

              dataProduto.picking.push(data);

              setDialogPicking(false);
              setEsconderTabPicking(false);
            } else {
              if (data.tipoPicking === 'V') {
                createMessage({
                  type: 'alert',
                  message:
                    'Já existe um endereço de picking do tipo VENDA cadastrado.',
                });
                return;
              }
              if (data.tipoPicking === 'M') {
                createMessage({
                  type: 'alert',
                  message:
                    'Já existe um endereço de picking do tipo MASTER cadastrado.',
                });
                return;
              }

              createMessage({
                type: 'alert',
                message:
                  'Já existe um endereço de picking do tipo PRÉ-PICKING cadastrado.',
              });
            }
          } else {
            createMessage({
              type: 'alert',
              message: 'Favor preencher todos os campos corretamente.',
            });
          }
        } else {
          data.percPontoReposicao = Number(data.percReposicao);

          dataProduto.picking
            .filter((pk) => Number(pk.codEndereco) === Number(data.codEndereco))
            .map((pk) => {
              pk.capacidade = data.capacidade;
              pk.percPontoReposicao = Number(data.percPontoReposicao);
              pk.pontoReposicao = data.pontoReposicao;

              return pk;
            });

          setEdicao(false);
          setDialogPicking(false);
          setPickingSelecionado({} as DataPicking);
          setEsconderTabPicking(false);
        }
      } else {
        setEdicao(false);
        setPickingSelecionado({} as DataPicking);
        setDialogPicking(false);
      }
    },
    [edicao, dataProduto, dataListProduto],
  );

  const adicionaNovoPickingLoja = useCallback(
    (retorno: boolean, data: DataPicking) => {
      if (retorno) {
        data.codTipoEndereco = Number(data.tipoEndereco);
        data.codTipoEstrutura = Number(data.tipoEstrutura);
        data.percPontoReposicao = Number(data.percReposicao);

        dataListProduto.tipoEndereco
          .filter((tipo) => tipo.codigo === data.codTipoEndereco)
          .map((tipo) => {
            data.descTipoEndereco = tipo.descricao;

            return tipo;
          });

        dataListProduto.tipoEstrutura
          .filter((tipo) => tipo.codigo === data.codTipoEstrutura)
          .map((tipo) => {
            data.descTipoEstrutura = tipo.descricao;

            return tipo;
          });

        if (data.capacidade && data.percPontoReposicao && data.pontoReposicao) {
          const encontrouOutroEndereco = dataProduto.enderecoLoja.filter(
            (pk) => pk.codEndereco === data.codEndereco,
          );

          if (encontrouOutroEndereco.length === 0) {
            if (dataProduto.enderecoLoja[0]?.codEndereco === undefined) {
              dataProduto.enderecoLoja.splice(0, 1);
            }

            dataProduto.enderecoLoja.push(data);

            setDialogEndLoja(false);
            setEsconderTabEndLoja(false);
          }
        } else {
          createMessage({
            type: 'alert',
            message: 'Favor preencher todos os campos corretamente.',
          });
        }
      } else {
        setDialogEndLoja(false);
      }
    },
    [dataProduto, dataListProduto],
  );

  const adicionaNovaEmbAuxiliar = useCallback(
    (retorno: boolean, data: DataEmbAuxiliar) => {
      if (retorno) {
        const repetido = dataProduto.embalagemAuxliar.filter(
          (emb) => Number(emb.codBarra) === Number(data.codBarra),
        );

        if (repetido.length === 0) {
          if (data.codBarra && data.embalagem && data.unidade && data.qtunit) {
            if (dataProduto.embalagemAuxliar[0]?.codBarra === undefined) {
              dataProduto.embalagemAuxliar.splice(0, 1);
            }

            if (edicao) {
              dataProduto.embalagemAuxliar.map((embalagem) => {
                if (Number(embalagem.codBarra) === Number(data.codBarra)) {
                  embalagem.codBarra = Number(data.codBarra);
                  embalagem.embalagem = data.embalagem;
                  embalagem.unidade = data.unidade;
                  embalagem.qtunit = Number(data.qtunit);

                  return embalagem;
                }
                return embalagem;
              });
              setEmbAuxiliarSelecionada({} as DataEmbAuxiliar);
            } else {
              dataProduto.embalagemAuxliar.push(data);
            }

            setDialogEmbAuxiliar(false);
            setEsconderTabEmbAux(false);
            setEdicao(false);
          } else {
            createMessage({
              type: 'alert',
              message: 'Favor preencher todos os campos corretamente.',
            });
          }
        } else {
          createMessage({
            type: 'alert',
            message: 'Código informado já existe.',
          });
        }
      } else {
        setEdicao(false);
        setEmbAuxiliarSelecionada({} as DataEmbAuxiliar);
        setDialogEmbAuxiliar(false);
      }
    },
    [dataProduto, edicao],
  );

  const adicionaNovoCodBarraAlt = useCallback(
    (retorno: boolean, data: DataEmbAuxiliar) => {
      if (retorno) {
        const repetido = dataProduto.codBarrasAlternativo.filter(
          (codAlt) => Number(codAlt.codBarra) === Number(data.codBarra),
        );

        if (repetido.length === 0) {
          if (data.codBarra && data.embalagem && data.unidade && data.qtunit) {
            if (dataProduto.codBarrasAlternativo[0]?.codBarra === undefined) {
              dataProduto.codBarrasAlternativo.splice(0, 1);
            }

            if (edicao) {
              dataProduto.codBarrasAlternativo.map((barraAlt) => {
                if (Number(barraAlt.codBarra) === Number(data.codBarra)) {
                  barraAlt.codBarra = Number(data.codBarra);
                  barraAlt.embalagem = data.embalagem;
                  barraAlt.unidade = data.unidade;
                  barraAlt.qtunit = Number(data.qtunit);

                  return barraAlt;
                }
                return barraAlt;
              });
              setCodBarraAltSelecionado({} as DataEmbAuxiliar);
            } else {
              dataProduto.codBarrasAlternativo.push(data);
            }

            setEsconderTabCodBarraAlt(false);
            setDialogCodBarraAlt(false);
            setEdicao(false);
          } else {
            createMessage({
              type: 'alert',
              message: 'Favor preencher todos os campos corretamente.',
            });
          }
        } else {
          createMessage({
            type: 'alert',
            message: 'Código informado já existe.',
          });
        }
      } else {
        setEdicao(false);
        setCodBarraAltSelecionado({} as DataEmbAuxiliar);
        setDialogCodBarraAlt(false);
      }
    },
    [dataProduto, edicao],
  );

  const impressaoEtiquetas = useCallback(
    async (retorno: boolean, params: ImpressaoProps) => {
      setDialogImpressao(false);
      setLoading(true);
      setMensagemLoading('Imprimindo etiqueta, por favor aguarde...');

      if (retorno) {
        const { master, venda, auxiliar, alternativo } = params;

        let paramsImpressao = {} as DTOImpressoes;

        paramsImpressao = {
          app: 'EPCWMS',
          tipousu: 'U',
          matricula: usuario.codigo,
          tamanho: 'G',
          nrorel: 9041,
          pCodfilial: dataProduto.codfilial,
          pCodprod: dataProduto.codprod,
          pFiltro: 0,
        } as DTOImpressoes;

        if (master) {
          paramsImpressao.pFiltro = 1;
        }
        if (venda) {
          paramsImpressao.pFiltro = 2;
        }
        if (auxiliar) {
          paramsImpressao.pFiltro = 3;
        }
        if (alternativo) {
          paramsImpressao.pFiltro = 4;
        }

        await apiRelatorios
          .get('servdw/REL/relatorio', { params: paramsImpressao })
          .then((responseImpressao) => {
            const relatorio = formataRelatorio(responseImpressao.data);

            window.open(relatorio);
          })
          .catch((err) => {
            if (
              err.response.data ===
              `Access violation at address 0000000000B6B802 in module 'RDWService.exe'. Read of address 0000000000000019`
            ) {
              createMessage({
                type: 'error',
                message: 'Nenhum registro encontrado para impressão.',
              });
            } else {
              createMessage({
                type: 'error',
                message: `Error: ${err.response.data}`,
              });
            }
          });
        setLoading(false);
      } else {
        setLoading(false);
      }
    },
    [dataProduto, usuario],
  );

  const transferirPicking = useCallback(
    (retorno: boolean, data: DataPicking) => {
      if (retorno) {
        data.percPontoReposicao = Number(data.percReposicao);
        data.codTipoEndereco = Number(data.tipoEndereco);
        data.codTipoEstrutura = Number(data.tipoEstrutura);
        data.percPontoReposicao = Number(data.percReposicao);

        if (
          data.codTipoEndereco &&
          data.codTipoEstrutura &&
          data.capacidade &&
          data.percPontoReposicao &&
          data.pontoReposicao
        ) {
          dataListProduto.tipoEndereco
            .filter((tipo) => tipo.codigo === data.codTipoEndereco)
            .map((tipo) => {
              data.descTipoEndereco = tipo.descricao;

              return tipo;
            });

          dataListProduto.tipoEstrutura
            .filter((tipo) => tipo.codigo === data.codTipoEstrutura)
            .map((tipo) => {
              data.descTipoEstrutura = tipo.descricao;

              return tipo;
            });

          dataProduto.picking
            .filter(
              (pk) =>
                Number(pk.codEndereco) ===
                Number(pickingSelecionado.codEndereco),
            )
            .map((pk) => {
              pk.codTipoEndereco = data.codTipoEndereco;
              pk.descTipoEndereco = data.descTipoEndereco;
              pk.codTipoEstrutura = data.codTipoEstrutura;
              pk.descTipoEstrutura = data.descTipoEstrutura;
              pk.tipoPicking = data.tipoPicking;
              pk.codEndereco = data.codEndereco;
              pk.deposito = data.deposito;
              pk.rua = data.rua;
              pk.predio = data.predio;
              pk.nivel = data.nivel;
              pk.apto = data.apto;
              pk.capacidade = data.capacidade;
              pk.percPontoReposicao = data.percPontoReposicao;
              pk.pontoReposicao = data.pontoReposicao;

              return pk;
            });

          setEsconderTabPicking(false);
          setEdicao(false);
          setDialogPicking(false);
          setPickingSelecionado({} as DataPicking);
          setDialogTransfPicking(false);
        } else {
          createMessage({
            type: 'alert',
            message: 'Favor preencher todos os campos corretamente.',
          });
        }
      } else {
        setEdicao(false);
        setDialogPicking(false);
        setPickingSelecionado({} as DataPicking);
        setDialogTransfPicking(false);
      }
    },
    [pickingSelecionado, dataProduto.picking, dataListProduto],
  );

  return (
    <>
      <NavBar
        paginaAtual="9901 - DADOS LOGÍSTICOS (EDIÇÃO)"
        caminho="/dashboard/dados-logisticos"
      />
      <Container>
        {!loading ? (
          <>
            <input
              id="tab4"
              type="radio"
              name="pct"
              checked={tab4Selecionada}
              readOnly
            />
            <input
              id="tab3"
              type="radio"
              name="pct"
              checked={tab3Selecionada}
              readOnly
            />
            <input
              id="tab2"
              type="radio"
              name="pct"
              checked={tab2Selecionada}
              readOnly
            />
            <input
              id="tab1"
              type="radio"
              name="pct"
              checked={tab1Selecionada}
              readOnly
            />
            <nav>
              <ul>
                <li className="tab1">
                  <button
                    id="tab1"
                    type="button"
                    onClick={() => {
                      setTab1Selecionada(true);
                      setTab2Selecionada(false);
                      setTab3Selecionada(false);
                      setTab4Selecionada(false);
                    }}
                  >
                <label htmlFor="tab1"><FiEdit />Dados Logísticos</label> {/*eslint-disable-line*/}
                  </button>
                </li>
                <li className="tab2">
                  <button
                    id="tab2"
                    type="button"
                    onClick={() => {
                      setTab1Selecionada(false);
                      setTab2Selecionada(true);
                      setTab3Selecionada(false);
                      setTab4Selecionada(false);
                    }}
                  >
                 <label htmlFor="tab2"><FiSettings />Parâmetros</label> {/*eslint-disable-line*/}
                  </button>
                </li>
                <li className="tab3">
                  <button
                    id="tab3"
                    type="button"
                    onClick={() => {
                      setTab1Selecionada(false);
                      setTab2Selecionada(false);
                      setTab3Selecionada(true);
                      setTab4Selecionada(false);
                    }}
                  >
                <label htmlFor="tab3"><FiPlusCircle />Cadastros Auxiliares</label> {/*eslint-disable-line*/}
                  </button>
                </li>
                <li className="tab4">
                  <button
                    id="tab4"
                    type="button"
                    onClick={() => {
                      setTab1Selecionada(false);
                      setTab2Selecionada(false);
                      setTab3Selecionada(false);
                      setTab4Selecionada(true);
                    }}
                  >
                <label htmlFor="tab4"><FiPackage />Estoque WMS</label> {/*eslint-disable-line*/}
                  </button>
                </li>
              </ul>
            </nav>
            <section>
              <div className="tab1">
                <Content>
                  <Form ref={formRefDados} onSubmit={gravarDadosProduto}>
                    <Input
                      name="codfilial"
                      type="number"
                      description="Cód.Filial"
                      disabled
                      percWidth={5}
                      defaultValue={dataProduto.codfilial}
                    />
                    <Input
                      name="codprod"
                      type="number"
                      description="Cód.Prod"
                      disabled
                      percWidth={10}
                      defaultValue={dataProduto.codprod}
                    />
                    <Input
                      name="descricao"
                      type="text"
                      description="Descrição"
                      disabled
                      percWidth={83.7}
                      defaultValue={dataProduto.descricao}
                    />
                    <FieldsetDados title="Dados Master" percWidth={53.7}>
                      <legend>
                        <span>DADOS MASTER</span>
                      </legend>
                      <div className="wrapDados">
                        <Input
                          name="dun"
                          type="number"
                          description="DUN"
                          percWidth={22}
                          defaultValue={dataProduto.dun}
                          disabled={usuario.permiteAltDadosLogisticos === 'N'}
                          onChange={(e) => {
                            setDataProduto({
                              ...dataProduto,
                              dun: Number(e.target.value),
                            });
                          }}
                        />
                        <Input
                          name="embalagemMaster"
                          type="text"
                          description="Emb.Master"
                          percWidth={21}
                          disabled
                          defaultValue={dataProduto.embalagemMaster}
                        />
                        <Input
                          name="codigoFabrica"
                          type="text"
                          description="Cód.Fábrica"
                          percWidth={20}
                          defaultValue={dataProduto.codigoFabrica}
                          disabled={usuario.permiteAltDadosLogisticos === 'N'}
                          onChange={(e) => {
                            setDataProduto({
                              ...dataProduto,
                              codigoFabrica: e.target.value,
                            });
                          }}
                        />
                        <Input
                          name="unidadeMaster"
                          type="text"
                          description="Un.Master"
                          percWidth={10}
                          disabled
                          defaultValue={dataProduto.unidadeMaster}
                        />
                        <Input
                          name="qtunitcx"
                          type="number"
                          description="Qt.Unit.Cx"
                          percWidth={9}
                          disabled
                          defaultValue={dataProduto.qtunitcx}
                        />
                      </div>
                      <div
                        className="wrapDados"
                        style={{ marginTop: '8px', marginLeft: '0%' }}
                      >
                        <Input
                          name="alturaCx"
                          type="number"
                          description="Altura Cx"
                          percWidth={10}
                          defaultValue={dataProduto.alturaCx}
                          disabled={usuario.permiteAltDadosLogisticos === 'N'}
                          onChange={(e) => {
                            setDataProduto({
                              ...dataProduto,
                              alturaCx: Number(e.target.value),
                            });
                          }}
                          onKeyUp={() => {
                            setDataProduto({
                              ...dataProduto,
                              volumeCxM3: parseFloat(
                                (
                                  (dataProduto.alturaCx *
                                    dataProduto.larguraCx *
                                    dataProduto.comprimentoCx) /
                                  1000000
                                ) // conversão para m³
                                  .toFixed(4),
                              ),
                            });
                          }}
                        />
                        <Input
                          name="larguraCx"
                          type="number"
                          description="Largura Cx"
                          percWidth={10}
                          defaultValue={dataProduto.larguraCx}
                          disabled={usuario.permiteAltDadosLogisticos === 'N'}
                          onChange={(e) => {
                            setDataProduto({
                              ...dataProduto,
                              larguraCx: Number(e.target.value),
                            });
                          }}
                          onKeyUp={() => {
                            setDataProduto({
                              ...dataProduto,
                              volumeCxM3: parseFloat(
                                (
                                  (dataProduto.alturaCx *
                                    dataProduto.larguraCx *
                                    dataProduto.comprimentoCx) /
                                  1000000
                                ) // conversão para m³
                                  .toFixed(4),
                              ),
                            });
                          }}
                        />
                        <Input
                          name="comprimentoCx"
                          type="number"
                          description="Comp. Cx"
                          percWidth={10}
                          defaultValue={dataProduto.comprimentoCx}
                          disabled={usuario.permiteAltDadosLogisticos === 'N'}
                          onChange={(e) => {
                            setDataProduto({
                              ...dataProduto,
                              comprimentoCx: Number(e.target.value),
                            });
                          }}
                          onKeyUp={() => {
                            setDataProduto({
                              ...dataProduto,
                              volumeCxM3: parseFloat(
                                (
                                  (dataProduto.alturaCx *
                                    dataProduto.larguraCx *
                                    dataProduto.comprimentoCx) /
                                  1000000
                                ) // conversão para m³
                                  .toFixed(4),
                              ),
                            });
                          }}
                        />
                        <Input
                          name="volumeCxM3"
                          type="number"
                          description="Vol. Cx m³"
                          percWidth={10}
                          disabled
                          value={dataProduto.volumeCxM3}
                        />
                        <Input
                          name="pesoLiqCx"
                          type="number"
                          description="Peso Liq. Cx"
                          percWidth={12}
                          defaultValue={dataProduto.pesoLiqCx}
                          disabled={usuario.permiteAltDadosLogisticos === 'N'}
                          onChange={(e) => {
                            setDataProduto({
                              ...dataProduto,
                              pesoLiqCx: Number(e.target.value),
                              pesoPalete: parseFloat(
                                (
                                  dataProduto.lastro *
                                  dataProduto.camada *
                                  Number(e.target.value)
                                ).toFixed(2),
                              ),
                            });
                          }}
                        />
                        <Input
                          name="pesoBrutoCx"
                          type="number"
                          description="Peso Bruto Cx"
                          percWidth={12}
                          defaultValue={dataProduto.pesoBrutoCx}
                          disabled={usuario.permiteAltDadosLogisticos === 'N'}
                          onChange={(e) => {
                            setDataProduto({
                              ...dataProduto,
                              pesoBrutoCx: Number(e.target.value),
                            });
                          }}
                        />
                      </div>
                    </FieldsetDados>
                    <FieldsetDados
                      title="Dados Unidade"
                      style={{ marginLeft: '0.3%' }}
                      percWidth={46}
                    >
                      <legend>
                        <span>DADOS UNIDADE</span>
                      </legend>
                      <div className="wrapDados">
                        <Input
                          name="ean"
                          type="number"
                          description="EAN"
                          percWidth={24}
                          defaultValue={dataProduto.ean}
                          disabled={usuario.permiteAltDadosLogisticos === 'N'}
                          onChange={(e) => {
                            setDataProduto({
                              ...dataProduto,
                              ean: Number(e.target.value),
                            });
                          }}
                        />
                        <Input
                          name="embalagem"
                          type="text"
                          description="Emb.Unit"
                          percWidth={21}
                          disabled
                          defaultValue={dataProduto.embalagem}
                        />
                        <Input
                          name="unidade"
                          type="text"
                          description="Unidade"
                          percWidth={10}
                          disabled
                          defaultValue={dataProduto.unidade}
                        />
                        <Input
                          name="qtunit"
                          type="number"
                          description="Qt.Unit"
                          percWidth={8}
                          disabled
                          defaultValue={dataProduto.qtunit}
                        />
                      </div>
                      <div
                        className="wrapDados"
                        style={{ marginTop: '8px', marginLeft: '0%' }}
                      >
                        <Input
                          name="alturaUn"
                          type="number"
                          description="Altura Un"
                          percWidth={10}
                          defaultValue={dataProduto.alturaUn}
                          disabled={usuario.permiteAltDadosLogisticos === 'N'}
                          onChange={(e) => {
                            setDataProduto({
                              ...dataProduto,
                              alturaUn: Number(e.target.value),
                            });
                          }}
                          onKeyUp={() => {
                            setDataProduto({
                              ...dataProduto,
                              volumeUnM3: parseFloat(
                                (
                                  (dataProduto.alturaUn *
                                    dataProduto.larguraUn *
                                    dataProduto.comprimentoUn) /
                                  1000000
                                ) // conversão para m³
                                  .toFixed(4),
                              ),
                            });
                          }}
                        />
                        <Input
                          name="larguraUn"
                          type="number"
                          description="Largura Un"
                          percWidth={12}
                          defaultValue={dataProduto.larguraUn}
                          disabled={usuario.permiteAltDadosLogisticos === 'N'}
                          onChange={(e) => {
                            setDataProduto({
                              ...dataProduto,
                              larguraUn: Number(e.target.value),
                            });
                          }}
                          onKeyUp={() => {
                            setDataProduto({
                              ...dataProduto,
                              volumeUnM3: parseFloat(
                                (
                                  (dataProduto.alturaUn *
                                    dataProduto.larguraUn *
                                    dataProduto.comprimentoUn) /
                                  1000000
                                ) // conversão para m³
                                  .toFixed(4),
                              ),
                            });
                          }}
                        />
                        <Input
                          name="comprimentoUn"
                          type="number"
                          description="Comp. Un"
                          percWidth={11}
                          defaultValue={dataProduto.comprimentoUn}
                          disabled={usuario.permiteAltDadosLogisticos === 'N'}
                          onChange={(e) => {
                            setDataProduto({
                              ...dataProduto,
                              comprimentoUn: Number(e.target.value),
                            });
                          }}
                          onKeyUp={() => {
                            setDataProduto({
                              ...dataProduto,
                              volumeUnM3: parseFloat(
                                (
                                  (dataProduto.alturaUn *
                                    dataProduto.larguraUn *
                                    dataProduto.comprimentoUn) /
                                  1000000
                                ) // conversão para m³
                                  .toFixed(4),
                              ),
                            });
                          }}
                        />
                        <Input
                          name="volumeUnM3"
                          type="number"
                          description="Vol. Un m³"
                          percWidth={12}
                          disabled
                          value={dataProduto.volumeUnM3}
                        />
                        <Input
                          name="pesoLiqUn"
                          type="number"
                          description="Peso Liq. Un"
                          percWidth={13}
                          defaultValue={dataProduto.pesoLiqUn}
                          disabled={usuario.permiteAltDadosLogisticos === 'N'}
                          onChange={(e) => {
                            setDataProduto({
                              ...dataProduto,
                              pesoLiqUn: Number(e.target.value),
                            });
                          }}
                        />
                        <Input
                          name="pesoBrutoUn"
                          type="number"
                          description="Peso Bruto Un"
                          percWidth={14}
                          defaultValue={dataProduto.pesoBrutoUn}
                          disabled={usuario.permiteAltDadosLogisticos === 'N'}
                          onChange={(e) => {
                            setDataProduto({
                              ...dataProduto,
                              pesoBrutoUn: Number(e.target.value),
                            });
                          }}
                        />
                      </div>
                    </FieldsetDados>
                    <FieldsetDados title="Dados Norma Palete" percWidth={54}>
                      <legend>
                        <span>DADOS NORMA PALETE</span>
                      </legend>
                      <div className="wrapDados">
                        <Input
                          name="lastro"
                          type="number"
                          description="Lastro"
                          percWidth={10}
                          defaultValue={dataProduto.lastro}
                          disabled={usuario.permiteAltDadosLogisticos === 'N'}
                          onChange={(e) => {
                            setDataProduto({
                              ...dataProduto,
                              lastro: Number(e.target.value),
                              pesoPalete: parseFloat(
                                (
                                  Number(e.target.value) *
                                  dataProduto.camada *
                                  dataProduto.pesoLiqCx
                                ).toFixed(2),
                              ),
                            });
                          }}
                          onKeyUp={() => {
                            setDataProduto({
                              ...dataProduto,
                              totPalete:
                                dataProduto.lastro * dataProduto.camada,
                            });
                          }}
                        />
                        <Input
                          name="camada"
                          type="number"
                          description="Camada"
                          percWidth={10}
                          defaultValue={dataProduto.camada}
                          disabled={usuario.permiteAltDadosLogisticos === 'N'}
                          onChange={(e) => {
                            setDataProduto({
                              ...dataProduto,
                              camada: Number(e.target.value),
                              pesoPalete: parseFloat(
                                (
                                  dataProduto.lastro *
                                  Number(e.target.value) *
                                  dataProduto.pesoLiqCx
                                ).toFixed(2),
                              ),
                            });
                          }}
                          onKeyUp={() => {
                            setDataProduto({
                              ...dataProduto,
                              totPalete:
                                dataProduto.lastro * dataProduto.camada,
                            });
                          }}
                        />
                        <Input
                          name="totPalete"
                          type="number"
                          description="Total Palete"
                          percWidth={10}
                          disabled
                          value={dataProduto.totPalete}
                        />
                        <Input
                          name="pesoPalete"
                          type="number"
                          description="Peso Palete"
                          percWidth={10}
                          value={dataProduto.pesoPalete}
                          disabled
                        />
                      </div>
                    </FieldsetDados>
                    <FieldsetDados
                      title="Dados Validade"
                      style={{ marginLeft: '0.3%' }}
                      percWidth={45.7}
                    >
                      <legend>
                        <span>DADOS VALIDADE</span>
                      </legend>
                      <div className="wrapDados">
                        <Input
                          name="prazoValidade"
                          type="number"
                          description="Prazo Val. (dias)"
                          percWidth={15}
                          defaultValue={dataProduto.prazoValidade}
                          disabled={usuario.permiteAltDadosLogisticos === 'N'}
                          onChange={(e) => {
                            setDataProduto({
                              ...dataProduto,
                              prazoValidade: Number(e.target.value),
                            });
                          }}
                        />
                        <Input
                          name="percShelfLife"
                          type="number"
                          description="% Shelf Life"
                          percWidth={12}
                          defaultValue={dataProduto.percShelfLife}
                          disabled={usuario.permiteAltDadosLogisticos === 'N'}
                          onChange={(e) => {
                            setDataProduto({
                              ...dataProduto,
                              percShelfLife: Number(e.target.value),
                            });
                          }}
                        />
                      </div>
                    </FieldsetDados>
                  </Form>
                </Content>
              </div>
              <div className="tab2">
                <Content>
                  <Form ref={formRefParametros} onSubmit={gravarDadosProduto}>
                    <Fieldset title="Parâmetros">
                      <legend>
                        <span>PRODUTO</span>
                      </legend>
                      <div className="wrap">
                        <CheckRadio percWidth={10}>
                          <h1>Tipo Norma</h1>
                          <div id="itens">
                            <label htmlFor="caixa">
                              <input
                                type="radio"
                                id="caixa"
                                name="tipoNorma"
                                disabled={
                                  usuario.permiteAltDadosLogisticos === 'N'
                                }
                                defaultChecked={dataProduto.tipoNorma === 'C'}
                                onChange={() => {
                                  setDataProduto({
                                    ...dataProduto,
                                    tipoNorma: 'C',
                                  });
                                }}
                              />
                              Caixa
                            </label>
                            <label htmlFor="peso">
                              <input
                                type="radio"
                                id="peso"
                                name="tipoNorma"
                                disabled={
                                  usuario.permiteAltDadosLogisticos === 'N'
                                }
                                defaultChecked={dataProduto.tipoNorma === 'P'}
                                onChange={() => {
                                  setDataProduto({
                                    ...dataProduto,
                                    tipoNorma: 'P',
                                  });
                                }}
                              />
                              Peso
                            </label>
                          </div>
                        </CheckRadio>
                        <CheckRadio percWidth={13}>
                          <h1>Pulmão Regulador</h1>
                          <div id="itens">
                            <label htmlFor="simPulmaoRegulador">
                              <input
                                type="radio"
                                id="simPulmaoRegulador"
                                name="usaPulmaoRegulador"
                                disabled={
                                  usuario.permiteAltDadosLogisticos === 'N'
                                }
                                defaultChecked={
                                  dataProduto.usaPulmaoRegulador === 'S'
                                }
                                onChange={() => {
                                  setDataProduto({
                                    ...dataProduto,
                                    usaPulmaoRegulador: 'S',
                                  });
                                }}
                              />
                              Sim
                            </label>
                            <label htmlFor="naoPulmaoRegulador">
                              <input
                                type="radio"
                                id="naoPulmaoRegulador"
                                name="usaPulmaoRegulador"
                                disabled={
                                  usuario.permiteAltDadosLogisticos === 'N'
                                }
                                defaultChecked={
                                  dataProduto.usaPulmaoRegulador === 'N'
                                }
                                onChange={() => {
                                  setDataProduto({
                                    ...dataProduto,
                                    usaPulmaoRegulador: 'N',
                                  });
                                }}
                              />
                              Não
                            </label>
                          </div>
                        </CheckRadio>
                        <CheckRadio percWidth={15}>
                          <h1>Tipo Variação</h1>
                          <div id="itens">
                            <label htmlFor="convencional">
                              <input
                                type="radio"
                                id="convencional"
                                name="tipoVariacao"
                                disabled={
                                  usuario.permiteAltDadosLogisticos === 'N'
                                }
                                defaultChecked={
                                  dataProduto.tipoVariacao === 'C'
                                }
                                onChange={() => {
                                  setDataProduto({
                                    ...dataProduto,
                                    tipoVariacao: 'C',
                                  });
                                }}
                              />
                              Convencional
                            </label>
                            <label htmlFor="hibrido">
                              <input
                                type="radio"
                                id="hibrido"
                                name="tipoVariacao"
                                disabled={
                                  usuario.permiteAltDadosLogisticos === 'N'
                                }
                                defaultChecked={
                                  dataProduto.tipoVariacao === 'H'
                                }
                                onChange={() => {
                                  setDataProduto({
                                    ...dataProduto,
                                    tipoVariacao: 'H',
                                  });
                                }}
                              />
                              Híbrido
                            </label>
                          </div>
                        </CheckRadio>
                        <CheckRadio percWidth={11}>
                          <h1>Tipo Estoque</h1>
                          <div id="itens">
                            <label htmlFor="padrao">
                              <input
                                type="radio"
                                id="padrao"
                                name="tipoEstoque"
                                disabled={
                                  usuario.permiteAltDadosLogisticos === 'N'
                                }
                                defaultChecked={
                                  dataProduto.tipoEstoque === 'PA'
                                }
                                onChange={() => {
                                  setDataProduto({
                                    ...dataProduto,
                                    tipoEstoque: 'PA',
                                  });
                                }}
                              />
                              Padrão
                            </label>
                            <label htmlFor="frios">
                              <input
                                type="radio"
                                id="frios"
                                name="tipoEstoque"
                                disabled={
                                  usuario.permiteAltDadosLogisticos === 'N'
                                }
                                defaultChecked={
                                  dataProduto.tipoEstoque === 'FR'
                                }
                                onChange={() => {
                                  setDataProduto({
                                    ...dataProduto,
                                    tipoEstoque: 'FR',
                                  });
                                }}
                              />
                              Frios
                            </label>
                          </div>
                        </CheckRadio>
                        <CheckRadio percWidth={10}>
                          <h1>Peso Variável</h1>
                          <div id="itens">
                            <label htmlFor="simPesoVariavel">
                              <input
                                type="radio"
                                id="simPesoVariavel"
                                name="pesoVariavel"
                                disabled={
                                  usuario.permiteAltDadosLogisticos === 'N'
                                }
                                defaultChecked={
                                  dataProduto.pesoVariavel === 'S'
                                }
                                onChange={() => {
                                  setDataProduto({
                                    ...dataProduto,
                                    pesoVariavel: 'S',
                                  });
                                }}
                              />
                              Sim
                            </label>
                            <label htmlFor="naoPesoVariavel">
                              <input
                                type="radio"
                                id="naoPesoVariavel"
                                name="pesoVariavel"
                                disabled={
                                  usuario.permiteAltDadosLogisticos === 'N'
                                }
                                defaultChecked={
                                  dataProduto.pesoVariavel === 'N'
                                }
                                onChange={() => {
                                  setDataProduto({
                                    ...dataProduto,
                                    pesoVariavel: 'N',
                                  });
                                }}
                              />
                              Não
                            </label>
                          </div>
                        </CheckRadio>
                        <CheckRadio percWidth={9}>
                          <h1>Fracionado</h1>
                          <div id="itens">
                            <label htmlFor="simFracionado">
                              <input
                                type="radio"
                                id="simFracionado"
                                name="fracionado"
                                disabled={
                                  usuario.permiteAltDadosLogisticos === 'N'
                                }
                                defaultChecked={dataProduto.fracionado === 'S'}
                                onChange={() => {
                                  setDataProduto({
                                    ...dataProduto,
                                    fracionado: 'S',
                                  });
                                }}
                              />
                              Sim
                            </label>
                            <label htmlFor="naoFracionado">
                              <input
                                type="radio"
                                id="naoFracionado"
                                name="fracionado"
                                disabled={
                                  usuario.permiteAltDadosLogisticos === 'N'
                                }
                                defaultChecked={dataProduto.fracionado === 'N'}
                                onChange={() => {
                                  setDataProduto({
                                    ...dataProduto,
                                    fracionado: 'N',
                                  });
                                }}
                              />
                              Não
                            </label>
                          </div>
                        </CheckRadio>
                        <CheckRadio percWidth={14}>
                          <h1>Expede Cx. Fechada</h1>
                          <div id="itens">
                            <label htmlFor="simExpedeCxFechada">
                              <input
                                type="radio"
                                id="simExpedeCxFechada"
                                name="expedeCxFechada"
                                disabled={
                                  usuario.permiteAltDadosLogisticos === 'N'
                                }
                                defaultChecked={
                                  dataProduto.expedeCxFechada === 'S'
                                }
                                onChange={() => {
                                  setDataProduto({
                                    ...dataProduto,
                                    expedeCxFechada: 'S',
                                  });
                                }}
                              />
                              Sim
                            </label>
                            <label htmlFor="naoExpedeCxFechada">
                              <input
                                type="radio"
                                id="naoExpedeCxFechada"
                                name="expedeCxFechada"
                                disabled={
                                  usuario.permiteAltDadosLogisticos === 'N'
                                }
                                defaultChecked={
                                  dataProduto.expedeCxFechada === 'N'
                                }
                                onChange={() => {
                                  setDataProduto({
                                    ...dataProduto,
                                    expedeCxFechada: 'N',
                                  });
                                }}
                              />
                              Não
                            </label>
                          </div>
                        </CheckRadio>
                      </div>
                      <div
                        className="wrap"
                        style={{ marginTop: '8px', marginLeft: '0%' }}
                      >
                        <CheckRadio percWidth={33}>
                          <h1>Tipo Produto</h1>
                          <div id="itens">
                            <label htmlFor="grandeza">
                              <input
                                type="radio"
                                id="grandeza"
                                name="tipoProduto"
                                disabled={
                                  usuario.permiteAltDadosLogisticos === 'N'
                                }
                                defaultChecked={dataProduto.tipoProduto === 1}
                                onChange={() => {
                                  setDataProduto({
                                    ...dataProduto,
                                    tipoProduto: 1,
                                  });
                                }}
                              />
                              Grandeza
                            </label>
                            <label htmlFor="miudeza">
                              <input
                                type="radio"
                                id="miudeza"
                                name="tipoProduto"
                                disabled={
                                  usuario.permiteAltDadosLogisticos === 'N'
                                }
                                defaultChecked={dataProduto.tipoProduto === 2}
                                onChange={() => {
                                  setDataProduto({
                                    ...dataProduto,
                                    tipoProduto: 2,
                                  });
                                }}
                              />
                              Miudeza
                            </label>
                            <label htmlFor="leveza">
                              <input
                                type="radio"
                                id="leveza"
                                name="tipoProduto"
                                disabled={
                                  usuario.permiteAltDadosLogisticos === 'N'
                                }
                                defaultChecked={dataProduto.tipoProduto === 3}
                                onChange={() => {
                                  setDataProduto({
                                    ...dataProduto,
                                    tipoProduto: 3,
                                  });
                                }}
                              />
                              Leveza
                            </label>
                            <label htmlFor="perigoso">
                              <input
                                type="radio"
                                id="perigoso"
                                name="tipoProduto"
                                disabled={
                                  usuario.permiteAltDadosLogisticos === 'N'
                                }
                                defaultChecked={dataProduto.tipoProduto === 4}
                                onChange={() => {
                                  setDataProduto({
                                    ...dataProduto,
                                    tipoProduto: 4,
                                  });
                                }}
                              />
                              Perigoso
                            </label>
                            <label htmlFor="embalados">
                              <input
                                type="radio"
                                id="embalados"
                                name="tipoProduto"
                                disabled={
                                  usuario.permiteAltDadosLogisticos === 'N'
                                }
                                defaultChecked={dataProduto.tipoProduto === 5}
                                onChange={() => {
                                  setDataProduto({
                                    ...dataProduto,
                                    tipoProduto: 5,
                                  });
                                }}
                              />
                              Embalados
                            </label>
                          </div>
                        </CheckRadio>
                        <CheckRadio percWidth={17}>
                          <h1>Abastece Palete Fechado</h1>
                          <div id="itens">
                            <label htmlFor="simPaleteFechado">
                              <input
                                type="radio"
                                id="simPaleteFechado"
                                name="abastecePaleteFechado"
                                disabled={
                                  usuario.permiteAltDadosLogisticos === 'N'
                                }
                                defaultChecked={
                                  dataProduto.abastecePaleteFechado === 'S'
                                }
                                onChange={() => {
                                  setDataProduto({
                                    ...dataProduto,
                                    abastecePaleteFechado: 'S',
                                  });
                                }}
                              />
                              Sim
                            </label>
                            <label htmlFor="naoPaleteFechado">
                              <input
                                type="radio"
                                id="naoPaleteFechado"
                                name="abastecePaleteFechado"
                                disabled={
                                  usuario.permiteAltDadosLogisticos === 'N'
                                }
                                defaultChecked={
                                  dataProduto.abastecePaleteFechado === 'N'
                                }
                                onChange={() => {
                                  setDataProduto({
                                    ...dataProduto,
                                    abastecePaleteFechado: 'N',
                                  });
                                }}
                              />
                              Não
                            </label>
                          </div>
                        </CheckRadio>
                        <CheckRadio percWidth={19}>
                          <h1>Abastece Palete Fechado Cx</h1>
                          <div id="itens">
                            <label htmlFor="simPaleteFechadoCx">
                              <input
                                type="radio"
                                id="simPaleteFechadoCx"
                                name="abastecePaleteFechadoCx"
                                disabled={
                                  usuario.permiteAltDadosLogisticos === 'N'
                                }
                                defaultChecked={
                                  dataProduto.abastecePaleteFechadoCx === 'S'
                                }
                                onChange={() => {
                                  setDataProduto({
                                    ...dataProduto,
                                    abastecePaleteFechadoCx: 'S',
                                  });
                                }}
                              />
                              Sim
                            </label>
                            <label htmlFor="naoPaleteFechadoCx">
                              <input
                                type="radio"
                                id="naoPaleteFechadoCx"
                                name="abastecePaleteFechadoCx"
                                disabled={
                                  usuario.permiteAltDadosLogisticos === 'N'
                                }
                                defaultChecked={
                                  dataProduto.abastecePaleteFechadoCx === 'N'
                                }
                                onChange={() => {
                                  setDataProduto({
                                    ...dataProduto,
                                    abastecePaleteFechadoCx: 'N',
                                  });
                                }}
                              />
                              Não
                            </label>
                          </div>
                        </CheckRadio>
                        <CheckRadio percWidth={20}>
                          <h1>Tipo Carga</h1>
                          <div id="itens">
                            <label htmlFor="seco">
                              <input
                                type="radio"
                                id="seco"
                                name="tipoCarga"
                                disabled={
                                  usuario.permiteAltDadosLogisticos === 'N'
                                }
                                defaultChecked={dataProduto.tipoCarga === 1}
                                onChange={() => {
                                  setDataProduto({
                                    ...dataProduto,
                                    tipoCarga: 1,
                                  });
                                }}
                              />
                              Seco
                            </label>
                            <label htmlFor="resfriado">
                              <input
                                type="radio"
                                id="resfriado"
                                name="tipoCarga"
                                disabled={
                                  usuario.permiteAltDadosLogisticos === 'N'
                                }
                                defaultChecked={dataProduto.tipoCarga === 2}
                                onChange={() => {
                                  setDataProduto({
                                    ...dataProduto,
                                    tipoCarga: 2,
                                  });
                                }}
                              />
                              Resfriado
                            </label>
                            <label htmlFor="congelado">
                              <input
                                type="radio"
                                id="congelado"
                                name="tipoCarga"
                                disabled={
                                  usuario.permiteAltDadosLogisticos === 'N'
                                }
                                defaultChecked={dataProduto.tipoCarga === 3}
                                onChange={() => {
                                  setDataProduto({
                                    ...dataProduto,
                                    tipoCarga: 3,
                                  });
                                }}
                              />
                              Congelado
                            </label>
                          </div>
                        </CheckRadio>
                      </div>
                    </Fieldset>
                    <Fieldset title="Parâmetros">
                      <legend>
                        <span>ENDEREÇO</span>
                      </legend>
                      <div className="wrap">
                        <CheckBox percWidth={19.5}>
                          <label htmlFor="enderecamentoCubagem">
                            <input
                              id="enderecamentoCubagem"
                              name="enderecamentoCubagem"
                              type="checkbox"
                              disabled={
                                usuario.permiteAltDadosLogisticos === 'N'
                              }
                              defaultChecked={
                                dataProduto.enderecamentoCubagem === 'S'
                              }
                              onChange={() => {
                                if (dataProduto.enderecamentoCubagem === 'S') {
                                  setDataProduto({
                                    ...dataProduto,
                                    enderecamentoCubagem: 'N',
                                  });
                                } else {
                                  setDataProduto({
                                    ...dataProduto,
                                    enderecamentoCubagem: 'S',
                                  });
                                }
                              }}
                            />
                            Endereçamento por Cubagem
                          </label>
                        </CheckBox>
                        {/* <CheckBox percWidth={26}>
                          <label htmlFor="validaCpPkAbastecimento">
                            <input
                              id="validaCpPkAbastecimento"
                              name="validaCpPkAbastecimento"
                              type="checkbox"
                              disabled={
                                usuario.permiteAltDadosLogisticos === 'N'
                              }
                              defaultChecked={
                                dataProduto.validaCpPkAbastecimento === 'S'
                              }
                              onChange={() => {
                                if (
                                  dataProduto.validaCpPkAbastecimento === 'S'
                                ) {
                                  setDataProduto({
                                    ...dataProduto,
                                    validaCpPkAbastecimento: 'N',
                                  });
                                } else {
                                  setDataProduto({
                                    ...dataProduto,
                                    validaCpPkAbastecimento: 'S',
                                  });
                                }
                              }}
                            />
                            Validar Capacidade do picking no abastecimento
                          </label>
                        </CheckBox> */}
                        <CheckBox percWidth={16}>
                          <label htmlFor="usaControleVal">
                            <input
                              id="usaControleVal"
                              name="usaControleVal"
                              type="checkbox"
                              disabled={
                                usuario.permiteAltDadosLogisticos === 'N'
                              }
                              defaultChecked={
                                dataProduto.usaControleVal === 'S'
                              }
                              onChange={() => {
                                if (dataProduto.usaControleVal === 'S') {
                                  setDataProduto({
                                    ...dataProduto,
                                    usaControleVal: 'N',
                                  });
                                } else {
                                  setDataProduto({
                                    ...dataProduto,
                                    usaControleVal: 'S',
                                  });
                                }
                              }}
                            />
                            Usa Controle de validade
                          </label>
                        </CheckBox>
                      </div>
                      <div
                        className="wrap"
                        style={{ marginLeft: '0%', marginTop: '8px' }}
                      >
                        <CheckBox percWidth={19.5}>
                          <label htmlFor="usaControleValPk">
                            <input
                              id="usaControleValPk"
                              name="usaControleValPk"
                              type="checkbox"
                              disabled={
                                usuario.permiteAltDadosLogisticos === 'N'
                              }
                              defaultChecked={
                                dataProduto.usaControleValPk === 'S'
                              }
                              onChange={() => {
                                if (dataProduto.usaControleValPk === 'S') {
                                  setDataProduto({
                                    ...dataProduto,
                                    usaControleValPk: 'N',
                                  });
                                } else {
                                  setDataProduto({
                                    ...dataProduto,
                                    usaControleValPk: 'S',
                                  });
                                }
                              }}
                            />
                            Usa Controle de validade no picking
                          </label>
                        </CheckBox>
                        <CheckBox percWidth={16}>
                          <label htmlFor="estoquePorLote">
                            <input
                              id="estoquePorLote"
                              name="estoquePorLote"
                              type="checkbox"
                              disabled={
                                usuario.permiteAltDadosLogisticos === 'N'
                              }
                              defaultChecked={
                                dataProduto.estoquePorLote === 'S'
                              }
                              onChange={() => {
                                if (dataProduto.estoquePorLote === 'S') {
                                  setDataProduto({
                                    ...dataProduto,
                                    estoquePorLote: 'N',
                                  });
                                } else {
                                  setDataProduto({
                                    ...dataProduto,
                                    estoquePorLote: 'S',
                                  });
                                }
                              }}
                            />
                            Controle de estoque por lote
                          </label>
                        </CheckBox>
                        <CheckBox percWidth={20}>
                          <label htmlFor="multiplicadorConf">
                            <input
                              id="multiplicadorConf"
                              name="multiplicadorConf"
                              type="checkbox"
                              disabled={
                                usuario.permiteAltDadosLogisticos === 'N'
                              }
                              defaultChecked={
                                dataProduto.multiplicadorConf === 'S'
                              }
                              onChange={() => {
                                if (dataProduto.multiplicadorConf === 'S') {
                                  setDataProduto({
                                    ...dataProduto,
                                    multiplicadorConf: 'N',
                                  });
                                } else {
                                  setDataProduto({
                                    ...dataProduto,
                                    multiplicadorConf: 'S',
                                  });
                                }
                              }}
                            />
                            Utiliza multiplicador na conferência
                          </label>
                        </CheckBox>
                      </div>
                      <div
                        className="wrap"
                        style={{ marginTop: '8px', marginLeft: '0%' }}
                      >
                        <Select
                          id="tipoEndereco"
                          name="tipoEndereco"
                          description="TIPO ENDEREÇO"
                          percWidth={20}
                          disabled={usuario.permiteAltDadosLogisticos === 'N'}
                          onChange={(e) => {
                            setDataProduto({
                              ...dataProduto,
                              tipoEndereco: Number(e.target.value),
                            });
                          }}
                        >
                          {dataListProduto.tipoEndereco
                            ?.filter(
                              (end) => end.codigo === dataProduto.tipoEndereco,
                            )
                            ?.map((end) => (
                              <option key={end.codigo} value={end.codigo}>
                                {end.descricao}
                              </option>
                            ))}
                          {dataListProduto.tipoEndereco
                            ?.filter(
                              (end) => end.codigo !== dataProduto.tipoEndereco,
                            )
                            ?.map((end) => (
                              <option key={end.codigo} value={end.codigo}>
                                {end.descricao}
                              </option>
                            ))}
                        </Select>
                        <Select
                          id="tipoEstrutura"
                          name="tipoEstrutura"
                          description="TIPO ESTRUTURA"
                          percWidth={20}
                          disabled={usuario.permiteAltDadosLogisticos === 'N'}
                          onChange={(e) => {
                            setDataProduto({
                              ...dataProduto,
                              tipoEstrutura: Number(e.target.value),
                            });
                          }}
                        >
                          {dataListProduto.tipoEstrutura
                            ?.filter(
                              (end) => end.codigo === dataProduto.tipoEstrutura,
                            )
                            ?.map((end) => (
                              <option key={end.codigo} value={end.codigo}>
                                {end.descricao}
                              </option>
                            ))}
                          {dataListProduto.tipoEstrutura
                            ?.filter(
                              (end) => end.codigo !== dataProduto.tipoEstrutura,
                            )
                            ?.map((end) => (
                              <option key={end.codigo} value={end.codigo}>
                                {end.descricao}
                              </option>
                            ))}
                        </Select>
                        <Select
                          id="caracteristicaProduto"
                          name="caracteristicaProduto"
                          description="CARACTERÍSTICA PRODUTO"
                          percWidth={16}
                          disabled={usuario.permiteAltDadosLogisticos === 'N'}
                          onChange={(e) => {
                            setDataProduto({
                              ...dataProduto,
                              caracteristicaProduto: Number(e.target.value),
                            });
                          }}
                        >
                          {dataListProduto.caracteristicaProduto
                            ?.filter(
                              (end) =>
                                end.codigo ===
                                dataProduto.caracteristicaProduto,
                            )
                            ?.map((end) => (
                              <option key={end.codigo} value={end.codigo}>
                                {end.descricao}
                              </option>
                            ))}
                          {dataListProduto.caracteristicaProduto
                            ?.filter(
                              (end) =>
                                end.codigo !==
                                dataProduto.caracteristicaProduto,
                            )
                            ?.map((end) => (
                              <option key={end.codigo} value={end.codigo}>
                                {end.descricao}
                              </option>
                            ))}
                        </Select>
                      </div>
                      <div
                        className="wrap"
                        style={{ marginTop: '8px', marginLeft: '0%' }}
                      >
                        <Input
                          type="number"
                          name="nivelMinimoAbastecimento"
                          description="Niv. Mín. Abastecimento"
                          percWidth={20}
                          defaultValue={dataProduto.nivelMinimoAbastecimento}
                          disabled={usuario.permiteAltDadosLogisticos === 'N'}
                          onChange={(e) => {
                            setDataProduto({
                              ...dataProduto,
                              nivelMinimoAbastecimento: Number(e.target.value),
                            });
                          }}
                        />
                        <Input
                          type="number"
                          name="nivelMaximoAbastecimento"
                          description="Niv. Máx. Abastecimento"
                          percWidth={20}
                          defaultValue={dataProduto.nivelMaximoAbastecimento}
                          disabled={usuario.permiteAltDadosLogisticos === 'N'}
                          onChange={(e) => {
                            setDataProduto({
                              ...dataProduto,
                              nivelMaximoAbastecimento: Number(e.target.value),
                            });
                          }}
                        />
                        <Input
                          type="number"
                          name="restricaoBlocado"
                          description="Restrição Blocado"
                          percWidth={16}
                          defaultValue={dataProduto.restricaoBlocado}
                          disabled={usuario.permiteAltDadosLogisticos === 'N'}
                          onChange={(e) => {
                            setDataProduto({
                              ...dataProduto,
                              restricaoBlocado: Number(e.target.value),
                            });
                          }}
                        />
                      </div>
                    </Fieldset>
                  </Form>
                </Content>
              </div>
              <div className="tab3">
                <Content>
                  <Fieldset title="Endereço de picking">
                    <legend>
                      <span>ENDEREÇO DE PICKING</span>
                    </legend>
                    <Button>
                      <button
                        type="button"
                        onClick={() => setDialogPicking(true)}
                        disabled={usuario.permiteAltDadosLogisticos === 'N'}
                      >
                        <FiPlusSquare />
                        Adicionar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEdicao(true);
                          setDialogPicking(true);
                        }}
                        disabled={
                          !pickingSelecionado?.codEndereco ||
                          usuario.permiteAltDadosLogisticos === 'N'
                        }
                      >
                        <FiEdit />
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          dataProduto.picking
                            .filter(
                              (pk) =>
                                pk.codEndereco ===
                                Number(pickingSelecionado.codEndereco),
                            )
                            .map((pk) => {
                              pk.codEnderecoAnterior =
                                pickingSelecionado.codEndereco;

                              return pk;
                            });
                          setDialogTransfPicking(true);
                        }}
                        disabled={
                          pickingSelecionado?.permiteTransfPk === 'N' ||
                          !pickingSelecionado?.codEndereco ||
                          usuario.permiteAltDadosLogisticos === 'N'
                        }
                      >
                        <FiRepeat />
                        Transferir
                      </button>
                      <button
                        type="button"
                        onClick={() => setDialogExclusao(true)}
                        disabled={
                          pickingSelecionado?.permiteExcluirPk === 'N' ||
                          !pickingSelecionado?.codEndereco ||
                          usuario.permiteAltDadosLogisticos === 'N'
                        }
                      >
                        <FiTrash2 />
                        Excluir
                      </button>
                    </Button>
                    {esconderTabPicking ? (
                      <p className="nenhumDadoTabela">
                        Nenhum registro encontrado
                      </p>
                    ) : (
                      <DataTable
                        value={dataProduto.picking}
                        scrollable
                        selectionMode="single"
                        selection={pickingSelecionado}
                        onSelectionChange={(e) => {
                          setPickingSelecionado(e.value);
                        }}
                        style={{ width: '92vw' }}
                        scrollHeight="20vh"
                        metaKeySelection={false}
                      >
                        <Column
                          field="codprod"
                          header="Prod"
                          style={{ width: '65px' }}
                          bodyStyle={{ textAlign: 'right' }}
                        />
                        <Column
                          field="descricao"
                          header="Descrição"
                          style={{ width: '250px' }}
                        />
                        <Column
                          field="codfilial"
                          header="Filial"
                          style={{ width: '65px' }}
                          bodyStyle={{ textAlign: 'right' }}
                        />
                        <Column
                          field="descFilial"
                          header="Nome Filial"
                          style={{ width: '300px' }}
                        />
                        <Column
                          field="codTipoEndereco"
                          header="Tipo End."
                          style={{ width: '80px' }}
                          bodyStyle={{ textAlign: 'right' }}
                        />
                        <Column
                          field="descTipoEndereco"
                          header="Tipo Endereço"
                          style={{ width: '200px' }}
                        />
                        <Column
                          field="codTipoEstrutura"
                          header="Tipo Est."
                          style={{ width: '80px' }}
                          bodyStyle={{ textAlign: 'right' }}
                        />
                        <Column
                          field="descTipoEstrutura"
                          header="Tipo Estrutura"
                          style={{ width: '200px' }}
                        />
                        <Column
                          field="tipoPicking"
                          header="Tipo Pk."
                          style={{ width: '80px' }}
                        />
                        <Column
                          field="codEndereco"
                          header="Cód. End"
                          style={{ width: '80px' }}
                          bodyStyle={{ textAlign: 'right' }}
                        />
                        <Column
                          field="deposito"
                          header="Dep"
                          style={{ width: '55px' }}
                          bodyStyle={{ textAlign: 'right' }}
                        />
                        <Column
                          field="rua"
                          header="Rua"
                          style={{ width: '55px' }}
                          bodyStyle={{ textAlign: 'right' }}
                        />
                        <Column
                          field="predio"
                          header="Pre"
                          style={{ width: '55px' }}
                          bodyStyle={{ textAlign: 'right' }}
                        />
                        <Column
                          field="nivel"
                          header="Niv"
                          style={{ width: '55px' }}
                          bodyStyle={{ textAlign: 'right' }}
                        />
                        <Column
                          field="apto"
                          header="Apto"
                          style={{ width: '55px' }}
                          bodyStyle={{ textAlign: 'right' }}
                        />
                        <Column
                          field="capacidade"
                          header="Capacidade"
                          style={{ width: '100px' }}
                          bodyStyle={{ textAlign: 'right' }}
                        />
                        <Column
                          field="percPontoReposicao"
                          header="% Reposição"
                          style={{ width: '120px' }}
                          bodyStyle={{ textAlign: 'right' }}
                        />
                        <Column
                          field="pontoReposicao"
                          header="Ponto Reposição"
                          style={{ width: '150px' }}
                          bodyStyle={{ textAlign: 'right' }}
                        />
                      </DataTable>
                    )}
                  </Fieldset>
                  <Fieldset title="Endereço loja">
                    <legend>
                      <span>ENDEREÇO LOJA</span>
                    </legend>
                    <Button>
                      <button
                        type="button"
                        onClick={() => setDialogEndLoja(true)}
                        disabled={usuario.permiteAltDadosLogisticos === 'N'}
                      >
                        <FiPlusSquare />
                        Adicionar
                      </button>
                      <button
                        type="button"
                        onClick={() => setDialogExclusao(true)}
                        disabled={
                          !enderecoLojaSelecionado?.codEndereco ||
                          usuario.permiteAltDadosLogisticos === 'N'
                        }
                      >
                        <FiTrash2 />
                        Excluir
                      </button>
                    </Button>
                    {esconderTabEndLoja ? (
                      <p className="nenhumDadoTabela">
                        Nenhum registro encontrado
                      </p>
                    ) : (
                      <DataTable
                        value={dataProduto.enderecoLoja}
                        scrollable
                        selectionMode="single"
                        selection={enderecoLojaSelecionado}
                        onSelectionChange={(e) => {
                          setEnderecoLojaSelecionado(e.value);
                        }}
                        scrollHeight="20vh"
                        style={{ width: '92vw' }}
                        metaKeySelection={false}
                      >
                        <Column
                          field="codprod"
                          header="Prod"
                          style={{ width: '65px' }}
                          bodyStyle={{ textAlign: 'right' }}
                        />
                        <Column
                          field="descricao"
                          header="Descrição"
                          style={{ width: '250px' }}
                        />
                        <Column
                          field="codfilial"
                          header="Filial"
                          style={{ width: '65px' }}
                          bodyStyle={{ textAlign: 'right' }}
                        />
                        <Column
                          field="descFilial"
                          header="Nome Filial"
                          style={{ width: '300px' }}
                        />
                        <Column
                          field="codEndereco"
                          header="Cód. End"
                          style={{ width: '80px' }}
                          bodyStyle={{ textAlign: 'right' }}
                        />
                        <Column
                          field="deposito"
                          header="Dep"
                          style={{ width: '55px' }}
                          bodyStyle={{ textAlign: 'right' }}
                        />
                        <Column
                          field="rua"
                          header="Rua"
                          style={{ width: '55px' }}
                          bodyStyle={{ textAlign: 'right' }}
                        />
                        <Column
                          field="predio"
                          header="Pre"
                          style={{ width: '55px' }}
                          bodyStyle={{ textAlign: 'right' }}
                        />
                        <Column
                          field="nivel"
                          header="Niv"
                          style={{ width: '55px' }}
                          bodyStyle={{ textAlign: 'right' }}
                        />
                        <Column
                          field="apto"
                          header="Apto"
                          style={{ width: '55px' }}
                          bodyStyle={{ textAlign: 'right' }}
                        />
                        <Column
                          field="capacidade"
                          header="Capacidade"
                          style={{ width: '100px' }}
                          bodyStyle={{ textAlign: 'right' }}
                        />
                        <Column
                          field="percPontoReposicao"
                          header="% Reposição"
                          style={{ width: '120px' }}
                          bodyStyle={{ textAlign: 'right' }}
                        />
                        <Column
                          field="pontoReposicao"
                          header="Ponto Reposição"
                          style={{ width: '150px' }}
                          bodyStyle={{ textAlign: 'right' }}
                        />
                      </DataTable>
                    )}
                  </Fieldset>
                  <Fieldset title="Embalagem Auxiliar">
                    <legend>
                      <span>EMBALAGEM AXILIAR</span>
                    </legend>
                    <Button>
                      <button
                        type="button"
                        onClick={() => setDialogEmbAuxiliar(true)}
                        disabled={usuario.permiteAltDadosLogisticos === 'N'}
                      >
                        <FiPlusSquare />
                        Adicionar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEdicao(true);
                          setDialogEmbAuxiliar(true);
                        }}
                        disabled={
                          !embAuxiliarSelecionada?.codBarra ||
                          usuario.permiteAltDadosLogisticos === 'N'
                        }
                      >
                        <FiEdit />
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => setDialogExclusao(true)}
                        disabled={
                          !embAuxiliarSelecionada?.codBarra ||
                          usuario.permiteAltDadosLogisticos === 'N'
                        }
                      >
                        <FiTrash2 />
                        Excluir
                      </button>
                    </Button>
                    {esconderTabEmbAux ? (
                      <p className="nenhumDadoTabela">
                        Nenhum registro encontrado
                      </p>
                    ) : (
                      <DataTable
                        value={dataProduto.embalagemAuxliar}
                        scrollable
                        selectionMode="single"
                        selection={embAuxiliarSelecionada}
                        onSelectionChange={(e) => {
                          setEmbAuxiliarSelecionada(e.value);
                        }}
                        scrollHeight="20vh"
                        style={{ width: '92vw' }}
                        metaKeySelection={false}
                      >
                        <Column
                          field="codprod"
                          header="Prod"
                          style={{ width: '65px' }}
                          bodyStyle={{ textAlign: 'right' }}
                        />
                        <Column
                          field="descricao"
                          header="Descrição"
                          style={{ width: '250px' }}
                        />
                        <Column
                          field="codfilial"
                          header="Filial"
                          style={{ width: '65px' }}
                          bodyStyle={{ textAlign: 'right' }}
                        />
                        <Column
                          field="descFilial"
                          header="Nome Filial"
                          style={{ width: '300px' }}
                        />
                        <Column
                          field="codBarra"
                          header="Cód.Barra"
                          style={{ width: '100px' }}
                          bodyStyle={{ textAlign: 'right' }}
                        />
                        <Column
                          field="embalagem"
                          header="Embalagem"
                          style={{ width: '200px' }}
                        />
                        <Column
                          field="unidade"
                          header="Unidade"
                          style={{ width: '80px' }}
                        />
                        <Column
                          field="qtunit"
                          header="Qt.Unit"
                          style={{ width: '80px' }}
                          bodyStyle={{ textAlign: 'right' }}
                        />
                      </DataTable>
                    )}
                  </Fieldset>
                  <Fieldset title="Cód Barras Alternativo">
                    <legend>
                      <span>CÓD. BARRAS ALTERNATIVO</span>
                    </legend>
                    <Button>
                      <button
                        type="button"
                        onClick={() => setDialogCodBarraAlt(true)}
                        disabled={usuario.permiteAltDadosLogisticos === 'N'}
                      >
                        <FiPlusSquare />
                        Adicionar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEdicao(true);
                          setDialogCodBarraAlt(true);
                        }}
                        disabled={
                          !codBarraAltSelecionado?.codBarra ||
                          usuario.permiteAltDadosLogisticos === 'N'
                        }
                      >
                        <FiEdit />
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => setDialogExclusao(true)}
                        disabled={
                          !codBarraAltSelecionado?.codBarra ||
                          usuario.permiteAltDadosLogisticos === 'N'
                        }
                      >
                        <FiTrash2 />
                        Excluir
                      </button>
                    </Button>
                    {esconderTabCodBarraAlt ? (
                      <p className="nenhumDadoTabela">
                        Nenhum registro encontrado
                      </p>
                    ) : (
                      <DataTable
                        value={dataProduto.codBarrasAlternativo}
                        scrollable
                        selectionMode="single"
                        selection={codBarraAltSelecionado}
                        onSelectionChange={(e) => {
                          setCodBarraAltSelecionado(e.value);
                        }}
                        scrollHeight="20vh"
                        style={{ width: '92vw' }}
                        metaKeySelection={false}
                      >
                        <Column
                          field="codprod"
                          header="Prod"
                          style={{ width: '65px' }}
                          bodyStyle={{ textAlign: 'right' }}
                        />
                        <Column
                          field="descricao"
                          header="Descrição"
                          style={{ width: '250px' }}
                        />
                        <Column
                          field="codfilial"
                          header="Filial"
                          style={{ width: '65px' }}
                          bodyStyle={{ textAlign: 'right' }}
                        />
                        <Column
                          field="descFilial"
                          header="Nome Filial"
                          style={{ width: '300px' }}
                        />
                        <Column
                          field="codBarra"
                          header="Cód.Barra"
                          style={{ width: '100px' }}
                          bodyStyle={{ textAlign: 'right' }}
                        />
                        <Column
                          field="embalagem"
                          header="Embalagem"
                          style={{ width: '200px' }}
                        />
                        <Column
                          field="unidade"
                          header="Unidade"
                          style={{ width: '80px' }}
                        />
                        <Column
                          field="qtunit"
                          header="Qt.Unit"
                          style={{ width: '80px' }}
                          bodyStyle={{ textAlign: 'right' }}
                        />
                      </DataTable>
                    )}
                  </Fieldset>
                </Content>
              </div>
              <div className="tab4">
                <Content>
                  <Fieldset title="Lista de endereços">
                    <legend>
                      <span>LISTA DE ENDEREÇOS</span>
                    </legend>
                    <DataTable
                      value={dataProduto.enderecosWms}
                      scrollable
                      style={{ width: '92vw' }}
                    >
                      <Column
                        field="codEndereco"
                        header="Cód.Endereço"
                        style={{ width: '40px' }}
                        bodyStyle={{ textAlign: 'right' }}
                      />
                      <Column
                        field="tipoEndereco"
                        header="Tipo Endereço"
                        style={{ width: '40px' }}
                        bodyStyle={{ textAlign: 'center' }}
                      />
                      <Column
                        field="deposito"
                        header="Depósito"
                        style={{ width: '40px' }}
                        bodyStyle={{ textAlign: 'right' }}
                      />
                      <Column
                        field="rua"
                        header="Rua"
                        style={{ width: '40px' }}
                        bodyStyle={{ textAlign: 'right' }}
                      />
                      <Column
                        field="predio"
                        header="Prédio"
                        style={{ width: '40px' }}
                        bodyStyle={{ textAlign: 'right' }}
                      />
                      <Column
                        field="nivel"
                        header="Nível"
                        style={{ width: '40px' }}
                        bodyStyle={{ textAlign: 'right' }}
                      />
                      <Column
                        field="apto"
                        header="Apto"
                        style={{ width: '40px' }}
                        bodyStyle={{ textAlign: 'right' }}
                      />
                      <Column
                        field="qt"
                        header="Est.Endereço"
                        style={{ width: '40px' }}
                        bodyStyle={{ textAlign: 'right' }}
                      />
                    </DataTable>
                  </Fieldset>
                </Content>
              </div>
            </section>
            <Button style={{ marginTop: '8px', marginLeft: '3.3em' }}>
              <button type="button" onClick={() => setDialogImpressao(true)}>
                <FiPrinter />
                Imprimir
              </button>
              <button
                type="button"
                onClick={() => setDialogConfirmacao(true)}
                disabled={usuario.permiteAltDadosLogisticos === 'N'}
              >
                <FiSave />
                Gravar
              </button>
              <button type="button" onClick={() => history.goBack()}>
                <FiXOctagon />
                Cancelar
              </button>
            </Button>
            {dialogImpressao ? (
              <DialogImpressao
                title="Impressão"
                executar={impressaoEtiquetas}
              />
            ) : (
              <> </>
            )}
            {dialogConfirmacao ? (
              <DialogConfirmacao
                title="Gravar dados"
                message="Você está prestes a gravar as alterações do item, deseja continuar?"
                executar={gravarDadosProduto}
              />
            ) : (
              <> </>
            )}
            {dialogExclusao ? (
              <DialogConfirmacao
                title="Confirmação de exclusão"
                message="Você está prestes a excluir o item, deseja continuar?"
                executar={validaExclusao}
              />
            ) : (
              <> </>
            )}
            {dialogPicking ? (
              <Dialog
                title="Cadastrar Endereço de Picking"
                message={`*Informar quantidades em unidade de venda. (Qt.Emb.Master: ${dataProduto.qtunitcx})`}
                tipoDialog="PK"
                edicaoPk={!!edicao}
                dataEdicaoPk={
                  edicao
                    ? {
                        tipoPicking: pickingSelecionado.tipoPicking,
                        codTipoEndereco: pickingSelecionado.codTipoEndereco,
                        codTipoEstrutura: pickingSelecionado.codTipoEstrutura,
                        codEndereco: pickingSelecionado.codEndereco,
                        deposito: pickingSelecionado.deposito,
                        rua: pickingSelecionado.rua,
                        predio: pickingSelecionado.predio,
                        nivel: pickingSelecionado.nivel,
                        apto: pickingSelecionado.apto,
                        capacidade: pickingSelecionado.capacidade,
                        percPontoReposicao:
                          pickingSelecionado.percPontoReposicao,
                        pontoReposicao: pickingSelecionado.pontoReposicao,
                      }
                    : undefined
                }
                cabecalho={{
                  codprod: dataProduto.codprod,
                  descricao: dataProduto.descricao,
                  codfilial: dataProduto.codfilial,
                  descFilial: dataProduto.descFilial,
                  tipoEndereco: dataListProduto.tipoEndereco,
                  tipoEstrutura: dataListProduto.tipoEstrutura,
                }}
                executar={adicionaNovoPicking}
              />
            ) : (
              <> </>
            )}
            {dialogTransfPicking ? (
              <Dialog
                title="Transferência de Picking"
                message={`*Informar quantidades em unidade de venda. (Qt.Emb.Master: ${dataProduto.qtunitcx})`}
                tipoDialog="PKTRANSF"
                cabecalho={{
                  codprod: dataProduto.codprod,
                  descricao: dataProduto.descricao,
                  codfilial: dataProduto.codfilial,
                  descFilial: dataProduto.descFilial,
                  tipoEndereco: dataListProduto.tipoEndereco,
                  tipoEstrutura: dataListProduto.tipoEstrutura,
                }}
                executar={transferirPicking}
              />
            ) : (
              <> </>
            )}
            {dialogEndLoja ? (
              <Dialog
                title="Cadastrar Endereço de Loja"
                message={`*Informar quantidades em unidade de venda. (Qt.Emb.Master: ${dataProduto.qtunitcx})`}
                tipoDialog="LOJA"
                cabecalho={{
                  codprod: dataProduto.codprod,
                  descricao: dataProduto.descricao,
                  codfilial: dataProduto.codfilial,
                  descFilial: dataProduto.descFilial,
                }}
                executar={adicionaNovoPickingLoja}
              />
            ) : (
              <> </>
            )}
            {dialogEmbAuxiliar ? (
              <Dialog
                title="Cadastrar Embalagem Auxiliar"
                tipoDialog="EMBALAGEM"
                edicao={!!edicao}
                dataEdicao={
                  edicao
                    ? {
                        codBarra: embAuxiliarSelecionada.codBarra,
                        embalagem: embAuxiliarSelecionada.embalagem,
                        unidade: embAuxiliarSelecionada.unidade,
                        qtunit: embAuxiliarSelecionada.qtunit,
                      }
                    : undefined
                }
                cabecalho={{
                  codprod: dataProduto.codprod,
                  descricao: dataProduto.descricao,
                  codfilial: dataProduto.codfilial,
                  descFilial: dataProduto.descFilial,
                }}
                executar={adicionaNovaEmbAuxiliar}
              />
            ) : (
              <> </>
            )}
            {dialogCodBarraAlt ? (
              <Dialog
                title="Cadastrar Código de Barras Alternativo"
                tipoDialog="EMBALAGEM"
                edicao={!!edicao}
                dataEdicao={
                  edicao
                    ? {
                        codBarra: codBarraAltSelecionado.codBarra,
                        embalagem: codBarraAltSelecionado.embalagem,
                        unidade: codBarraAltSelecionado.unidade,
                        qtunit: codBarraAltSelecionado.qtunit,
                      }
                    : undefined
                }
                cabecalho={{
                  codprod: dataProduto.codprod,
                  descricao: dataProduto.descricao,
                  codfilial: dataProduto.codfilial,
                  descFilial: dataProduto.descFilial,
                }}
                executar={adicionaNovoCodBarraAlt}
              />
            ) : (
              <> </>
            )}
          </>
        ) : (
          <Loanding>
            <ReactLoading
              className="loading"
              type="spokes"
              width="120px"
              color="#c22e2c"
            />
            <h1>{mensagemLoading}</h1>
          </Loanding>
        )}
      </Container>
    </>
  );
};

export default DadosLogistico;
