import React, {
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
  useCallback,
} from 'react';
import {
  FiCheckSquare,
  FiTrash2,
  FiRefreshCw,
  FiPlusCircle,
  FiXOctagon,
  FiList,
  FiSearch,
} from 'react-icons/fi';
import { FcRightUp2, FcLeftDown2 } from 'react-icons/fc';
import * as Yup from 'yup';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import ReactLoading from 'react-loading';
import getValidationErrors from '../../../utils/getValidationErros';
import { useAuth } from '../../../hooks/auth';

import api from '../../../services/api';
import apiRelatorios from '../../../services/relatorios';

import DialogConfirmacao from '../../../components/Dialog-Generico';
import NavBar from '../../../components/NavBar';
import Input from '../../../components/Input';
import Select from '../../../components/Select';
import DialogInformacoes from './components/Dialog-Transferencia';
import { createMessage } from '../../../components/Toast';
import formataRelatorio from '../../../utils/formataRelatorioPdf';

import {
  Container,
  Content,
  FieldsetTable,
  Button,
  ButtonPesquisa,
  Loanding,
} from './styles';

interface Filiais {
  codigo: number;
}

interface DTOPesquisa {
  filial: number;
  codprod: number;
}

interface DataProdutoTransf {
  codProd: number;
  descricao: string;
  qtunitcx: number;
  lastro: number;
  camada: number;
  norma: number;
  enderecosProduto: [
    {
      tipoEndereco: string;
      codEndereco: number;
      deposito: number;
      rua: number;
      predio: number;
      nivel: number;
      apto: number;
      qt: number;
      pendencia: string;
      dataValidade: string;
      codigoUma: number;
      capacidade: number;
      pontoRep: number;
    },
  ];
  enderecosDisponiveis: [
    {
      descricaoTipoEndereco: string;
      situacao: string;
      deposito: number;
      rua: number;
      predio: number;
      nivel: number;
      apto: number;
      tipoEndereco: string;
      codEndereco: number;
      descricaoEstrutura: string;
      qtEstDisp: number;
    },
  ];
}

interface EnderecoOrigem {
  tipoEndereco: string;
  codEndereco: number;
  deposito: number;
  rua: number;
  predio: number;
  nivel: number;
  apto: number;
  qt: number;
  qtBloqueada: number;
  pendencia: string;
  dataValidade: string;
  codigoUma: number;
  capacidade: number;
  pontoRep: number;
}

interface EnderecoDestino {
  descricaoTipoEndereco: string;
  situacao: string;
  deposito: number;
  rua: number;
  predio: number;
  nivel: number;
  apto: number;
  tipoEndereco: string;
  codEndereco: number;
  descricaoEstrutura: string;
  qtEstDisp: number;
}

interface DTOFiltro {
  depositoOrigem: string;
  ruaOrigem: string;
  predioOrigem: string;
  nivelOrigem: string;
  aptoOrigem: string;
}

interface ProdutoLista {
  codprod: number;
  descricao: string;
  origem: {
    codEndereco: number;
    deposito: number;
    rua: number;
    predio: number;
    nivel: number;
    apto: number;
  };
  destino: {
    codEndereco: number;
    deposito: number;
    rua: number;
    predio: number;
    nivel: number;
    apto: number;
  };
  qt: number;
  validade: string;
}

interface DTOTransferencia {
  codprod: number;
  codfilial: number;
  codEnderecoOrig: number;
  codEnderecoDest: number;
  qttransf: number;
  codfunc: number;
}

interface RetornoTransf {
  retornoTransferencia: string;
  numTransWms: number;
}

interface DTOImpressoes {
  app: 'EPCWMS';
  tipousu: 'U';
  matricula: number;
  tamanho: 'G';
  nrorel: 9063 | 9064;
  pCodfilial: number;
  pNumtranswms: number;
}

const Rotina9909: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { usuario } = useAuth();
  const [dialogConfirmacao, setDialogConfirmacao] = useState(false);
  const [tituloConfirmacao, setTituloConfirmacao] = useState('');
  const [mensagemConfirmacao, setMensagemConfirmacao] = useState('');
  const [executarConfirmacao, setExecutarConfirmacao] = useState<'I' | 'T'>(
    'I',
  ); // I -> item, T -> Todos
  const [dialog, setDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mensagemLoading, setMensagemLoading] = useState('');
  const [tab1Selecionada, setTab1Selecionada] = useState(false);
  const [tab2Selecionada, setTab2Selecionada] = useState(false);
  const [enderecoOrig, setEnderecoOrig] = useState({} as EnderecoOrigem);
  const [enderecoDestino, setEnderecoDestino] = useState({} as EnderecoDestino);
  const [filiais, setFiliais] = useState<Filiais[]>([]);
  const [filialSelecionada, setFilialSelecionada] = useState(
    Number(usuario.filial),
  );
  const [produto, setProduto] = useState({} as DataProdutoTransf);
  const [listaProduto, setListaProduto] = useState<ProdutoLista[]>([]);
  const [produtoListaSelecionado, setProdutoListaSelecionado] = useState<
    ProdutoLista
  >({} as ProdutoLista);

  useEffect(() => {
    setTab1Selecionada(true);
    setFilialSelecionada(usuario.filial);
    setMensagemLoading('Carregando filiais, aguarde...');
    setLoading(true);

    api
      .get<Filiais[]>(`Rotina9901/BuscaFiliais/${usuario.codigo}`)
      .then((response) => {
        const filiaisEncontradas = response.data;

        if (filiaisEncontradas.length > 0) {
          setFiliais(filiaisEncontradas);
          setLoading(false);
          document.getElementById('codprod')?.focus();
        } else {
          createMessage({
            type: 'alert',
            message: 'Usuário não possui acesso a nenhuma filial.',
          });
          setLoading(false);
        }
      })
      .catch((err) => {
        createMessage({
          type: 'error',
          message: `Error: ${err.message}`,
        });
        setLoading(false);
      });
  }, [usuario]);

  function limparTela(): void {
    setProduto({} as DataProdutoTransf);
    setListaProduto([]);
  }

  const rowClassOrig = useCallback(
    (data: EnderecoOrigem | EnderecoDestino): object => {
      const filtro = listaProduto.filter(
        (end) => end.origem.codEndereco === data.codEndereco,
      );

      if (filtro.length > 0) {
        return {
          styleEndSelecionado: true,
        };
      }

      return {
        styleEndSelecionado: false,
      };
    },
    [listaProduto],
  );

  const rowClassDestino = useCallback(
    (data: EnderecoOrigem | EnderecoDestino): object => {
      const filtro = listaProduto.filter(
        (end) => end.destino.codEndereco === data.codEndereco,
      );

      if (filtro.length > 0) {
        return {
          styleEndSelecionado: true,
        };
      }

      return {
        styleEndSelecionado: false,
      };
    },
    [listaProduto],
  );

  const cabecalhoLista = (
    <ColumnGroup>
      <Row>
        <Column header="Dados Transferência" colSpan={4} />
        <Column header="Endereço Origem" colSpan={5} />
        <Column header="Endereço Destino" colSpan={6} />
      </Row>
      <Row>
        <Column
          field="codprod"
          header="Código"
          style={{ width: '70px' }}
          bodyStyle={{ textAlign: 'right' }}
        />
        <Column
          field="descricao"
          header="Descrição"
          style={{ width: '300px' }}
        />
        <Column
          field="qt"
          header="Quant."
          style={{ width: '70px' }}
          bodyStyle={{ textAlign: 'right' }}
        />
        <Column
          field="validade"
          header="Validade"
          style={{ width: '90px' }}
          bodyStyle={{ textAlign: 'center' }}
        />
        <Column
          field="origem.deposito"
          header="Dep"
          style={{ width: '65px' }}
          bodyStyle={{ textAlign: 'right' }}
        />
        <Column
          field="origem.rua"
          header="Rua"
          style={{ width: '65px' }}
          bodyStyle={{ textAlign: 'right' }}
        />
        <Column
          field="origem.predio"
          header="Préd"
          style={{ width: '65px' }}
          bodyStyle={{ textAlign: 'right' }}
        />
        <Column
          field="origem.nivel"
          header="Nív"
          style={{ width: '65px' }}
          bodyStyle={{ textAlign: 'right' }}
        />
        <Column
          field="origem.apto"
          header="Apto"
          style={{ width: '65px' }}
          bodyStyle={{ textAlign: 'right' }}
        />
        <Column
          field="destino.codEndereco"
          header="Cód"
          style={{ width: '65px' }}
          bodyStyle={{ textAlign: 'right' }}
        />
        <Column
          field="destino.deposito"
          header="Dep"
          style={{ width: '65px' }}
          bodyStyle={{ textAlign: 'right' }}
        />
        <Column
          field="destino.rua"
          header="Rua"
          style={{ width: '65px' }}
          bodyStyle={{ textAlign: 'right' }}
        />
        <Column
          field="destino.predio"
          header="Préd"
          style={{ width: '65px' }}
          bodyStyle={{ textAlign: 'right' }}
        />
        <Column
          field="destino.nivel"
          header="Nív"
          style={{ width: '65px' }}
          bodyStyle={{ textAlign: 'right' }}
        />
        <Column
          field="destino.apto"
          header="Apto"
          style={{ width: '65px' }}
          bodyStyle={{ textAlign: 'right' }}
        />
      </Row>
    </ColumnGroup>
  );

  async function pesquisarProdutos(data: DTOPesquisa): Promise<void> {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        codprod: Yup.string().required('Código do produto obrigatório.'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      setLoading(true);
      setMensagemLoading('Buscando dados para transferência, aguarde...');

      const response = await api.get<DataProdutoTransf>(
        `Rotina9909/BuscaDadosProdutoTransferencia/${usuario.filial}/${data.codprod}`,
      );

      const produtoResponse = response.data;

      if (produtoResponse.codProd !== 0) {
        setEnderecoOrig({} as EnderecoOrigem);
        setEnderecoDestino({} as EnderecoDestino);
        setProduto(produtoResponse);
        setLoading(false);
      } else {
        createMessage({
          type: 'alert',
          message: `Nenhum produto encontrado com o código: ${data.codprod} para a filial: ${data.filial}`,
        });

        setLoading(false);
      }
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);

        setLoading(false);
        return;
      }

      createMessage({
        type: 'error',
        message: `Erro: ${err.message}`,
      });
      setLoading(false);
    }
  }

  function chamaPesquisa(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'Enter') {
      document.getElementById('pesquisar')?.click();
    }
  }

  const estiloPendencia = useCallback((rowData: EnderecoOrigem) => {
    let retorno;

    if (rowData.pendencia === 'S') {
      retorno = <FcLeftDown2 />;
    } else if (rowData.pendencia === 'E') {
      retorno = <FcRightUp2 />;
    } else if (rowData.pendencia === 'T') {
      retorno = (
        <>
          <FcLeftDown2 />
          <FcRightUp2 />
        </>
      );
    }

    return (
      <span
        style={{
          padding: '2px 10px',
          fontSize: '20px',
          justifyContent: 'center',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {retorno}
      </span>
    );
  }, []);

  function adicionaItem(): void {
    const validaOrigem = listaProduto.filter(
      (end) => end.origem.codEndereco === enderecoOrig.codEndereco,
    );

    if (validaOrigem.length === 0) {
      if (enderecoOrig.codEndereco === enderecoDestino.codEndereco) {
        createMessage({
          type: 'alert',
          message:
            'Endereços iguais. O endereço origem e destino não podem ser iguais.',
        });
      } else {
        setDialog(true);
      }
    } else {
      createMessage({
        type: 'alert',
        message: 'O endereço selecionado já está na listagem.',
      });
    }
  }

  function validaItemLista(retorno: boolean, total: number): void {
    if (retorno) {
      if (total <= enderecoOrig.qt && total !== 0) {
        const data = {
          codprod: produto.codProd,
          descricao: produto.descricao,
          validade: enderecoOrig.dataValidade,
          qt: total,
          destino: {
            codEndereco: enderecoDestino.codEndereco,
            deposito: enderecoDestino.deposito,
            rua: enderecoDestino.rua,
            predio: enderecoDestino.predio,
            nivel: enderecoDestino.nivel,
            apto: enderecoDestino.apto,
          },
          origem: {
            codEndereco: enderecoOrig.codEndereco,
            deposito: enderecoOrig.deposito,
            rua: enderecoOrig.rua,
            predio: enderecoOrig.predio,
            nivel: enderecoOrig.nivel,
            apto: enderecoOrig.apto,
          },
        } as ProdutoLista;

        setListaProduto([...listaProduto, data]);

        createMessage({
          type: 'success',
          message: 'Item adicionado a lista de transferência.',
        });

        setEnderecoDestino({} as EnderecoDestino);
        setEnderecoOrig({} as EnderecoOrigem);
        setDialog(false);
      } else {
        createMessage({
          type: 'alert',
          message:
            total === 0
              ? 'A quantidade não pode ser igual a 0.'
              : 'A quantidade total não pode ser superior a quantidade do endereço.',
        });
      }
    } else {
      setDialog(false);
    }
  }

  function excluiItemLista(retorno: boolean): void {
    if (retorno) {
      if (executarConfirmacao === 'I') {
        const listaAtualizada = listaProduto.filter(
          (end) =>
            end.origem.codEndereco !==
            produtoListaSelecionado.origem.codEndereco,
        );

        setListaProduto(listaAtualizada);
        setProdutoListaSelecionado({} as ProdutoLista);
        setDialogConfirmacao(false);
      } else {
        setListaProduto([]);
        setDialogConfirmacao(false);
        setTab1Selecionada(true);
      }
    } else {
      setDialogConfirmacao(false);
    }
  }

  async function ImpressaoDados(numtranswms: number): Promise<void> {
    setMensagemLoading(
      'Impressão da ordem de abastecimento/transferência de enderço, aguarde...',
    );

    // Imprime Lista Transferência
    let paramsImpressao = {} as DTOImpressoes;

    paramsImpressao = {
      app: 'EPCWMS',
      tipousu: 'U',
      matricula: usuario.codigo,
      tamanho: 'G',
      nrorel: 9063,
      pCodfilial: filialSelecionada,
      pNumtranswms: numtranswms,
    } as DTOImpressoes;

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

    setMensagemLoading('Impressão das placas, aguarde...');

    // Imprime Placas Transferência
    let paramsImpressaoEtiqueta = {} as DTOImpressoes;

    paramsImpressaoEtiqueta = {
      app: 'EPCWMS',
      tipousu: 'U',
      matricula: usuario.codigo,
      tamanho: 'G',
      nrorel: 9064,
      pCodfilial: filialSelecionada,
      pNumtranswms: numtranswms,
    } as DTOImpressoes;

    await apiRelatorios
      .get('servdw/REL/relatorio', { params: paramsImpressaoEtiqueta })
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
  }

  async function transferirEnderecos(): Promise<void> {
    setMensagemLoading('Validando dados para transferência, aguarde...');
    setLoading(true);

    try {
      let enderecos = '';
      let produtos = '';

      listaProduto.map((end) => {
        if (enderecos === '' || produtos === '') {
          if (enderecos === '') {
            enderecos = end.destino.codEndereco.toString();
          }
          if (produtos === '') {
            produtos = end.codprod.toString();
          }
          return end;
        }

        produtos = `${produtos}, ${end.codprod.toString()}`;
        enderecos = `${enderecos},${end.destino.codEndereco.toString()}`;

        return end;
      });

      const response = await api.get<number[]>(
        `Rotina9909/ValidaEnderecos/${enderecos}/${produtos}`,
      );

      const validacao = response.data;

      if (validacao.length === 0) {
        setMensagemLoading(
          'Realizando a transferência dos endereços, aguarde...',
        );

        const listaTransf = [] as DTOTransferencia[];

        listaProduto.map((end) => {
          const item = {
            codfilial: filialSelecionada,
            codfunc: usuario.codigo,
            codprod: end.codprod,
            qttransf: end.qt,
            codEnderecoOrig: end.origem.codEndereco,
            codEnderecoDest: end.destino.codEndereco,
          } as DTOTransferencia;

          listaTransf.push(item);

          return end;
        });

        const responseTransf = await api.post<RetornoTransf>(
          'Rotina9909/TransfereEnderecos',
          listaTransf,
        );

        const respostaTransf = responseTransf.data;

        if (
          respostaTransf.retornoTransferencia.includes(
            'Transferência realizada com sucesso.',
          )
        ) {
          await ImpressaoDados(respostaTransf.numTransWms);

          limparTela();
          setTab1Selecionada(true);
          setLoading(false);
          createMessage({
            type: 'info',
            message: respostaTransf.retornoTransferencia,
          });
          document.getElementById('codprod')?.focus();
        } else {
          createMessage({
            type: 'error',
            message: respostaTransf.retornoTransferencia,
          });
          setLoading(false);
        }
      } else {
        createMessage({
          type: 'alert',
          message:
            validacao.length === 1
              ? `Favor verificar o endereço ${validacao.toString()} pois está ocupado.`
              : `Favor verificar os endereços ${validacao.toString()} pois estão ocupados.`,
        });
        setLoading(false);
      }
    } catch (err) {
      createMessage({
        type: 'error',
        message: err.message,
      });
      setLoading(false);
    }
  }

  return (
    <>
      <NavBar paginaAtual="9909 - TRANSFERIR PRODUTO DE ENDEREÇO" caminho="/" />
      <Container>
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
                }}
              >
                <label htmlFor="tab1"><FiCheckSquare />Seleções para Transferências</label> {/*eslint-disable-line*/}
              </button>
            </li>
            <li className="tab2">
              <button
                id="tab2"
                type="button"
                onClick={() => {
                  setTab1Selecionada(false);
                  setTab2Selecionada(true);
                }}
              >
                 <label htmlFor="tab2"><FiList />Lista de Transferências</label> {/*eslint-disable-line*/}
              </button>
            </li>
          </ul>
        </nav>
        <section>
          <div className="tab1">
            <Content>
              <Form ref={formRef} onSubmit={pesquisarProdutos}>
                <Select
                  id="filial"
                  name="filial"
                  description="FILIAL"
                  percWidth={5}
                  onChange={(e) => {
                    setFilialSelecionada(Number(e.target.value));
                  }}
                  disabled={listaProduto.length !== 0}
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
                <Input
                  id="codprod"
                  name="codprod"
                  type="number"
                  description="PROD/EAN/DUN"
                  percWidth={12}
                  defaultValue={produto.codProd}
                  onKeyUp={chamaPesquisa}
                />
                <Input
                  id="descricao"
                  name="descricao"
                  type="text"
                  description="Descrição"
                  percWidth={40}
                  value={produto.descricao}
                  disabled
                />
                <Input
                  id="lastro"
                  name="lastro"
                  type="number"
                  description="Lastro"
                  percWidth={5}
                  value={produto.lastro}
                  disabled
                />
                <Input
                  id="camada"
                  name="camada"
                  type="number"
                  description="Camada"
                  percWidth={5}
                  value={produto.camada}
                  disabled
                />
                <Input
                  id="norma"
                  name="norma"
                  type="number"
                  description="Total Norma"
                  percWidth={8}
                  value={produto.norma}
                  disabled
                />
                <ButtonPesquisa>
                  <button
                    id="pesquisar"
                    type="button"
                    onClick={() => {
                      pesquisarProdutos(
                        formRef.current?.getData() as DTOPesquisa,
                      );
                    }}
                  >
                    <FiSearch />
                    Pesquisar
                  </button>
                </ButtonPesquisa>
              </Form>

              {!loading ? (
                <> </>
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

              <FieldsetTable>
                <legend>
                  <span>ENDEREÇOS DO PRODUTO</span>
                </legend>
                <DataTable
                  header="Selecione o endereço de origem"
                  value={produto.enderecosProduto}
                  selectionMode="single"
                  selection={enderecoOrig}
                  onSelectionChange={(e) => {
                    setEnderecoOrig(e.value);
                  }}
                  scrollable
                  paginator
                  rows={10}
                  scrollHeight="60vh"
                  style={{ width: '45vw' }}
                  rowClassName={rowClassOrig}
                  metaKeySelection={false}
                >
                  <Column
                    field="tipoEndereco"
                    header="Tipo Ender."
                    style={{ width: '110px' }}
                  />
                  <Column
                    field="deposito"
                    header="Dep"
                    style={{ width: '60px' }}
                    bodyStyle={{ textAlign: 'right' }}
                    filter
                    filterMatchMode="equals"
                    filterType="number"
                  />
                  <Column
                    field="rua"
                    header="Rua"
                    style={{ width: '60px' }}
                    bodyStyle={{ textAlign: 'right' }}
                    filter
                    filterMatchMode="equals"
                    filterType="number"
                  />
                  <Column
                    field="predio"
                    header="Préd"
                    style={{ width: '60px' }}
                    bodyStyle={{ textAlign: 'right' }}
                    filter
                    filterMatchMode="equals"
                    filterType="number"
                  />
                  <Column
                    field="nivel"
                    header="Nív"
                    style={{ width: '60px' }}
                    bodyStyle={{ textAlign: 'right' }}
                    filter
                    filterMatchMode="equals"
                    filterType="number"
                  />
                  <Column
                    field="apto"
                    header="Apto"
                    style={{ width: '60px' }}
                    bodyStyle={{ textAlign: 'right' }}
                    filter
                    filterMatchMode="equals"
                    filterType="number"
                  />
                  <Column
                    field="qt"
                    header="Qtd"
                    style={{ width: '60px' }}
                    bodyStyle={{ textAlign: 'right' }}
                  />
                  <Column
                    field="pendencia"
                    header="Pendência"
                    style={{ width: '100px' }}
                    body={estiloPendencia}
                  />
                  <Column
                    field="dataValidade"
                    header="Validade"
                    style={{ width: '100px' }}
                    bodyStyle={{ textAlign: 'center' }}
                  />
                  <Column
                    field="codigoUma"
                    header="U.M.A"
                    style={{ width: '90px' }}
                    bodyStyle={{ textAlign: 'right' }}
                  />
                  <Column
                    field="capacidade"
                    header="Capaci."
                    style={{ width: '80px' }}
                    bodyStyle={{ textAlign: 'right' }}
                  />
                  <Column
                    field="pontoRep"
                    header="Ponto Rep."
                    style={{ width: '110px' }}
                    bodyStyle={{ textAlign: 'right' }}
                  />
                </DataTable>
              </FieldsetTable>
              <FieldsetTable style={{ marginLeft: '0.3%' }}>
                <legend>
                  <span>ENDEREÇOS DISPONÍVEIS</span>
                </legend>
                <DataTable
                  header="Selecione o endereço de destino"
                  value={produto.enderecosDisponiveis}
                  selectionMode="single"
                  selection={enderecoDestino}
                  onSelectionChange={(e) => {
                    setEnderecoDestino(e.value);
                  }}
                  scrollable
                  paginator
                  rows={10}
                  scrollHeight="60vh"
                  style={{ width: '45vw' }}
                  metaKeySelection={false}
                  rowClassName={rowClassDestino}
                >
                  <Column
                    field="descricaoTipoEndereco"
                    header="Descrição"
                    style={{ width: '140px' }}
                  />
                  <Column
                    field="situacao"
                    header="Situação"
                    style={{ width: '90px' }}
                  />
                  <Column
                    field="deposito"
                    header="Dep"
                    style={{ width: '60px' }}
                    bodyStyle={{ textAlign: 'right' }}
                    filter
                    filterMatchMode="equals"
                    filterType="number"
                  />
                  <Column
                    field="rua"
                    header="Rua"
                    style={{ width: '60px' }}
                    bodyStyle={{ textAlign: 'right' }}
                    filter
                    filterMatchMode="equals"
                    filterType="number"
                  />
                  <Column
                    field="predio"
                    header="Préd"
                    style={{ width: '60px' }}
                    bodyStyle={{ textAlign: 'right' }}
                    filter
                    filterMatchMode="equals"
                    filterType="number"
                  />
                  <Column
                    field="nivel"
                    header="Nív"
                    style={{ width: '60px' }}
                    bodyStyle={{ textAlign: 'right' }}
                    filter
                    filterMatchMode="equals"
                    filterType="number"
                  />
                  <Column
                    field="apto"
                    header="Apto"
                    style={{ width: '60px' }}
                    bodyStyle={{ textAlign: 'right' }}
                    filter
                    filterMatchMode="equals"
                    filterType="number"
                  />
                  <Column
                    field="tipoEndereco"
                    header="Tipo End."
                    style={{ width: '100px' }}
                  />
                  <Column
                    field="codEndereco"
                    header="Código"
                    style={{ width: '90px' }}
                    bodyStyle={{ textAlign: 'right' }}
                  />
                  <Column
                    field="descricaoEstrutura"
                    header="Estrutura"
                    style={{ width: '140px' }}
                  />
                  <Column
                    field="qtEstDisp"
                    header="Qtd"
                    style={{ width: '60px' }}
                    bodyStyle={{ textAlign: 'right' }}
                  />
                </DataTable>
              </FieldsetTable>
              {dialog ? (
                <DialogInformacoes
                  endOrig={{
                    deposito: enderecoOrig.deposito,
                    rua: enderecoOrig.rua,
                    predio: enderecoOrig.predio,
                    nivel: enderecoOrig.nivel,
                    apto: enderecoOrig.apto,
                    qtDisp: enderecoOrig.qt,
                    qtBloq: enderecoOrig.qtBloqueada,
                    qtDispCx: Math.round(enderecoOrig.qt / produto.qtunitcx),
                  }}
                  endDestino={{
                    deposito: enderecoDestino.deposito,
                    rua: enderecoDestino.rua,
                    predio: enderecoDestino.predio,
                    nivel: enderecoDestino.nivel,
                    apto: enderecoDestino.apto,
                  }}
                  qtunitcx={produto.qtunitcx}
                  executar={validaItemLista}
                />
              ) : (
                <> </>
              )}
            </Content>
          </div>
          <div className="tab2">
            {!loading ? (
              <Content>
                {dialogConfirmacao ? (
                  <DialogConfirmacao
                    title={tituloConfirmacao}
                    message={mensagemConfirmacao}
                    executar={excluiItemLista}
                  />
                ) : (
                  <> </>
                )}
                <DataTable
                  headerColumnGroup={cabecalhoLista}
                  selectionMode="single"
                  selection={produtoListaSelecionado}
                  onSelectionChange={(e) => {
                    setProdutoListaSelecionado(e.value);
                  }}
                  value={listaProduto}
                  scrollable
                  paginator
                  rows={20}
                  scrollHeight="60vh"
                  style={{ width: '93vw' }}
                  metaKeySelection={false}
                >
                  <Column
                    field="codprod"
                    header="Código"
                    style={{ width: '70px' }}
                    bodyStyle={{ textAlign: 'right' }}
                  />
                  <Column
                    field="descricao"
                    header="Descrição"
                    style={{ width: '300px' }}
                  />
                  <Column
                    field="qt"
                    header="Quant."
                    style={{ width: '70px' }}
                    bodyStyle={{ textAlign: 'right' }}
                  />
                  <Column
                    field="validade"
                    header="Validade"
                    style={{ width: '90px' }}
                    bodyStyle={{ textAlign: 'center' }}
                  />
                  <Column
                    field="origem.deposito"
                    header="Dep"
                    style={{ width: '65px' }}
                    bodyStyle={{ textAlign: 'right' }}
                  />
                  <Column
                    field="origem.rua"
                    header="Rua"
                    style={{ width: '65px' }}
                    bodyStyle={{ textAlign: 'right' }}
                  />
                  <Column
                    field="origem.predio"
                    header="Préd"
                    style={{ width: '65px' }}
                    bodyStyle={{ textAlign: 'right' }}
                  />
                  <Column
                    field="origem.nivel"
                    header="Nív"
                    style={{ width: '65px' }}
                    bodyStyle={{ textAlign: 'right' }}
                  />
                  <Column
                    field="origem.apto"
                    header="Apto"
                    style={{ width: '65px' }}
                    bodyStyle={{ textAlign: 'right' }}
                  />
                  <Column
                    field="destino.codEndereco"
                    header="Cód"
                    style={{ width: '65px' }}
                    bodyStyle={{ textAlign: 'right' }}
                  />
                  <Column
                    field="destino.deposito"
                    header="Dep"
                    style={{ width: '65px' }}
                    bodyStyle={{ textAlign: 'right' }}
                  />
                  <Column
                    field="destino.rua"
                    header="Rua"
                    style={{ width: '65px' }}
                    bodyStyle={{ textAlign: 'right' }}
                  />
                  <Column
                    field="destino.predio"
                    header="Préd"
                    style={{ width: '65px' }}
                    bodyStyle={{ textAlign: 'right' }}
                  />
                  <Column
                    field="destino.nivel"
                    header="Nív"
                    style={{ width: '65px' }}
                    bodyStyle={{ textAlign: 'right' }}
                  />
                  <Column
                    field="destino.apto"
                    header="Apto"
                    style={{ width: '65px' }}
                    bodyStyle={{ textAlign: 'right' }}
                  />
                </DataTable>
              </Content>
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
          </div>
        </section>
        {tab1Selecionada ? (
          <Button style={{ marginTop: '8px', marginLeft: '3.3em' }}>
            <button
              id="adicionarLista"
              type="button"
              onClick={adicionaItem}
              disabled={
                enderecoOrig?.tipoEndereco === undefined ||
                enderecoDestino?.tipoEndereco === undefined
              }
            >
              <FiPlusCircle />
              Adicionar à lista
            </button>
          </Button>
        ) : (
          <Button style={{ marginTop: '8px', marginLeft: '3.3em' }}>
            <button
              type="button"
              onClick={() => {
                setTituloConfirmacao('Remover item da lista');
                setMensagemConfirmacao(
                  'Deseja realmente remover o item da lista?',
                );
                setExecutarConfirmacao('I');
                setDialogConfirmacao(true);
              }}
              disabled={!produtoListaSelecionado?.codprod}
            >
              <FiTrash2 />
              Excluir item
            </button>
            <button
              type="button"
              onClick={transferirEnderecos}
              disabled={listaProduto.length === 0}
            >
              <FiRefreshCw />
              Transferir
            </button>
            <button
              type="button"
              onClick={() => {
                setTituloConfirmacao('Remover todos os itens da lista');
                setMensagemConfirmacao(
                  'Deseja realmente remover todos os itens da lista?',
                );
                setExecutarConfirmacao('T');
                setDialogConfirmacao(true);
              }}
              disabled={
                listaProduto.length === 0 || !!produtoListaSelecionado?.codprod
              }
            >
              <FiXOctagon />
              Cancelar
            </button>
          </Button>
        )}
      </Container>
    </>
  );
};

export default Rotina9909;
