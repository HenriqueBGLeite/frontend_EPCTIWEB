import React, { useState, useCallback } from 'react';
import { FiCheck, FiX } from 'react-icons/fi';
import { Dialog as DialogPrime } from 'primereact/dialog';

import { Container, Footer } from './styles';

interface DialogProps {
  title: string;
  message?: string;
  executar: Function;
}

const DialogGenerico: React.FC<DialogProps> = (props) => {
  const { title, message, executar } = props;

  const [action, setAction] = useState(false);

  const footer = useCallback(() => {
    return (
      <Footer>
        <button type="submit" onClick={() => executar(true)}>
          <FiCheck />
          Confirmar
        </button>
        <button id="cancelar" type="button" onClick={() => executar(false)}>
          <FiX />
          Cancelar
        </button>
      </Footer>
    );
  }, [executar]);

  return (
    <DialogPrime
      header={title}
      visible
      style={{ width: '40vw', fontWeight: 'bold', fontSize: '16px' }}
      onHide={() => setAction(action)}
      blockScroll
      footer={footer()}
      closable={false}
    >
      <Container>
        <p>{message}</p>
      </Container>
    </DialogPrime>
  );
};

export default DialogGenerico;
