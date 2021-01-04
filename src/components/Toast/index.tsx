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
      toast.warn(message);
      break;
    case 'error':
      toast.error(message);
      break;
    default:
      toast.info(message);
  }
};

const ToastAnimated: React.FC = () => <Toast />;

export { ToastAnimated, createMessage };
