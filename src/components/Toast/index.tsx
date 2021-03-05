import React from 'react';
import { toast } from 'react-toastify';

import { Toast } from './style';

interface ToastDTO {
  type?: 'success' | 'alert' | 'error' | 'info';
  message: string;
}

const createMessage = ({ type, message }: ToastDTO): void => {
  switch (type) {
    case 'success':
      toast.success(message, { autoClose: 4000 });
      break;
    case 'alert':
      toast.warn(message);
      break;
    case 'error':
      toast.error(message);
      break;
    default:
      toast.info(message);
  }
};

const ToastAnimated: React.FC = () => (
  <Toast
    style={{ width: '94%', marginLeft: '3.3em' }}
    position="top-left"
    autoClose={false}
    newestOnTop
    closeOnClick
  />
);

export { ToastAnimated, createMessage };
