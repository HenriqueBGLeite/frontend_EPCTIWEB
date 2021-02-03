import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useHistory } from 'react-router';
import { FiSearch } from 'react-icons/fi';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import ReactLoading from 'react-loading';

import api from '../../../services/api';
import { useAuth } from '../../../hooks/auth';
import { formataValor } from '../../../utils/formataValor';

import NavBar from '../../../components/NavBar';
import Input from '../../../components/Input';
import Select from '../../../components/Select';
import { createMessage } from '../../../components/Toast';

import { Container, Content, Loanding, Button } from './styles';

interface Filiais {
  codigo: number;
}

interface Fornecedor {
  value: number;
  label: string;
}

interface PesquisaForm {
  filial: number;
  codprod: string;
  descricao: string;
  fornecedor: string;
}

interface Produto {
  codprod: number;
  produto: string;
  embalagemmaster: string;
  embalagem: string;
  esterp: number;
  esterpformatado: string;
  estwms: number;
  estwmsformatado: string;
  fornecedor: string;
}

const Rotina9901: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();
  const { usuario } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingFornecedores, setLoadingFornecedores] = useState(false);
  const [loadingProdutos, setLoadingProdutos] = useState(false);
  const [filiais, setFiliais] = useState<Filiais[]>([]);
  const [filialSelecionada, setFilialSelecionada] = useState(
    Number(usuario.filial),
  );
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [listaProduto, setListaProduto] = useState<Produto[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto>(
    {} as Produto,
  );

  useEffect(() => {
    setFilialSelecionada(usuario.filial);
    setLoading(true);

    api
      .get<Filiais[]>(`Rotina9901/BuscaFiliais/${usuario.codigo}`)
      .then((response) => {
        const filiaisEncontradas = response.data;

        if (filiaisEncontradas.length > 0) {
          setFiliais(filiaisEncontradas);
          setLoading(false);
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

  const buscarFornecedores = useCallback(async () => {
    if (fornecedores.length === 0) {
      setLoadingFornecedores(true);

      await api
        .get<Fornecedor[]>(`Rotina9901/BuscaFornecedores/`)
        .then((response) => {
          const fornecedoresEncontrados = response.data;

          if (fornecedoresEncontrados.length > 0) {
            setFornecedores(fornecedoresEncontrados);
            setLoadingFornecedores(false);
          } else {
            createMessage({
              type: 'alert',
              message: 'Nenhum fornecedor foi encontrado.',
            });
            setLoadingFornecedores(false);
          }
        })
        .catch((err) => {
          createMessage({
            type: 'error',
            message: `Error: ${err.message}`,
          });
          setLoadingFornecedores(false);
        });
    }
  }, [fornecedores]);

  const pesquisarProdutos = useCallback((data: PesquisaForm) => {
    const fornecePesquisa =
      data.fornecedor === 'SELECIONE UM FORNECEDOR...' ? '' : data.fornecedor;

    const dataPesquisa = {
      codfilial: data.filial,
      produto: data.codprod,
      descricao: data.descricao,
      fornecedores: fornecePesquisa,
    };

    setLoadingProdutos(true);

    api
      .post<Produto[]>(`Rotina9901/BuscaProdutos/`, dataPesquisa)
      .then((response) => {
        const produtosEncontrados = response.data;

        if (produtosEncontrados.length > 0) {
          produtosEncontrados.map((prod) => {
            const esterp = formataValor(prod.esterp);
            const estwms = formataValor(prod.estwms);

            prod.esterpformatado = esterp;
            prod.estwmsformatado = estwms;

            return prod;
          });

          setListaProduto(produtosEncontrados);
          setLoadingProdutos(false);
        } else {
          createMessage({
            type: 'alert',
            message: 'Nenhum produto foi encontrado com os filtros informados.',
          });
          setListaProduto([]);
          setLoadingProdutos(false);
        }
      })
      .catch((err) => {
        createMessage({
          type: 'error',
          message: `Error: ${err.message}`,
        });
        setListaProduto([]);
        setLoadingProdutos(false);
      });
  }, []);

  const editarProduto = useCallback(() => {
    const parametros = {
      codprod: produtoSelecionado.codprod,
      filial: filialSelecionada,
    };

    history.push('dados-logisticos/editar', parametros);
  }, [history, produtoSelecionado, filialSelecionada]);

  const chamaPesquisa = useCallback((event) => {
    if (event.key === 'Enter') {
      document.getElementById('pesquisar')?.click();
    }
  }, []);

  return (
    <>
      <NavBar paginaAtual="9901 - DADOS LOGÍSTICOS" caminho="/" />
      <Container>
        {!loading ? (
          <>
            <Content>
              <Form ref={formRef} onSubmit={pesquisarProdutos}>
                <Select
                  id="filial"
                  name="filial"
                  description="FILIAL"
                  percWidth={8}
                  onChange={(e) => {
                    setFilialSelecionada(Number(e.target.value));
                  }}
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
                  focus
                  id="codprod"
                  name="codprod"
                  type="number"
                  description="PROD/EAN/DUN"
                  percWidth={18}
                  onKeyUp={chamaPesquisa}
                />
                <Input
                  id="descricao"
                  name="descricao"
                  type="text"
                  description="DESCRIÇÃO"
                  autoComplete="on"
                  style={{ textTransform: 'uppercase' }}
                  percWidth={20}
                  onKeyUp={chamaPesquisa}
                />
                {!loadingFornecedores ? (
                  <Select
                    id="fornecedor"
                    name="fornecedor"
                    description="FORNECEDOR"
                    percWidth={35}
                    onFocus={buscarFornecedores}
                    inputMode="search"
                    defaultValue="SELECIONE UM FORNECEDOR..."
                  >
                    <option>SELECIONE UM FORNECEDOR...</option>
                    {fornecedores.map((forne) => (
                      <option key={forne.value} value={forne.value}>
                        {forne.label}
                      </option>
                    ))}
                  </Select>
                ) : (
                  <Loanding forncedor>
                    <ReactLoading
                      className="loadingFornecedores"
                      type="spokes"
                      width="70px"
                      height="50px"
                      color="#c22e2c"
                    />
                    <p>Carregando fornecedores, aguarde...</p>
                  </Loanding>
                )}
                <Button>
                  <button
                    id="pesquisar"
                    type="button"
                    onClick={() => {
                      pesquisarProdutos(
                        formRef.current?.getData() as PesquisaForm,
                      );
                    }}
                  >
                    <FiSearch />
                    Pesquisar
                  </button>
                </Button>
              </Form>
            </Content>
            {!loadingProdutos ? (
              <>
                <DataTable
                  header="Selecione um produto para edição"
                  value={listaProduto}
                  selectionMode="single"
                  selection={produtoSelecionado}
                  onSelectionChange={(e) => setProdutoSelecionado(e.value)}
                  scrollable
                  paginator
                  rows={20}
                  scrollHeight="60vh"
                  style={{ width: '99%' }}
                  onRowDoubleClick={editarProduto}
                >
                  <Column
                    field="produto"
                    header="Produto"
                    style={{ width: '340px' }}
                  />
                  <Column
                    field="embalagemmaster"
                    header="Emb. Master"
                    style={{ width: '70px' }}
                  />
                  <Column
                    field="embalagem"
                    header="Emb. Unit."
                    style={{ width: '60px' }}
                  />
                  <Column
                    field="esterpformatado"
                    header="Est. ERP"
                    style={{ width: '50px' }}
                    bodyStyle={{ textAlign: 'right' }}
                  />
                  <Column
                    field="estwmsformatado"
                    header="Est. WMS"
                    style={{ width: '60px' }}
                    bodyStyle={{ textAlign: 'right' }}
                  />
                  <Column
                    field="fornecedor"
                    header="Fornecedor"
                    style={{ width: '340px' }}
                  />
                </DataTable>
              </>
            ) : (
              <Loanding>
                <ReactLoading
                  className="loading"
                  type="spokes"
                  width="120px"
                  color="#c22e2c"
                />
                <h1>Carregando produtos, aguarde...</h1>
              </Loanding>
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
            <h1>Carregando filiais, aguarde...</h1>
          </Loanding>
        )}
      </Container>
    </>
  );
};

export default Rotina9901;
