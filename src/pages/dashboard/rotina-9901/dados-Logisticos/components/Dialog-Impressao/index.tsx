import React, { useState, useCallback } from 'react';
import { FiCheck, FiX } from 'react-icons/fi';
import { Dialog as DialogPrime } from 'primereact/dialog';

import { Container, Footer, Divisor, CheckRadio } from './styles';

interface DialogProps {
  title: string;
  executar: Function;
}

interface ImpressaoProps {
  master: boolean;
  venda: boolean;
  auxiliar: boolean;
  alternativo: boolean;
}

const DialogImpressao: React.FC<DialogProps> = (props) => {
  const { title, executar } = props;

  const [action, setAction] = useState(false);
  const [master, setMaster] = useState(false);
  const [venda, setVenda] = useState(false);
  const [auxiliar, setAuxiliar] = useState(false);
  const [alternativo, setAlternativo] = useState(false);

  const footer = useCallback(() => {
    const propsImpressao = {
      master,
      venda,
      auxiliar,
      alternativo,
    } as ImpressaoProps;

    return (
      <Footer>
        <button
          type="submit"
          onClick={() => executar(true, propsImpressao)}
          disabled={!master && !venda && !auxiliar && !alternativo}
        >
          <FiCheck /> Confirmar
        </button>
        <button type="button" onClick={() => executar(false)}>
          <FiX /> Cancelar
        </button>
      </Footer>
    );
  }, [executar, master, venda, auxiliar, alternativo]);

  return (
    <DialogPrime
      header={title}
      visible
      style={{ width: '30vw', fontWeight: 'bold', fontSize: '16px' }}
      onHide={() => setAction(action)}
      blockScroll
      footer={footer()}
      closable={false}
    >
      <Container>
        <CheckRadio>
          <h1>Selecione o que deseja imprimir:</h1>
          <label htmlFor="master">
            <input
              id="master"
              name="master"
              type="radio"
              checked={master}
              onChange={() => {
                if (master) {
                  setMaster(false);
                } else {
                  setMaster(true);
                  setVenda(false);
                  setAuxiliar(false);
                  setAlternativo(false);
                }
              }}
            />
            Etiqueta Código de Barras Master
          </label>
          <Divisor />
          <label htmlFor="venda">
            <input
              id="venda"
              name="venda"
              type="radio"
              checked={venda}
              onChange={() => {
                if (venda) {
                  setVenda(false);
                } else {
                  setVenda(true);
                  setMaster(false);
                  setAuxiliar(false);
                  setAlternativo(false);
                }
              }}
            />
            Etiqueta Código de Barras Venda
          </label>
          <Divisor />
          <label htmlFor="auxiliar">
            <input
              id="auxiliar"
              name="auxiliar"
              type="radio"
              checked={auxiliar}
              onChange={() => {
                if (auxiliar) {
                  setAuxiliar(false);
                } else {
                  setAuxiliar(true);
                  setMaster(false);
                  setVenda(false);
                  setAlternativo(false);
                }
              }}
            />
            Etiqueta Código de Barras Embalagem Auxiliar
          </label>
          <Divisor />
          <label htmlFor="alternativo">
            <input
              id="alternativo"
              name="alternativo"
              type="radio"
              checked={alternativo}
              onChange={() => {
                if (alternativo) {
                  setAlternativo(false);
                } else {
                  setAlternativo(true);
                  setMaster(false);
                  setVenda(false);
                  setAuxiliar(false);
                }
              }}
            />
            Etiqueta Código de Barras Alternativo
          </label>
        </CheckRadio>
      </Container>
    </DialogPrime>
  );
};

export default DialogImpressao;
