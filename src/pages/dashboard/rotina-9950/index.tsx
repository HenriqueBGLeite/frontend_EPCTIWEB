import React, { useEffect, useState, useRef, useCallback } from 'react';
import { FiPrinter, FiScissors, FiThumbsUp } from 'react-icons/fi';
import { FaSearch, FaPlay, FaTrashAlt } from 'react-icons/fa';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { ProgressBar } from 'primereact/progressbar';
import ReactLoading from 'react-loading';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { MultiSelect } from 'primereact/multiselect';

import { useAuth } from '../../../hooks/auth';
import { formataDataInicial, formataData } from '../../../utils/formataData';
import { formataReais, formataValor } from '../../../utils/formataValor';
import formataRelatorio from '../../../utils/formataRelatorioPdf';
import { createMessage } from '../../../components/Toast';

import api from '../../../services/api';
import apiRelatorios from '../../../services/relatorios';

import Input from '../../../components/Input';
import NavBar from '../../../components/NavBar';
import Dialog from '../../../components/Dialog';
import DialogGenerico from '../../../components/Dialog-Generico';
import Select from '../../../components/Select';

import {
  Container,
  Content,
  Divisor,
  Button,
  CheckRadio,
  CheckBox,
  Loading,
} from './styles';

interface Filiais {
  codigo: number;
}

interface Rotas {
  value: number;
  label: string;
}

interface DataInicioFim {
  inicio: string;
  fim: string;
}

interface Pesquisa {
  codfilial: number;
  dataInicial: string;
  dataFinal: string;
  rotas: string;
  numcar: number;
  numped: number;
  numtranswms: number;
  numos: number;
  tipoos: number;
  modeloSep: string;
  gerados: boolean;
  faturados: boolean;
  impressos: boolean;
}

interface DTOData {
  filial: string;
  dataInicial: string;
  dataFinal: string;
  carga: number;
  numped: number;
  numtranswms: number;
  numos: number;
  tipoos: number;
}

interface DataPedidos {
  numtranswms: number;
  pedidos: string;
  cliente: string;
  rota: string;
  praca: string;
  vlped: number;
  vlpedformatado: string;
  peso: number;
  pesoformatado: string;
  volume: number;
  volumeformatado: string;
  oS13: number;
  voL13: number;
  oS20: number;
  voL20: number;
  oS17: number;
  voL17: number;
  separacao: number;
  conferencia: number;
  divergencia: number;
  obswms: string;
}

interface DataCargas {
  numcar: number;
  destino: string;
  numbox: number;
  vltotal: number;
  vltotalformatado: string;
  peso: number;
  pesoformatado: string;
  volume: number;
  volumeformatado: string;
  oS13: number;
  voL13: number;
  oS20: number;
  voL20: number;
  oS17: number;
  voL17: number;
  separacao: number;
  conferencia: number;
  divergencia: number;
  obswms: string;
}

interface GerarOs {
  numped: number;
  numcar: number;
  numbox: number;
  modelosep: string;
  codfuncger: number;
  homologacao: boolean;
}

interface EstornoOs {
  numtranswms: number;
  numcar: number;
  modelosep: string;
  codfuncger: number;
  homologacao: boolean;
}

interface CorteCarga {
  numcar: number;
  numtranswms: number;
  codfuncger: number;
  homologacao: boolean;
  modeloSep: string;
}

interface BoxData {
  codbox: number;
  descricao: string;
}

interface ImprimirOs {
  antecipado: 'S' | 'N';
  modelo: 'C' | 'P' | 'A';
  cargasTransacoes: string;
  tipoos: number;
  codfunc: number;
}

interface ImpressaoProps {
  mapaSeparacao: boolean;
  etiqueta13: boolean;
  etiqueta20: boolean;
  etiqueta17: boolean;
  mapaSeparacaoAntecipado: boolean;
  etiqueta13Antecipada: boolean;
}

interface DTOImpressoes {
  app: 'EPCWMS';
  tipousu: 'U';
  matricula: number;
  tamanho: 'G';
  nrorel: 9029 | 9030 | 9031;
  pAntecipado: 'S' | 'N';
  pNumcar?: string;
  pNumtranswms?: string;
  pNumos?: number;
  pDtIni: string;
  pDtFim: string;
}

interface DTOImpressoes20e17 {
  app: 'EPCWMS';
  tipousu: 'U';
  matricula: number;
  tamanho: 'G';
  nrorel: 9030;
  pNumcar?: string;
  pNumtranswms?: string;
  pNumos?: number;
  pTipoos: number;
  pDtIni: string;
  pDtFim: string;
}

const Rotina9950: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { usuario, homologacao } = useAuth();
  const [dialogGerar, setDialogGerar] = useState(false);
  const [dialogImprimir, setDialogImprimir] = useState(false);
  const [dialogEstornar, setDialogEstornar] = useState(false);
  const [dialogCortar, setDialogCortar] = useState(false);
  const [dialogLiberarFaturamento, setDialogLiberarFaturamento] = useState(
    false,
  );
  const [loading, setLoading] = useState(false);
  const [loadingPesquisa, setLoadingPesquisa] = useState(false);
  const [loadingGerar, setLoadingGerar] = useState(false);
  const [loadingImprimir, setLoadingImprimir] = useState(false);
  const [messagemImpressao, setMensagemImpressao] = useState('');
  const [loadingEstornar, setLoadingEstornar] = useState(false);
  const [loadingCortar, setLoadingCortar] = useState(false);
  const [loadingLiberarFaturamento, setLoadingLiberarFaturamento] = useState(
    false,
  );
  const [gerados, setGerados] = useState(false);
  const [faturados, setFaturados] = useState(false);
  const [impressos, setImpressos] = useState(false);
  const [pedidos, setPedidos] = useState<DataPedidos[]>([]);
  const [pedidosSelecionados, setPedidosSelecionados] = useState<DataPedidos[]>(
    [],
  );
  const [cargas, setCargas] = useState<DataCargas[]>([]);
  const [cargaSelecionadas, setCargasSelecionadas] = useState<DataCargas[]>([]);
  const [listagemBox, setListagemBox] = useState<BoxData[]>([]);
  const [filiais, setFiliais] = useState<Filiais[]>([]);
  const [filialSelecionada, setFilialSelecionada] = useState(
    Number(usuario.filial),
  );
  const [modeloSeparacao, setModeloSeparacao] = useState('A');
  const [dataInicioFim, setDataInicioFim] = useState<DataInicioFim>(
    {} as DataInicioFim,
  );
  const [rotas, setRotas] = useState<Rotas[]>([]);
  const [rotasSelecionadas, setRotasSelecionadas] = useState<Rotas[]>([]);

  const [totalValor, setTotalValor] = useState('');
  const [totalPeso, setTotalPeso] = useState('');
  const [totalVolume, setTotalVolume] = useState('');

  useEffect(() => {
    setFilialSelecionada(usuario.filial);

    const { dataInicial, dataFinal } = formataDataInicial();

    setDataInicioFim({ inicio: dataInicial, fim: dataFinal });

    api
      .get<BoxData[]>(`Rotina9950/BoxFilial/${usuario.filial}`)
      .then((response) => {
        const achouBox = response.data;

        if (achouBox.length > 0) {
          setListagemBox(achouBox);
        } else {
          createMessage({
            type: 'error',
            message: 'Nenhum box foi encontrado.',
          });
        }
      })
      .catch((err) => {
        createMessage({
          type: 'error',
          message: `Error: ${err.message}`,
        });
      });

    api
      .get<Filiais[]>(`Rotina9950/BuscaFiliais/${usuario.codigo}`)
      .then((response) => {
        const filiaisEncontradas = response.data;

        if (filiaisEncontradas.length > 0) {
          setFiliais(filiaisEncontradas);
        } else {
          createMessage({
            type: 'alert',
            message: 'Usuário não possui acesso a nenhuma filial.',
          });
        }
      })
      .catch((err) => {
        createMessage({
          type: 'error',
          message: `Error: ${err.message}`,
        });
      });

    api
      .get<Rotas[]>('Rotina9950/BuscaRotas/')
      .then((response) => {
        const rotasEncontradas = response.data;

        if (rotasEncontradas.length > 0) {
          setRotas(rotasEncontradas);
        } else {
          createMessage({
            type: 'alert',
            message: 'Usuário não possui acesso a nenhuma filial.',
          });
        }
      })
      .catch((err) => {
        createMessage({
          type: 'error',
          message: `Error: ${err.message}`,
        });
      });
  }, [usuario]);

  const atribuiRotaSelecionada = useCallback((e) => {
    const selecao = e.value as Rotas[];

    setRotasSelecionadas(selecao);
  }, []);

  const pesquisarDados = useCallback(
    async (data: DTOData) => {
      setPedidosSelecionados([]);
      setCargasSelecionadas([]);

      const dataInicialFormatada = formataData(`${data.dataInicial}T00:00:00`);
      const dataFinalFormatada = formataData(`${data.dataFinal}T00:00:00`);

      const dataPesquisa = {
        codfilial: Number(data.filial),
        dataInicial: dataInicialFormatada,
        dataFinal: dataFinalFormatada,
        rotas: rotasSelecionadas.toString(),
        numcar: data.carga,
        numped: data.numped,
        numtranswms: data.numtranswms,
        numos: data.numos,
        tipoos: data.tipoos,
        modeloSep: modeloSeparacao,
        gerados,
        faturados,
        impressos,
      } as Pesquisa;

      if (modeloSeparacao !== 'C') {
        try {
          setLoading(true);
          setLoadingPesquisa(true);
          const response = await api.post<DataPedidos[]>(
            'Rotina9950/BuscaDadosCargaPedidos/',
            dataPesquisa,
          );

          if (response.data.length > 0) {
            const retornoPedidos = response.data;

            let totalValorPedidos = 0;
            let totalPesoPedidos = 0;
            let totalVolumePedidos = 0;

            retornoPedidos.map((pedido) => {
              const valorFormatado = formataReais(pedido.vlped);
              const valorFormatadoPeso = formataValor(pedido.peso);
              const valorFormatadoVolume = formataValor(pedido.volume);

              totalValorPedidos += pedido.vlped;
              totalPesoPedidos += pedido.peso;
              totalVolumePedidos += pedido.volume;

              pedido.vlpedformatado = valorFormatado;
              pedido.pesoformatado = valorFormatadoPeso;
              pedido.volumeformatado = valorFormatadoVolume;

              return pedido;
            });

            setTotalValor(formataReais(totalValorPedidos));
            setTotalPeso(formataValor(totalPesoPedidos));
            setTotalVolume(formataValor(totalVolumePedidos));

            setPedidos(retornoPedidos);
            setLoadingPesquisa(false);
            setLoading(false);
          } else {
            createMessage({
              type: 'alert',
              message:
                'Nenhum registro foi encontrado com os filtros informados.',
            });
            setPedidos([]);
            setTotalValor('');
            setTotalPeso('');
            setTotalVolume('');
            setLoadingPesquisa(false);
            setLoading(false);
          }
        } catch (err) {
          createMessage({
            type: 'alert',
            message: `Error: ${err.message}`,
          });
          setPedidos([]);
          setTotalValor('');
          setTotalPeso('');
          setTotalVolume('');
          setLoadingPesquisa(false);
          setLoading(false);
        }
      } else {
        try {
          setLoading(true);
          setLoadingPesquisa(true);
          const response = await api.post<DataCargas[]>(
            'Rotina9950/BuscaDadosCargaPedidos/',
            dataPesquisa,
          );

          if (response.data.length > 0) {
            const retornoCargas = response.data;

            let totalValorCargas = 0;
            let totalPesoCargas = 0;
            let totalVolumeCargas = 0;

            retornoCargas.map((carga) => {
              const valorFormatado = formataReais(carga.vltotal);
              const valorFormatadoPeso = formataValor(carga.peso);
              const valorFormatadoVolume = formataValor(carga.volume);

              carga.vltotalformatado = valorFormatado;
              carga.pesoformatado = valorFormatadoPeso;
              carga.volumeformatado = valorFormatadoVolume;

              totalValorCargas += carga.vltotal;
              totalPesoCargas += carga.peso;
              totalVolumeCargas += carga.volume;

              return carga;
            });

            setTotalValor(formataReais(totalValorCargas));
            setTotalPeso(formataValor(totalPesoCargas));
            setTotalVolume(formataValor(totalVolumeCargas));

            setCargas(retornoCargas);
            setLoadingPesquisa(false);
            setLoading(false);
          } else {
            createMessage({
              type: 'alert',
              message:
                'Nenhum registro foi encontrado com os filtros informados.',
            });
            setCargas([]);
            setTotalValor('');
            setTotalPeso('');
            setTotalVolume('');
            setLoadingPesquisa(false);
            setLoading(false);
          }
        } catch (err) {
          createMessage({
            type: 'alert',
            message: `Error: ${err.message}`,
          });
          setCargas([]);
          setTotalValor('');
          setTotalPeso('');
          setTotalVolume('');
          setLoadingPesquisa(false);
          setLoading(false);
        }
      }
    },
    [modeloSeparacao, rotasSelecionadas, gerados, faturados, impressos],
  );

  const styleOsVolume = useCallback(
    (rowData: DataPedidos | DataCargas, column) => {
      let cor = '';
      let fonte = '';
      let valor;

      if (
        rowData.oS13 === 0 &&
        rowData.voL13 === 0 &&
        rowData.oS20 === 0 &&
        rowData.voL20 === 0 &&
        rowData.oS17 === 0 &&
        rowData.voL17 === 0
      ) {
        cor = '#FFCDD2';
        fonte = '#C63737';
      } else if (column.field === 'oS13' || column.field === 'voL13') {
        if (rowData.oS13 > rowData.voL13) {
          cor = '#FEEDAF';
          fonte = '#8A5340';
        } else {
          cor = '#C8E6C9';
          fonte = '#256029';
        }
      } else if (column.field === 'oS20' || column.field === 'voL20') {
        if (rowData.oS20 > rowData.voL20) {
          cor = '#FEEDAF';
          fonte = '#8A5340';
        } else {
          cor = '#C8E6C9';
          fonte = '#256029';
        }
      } else if (column.field === 'oS17' || column.field === 'voL17') {
        if (rowData.oS17 > rowData.voL17) {
          cor = '#FEEDAF';
          fonte = '#8A5340';
        } else {
          cor = '#C8E6C9';
          fonte = '#256029';
        }
      }

      switch (column.field) {
        case 'oS13':
          valor = rowData.oS13;
          break;
        case 'voL13':
          valor = rowData.voL13;
          break;
        case 'oS20':
          valor = rowData.oS20;
          break;
        case 'voL20':
          valor = rowData.voL20;
          break;
        case 'oS17':
          valor = rowData.oS17;
          break;
        case 'voL17':
          valor = rowData.voL17;
          break;
        default:
          valor = 0;
      }

      return (
        <span
          style={{
            padding: '2px 10px',
            borderRadius: '6px',
            fontSize: '14px',
            color: fonte,
            fontWeight: 'bold',
            backgroundColor: cor,
          }}
        >
          {valor}
        </span>
      );
    },
    [],
  );

  const percentualPedido = useCallback((rowData: DataPedidos, column) => {
    let valor;

    switch (column.field) {
      case 'separacao':
        valor = rowData.separacao;
        break;
      case 'conferencia':
        valor = rowData.conferencia;
        break;
      case 'divergencia':
        valor = rowData.divergencia;
        break;
      default:
        valor = 0;
    }

    return <ProgressBar value={valor} showValue />;
  }, []);

  const selecionaPedidos = useCallback((pedido) => {
    const selecao = pedido.value as DataPedidos[];

    setPedidosSelecionados(selecao);
  }, []);

  const selecionaCargas = useCallback((carga) => {
    const selecao = carga.value as DataCargas[];

    setCargasSelecionadas(selecao);
  }, []);

  const filtraGerados = useCallback(() => {
    if (gerados !== true) {
      setGerados(true);
    } else {
      setImpressos(false);
      setFaturados(false);
      setGerados(false);
    }

    setCargas([]);
    setCargasSelecionadas([]);
    setPedidos([]);
    setPedidosSelecionados([]);
    setTotalValor('');
    setTotalPeso('');
    setTotalVolume('');
  }, [gerados]);

  const filtraFaturados = useCallback(() => {
    if (faturados !== true) {
      setFaturados(true);
      setGerados(true);
    } else {
      setFaturados(false);
    }

    setCargas([]);
    setCargasSelecionadas([]);
    setPedidos([]);
    setPedidosSelecionados([]);
    setTotalValor('');
    setTotalPeso('');
    setTotalVolume('');
  }, [faturados]);

  const filtraImpressos = useCallback(() => {
    if (impressos !== true) {
      setImpressos(true);
    } else {
      setImpressos(false);
    }

    setCargas([]);
    setCargasSelecionadas([]);
    setPedidos([]);
    setPedidosSelecionados([]);
    setTotalValor('');
    setTotalPeso('');
    setTotalVolume('');
  }, [impressos]);

  const validaBox = useCallback((): boolean => {
    let valida = true;

    cargaSelecionadas.map((carga) => {
      if (carga.numbox === null) {
        valida = false;
      }

      return valida;
    });

    return valida;
  }, [cargaSelecionadas]);

  const gerarOs = useCallback(
    async (box?: number) => {
      if (modeloSeparacao === 'C') {
        const cargasValidas = validaBox();

        if (cargasValidas) {
          setLoading(true);
          setLoadingGerar(true);

          const dataGerarCarga = cargaSelecionadas.map((item) => {
            const carga = {} as GerarOs;

            carga.numcar = item.numcar;
            carga.numped = 0;
            carga.numbox = item.numbox;
            carga.modelosep = 'C';
            carga.codfuncger = usuario.codigo;
            carga.homologacao = homologacao;

            return carga;
          });

          try {
            const responseCarga = await api.post(
              'Rotina9950/GerarOsWms/',
              dataGerarCarga,
            );

            if (responseCarga.data === 'Carga paletizada com sucesso!') {
              setGerados(true);
              setLoadingGerar(false);
              createMessage({
                type: 'success',
                message: responseCarga.data,
              });
              document.getElementById('pesquisar')?.click();
            } else {
              createMessage({
                type: 'error',
                message: responseCarga.data,
              });
              setLoadingGerar(false);
              setLoading(false);
            }
          } catch (err) {
            createMessage({
              type: 'error',
              message: `Error: ${err.message}`,
            });
            setLoadingGerar(false);
            setLoading(false);
          }
        } else {
          createMessage({
            type: 'alert',
            message: 'Favor informar o box em todas as cargas selecionadas.',
          });
        }
      } else {
        setLoading(true);
        setLoadingGerar(true);

        const dataGerarPedido = pedidosSelecionados.map((item) => {
          const pedido = {} as GerarOs;

          pedido.numcar = 0;
          pedido.numped = Number(item.pedidos);
          pedido.numbox = box as number;
          pedido.modelosep = 'P';
          pedido.codfuncger = usuario.codigo;
          pedido.homologacao = homologacao;

          return pedido;
        });

        try {
          const responsePedido = await api.post<string>(
            'Rotina9950/GerarOsWms/',
            dataGerarPedido,
          );

          if (responsePedido.data === 'O.S gerada com sucesso!') {
            setGerados(true);
            setLoadingGerar(false);
            createMessage({
              type: 'success',
              message: responsePedido.data,
            });
            document.getElementById('pesquisar')?.click();
          } else {
            createMessage({
              type: 'error',
              message: responsePedido.data,
            });
            setLoadingGerar(false);
            setLoading(false);

            document.getElementById('pesquisar')?.click();
          }
        } catch (err) {
          createMessage({
            type: 'error',
            message: `Error: ${err.message}`,
          });
          setLoadingGerar(false);
          setLoading(false);
        }
      }
    },
    [
      modeloSeparacao,
      cargaSelecionadas,
      pedidosSelecionados,
      usuario,
      validaBox,
      homologacao,
    ],
  );

  const estornarOs = useCallback(async () => {
    setLoading(true);
    setLoadingEstornar(true);

    if (modeloSeparacao === 'C') {
      const dataEstornoCarga = cargaSelecionadas.map((item) => {
        const carga = {} as EstornoOs;

        carga.numcar = item.numcar;
        carga.numtranswms = -1;
        carga.modelosep = 'C';
        carga.codfuncger = usuario.codigo;
        carga.homologacao = homologacao;

        return carga;
      });

      try {
        const responseCarga = await api.post<string>(
          'Rotina9950/EstornarWms/',
          dataEstornoCarga,
        );

        if (responseCarga.data === 'Estorno realizado com sucesso!') {
          setGerados(false);
          setImpressos(false);
          setLoadingEstornar(false);
          createMessage({
            type: 'success',
            message: responseCarga.data,
          });
          document.getElementById('pesquisar')?.click();
        } else {
          createMessage({
            type: 'error',
            message: responseCarga.data,
          });
          setLoadingEstornar(false);
          setLoading(false);
        }
      } catch (err) {
        createMessage({
          type: 'error',
          message: `Error: ${err.message}`,
        });
        setLoadingEstornar(false);
        setLoading(false);
      }
    } else {
      const dataEstornoPedido = pedidosSelecionados.map((item) => {
        const pedido = {} as EstornoOs;

        pedido.numcar = -1;
        pedido.numtranswms = item.numtranswms;
        pedido.modelosep = 'P';
        pedido.codfuncger = usuario.codigo;
        pedido.homologacao = homologacao;

        return pedido;
      });

      try {
        const responsePedido = await api.post(
          'Rotina9950/EstornarWms/',
          dataEstornoPedido,
        );

        if (responsePedido.data === 'Estorno realizado com sucesso!') {
          setGerados(false);
          setImpressos(false);
          setLoadingEstornar(false);
          createMessage({
            type: 'success',
            message: responsePedido.data,
          });
          formRef.current?.setFieldValue('numtranswms', null);
          document.getElementById('pesquisar')?.click();
        } else {
          createMessage({
            type: 'error',
            message: responsePedido.data,
          });
          setLoadingEstornar(false);
          setLoading(false);
        }
      } catch (err) {
        createMessage({
          type: 'error',
          message: `Error: ${err.message}`,
        });
        setLoadingEstornar(false);
        setLoading(false);
      }
    }
  }, [
    modeloSeparacao,
    cargaSelecionadas,
    pedidosSelecionados,
    usuario,
    homologacao,
  ]);

  const corteCarga = useCallback(async () => {
    setLoading(true);
    setLoadingCortar(true);

    try {
      const dataCorteCarga = {} as CorteCarga;

      if (modeloSeparacao === 'C') {
        dataCorteCarga.numcar = cargaSelecionadas[0].numcar;
        dataCorteCarga.numtranswms = -1;
        dataCorteCarga.codfuncger = usuario.codigo;
        dataCorteCarga.homologacao = homologacao;
        dataCorteCarga.modeloSep = modeloSeparacao;
      } else {
        dataCorteCarga.numcar = -1;
        dataCorteCarga.numtranswms = pedidosSelecionados[0].numtranswms;
        dataCorteCarga.codfuncger = usuario.codigo;
        dataCorteCarga.homologacao = homologacao;
        dataCorteCarga.modeloSep = modeloSeparacao;
      }

      const cortouCarga = await api.post('Rotina9950/Corte/', dataCorteCarga);

      if (
        cortouCarga.data === 'Corte por carga realizado com sucesso.' ||
        cortouCarga.data === 'Corte por transação realizado com sucesso.'
      ) {
        setLoadingCortar(false);
        createMessage({
          type: 'success',
          message: cortouCarga.data,
        });
        document.getElementById('pesquisar')?.click();
      } else {
        createMessage({
          type: 'error',
          message: cortouCarga.data,
        });
        setLoadingCortar(false);
        setLoading(false);
      }
    } catch (err) {
      createMessage({
        type: 'error',
        message: `Error: ${err.message}`,
      });
      setLoadingCortar(false);
      setLoading(false);
    }
  }, [
    cargaSelecionadas,
    usuario,
    pedidosSelecionados,
    modeloSeparacao,
    homologacao,
  ]);

  const liberarFaturamento = useCallback(async () => {
    setLoading(true);
    setLoadingLiberarFaturamento(true);

    try {
      const response = await api.get(
        `Rotina9950/FinalizaOsCarregamento/${cargaSelecionadas[0].numcar}`,
      );

      const finalizou = response.data;

      if (finalizou) {
        createMessage({
          type: 'success',
          message: `Carga liberada para faturamento.`,
        });
      } else {
        createMessage({
          type: 'alert',
          message: `Não foi possível finalizar as O.S. da carga neste momento. Por favor, tente mais tarde.`,
        });
      }
      document.getElementById('pesquisar')?.click();

      setLoadingLiberarFaturamento(false);
      setLoading(false);
    } catch (err) {
      createMessage({
        type: 'error',
        message: `Erro: ${err.message}`,
      });
      setLoadingLiberarFaturamento(false);
      setLoading(false);
    }
  }, [cargaSelecionadas]);

  const chamaGerar = useCallback(
    (retorno: boolean, box: number) => {
      if (retorno) {
        setDialogGerar(false);
        gerarOs(box);
      } else {
        setDialogGerar(false);
      }
    },
    [gerarOs],
  );

  const chamaImpressao = useCallback(
    async (retorno: boolean, parametrosImpressao: ImpressaoProps) => {
      if (retorno) {
        setDialogImprimir(false);
        setLoading(true);
        setLoadingImprimir(true);

        const dataPesquisa = formRef.current?.getData() as Pesquisa;
        let valoresSelecionados = '';

        if (modeloSeparacao === 'C') {
          valoresSelecionados = cargaSelecionadas
            .map((object) => object.numcar)
            .join(',');
        } else {
          valoresSelecionados = pedidosSelecionados
            .map((object) => object.numtranswms)
            .join(',');
        }

        const dataImpressao = {
          antecipado: 'N',
          modelo: modeloSeparacao,
          cargasTransacoes: valoresSelecionados,
          tipoos: 13,
          codfunc: usuario.codigo,
        } as ImprimirOs;

        if (parametrosImpressao.etiqueta13Antecipada) {
          dataImpressao.antecipado = 'S';
          dataImpressao.tipoos = 13;

          setMensagemImpressao(
            'Gerando volumes O.S. tipo 13 (E.T.) antecipado, aguarde...',
          );

          await api
            .post('Rotina9950/GerarVolumesWMS/', dataImpressao)
            .then((response) => {
              const gerouVolumes = response.data;

              if (gerouVolumes) {
                createMessage({
                  type: 'success',
                  message: 'Volumes do tipo 13 gerados com sucesso.',
                });
              } else {
                createMessage({
                  type: 'error',
                  message:
                    'Erro ao tentar gerar os volumes do tipo 13. Por favor, tente novamente mais tarde.',
                });
              }
            })
            .catch((err) => {
              createMessage({
                type: 'error',
                message: `Erro: ${err.message}`,
              });
            });

          setMensagemImpressao(
            'Imprimindo Etiqueta O.S. tipo 13 (E.T.) antecipado, aguarde...',
          );

          const dataInicialFormatada = formataData(
            `${dataPesquisa.dataInicial}T00:00:00`,
          );
          const dataFinalFormatada = formataData(
            `${dataPesquisa.dataFinal}T00:00:00`,
          );

          let params = {} as DTOImpressoes;

          if (modeloSeparacao === 'C') {
            if (dataPesquisa.numos) {
              params = {
                app: 'EPCWMS',
                tipousu: 'U',
                matricula: usuario.codigo,
                tamanho: 'G',
                nrorel: 9031,
                pAntecipado: dataImpressao.antecipado,
                pNumos: dataPesquisa.numos,
                pDtIni: dataInicialFormatada,
                pDtFim: dataFinalFormatada,
              };
            } else {
              params = {
                app: 'EPCWMS',
                tipousu: 'U',
                matricula: usuario.codigo,
                tamanho: 'G',
                nrorel: 9031,
                pAntecipado: dataImpressao.antecipado,
                pNumcar: dataImpressao.cargasTransacoes,
                pDtIni: dataInicialFormatada,
                pDtFim: dataFinalFormatada,
              };
            }
          } else if (modeloSeparacao !== 'C') {
            if (dataPesquisa.numos) {
              params = {
                app: 'EPCWMS',
                tipousu: 'U',
                matricula: usuario.codigo,
                tamanho: 'G',
                nrorel: 9031,
                pAntecipado: dataImpressao.antecipado,
                pNumos: dataPesquisa.numos,
                pDtIni: dataInicialFormatada,
                pDtFim: dataFinalFormatada,
              };
            } else {
              params = {
                app: 'EPCWMS',
                tipousu: 'U',
                matricula: usuario.codigo,
                tamanho: 'G',
                nrorel: 9031,
                pAntecipado: dataImpressao.antecipado,
                pNumtranswms: dataImpressao.cargasTransacoes,
                pDtIni: dataInicialFormatada,
                pDtFim: dataFinalFormatada,
              };
            }
          }

          await apiRelatorios
            .get('servdw/REL/relatorio', { params })
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
                  message:
                    'Nenhum registro encontrado para impressão de etiqueta tipo 13 antecipada.',
                });
              } else {
                createMessage({
                  type: 'error',
                  message: `Error: ${err.response.data}`,
                });
              }
            });
        }
        if (parametrosImpressao.mapaSeparacaoAntecipado) {
          dataImpressao.antecipado = 'S';

          setMensagemImpressao(
            'Imprimindo Mapa de Separação (E.T.) antecipado, aguarde...',
          );

          const dataInicialFormatada = formataData(
            `${dataPesquisa.dataInicial}T00:00:00`,
          );
          const dataFinalFormatada = formataData(
            `${dataPesquisa.dataFinal}T00:00:00`,
          );

          let params = {} as DTOImpressoes;

          if (modeloSeparacao === 'C') {
            if (dataPesquisa.numos) {
              params = {
                app: 'EPCWMS',
                tipousu: 'U',
                matricula: usuario.codigo,
                tamanho: 'G',
                nrorel: 9029,
                pAntecipado: dataImpressao.antecipado,
                pNumos: dataPesquisa.numos,
                pDtIni: dataInicialFormatada,
                pDtFim: dataFinalFormatada,
              };
            } else {
              params = {
                app: 'EPCWMS',
                tipousu: 'U',
                matricula: usuario.codigo,
                tamanho: 'G',
                nrorel: 9029,
                pAntecipado: dataImpressao.antecipado,
                pNumcar: dataImpressao.cargasTransacoes,
                pDtIni: dataInicialFormatada,
                pDtFim: dataFinalFormatada,
              };
            }
          } else if (modeloSeparacao !== 'C') {
            if (dataPesquisa.numos) {
              params = {
                app: 'EPCWMS',
                tipousu: 'U',
                matricula: usuario.codigo,
                tamanho: 'G',
                nrorel: 9029,
                pAntecipado: dataImpressao.antecipado,
                pNumos: dataPesquisa.numos,
                pDtIni: dataInicialFormatada,
                pDtFim: dataFinalFormatada,
              };
            } else {
              params = {
                app: 'EPCWMS',
                tipousu: 'U',
                matricula: usuario.codigo,
                tamanho: 'G',
                nrorel: 9029,
                pAntecipado: dataImpressao.antecipado,
                pNumtranswms: dataImpressao.cargasTransacoes,
                pDtIni: dataInicialFormatada,
                pDtFim: dataFinalFormatada,
              };
            }
          }

          await apiRelatorios
            .get('servdw/REL/relatorio', { params })
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
                  message:
                    'Nenhum registro encontrado para impressão do mapa de separação do E.T. antecipado.',
                });
              } else {
                createMessage({
                  type: 'error',
                  message: `Error: ${err.response.data}`,
                });
              }
            });
        }
        if (parametrosImpressao.etiqueta13) {
          dataImpressao.antecipado = 'N';
          dataImpressao.tipoos = 13;

          setMensagemImpressao(
            'Gerando volumes O.S. tipo 13 (E.T.), aguarde...',
          );

          await api
            .post('Rotina9950/GerarVolumesWMS/', dataImpressao)
            .then((response) => {
              const gerouVolumes = response.data;

              if (gerouVolumes) {
                createMessage({
                  type: 'success',
                  message: 'Volumes do tipo 13 gerados com sucesso.',
                });
              } else {
                createMessage({
                  type: 'error',
                  message:
                    'Erro ao tentar gerar os volumes do tipo 13. Por favor, tente novamente mais tarde.',
                });
              }
            })
            .catch((err) => {
              createMessage({
                type: 'error',
                message: `Erro: ${err.message}`,
              });
            });

          setMensagemImpressao(
            'Imprimindo Etiqueta O.S. tipo 13 (E.T.), aguarde...',
          );

          const dataInicialFormatada = formataData(
            `${dataPesquisa.dataInicial}T00:00:00`,
          );
          const dataFinalFormatada = formataData(
            `${dataPesquisa.dataFinal}T00:00:00`,
          );

          let params = {} as DTOImpressoes;

          if (modeloSeparacao === 'C') {
            if (dataPesquisa.numos) {
              params = {
                app: 'EPCWMS',
                tipousu: 'U',
                matricula: usuario.codigo,
                tamanho: 'G',
                nrorel: 9031,
                pAntecipado: dataImpressao.antecipado,
                pNumos: dataPesquisa.numos,
                pDtIni: dataInicialFormatada,
                pDtFim: dataFinalFormatada,
              };
            } else {
              params = {
                app: 'EPCWMS',
                tipousu: 'U',
                matricula: usuario.codigo,
                tamanho: 'G',
                nrorel: 9031,
                pAntecipado: dataImpressao.antecipado,
                pNumcar: dataImpressao.cargasTransacoes,
                pDtIni: dataInicialFormatada,
                pDtFim: dataFinalFormatada,
              };
            }
          } else if (modeloSeparacao !== 'C') {
            if (dataPesquisa.numos) {
              params = {
                app: 'EPCWMS',
                tipousu: 'U',
                matricula: usuario.codigo,
                tamanho: 'G',
                nrorel: 9031,
                pAntecipado: dataImpressao.antecipado,
                pNumos: dataPesquisa.numos,
                pDtIni: dataInicialFormatada,
                pDtFim: dataFinalFormatada,
              };
            } else {
              params = {
                app: 'EPCWMS',
                tipousu: 'U',
                matricula: usuario.codigo,
                tamanho: 'G',
                nrorel: 9031,
                pAntecipado: dataImpressao.antecipado,
                pNumtranswms: dataImpressao.cargasTransacoes,
                pDtIni: dataInicialFormatada,
                pDtFim: dataFinalFormatada,
              };
            }
          }

          await apiRelatorios
            .get('servdw/REL/relatorio', { params })
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
                  message:
                    'Nenhum registro encontrado para impressão de etiqueta tipo 13.',
                });
              } else {
                createMessage({
                  type: 'error',
                  message: `Error: ${err.response.data}`,
                });
              }
            });
        }
        if (parametrosImpressao.mapaSeparacao) {
          dataImpressao.antecipado = 'N';

          setMensagemImpressao(
            'Imprimindo Mapa de Separação (E.T.), aguarde...',
          );

          const dataInicialFormatada = formataData(
            `${dataPesquisa.dataInicial}T00:00:00`,
          );
          const dataFinalFormatada = formataData(
            `${dataPesquisa.dataFinal}T00:00:00`,
          );

          let params = {} as DTOImpressoes;

          if (modeloSeparacao === 'C') {
            if (dataPesquisa.numos) {
              params = {
                app: 'EPCWMS',
                tipousu: 'U',
                matricula: usuario.codigo,
                tamanho: 'G',
                nrorel: 9029,
                pAntecipado: dataImpressao.antecipado,
                pNumos: dataPesquisa.numos,
                pDtIni: dataInicialFormatada,
                pDtFim: dataFinalFormatada,
              };
            } else {
              params = {
                app: 'EPCWMS',
                tipousu: 'U',
                matricula: usuario.codigo,
                tamanho: 'G',
                nrorel: 9029,
                pAntecipado: dataImpressao.antecipado,
                pNumcar: dataImpressao.cargasTransacoes,
                pDtIni: dataInicialFormatada,
                pDtFim: dataFinalFormatada,
              };
            }
          } else if (modeloSeparacao !== 'C') {
            if (dataPesquisa.numos) {
              params = {
                app: 'EPCWMS',
                tipousu: 'U',
                matricula: usuario.codigo,
                tamanho: 'G',
                nrorel: 9029,
                pAntecipado: dataImpressao.antecipado,
                pNumos: dataPesquisa.numos,
                pDtIni: dataInicialFormatada,
                pDtFim: dataFinalFormatada,
              };
            } else {
              params = {
                app: 'EPCWMS',
                tipousu: 'U',
                matricula: usuario.codigo,
                tamanho: 'G',
                nrorel: 9029,
                pAntecipado: dataImpressao.antecipado,
                pNumtranswms: dataImpressao.cargasTransacoes,
                pDtIni: dataInicialFormatada,
                pDtFim: dataFinalFormatada,
              };
            }
          }

          await apiRelatorios
            .get('servdw/REL/relatorio', { params })
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
                  message:
                    'Nenhum registro encontrado para impressão do mapa de separação do E.T.',
                });
              } else {
                createMessage({
                  type: 'error',
                  message: `Error: ${err.response.data}`,
                });
              }
            });
        }
        if (parametrosImpressao.etiqueta20) {
          dataImpressao.antecipado = 'N';
          dataImpressao.tipoos = 20;

          setMensagemImpressao(
            'Gerando volumes O.S. tipo 20 (Caixaria), aguarde...',
          );

          await api
            .post('Rotina9950/GerarVolumesWMS/', dataImpressao)
            .then((response) => {
              const gerouVolumes = response.data;

              if (gerouVolumes) {
                createMessage({
                  type: 'success',
                  message: 'Volumes do tipo 20 gerados com sucesso.',
                });
              } else {
                createMessage({
                  type: 'error',
                  message:
                    'Erro ao tentar gerar os volumes do tipo 20. Por favor, tente novamente mais tarde.',
                });
              }
            })
            .catch((err) => {
              createMessage({
                type: 'error',
                message: `Erro: ${err.message}`,
              });
            });

          setMensagemImpressao(
            'Imprimindo Etiqueta O.S. tipo 20 (Caixaria), aguarde...',
          );

          const dataInicialFormatada = formataData(
            `${dataPesquisa.dataInicial}T00:00:00`,
          );
          const dataFinalFormatada = formataData(
            `${dataPesquisa.dataFinal}T00:00:00`,
          );

          let params = {} as DTOImpressoes20e17;

          if (modeloSeparacao === 'C') {
            if (dataPesquisa.numos) {
              params = {
                app: 'EPCWMS',
                tipousu: 'U',
                matricula: usuario.codigo,
                tamanho: 'G',
                nrorel: 9030,
                pTipoos: dataImpressao.tipoos,
                pNumos: dataPesquisa.numos,
                pDtIni: dataInicialFormatada,
                pDtFim: dataFinalFormatada,
              };
            } else {
              params = {
                app: 'EPCWMS',
                tipousu: 'U',
                matricula: usuario.codigo,
                tamanho: 'G',
                nrorel: 9030,
                pTipoos: dataImpressao.tipoos,
                pNumcar: dataImpressao.cargasTransacoes,
                pDtIni: dataInicialFormatada,
                pDtFim: dataFinalFormatada,
              };
            }
          } else if (modeloSeparacao !== 'C') {
            if (dataPesquisa.numos) {
              params = {
                app: 'EPCWMS',
                tipousu: 'U',
                matricula: usuario.codigo,
                tamanho: 'G',
                nrorel: 9030,
                pTipoos: dataImpressao.tipoos,
                pNumos: dataPesquisa.numos,
                pDtIni: dataInicialFormatada,
                pDtFim: dataFinalFormatada,
              };
            } else {
              params = {
                app: 'EPCWMS',
                tipousu: 'U',
                matricula: usuario.codigo,
                tamanho: 'G',
                nrorel: 9030,
                pTipoos: dataImpressao.tipoos,
                pNumtranswms: dataImpressao.cargasTransacoes,
                pDtIni: dataInicialFormatada,
                pDtFim: dataFinalFormatada,
              };
            }
          }

          await apiRelatorios
            .get('servdw/REL/relatorio', { params })
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
                  message:
                    'Nenhum registro encontrado para impressão de etiqueta tipo 20.',
                });
              } else {
                createMessage({
                  type: 'error',
                  message: `Error: ${err.response.data}`,
                });
              }
            });
        }
        if (parametrosImpressao.etiqueta17) {
          dataImpressao.antecipado = 'N';
          dataImpressao.tipoos = 17;

          setMensagemImpressao(
            'Gerando volumes O.S. tipo 17 (Pulmão Box), aguarde...',
          );

          await api
            .post('Rotina9950/GerarVolumesWMS/', dataImpressao)
            .then((response) => {
              const gerouVolumes = response.data;

              if (gerouVolumes) {
                createMessage({
                  type: 'success',
                  message: 'Volumes do tipo 17 gerados com sucesso.',
                });
              } else {
                createMessage({
                  type: 'error',
                  message:
                    'Erro ao tentar gerar os volumes do tipo 17. Por favor, tente novamente mais tarde.',
                });
              }
            })
            .catch((err) => {
              createMessage({
                type: 'error',
                message: `Erro: ${err.message}`,
              });
            });

          setMensagemImpressao(
            'Imprimindo Etiqueta O.S. tipo 17 (Pulmão Box), aguarde...',
          );

          const dataInicialFormatada = formataData(
            `${dataPesquisa.dataInicial}T00:00:00`,
          );
          const dataFinalFormatada = formataData(
            `${dataPesquisa.dataFinal}T00:00:00`,
          );

          let params = {} as DTOImpressoes20e17;

          if (modeloSeparacao === 'C') {
            if (dataPesquisa.numos) {
              params = {
                app: 'EPCWMS',
                tipousu: 'U',
                matricula: usuario.codigo,
                tamanho: 'G',
                nrorel: 9030,
                pTipoos: dataImpressao.tipoos,
                pNumcar: dataImpressao.cargasTransacoes,
                pNumos: dataPesquisa.numos,
                pDtIni: dataInicialFormatada,
                pDtFim: dataFinalFormatada,
              };
            } else {
              params = {
                app: 'EPCWMS',
                tipousu: 'U',
                matricula: usuario.codigo,
                tamanho: 'G',
                nrorel: 9030,
                pTipoos: dataImpressao.tipoos,
                pNumcar: dataImpressao.cargasTransacoes,
                pDtIni: dataInicialFormatada,
                pDtFim: dataFinalFormatada,
              };
            }
          } else if (modeloSeparacao !== 'C') {
            if (dataPesquisa.numos) {
              params = {
                app: 'EPCWMS',
                tipousu: 'U',
                matricula: usuario.codigo,
                tamanho: 'G',
                nrorel: 9030,
                pTipoos: dataImpressao.tipoos,
                pNumtranswms: dataImpressao.cargasTransacoes,
                pNumos: dataPesquisa.numos,
                pDtIni: dataInicialFormatada,
                pDtFim: dataFinalFormatada,
              };
            } else {
              params = {
                app: 'EPCWMS',
                tipousu: 'U',
                matricula: usuario.codigo,
                tamanho: 'G',
                nrorel: 9030,
                pTipoos: dataImpressao.tipoos,
                pNumtranswms: dataImpressao.cargasTransacoes,
                pDtIni: dataInicialFormatada,
                pDtFim: dataFinalFormatada,
              };
            }
          }

          await apiRelatorios
            .get('servdw/REL/relatorio', { params })
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
                  message:
                    'Nenhum registro encontrado para impressão de etiqueta tipo 17.',
                });
              } else {
                createMessage({
                  type: 'error',
                  message: `Error: ${err.response.data}`,
                });
              }
            });
        }

        setImpressos(true);
        setLoadingImprimir(false);
        setLoading(false);
        document.getElementById('pesquisar')?.click();
      } else {
        setDialogImprimir(false);
      }
    },
    [cargaSelecionadas, pedidosSelecionados, modeloSeparacao, usuario.codigo],
  );

  const chamaEstorno = useCallback(
    (retorno: boolean) => {
      if (retorno) {
        setDialogEstornar(false);
        estornarOs();
      } else {
        setDialogEstornar(false);
      }
    },
    [estornarOs],
  );

  const chamaCorte = useCallback(
    (retorno: boolean) => {
      if (retorno) {
        setDialogCortar(false);
        corteCarga();
      } else {
        setDialogCortar(false);
      }
    },
    [corteCarga],
  );

  const chamaLiberarFaturamento = useCallback(
    (retorno: boolean) => {
      if (retorno) {
        setDialogLiberarFaturamento(false);
        liberarFaturamento();
      } else {
        setDialogLiberarFaturamento(false);
      }
    },
    [liberarFaturamento],
  );

  const editarNumBoxCarga = useCallback((props, value) => {
    const dadosCargaOrig = [...props.value];
    dadosCargaOrig[props.rowIndex][props.field] = value;
  }, []);

  const listaBox = useCallback(
    (props) => {
      return (
        <>
          <input
            type="number"
            name="listaBox"
            list="listaBox"
            className="styleInputBox"
            onChange={(e) => editarNumBoxCarga(props, e.target.value)} //eslint-disable-line
          />
          <datalist id="listaBox">
            {listagemBox.map((lista) => (
              <option key={lista.codbox} value={lista.codbox}>
                {lista.descricao}
              </option>
            ))}
          </datalist>
        </>
      );
    },
    [listagemBox, editarNumBoxCarga],
  );

  const valorFormatadoPedido = useCallback((rowData: DataPedidos, column) => {
    switch (column.field) {
      case 'vlped':
        return rowData.vlpedformatado;
      case 'peso':
        return rowData.pesoformatado;
      case 'volume':
        return rowData.volumeformatado;
      default:
        return null;
    }
  }, []);

  const valorFormatadoCarga = useCallback((rowData: DataCargas, column) => {
    switch (column.field) {
      case 'vltotal':
        return rowData.vltotalformatado;
      case 'peso':
        return rowData.pesoformatado;
      case 'volume':
        return rowData.volumeformatado;
      default:
        return null;
    }
  }, []);

  const cabecalhoPed = (
    <ColumnGroup>
      <Row>
        <Column selectionMode="multiple" style={{ width: '3.8em' }} />
        <Column
          field="numtranswms"
          header="Transação"
          style={{ width: '68px' }}
          bodyStyle={{ textAlign: 'right' }}
        />
        <Column
          field="pedidos"
          header="Pedidos"
          style={{ width: '80px' }}
          bodyStyle={{ textAlign: 'right' }}
        />
        <Column field="cliente" header="Cliente" style={{ width: '150px' }} />
        <Column field="rota" header="Rota" style={{ width: '130px' }} />
        <Column field="praca" header="Praça" style={{ width: '110px' }} />
        <Column
          field="vlped"
          header="Vl.Ped"
          style={{ width: '75px' }}
          body={valorFormatadoPedido}
          bodyStyle={{ textAlign: 'right' }}
          sortable
        />
        <Column
          field="peso"
          header="Peso"
          style={{ width: '58px' }}
          bodyStyle={{ textAlign: 'right' }}
          body={valorFormatadoPedido}
          sortable
        />
        <Column
          field="volume"
          header="Vol."
          style={{ width: '55px' }}
          bodyStyle={{ textAlign: 'right' }}
          body={valorFormatadoPedido}
          sortable
        />
        <Column
          field="oS13"
          header="O.S. 13"
          style={{ width: '45px' }}
          body={styleOsVolume}
        />
        <Column
          field="voL13"
          header="Vol 13"
          style={{ width: '45px' }}
          body={styleOsVolume}
        />
        <Column
          field="oS20"
          header="O.S. 20"
          style={{ width: '45px' }}
          body={styleOsVolume}
        />
        <Column
          field="voL20"
          header="Vol 20"
          style={{ width: '45px' }}
          body={styleOsVolume}
        />
        <Column
          field="oS17"
          header="O.S. 17"
          style={{ width: '45px' }}
          body={styleOsVolume}
        />
        <Column
          field="voL17"
          header="Vol 17"
          style={{ width: '45px' }}
          body={styleOsVolume}
        />
        <Column
          field="separacao"
          header="Separação %"
          style={{ width: '82px' }}
          body={percentualPedido}
        />
        <Column
          field="conferencia"
          header="Conferência %"
          style={{ width: '91px' }}
          body={percentualPedido}
        />
        <Column
          field="divergencia"
          header="Divergência %"
          style={{ width: '90px' }}
          body={percentualPedido}
        />
        <Column field="obswms" header="Obs. Wms" style={{ width: '152px' }} />
      </Row>
    </ColumnGroup>
  );

  const footerPed = (
    <ColumnGroup>
      <Row>
        <Column
          footer="Totais:"
          colSpan={6}
          footerStyle={{ textAlign: 'right' }}
        />
        <Column footer={totalValor} />
        <Column footer={totalPeso} />
        <Column footer={totalVolume} />
      </Row>
    </ColumnGroup>
  );

  const cabecalhoCarga = (
    <ColumnGroup>
      <Row>
        <Column selectionMode="multiple" style={{ width: '3.5em' }} />
        <Column
          field="numcar"
          header="Carga"
          style={{ width: '68px' }}
          bodyStyle={{ textAlign: 'right' }}
        />
        <Column field="destino" header="Destino" style={{ width: '150px' }} />
        {gerados ? (
          <Column
            field="numbox"
            header="Núm. Box"
            style={{ width: '80px' }}
            bodyStyle={{ textAlign: 'right' }}
          />
        ) : (
          <Column
            field="numbox"
            header="Núm. Box"
            editor={(props) => listaBox(props)}
            style={{ width: '80px' }}
            bodyStyle={{ textAlign: 'right' }}
          />
        )}
        <Column
          field="vltotal"
          header="Vl. Total"
          style={{ width: '75px' }}
          body={valorFormatadoCarga}
          bodyStyle={{ textAlign: 'right' }}
          sortable
        />
        <Column
          field="peso"
          header="Peso"
          style={{ width: '58px' }}
          bodyStyle={{ textAlign: 'right' }}
          body={valorFormatadoCarga}
          sortable
        />
        <Column
          field="volume"
          header="Vol."
          style={{ width: '47px' }}
          bodyStyle={{ textAlign: 'right' }}
          body={valorFormatadoCarga}
          sortable
        />
        <Column
          field="oS13"
          header="O.S. 13"
          style={{ width: '50px' }}
          body={styleOsVolume}
        />
        <Column
          field="voL13"
          header="Vol 13"
          style={{ width: '50px' }}
          body={styleOsVolume}
        />
        <Column
          field="oS20"
          header="O.S. 20"
          style={{ width: '50px' }}
          body={styleOsVolume}
        />
        <Column
          field="voL20"
          header="Vol 20"
          style={{ width: '60px' }}
          body={styleOsVolume}
        />
        <Column
          field="oS17"
          header="O.S. 17"
          style={{ width: '45px' }}
          body={styleOsVolume}
        />
        <Column
          field="voL17"
          header="Vol 17"
          style={{ width: '45px' }}
          body={styleOsVolume}
        />
        <Column
          field="separacao"
          header="Separação %"
          style={{ width: '90px' }}
          body={percentualPedido}
        />
        <Column
          field="conferencia"
          header="Conferência %"
          style={{ width: '95px' }}
          body={percentualPedido}
        />
        <Column
          field="divergencia"
          header="Divergência %"
          style={{ width: '90px' }}
          body={percentualPedido}
        />
        <Column field="obswms" header="Obs. Wms" style={{ width: '150px' }} />
      </Row>
    </ColumnGroup>
  );

  const footerCarga = (
    <ColumnGroup>
      <Row>
        <Column
          footer="Totais:"
          colSpan={4}
          footerStyle={{ textAlign: 'right' }}
        />
        <Column footer={totalValor} />
        <Column footer={totalPeso} />
        <Column footer={totalVolume} />
      </Row>
    </ColumnGroup>
  );

  return (
    <>
      <NavBar paginaAtual="9950 - WMS GRUPO" caminho="/" />
      <Container>
        <Content>
          <Form ref={formRef} onSubmit={pesquisarDados}>
            <Select
              id="filial"
              name="filial"
              description="FILIAL"
              percWidth={4}
              onChange={(e) => setFilialSelecionada(Number(e.target.value))}
            >
              <option value={filialSelecionada}>{filialSelecionada}</option>
              {filiais
                .filter(
                  (fil) => Number(fil.codigo) !== Number(filialSelecionada),
                )
                .map((filial) => (
                  <option key={filial.codigo} value={filial.codigo}>
                    {filial.codigo}
                  </option>
                ))}
            </Select>
            <CheckBox>
              <label htmlFor="gerados">
                <input
                  id="gerados"
                  name="gerados"
                  type="checkbox"
                  checked={gerados}
                  onChange={filtraGerados}
                />
                Gerados
              </label>
              <label htmlFor="impressos">
                <input
                  id="impressos"
                  name="impressos"
                  type="checkbox"
                  checked={impressos}
                  onChange={filtraImpressos}
                  disabled={!gerados}
                />
                Impressos
              </label>
              <label htmlFor="faturados">
                <input
                  id="faturados"
                  name="faturados"
                  type="checkbox"
                  checked={faturados}
                  onChange={filtraFaturados}
                />
                Faturados
              </label>
            </CheckBox>
            <CheckRadio>
              <h1>Modelo de Separação</h1>
              <label htmlFor="antecipado">
                <input
                  id="antecipado"
                  name="antecipado"
                  type="radio"
                  value="A"
                  onChange={(e) => {
                    setModeloSeparacao(e.target.value);
                    setCargas([]);
                    setPedidos([]);
                    setTotalValor('');
                    setTotalPeso('');
                    setTotalVolume('');
                  }}
                  checked={modeloSeparacao === 'A'}
                />
                Antecipado
              </label>
              <label htmlFor="pedido">
                <input
                  id="pedido"
                  name="pedido"
                  type="radio"
                  value="P"
                  onChange={(e) => {
                    setModeloSeparacao(e.target.value);
                    setCargas([]);
                    setPedidos([]);
                    setTotalValor('');
                    setTotalPeso('');
                    setTotalVolume('');
                  }}
                  checked={modeloSeparacao === 'P'}
                />
                Pedido
              </label>
              <label htmlFor="carga">
                <input
                  id="carga"
                  name="carga"
                  type="radio"
                  value="C"
                  onChange={(e) => {
                    setModeloSeparacao(e.target.value);
                    setCargas([]);
                    setPedidos([]);
                    setTotalValor('');
                    setTotalPeso('');
                    setTotalVolume('');
                  }}
                  checked={modeloSeparacao === 'C'}
                />
                Carga
              </label>
            </CheckRadio>
            <Input
              percWidth={12}
              name="dataInicial"
              description="Data Inicial"
              type="date"
              defaultValue={dataInicioFim.inicio}
            />
            <Input
              percWidth={12}
              name="dataFinal"
              description="Data Final"
              defaultValue={dataInicioFim.fim}
              type="date"
            />
            <MultiSelect
              className="multiSelect"
              value={rotasSelecionadas}
              options={rotas}
              onChange={(e) => atribuiRotaSelecionada(e)}
              filter
              selectedItemsLabel={`${rotasSelecionadas.length} rotas selecionadas`}
              placeholder="Selecione a(s) rota(s)"
              name="rotas"
            />
            {modeloSeparacao === 'C' ? (
              <Input
                percWidth={9}
                name="carga"
                type="number"
                description="Carga"
              />
            ) : (
              <Input
                percWidth={9}
                name="numtranswms"
                type="number"
                description="Transação"
              />
            )}
            {modeloSeparacao !== 'C' ? (
              <Input
                percWidth={8}
                name="numped"
                type="number"
                description="Num. Pedido"
              />
            ) : (
              <> </>
            )}

            <Input
              percWidth={7}
              name="numos"
              type="number"
              description="Num. O.S."
            />
            <Input
              percWidth={6}
              name="tipoos"
              type="number"
              description="Tipo O.S."
            />
            <Divisor />
            <Button>
              <button
                id="pesquisar"
                type="submit"
                disabled={
                  loadingGerar ||
                  loadingImprimir ||
                  loadingLiberarFaturamento ||
                  loadingEstornar ||
                  loadingCortar
                }
              >
                <FaSearch />
                Pesquisar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (modeloSeparacao !== 'C') {
                    setDialogGerar(true);
                  } else {
                    gerarOs();
                  }
                }}
                disabled={
                  !(
                    (modeloSeparacao !== 'C' &&
                      pedidosSelecionados.length >= 1) ||
                    (modeloSeparacao === 'C' && cargaSelecionadas.length >= 1)
                  ) ||
                  gerados ||
                  loading
                }
              >
                <FaPlay />
                Gerar O.S.
              </button>
              <button
                type="button"
                onClick={() => setDialogImprimir(true)}
                disabled={
                  !(
                    (modeloSeparacao !== 'C' &&
                      pedidosSelecionados.length >= 1) ||
                    (modeloSeparacao === 'C' && cargaSelecionadas.length >= 1)
                  ) ||
                  !gerados ||
                  loading
                }
              >
                <FiPrinter />
                Imprimir O.S.
              </button>
              <button
                type="button"
                onClick={() => setDialogEstornar(true)}
                disabled={
                  !(
                    (modeloSeparacao !== 'C' &&
                      pedidosSelecionados.length >= 1) ||
                    (modeloSeparacao === 'C' && cargaSelecionadas.length === 1)
                  ) ||
                  !gerados ||
                  loading
                }
              >
                <FaTrashAlt />
                Estornar O.S.
              </button>
              {(modeloSeparacao === 'C' &&
                cargaSelecionadas[0]?.separacao === 100 &&
                cargaSelecionadas[0]?.conferencia !== 100 &&
                cargaSelecionadas.length === 1 &&
                gerados &&
                !faturados &&
                !loading) ||
              (modeloSeparacao !== 'C' &&
                pedidosSelecionados.length === 1 &&
                gerados &&
                !faturados &&
                !loading) ? (
                <button type="button" onClick={() => setDialogCortar(true)}> {/*eslint-disable-line*/}
                  <FiScissors />
                  Corte
                </button>
              ) : (
                <button type="button" disabled>
                  <FiScissors />
                  Corte
                </button>
              )}
              <button
                type="button"
                onClick={() => setDialogLiberarFaturamento(true)}
                disabled={
                  !(
                    modeloSeparacao === 'C' &&
                    cargaSelecionadas.length === 1 &&
                    gerados &&
                    impressos &&
                    !faturados
                  ) || loading
                }
              >
                <FiThumbsUp />
                Liberar p/ Faturar
              </button>
            </Button>
          </Form>
          {dialogGerar ? (
            <Dialog
              title="Gerar Pedidos"
              message="Selecione um box:"
              modeloDialog="G"
              tipoSeparacao={modeloSeparacao as 'A' | 'P' | 'C'}
              executar={chamaGerar}
            />
          ) : (
            <> </>
          )}
          {dialogImprimir ? (
            <Dialog
              title="Selecione as opções que deseja imprimir:"
              modeloDialog="I"
              tipoSeparacao={modeloSeparacao as 'A' | 'P' | 'C'}
              executar={chamaImpressao}
            />
          ) : (
            <> </>
          )}
          {dialogEstornar ? (
            <Dialog
              title={
                modeloSeparacao === 'C'
                  ? 'Deseja realmente estornar o carregamento?'
                  : 'Deseja realmente estornar a(s) transação(ões)?'
              }
              message={
                modeloSeparacao === 'C'
                  ? `Você está prestes a estornar a carga: ${cargaSelecionadas[0].numcar}, deseja continuar?`
                  : 'Você está prestes a estornar os registros selecionados, deseja continuar?'
              }
              numcar={modeloSeparacao === 'C' ? cargaSelecionadas[0].numcar : 0}
              numtranswms={
                modeloSeparacao !== 'C'
                  ? pedidosSelecionados
                      .map((object) => object.numtranswms)
                      .join(',')
                  : ''
              }
              modeloDialog="E"
              tipoSeparacao={modeloSeparacao as 'A' | 'P' | 'C'}
              executar={chamaEstorno}
            />
          ) : (
            <> </>
          )}
          {dialogCortar ? (
            <Dialog
              title={
                modeloSeparacao === 'C'
                  ? 'Deseja realmente realizar o corte no carregamento?'
                  : 'Deseja realmente realizar o corte na transação?'
              }
              message={
                modeloSeparacao === 'C'
                  ? `Você está prestes a realizar os cortes na carga: ${cargaSelecionadas[0].numcar}, deseja continuar?`
                  : `Você está prestes a realizar os cortes na transação: ${pedidosSelecionados[0].numtranswms}, deseja continuar?`
              }
              modeloDialog="C"
              numcar={
                modeloSeparacao === 'C'
                  ? cargaSelecionadas[0].numcar
                  : undefined
              }
              numtranswms={
                modeloSeparacao !== 'C'
                  ? String(pedidosSelecionados[0].numtranswms)
                  : undefined
              }
              tipoSeparacao={modeloSeparacao as 'A' | 'P' | 'C'}
              executar={chamaCorte}
            />
          ) : (
            <> </>
          )}
          {dialogLiberarFaturamento ? (
            <DialogGenerico
              title={`Liberar carga: ${cargaSelecionadas[0].numcar}`}
              message={`Você está prestes a liberar o carregamento: ${cargaSelecionadas[0].numcar} para o faturamento. Isso implica em finalizar as O.S. sem que estejam conferidas, deseja continuar?`}
              executar={chamaLiberarFaturamento}
            />
          ) : (
            <> </>
          )}
          {!loading ? (
            <>
              {modeloSeparacao === 'C' ? (
                <DataTable
                  value={cargas}
                  scrollable
                  scrollHeight="64vh"
                  paginator
                  rows={20}
                  resizableColumns
                  editMode="cell"
                  columnResizeMode="expand"
                  style={{ width: '99%' }}
                  selection={cargaSelecionadas}
                  onSelectionChange={(e) => selecionaCargas(e)}
                  headerColumnGroup={cabecalhoCarga}
                  footerColumnGroup={footerCarga}
                >
                  <Column selectionMode="multiple" style={{ width: '3.5em' }} />
                  <Column
                    field="numcar"
                    header="Carga"
                    style={{ width: '68px' }}
                    bodyStyle={{ textAlign: 'right' }}
                  />
                  <Column
                    field="destino"
                    header="Destino"
                    style={{ width: '150px' }}
                  />
                  {gerados ? (
                    <Column
                      field="numbox"
                      header="Núm. Box"
                      style={{ width: '80px' }}
                      bodyStyle={{ textAlign: 'right' }}
                    />
                  ) : (
                    <Column
                      field="numbox"
                      header="Núm. Box"
                      editor={(props) => listaBox(props)}
                      style={{ width: '80px' }}
                      bodyStyle={{ textAlign: 'right' }}
                    />
                  )}
                  <Column
                    field="vltotal"
                    header="Vl. Total"
                    style={{ width: '75px' }}
                    body={valorFormatadoCarga}
                    bodyStyle={{ textAlign: 'right' }}
                    sortable
                  />
                  <Column
                    field="peso"
                    header="Peso"
                    style={{ width: '58px' }}
                    bodyStyle={{ textAlign: 'right' }}
                    body={valorFormatadoCarga}
                    sortable
                  />
                  <Column
                    field="volume"
                    header="Vol."
                    style={{ width: '47px' }}
                    bodyStyle={{ textAlign: 'right' }}
                    body={valorFormatadoCarga}
                    sortable
                  />
                  <Column
                    field="oS13"
                    header="O.S. 13"
                    style={{ width: '50px' }}
                    body={styleOsVolume}
                  />
                  <Column
                    field="voL13"
                    header="Vol 13"
                    style={{ width: '50px' }}
                    body={styleOsVolume}
                  />
                  <Column
                    field="oS20"
                    header="O.S. 20"
                    style={{ width: '50px' }}
                    body={styleOsVolume}
                  />
                  <Column
                    field="voL20"
                    header="Vol 20"
                    style={{ width: '60px' }}
                    body={styleOsVolume}
                  />
                  <Column
                    field="oS17"
                    header="O.S. 17"
                    style={{ width: '45px' }}
                    body={styleOsVolume}
                  />
                  <Column
                    field="voL17"
                    header="Vol 17"
                    style={{ width: '45px' }}
                    body={styleOsVolume}
                  />
                  <Column
                    field="separacao"
                    header="Separação %"
                    style={{ width: '90px' }}
                    body={percentualPedido}
                  />
                  <Column
                    field="conferencia"
                    header="Conferência %"
                    style={{ width: '95px' }}
                    body={percentualPedido}
                  />
                  <Column
                    field="divergencia"
                    header="Divergência %"
                    style={{ width: '90px' }}
                    body={percentualPedido}
                  />
                  <Column
                    field="obswms"
                    header="Obs. Wms"
                    style={{ width: '150px' }}
                  />
                </DataTable>
              ) : (
                <>
                  <DataTable
                    value={pedidos}
                    scrollable
                    scrollHeight="64vh"
                    paginator
                    rows={20}
                    resizableColumns
                    columnResizeMode="expand"
                    style={{ width: '99%' }}
                    selection={pedidosSelecionados}
                    onSelectionChange={(e) => selecionaPedidos(e)}
                    headerColumnGroup={cabecalhoPed}
                    footerColumnGroup={footerPed}
                  >
                    <Column
                      selectionMode="multiple"
                      style={{ width: '3.8em' }}
                    />
                    <Column
                      field="numtranswms"
                      header="Transação"
                      style={{ width: '68px' }}
                      bodyStyle={{ textAlign: 'right' }}
                    />
                    <Column
                      field="pedidos"
                      header="Pedidos"
                      style={{ width: '80px' }}
                      bodyStyle={{ textAlign: 'right' }}
                    />
                    <Column
                      field="cliente"
                      header="Cliente"
                      style={{ width: '150px' }}
                    />
                    <Column
                      field="rota"
                      header="Rota"
                      style={{ width: '130px' }}
                    />
                    <Column
                      field="praca"
                      header="Praça"
                      style={{ width: '110px' }}
                    />
                    <Column
                      field="vlped"
                      header="Vl.Ped"
                      style={{ width: '75px' }}
                      body={valorFormatadoPedido}
                      bodyStyle={{ textAlign: 'right' }}
                      sortable
                    />
                    <Column
                      field="peso"
                      header="Peso"
                      style={{ width: '58px' }}
                      bodyStyle={{ textAlign: 'right' }}
                      body={valorFormatadoPedido}
                      sortable
                    />
                    <Column
                      field="volume"
                      header="Vol."
                      style={{ width: '55px' }}
                      bodyStyle={{ textAlign: 'right' }}
                      body={valorFormatadoPedido}
                      sortable
                    />
                    <Column
                      field="oS13"
                      header="O.S. 13"
                      style={{ width: '45px' }}
                      body={styleOsVolume}
                    />
                    <Column
                      field="voL13"
                      header="Vol 13"
                      style={{ width: '45px' }}
                      body={styleOsVolume}
                    />
                    <Column
                      field="oS20"
                      header="O.S. 20"
                      style={{ width: '45px' }}
                      body={styleOsVolume}
                    />
                    <Column
                      field="voL20"
                      header="Vol 20"
                      style={{ width: '45px' }}
                      body={styleOsVolume}
                    />
                    <Column
                      field="oS17"
                      header="O.S. 17"
                      style={{ width: '45px' }}
                      body={styleOsVolume}
                    />
                    <Column
                      field="voL17"
                      header="Vol 17"
                      style={{ width: '45px' }}
                      body={styleOsVolume}
                    />
                    <Column
                      field="separacao"
                      header="Separação %"
                      style={{ width: '82px' }}
                      body={percentualPedido}
                    />
                    <Column
                      field="conferencia"
                      header="Conferência %"
                      style={{ width: '91px' }}
                      body={percentualPedido}
                    />
                    <Column
                      field="divergencia"
                      header="Divergência %"
                      style={{ width: '90px' }}
                      body={percentualPedido}
                    />
                    <Column
                      field="obswms"
                      header="Obs. Wms"
                      style={{ width: '152px' }}
                    />
                  </DataTable>
                </>
              )}
            </>
          ) : (
            <Loading>
              <ReactLoading
                className="loading"
                type="spokes"
                width="120px"
                color="#c22e2c"
              />
              {loadingPesquisa ? (
                <h1>Carregando registros...</h1>
              ) : (
                <>
                  {loadingGerar ? (
                    <h1>Gerando O.S, aguarde...</h1>
                  ) : (
                    <>
                      {loadingImprimir ? (
                        <h1>{messagemImpressao}</h1>
                      ) : (
                        <>
                          {loadingEstornar ? (
                            <h1>Estornando registros, aguarde...</h1>
                          ) : (
                            <>
                              {loadingCortar ? (
                                <h1>
                                  {modeloSeparacao === 'C'
                                    ? `Realizando corte na carga: ${cargaSelecionadas[0].numcar}, aguarde...`
                                    : `Realizando corte na transação: ${pedidosSelecionados[0].numtranswms}, aguarde...`}
                                </h1>
                              ) : (
                                <>
                                  {loadingLiberarFaturamento ? (
                                    <h1>
                                      Finalizando O.S. da carga: $
                                      {cargaSelecionadas[0].numcar}, aguarde...
                                    </h1>
                                  ) : (
                                    <> </>
                                  )}
                                </>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </Loading>
          )}
        </Content>
      </Container>
    </>
  );
};

export default Rotina9950;
