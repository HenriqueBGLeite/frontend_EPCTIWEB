import React, { useState, useCallback, useRef, KeyboardEvent } from 'react';
import { FiCheck, FiX } from 'react-icons/fi';
import { Dialog as DialogPrime } from 'primereact/dialog';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import Input from '../../../../../components/Input';

import { Container, Divisor, Footer } from './styles';

interface DialogProps {
  endOrig: {
    deposito: number;
    rua: number;
    predio: number;
    nivel: number;
    apto: number;
    qtDisp: number;
    qtBloq: number;
    qtDispCx: number;
  };
  endDestino: {
    deposito: number;
    rua: number;
    predio: number;
    nivel: number;
    apto: number;
  };
  qtunitcx: number;
  executar: Function;
}

const DialogTransferencia: React.FC<DialogProps> = (props) => {
  const { endOrig, endDestino, qtunitcx, executar } = props;
  const formRef = useRef<FormHandles>(null);
  const [unidade, setUnidade] = useState(0);
  const [caixa, setCaixa] = useState(0);
  const [total, setTotal] = useState(0);

  const [action, setAction] = useState(false);

  const footer = useCallback(() => {
    return (
      <Footer>
        <button
          id="confirmar"
          type="submit"
          onClick={() => executar(true, total)}
        >
          <FiCheck /> Confirmar
        </button>
        <button type="button" onClick={() => executar(false)}>
          <FiX /> Cancelar
        </button>
      </Footer>
    );
  }, [executar, total]);

  function focusCampo(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.currentTarget.id === 'qtUn' && event.key === 'Enter') {
      document.getElementById('qtCx')?.focus();
    }
    if (event.currentTarget.id === 'qtCx' && event.key === 'Enter') {
      document.getElementById('confirmar')?.focus();
    }
  }

  return (
    <DialogPrime
      showHeader={false}
      visible
      style={{ width: '40vw', fontWeight: 'bold', fontSize: '16px' }}
      onHide={() => setAction(action)}
      blockScroll
      footer={footer()}
      closable={false}
    >
      <Container>
        <Form ref={formRef} onSubmit={() => executar(true, total)}>
          <h3>Dados do endereço de origem</h3>
          <Divisor />
          <Input
            percWidth={19}
            name="depOrig"
            value={endOrig.deposito}
            description="Depósito"
            disabled
          />
          <Input
            percWidth={18}
            name="ruaOrig"
            value={endOrig.rua}
            description="Rua"
            disabled
          />
          <Input
            percWidth={19}
            name="predioOrig"
            value={endOrig.predio}
            description="Prédio"
            disabled
          />
          <Input
            percWidth={18}
            name="nivelOrig"
            value={endOrig.nivel}
            description="Nível"
            disabled
          />
          <Input
            percWidth={19}
            name="aptoOrig"
            value={endOrig.apto}
            description="Apto"
            disabled
          />
          <Divisor />
          <h3>Dados do endereço de destino</h3>
          <Divisor />
          <Input
            percWidth={19}
            name="depDestino"
            value={endDestino.deposito}
            description="Depósito"
            disabled
          />
          <Input
            percWidth={18}
            name="ruaDestino"
            value={endDestino.rua}
            description="Rua"
            disabled
          />
          <Input
            percWidth={19}
            name="predioDestino"
            value={endDestino.predio}
            description="Prédio"
            disabled
          />
          <Input
            percWidth={18}
            name="nivelDestino"
            value={endDestino.nivel}
            description="Nível"
            disabled
          />
          <Input
            percWidth={19}
            name="aptoDestino"
            value={endDestino.apto}
            description="Apto"
            disabled
          />
          <Divisor />
          <h3>Quantidades</h3>
          <Divisor />
          <Input
            percWidth={32}
            name="qtDisp"
            value={endOrig.qtDisp}
            description="Qt. Disp"
            disabled
          />
          <Input
            percWidth={32}
            name="qtBloq"
            value={endOrig.qtBloq}
            description="Qt. Bloq"
            disabled
          />
          <Input
            percWidth={31}
            name="qtDispCx"
            value={endOrig.qtDispCx}
            description="Qt. Disp. Cx"
            disabled
          />
          <Divisor />
          <Input
            focus
            percWidth={49}
            id="qtUn"
            name="qtUn"
            description="Quant. Unidade"
            onChange={(e) => {
              setUnidade(Number(e.target.value));
              setTotal(caixa + Number(e.target.value));
            }}
            onKeyPress={(e) => focusCampo(e)}
          />
          <Input
            percWidth={48}
            id="qtCx"
            name="qtCx"
            description="Quant. Caixa"
            onChange={(e) => {
              const valor = Number(e.target.value) * qtunitcx;

              setCaixa(valor);
              setTotal(unidade + valor);
            }}
            onKeyPress={(e) => focusCampo(e)}
          />
        </Form>
      </Container>
    </DialogPrime>
  );
};

export default DialogTransferencia;
