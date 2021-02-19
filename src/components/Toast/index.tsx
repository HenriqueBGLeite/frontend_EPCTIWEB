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
      toast.success(message);
      break;
    case 'alert':
      toast.warn(message, { autoClose: false });
      break;
    case 'error':
      toast.error(message, { autoClose: false });
      break;
    default:
      toast.info(message);
  }
};

const ToastAnimated: React.FC = () => (
  <Toast position="top-center" autoClose={4000} newestOnTop closeOnClick />
);

export { ToastAnimated, createMessage };
