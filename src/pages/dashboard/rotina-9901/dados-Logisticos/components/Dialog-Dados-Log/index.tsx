import React, { useEffect, useState, useCallback, useRef } from 'react';
import { FiCheck, FiX, FiSearch } from 'react-icons/fi';
import { Dialog as DialogPrime } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import api from '../../../../../../services/api';

import Input from '../../../../../../components/Input';
import Select from '../../../../../../components/Select';
import { createMessage } from '../../../../../../components/Toast';

import { Container, Tabela, Footer } from './styles';

interface DialogProps {
  title: string;
  message?: string;
  tipoDialog: 'EMBALAGEM' | 'PK' | 'LOJA' | 'PKTRANSF';
  edicao?: boolean;
  dataEdicao?: {
    codBarra: number;
    embalagem: string;
    unidade: string;
    qtunit: number;
  };
  edicaoPk?: boolean;
  dataEdicaoPk?: {
    tipoPicking: string;
    codTipoEndereco: number;
    codTipoEstrutura: number;
    codEndereco: number;
    deposito: number;
    rua: number;
    predio: number;
    nivel: number;
    apto: number;
    capacidade: number;
    percPontoReposicao: number;
    pontoReposicao: number;
  };
  cabecalho: {
    codprod: number;
    descricao: string;
    codfilial: number;
    descFilial: string;
    tipoEndereco?: [
      {
        codigo: number;
        descricao: string;
      },
    ];
    tipoEstrutura?: [
      {
        codigo: number;
        descricao: string;
      },
    ];
  };
  executar: Function;
}

interface DTOPesquisa {
  tipoPicking: 'V' | 'M' | 'P';
  tipoEndereco: number;
  tipoEstrutura: number;
  codEndereco?: number;
  rua?: number;
  predio?: number;
  nivel?: number;
  apto?: number;
}

interface DTOPesquisaEndereco {
  codFilial: number;
  tipoEndereco: number;
  tipoEstrutura: number;
  codEndereco?: number;
  rua?: number;
  predio?: number;
  nivel?: number;
  apto?: number;
}

interface Endereco {
  codendereco: number;
  deposito: number;
  rua: number;
  predio: number;
  nivel: number;
  apto: number;
  codTipoEndereco: number;
  descTipoEndereco: string;
  codTipoEstrutura: number;
  descTipoEstrutura: string;
  status: string;
}

const DialogDadosLog: React.FC<DialogProps> = (props) => {
  const {
    title,
    message,
    tipoDialog,
    edicao,
    dataEdicao,
    edicaoPk,
    dataEdicaoPk,
    executar,
    cabecalho,
  } = props;
  const formRefDados = useRef<FormHandles>(null);
  const [inputCapacidade, setInputCapacidade] = useState(0);
  const [inputPercRep, setInputPercRep] = useState(0);
  const [inputPontoRep, setInputPontoRep] = useState(0);
  const [dataPesquisa, setDataPesquisa] = useState<DTOPesquisa>(
    {} as DTOPesquisa,
  );

  const [mostrarTabela, setMostrarTabela] = useState(false);
  const [ocultarPesquisa, setOcultarPesquisa] = useState(false);
  const [listaEnderecos, setListaEnderecos] = useState<Endereco[]>([]);
  const [enderecoSelecionado, setEnderecoSelecionado] = useState<Endereco>(
    {} as Endereco,
  );
  const [mostrarDadosPicking, setMostrarDadosPicking] = useState(false);

  const [action, setAction] = useState(false);

  useEffect(() => {
    if (tipoDialog === 'LOJA') {
      api
        .get<Endereco[]>(`Rotina9901/ListaEnderecosLoja/${cabecalho.codfilial}`)
        .then((response) => {
          setListaEnderecos(response.data);
          setMostrarTabela(true);
        })
        .catch((err) => {
          createMessage({
            type: 'error',
            message: `Erro: ${err.message}`,
          });
        });
    }

    if (edicaoPk) {
      setOcultarPesquisa(true);
      setMostrarDadosPicking(true);
      setOcultarPesquisa(true);
      if (dataEdicaoPk) {
        setInputCapacidade(dataEdicaoPk.capacidade);
        setInputPercRep(dataEdicaoPk.percPontoReposicao);
        setInputPontoRep(dataEdicaoPk.pontoReposicao);
      }
    }
  }, [cabecalho, tipoDialog, edicaoPk, dataEdicaoPk]);

  const footer = useCallback(() => {
    return (
      <Footer>
        <button
          type="submit"
          className="footerButton"
          onClick={() => executar(true, formRefDados.current?.getData())}
        >
          <FiCheck />
          Confirmar
        </button>
        <button
          id="cancelar"
          className="footerButton"
          type="button"
          onClick={() => executar(false)}
        >
          <FiX />
          Cancelar
        </button>
      </Footer>
    );
  }, [executar]);

  const pesquisaEnderecos = useCallback(async () => {
    setListaEnderecos([]);
    setInputCapacidade(0);
    setInputPercRep(0);
    setInputPontoRep(0);
    setEnderecoSelecionado({} as Endereco);
    setMostrarDadosPicking(false);

    const dataPesquisaEndereco = {
      codFilial: cabecalho.codfilial,
      tipoEndereco: dataPesquisa.tipoEndereco,
      tipoEstrutura: dataPesquisa.tipoEstrutura,
      codEndereco: dataPesquisa.codEndereco,
      rua: dataPesquisa.rua,
      predio: dataPesquisa.predio,
      nivel: dataPesquisa.nivel,
      apto: dataPesquisa.apto,
    } as DTOPesquisaEndereco;

    await api
      .post<Endereco[]>(`Rotina9901/ListaEnderecos/`, dataPesquisaEndereco)
      .then((response) => {
        setListaEnderecos(response.data);
        setMostrarTabela(true);
      })
      .catch((err) => {
        createMessage({
          type: 'error',
          message: `Erro: ${err.message}`,
        });
      });
  }, [cabecalho, dataPesquisa]);

  const habilitaEscondeCampos = useCallback(async () => {
    setMostrarTabela(false);
    setMostrarDadosPicking(true);
  }, []);

  const selecionouEndereco = useCallback(async () => {
    await habilitaEscondeCampos();

    if (tipoDialog === 'PKTRANSF') {
      formRefDados.current?.setFieldValue(
        'tipoEndereco',
        enderecoSelecionado.codTipoEndereco,
      );

      formRefDados.current?.setFieldValue(
        'tipoEstrutura',
        enderecoSelecionado.codTipoEstrutura,
      );

      setDataPesquisa({
        ...dataPesquisa,
        tipoEndereco: enderecoSelecionado.codTipoEndereco,
        tipoEstrutura: enderecoSelecionado.codTipoEstrutura,
      });
    }

    document.getElementById('capacidadeFoco')?.focus();
  }, [tipoDialog, habilitaEscondeCampos, enderecoSelecionado, dataPesquisa]);

  return (
    <DialogPrime
      header={title}
      visible
      style={
        tipoDialog === 'EMBALAGEM'
          ? { width: '50vw', fontWeight: 'bold', fontSize: '16px' }
          : { width: '90vw', fontWeight: 'bold', fontSize: '16px' }
      }
      onHide={() => setAction(action)}
      blockScroll
      footer={footer()}
      closable={false}
    >
      <Container>
        <Form ref={formRefDados} onSubmit={() => executar(true)}>
          <Input
            percWidth={18}
            name="codprod"
            type="number"
            value={cabecalho.codprod}
            description="Cód.Prod"
            disabled
          />
          <Input
            percWidth={80}
            style={{ marginLeft: '1%' }}
            name="descricao"
            type="text"
            value={cabecalho.descricao}
            description="Produto"
            disabled
          />
          <Input
            percWidth={18}
            name="codfilial"
            type="number"
            value={cabecalho.codfilial}
            description="Cód.Filial"
            disabled
          />
          <Input
            percWidth={80}
            name="descFilial"
            type="text"
            value={cabecalho.descFilial}
            description="Nome Filial"
            disabled
          />
          {tipoDialog === 'EMBALAGEM' ? (
            <>
              <Input
                focus
                percWidth={24}
                name="codBarra"
                type="number"
                description="Cód.Barras"
                defaultValue={edicao ? dataEdicao?.codBarra : undefined}
                disabled={!!edicao}
              />
              <Input
                percWidth={24}
                name="embalagem"
                type="text"
                description="Embalagem"
                defaultValue={edicao ? dataEdicao?.embalagem : undefined}
              />
              <Input
                percWidth={24}
                name="unidade"
                type="text"
                description="Unidade"
                defaultValue={edicao ? dataEdicao?.unidade : undefined}
              />
              <Input
                percWidth={24}
                name="qtunit"
                type="number"
                description="Qt.Unit"
                defaultValue={edicao ? dataEdicao?.qtunit : undefined}
              />
            </>
          ) : (
            <>
              {tipoDialog === 'LOJA' ? (
                <>
                  {mostrarTabela ? (
                    <Tabela>
                      <DataTable
                        header="*Selecione o endereço clicando duas vezes*"
                        value={listaEnderecos}
                        selectionMode="single"
                        selection={enderecoSelecionado}
                        onSelectionChange={(e) => {
                          setEnderecoSelecionado(e.value);
                        }}
                        scrollable
                        paginator
                        rows={5}
                        scrollHeight="35vh"
                        style={{ width: '100%', margin: '6px 0px' }}
                        onRowDoubleClick={() => selecionouEndereco()}
                      >
                        <Column
                          field="codendereco"
                          header="Cód.End"
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
                          field="codTipoEndereco"
                          header="Tipo End"
                          style={{ width: '85px' }}
                          bodyStyle={{ textAlign: 'right' }}
                        />
                        <Column
                          field="descendereco"
                          header="Tipo Endereço"
                          style={{ width: '150px' }}
                        />
                        <Column
                          field="codTipoEstrutura"
                          header="Tipo Est"
                          style={{ width: '85px' }}
                          bodyStyle={{ textAlign: 'right' }}
                        />
                        <Column
                          field="descestrutura"
                          header="Tipo Estrutura"
                          style={{ width: '150px' }}
                        />
                        <Column
                          field="status"
                          header="Status"
                          style={{ width: '100px' }}
                        />
                      </DataTable>
                    </Tabela>
                  ) : (
                    <> </>
                  )}
                  {mostrarDadosPicking ? (
                    <>
                      <Input
                        percWidth={12}
                        name="codEndereco"
                        type="number"
                        description="Cód.Endereço"
                        value={enderecoSelecionado?.codendereco}
                        disabled
                      />
                      <Input
                        percWidth={8}
                        name="deposito"
                        type="number"
                        description="Depósito"
                        value={enderecoSelecionado?.deposito}
                        disabled
                      />
                      <Input
                        percWidth={8}
                        name="rua"
                        type="number"
                        description="Rua"
                        value={enderecoSelecionado?.rua}
                        disabled
                      />
                      <Input
                        percWidth={8}
                        name="predio"
                        type="number"
                        description="Prédio"
                        value={enderecoSelecionado?.predio}
                        disabled
                      />
                      <Input
                        percWidth={8}
                        name="nivel"
                        type="number"
                        description="Nível"
                        value={enderecoSelecionado?.nivel}
                        disabled
                      />
                      <Input
                        percWidth={8}
                        name="apto"
                        type="number"
                        description="Apto"
                        value={enderecoSelecionado?.apto}
                        disabled
                      />
                      <Input
                        percWidth={12}
                        id="capacidadeFoco"
                        name="capacidade"
                        type="number"
                        description="Capacidade"
                        onChange={(e) => {
                          setInputCapacidade(Number(e.target.value));
                        }}
                      />
                      <Input
                        percWidth={12}
                        name="percReposicao"
                        type="number"
                        description="% Resposição"
                        value={inputPercRep}
                        onChange={(e) => {
                          setInputPercRep(Number(e.target.value));
                        }}
                        onKeyUp={() => {
                          setInputPontoRep(
                            inputCapacidade * (inputPercRep / 100),
                          );
                        }}
                      />
                      <Input
                        percWidth={15}
                        name="pontoReposicao"
                        type="number"
                        description="Ponto Reposição"
                        value={inputPontoRep}
                        onChange={(e) => {
                          setInputPontoRep(Number(e.target.value));
                        }}
                        onKeyUp={() => {
                          setInputPercRep(
                            (inputPontoRep / inputCapacidade) * 100,
                          );
                        }}
                      />
                      <p>{message}</p>
                    </>
                  ) : (
                    <> </>
                  )}
                </>
              ) : (
                <>
                  {ocultarPesquisa ? (
                    <> </>
                  ) : (
                    <>
                      <Select
                        id="tipoPicking"
                        name="tipoPicking"
                        description="TIPO PICKING"
                        percWidth={9}
                        inputMode="search"
                        onChange={(e) => {
                          if (mostrarDadosPicking) {
                            setMostrarDadosPicking(false);
                          }

                          setDataPesquisa({
                            ...dataPesquisa,
                            tipoPicking: e.target.value as 'V' | 'M' | 'P',
                          });
                        }}
                      >
                        <option value="V">VENDA</option>
                        <option value="M">MÁSTER</option>
                        <option value="P">PRÉ-PICKING</option>
                      </Select>
                      <Select
                        id="tipoEndereco"
                        name="tipoEndereco"
                        description="TIPO ENDEREÇO"
                        percWidth={23}
                        inputMode="search"
                        defaultValue="SELECIONE O TIPO DO ENDEREÇO..."
                        onChange={(e) => {
                          setDataPesquisa({
                            ...dataPesquisa,
                            tipoEndereco: Number(e.target.value),
                          });
                        }}
                      >
                        <option value={0}>
                          SELECIONE O TIPO DO ENDEREÇO...
                        </option>
                        {cabecalho.tipoEndereco?.map((end) => (
                          <option key={end.codigo} value={end.codigo}>
                            {end.descricao}
                          </option>
                        ))}
                      </Select>
                      <Select
                        id="tipoEstrutura"
                        name="tipoEstrutura"
                        description="TIPO ESTRUTURA"
                        percWidth={23}
                        inputMode="search"
                        defaultValue="SELECIONE O TIPO DE ESTRUTURA..."
                        onChange={(e) => {
                          setDataPesquisa({
                            ...dataPesquisa,
                            tipoEstrutura: Number(e.target.value),
                          });
                        }}
                      >
                        <option value={0}>
                          SELECIONE O TIPO DE ESTRUTURA...
                        </option>
                        {cabecalho.tipoEstrutura?.map((end) => (
                          <option key={end.codigo} value={end.codigo}>
                            {end.descricao}
                          </option>
                        ))}
                      </Select>
                      <Input
                        percWidth={10}
                        name="codEnderecoPesquisa"
                        type="number"
                        description="Cód.Endereço"
                        onChange={(e) => {
                          setDataPesquisa({
                            ...dataPesquisa,
                            codEndereco: Number(e.target.value),
                          });
                        }}
                      />
                      <Input
                        percWidth={4}
                        name="ruaPesquisa"
                        type="number"
                        description="Rua"
                        onChange={(e) => {
                          setDataPesquisa({
                            ...dataPesquisa,
                            rua: Number(e.target.value),
                          });
                        }}
                      />
                      <Input
                        percWidth={5.5}
                        name="predioPesquisa"
                        type="number"
                        description="Prédio"
                        onChange={(e) => {
                          setDataPesquisa({
                            ...dataPesquisa,
                            predio: Number(e.target.value),
                          });
                        }}
                      />
                      <Input
                        percWidth={5}
                        name="nivelPesquisa"
                        type="number"
                        description="Nível"
                        onChange={(e) => {
                          setDataPesquisa({
                            ...dataPesquisa,
                            nivel: Number(e.target.value),
                          });
                        }}
                      />
                      <Input
                        percWidth={5}
                        name="aptoPesquisa"
                        type="number"
                        description="Apto"
                        onChange={(e) => {
                          setDataPesquisa({
                            ...dataPesquisa,
                            apto: Number(e.target.value),
                          });
                        }}
                      />
                      <button
                        type="button"
                        className="pesquisarButton"
                        onClick={() => pesquisaEnderecos()}
                        disabled={
                          dataPesquisa.tipoEndereco === undefined ||
                          dataPesquisa.tipoEndereco === 0 ||
                          dataPesquisa.tipoEstrutura === undefined ||
                          dataPesquisa.tipoEstrutura === 0
                        }
                      >
                        <FiSearch />
                        Pesquisar
                      </button>
                    </>
                  )}

                  {mostrarTabela ? (
                    <Tabela>
                      <DataTable
                        value={listaEnderecos}
                        selectionMode="single"
                        header="*Selecione o endereço clicando duas vezes*"
                        selection={enderecoSelecionado}
                        onSelectionChange={(e) => {
                          setEnderecoSelecionado(e.value);
                        }}
                        scrollable
                        paginator
                        rows={5}
                        scrollHeight="35vh"
                        style={{ width: '100%', margin: '6px 0px' }}
                        onRowDoubleClick={() => selecionouEndereco()}
                      >
                        <Column
                          field="codendereco"
                          header="Cód.End"
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
                          field="codTipoEndereco"
                          header="Tipo End"
                          style={{ width: '85px' }}
                          bodyStyle={{ textAlign: 'right' }}
                        />
                        <Column
                          field="descendereco"
                          header="Tipo Endereço"
                          style={{ width: '150px' }}
                        />
                        <Column
                          field="codTipoEstrutura"
                          header="Tipo Est"
                          style={{ width: '85px' }}
                          bodyStyle={{ textAlign: 'right' }}
                        />
                        <Column
                          field="descestrutura"
                          header="Tipo Estrutura"
                          style={{ width: '150px' }}
                        />
                        <Column
                          field="status"
                          header="Status"
                          style={{ width: '100px' }}
                        />
                      </DataTable>
                    </Tabela>
                  ) : (
                    <> </>
                  )}
                  {mostrarDadosPicking || edicaoPk ? (
                    <>
                      <Input
                        percWidth={12}
                        name="codEndereco"
                        type="number"
                        description="Cód.Endereço"
                        value={
                          edicaoPk
                            ? dataEdicaoPk?.codEndereco
                            : enderecoSelecionado?.codendereco
                        }
                        disabled
                      />
                      <Input
                        percWidth={8}
                        name="deposito"
                        type="number"
                        description="Depósito"
                        value={enderecoSelecionado?.deposito}
                        defaultValue={
                          edicaoPk ? dataEdicaoPk?.deposito : undefined
                        }
                        disabled
                      />
                      <Input
                        percWidth={8}
                        name="rua"
                        type="number"
                        description="Rua"
                        value={enderecoSelecionado?.rua}
                        defaultValue={edicaoPk ? dataEdicaoPk?.rua : undefined}
                        disabled
                      />
                      <Input
                        percWidth={8}
                        name="predio"
                        type="number"
                        description="Prédio"
                        value={enderecoSelecionado?.predio}
                        defaultValue={
                          edicaoPk ? dataEdicaoPk?.predio : undefined
                        }
                        disabled
                      />
                      <Input
                        percWidth={8}
                        name="nivel"
                        type="number"
                        description="Nível"
                        value={enderecoSelecionado?.nivel}
                        defaultValue={
                          edicaoPk ? dataEdicaoPk?.nivel : undefined
                        }
                        disabled
                      />
                      <Input
                        percWidth={8}
                        name="apto"
                        type="number"
                        description="Apto"
                        value={enderecoSelecionado?.apto}
                        defaultValue={edicaoPk ? dataEdicaoPk?.apto : undefined}
                        disabled
                      />
                      <Input
                        percWidth={15}
                        id="capacidadeFoco"
                        name="capacidade"
                        type="number"
                        description="Capacidade"
                        defaultValue={
                          edicaoPk ? dataEdicaoPk?.capacidade : undefined
                        }
                        onChange={(e) => {
                          setInputCapacidade(Number(e.target.value));
                          setInputPontoRep(
                            parseFloat(
                              (
                                Number(e.target.value) *
                                (inputPercRep / 100)
                              ).toFixed(0),
                            ),
                          );
                        }}
                      />
                      <Input
                        percWidth={12}
                        name="percReposicao"
                        type="number"
                        description="% Resposição"
                        value={inputPercRep}
                        onChange={(e) => {
                          setInputPercRep(Number(e.target.value));
                        }}
                        onKeyUp={() => {
                          setInputPontoRep(
                            parseFloat(
                              (inputCapacidade * (inputPercRep / 100)).toFixed(
                                0,
                              ),
                            ),
                          );
                        }}
                      />
                      <Input
                        percWidth={15}
                        name="pontoReposicao"
                        type="number"
                        description="Ponto Reposição"
                        value={inputPontoRep}
                        onChange={(e) => {
                          setInputPontoRep(Number(e.target.value));
                        }}
                        onKeyUp={() => {
                          setInputPercRep(
                            parseFloat(
                              ((inputPontoRep / inputCapacidade) * 100).toFixed(
                                2,
                              ),
                            ),
                          );
                        }}
                      />
                      <p>{message}</p>
                    </>
                  ) : (
                    <> </>
                  )}
                </>
              )}
            </>
          )}
        </Form>
      </Container>
    </DialogPrime>
  );
};

export default DialogDadosLog;
