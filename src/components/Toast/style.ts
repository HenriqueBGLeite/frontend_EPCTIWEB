import styled from 'styled-components';

import { ToastContainer } from 'react-toastify';

export const Toast = styled(ToastContainer)`
  .Toastify__toast--info {
    background: #0000ff;
  }
  .Toastify__toast--success {
    background: #008000;
  }
  .Toastify__toast--warning {
    color: #000;
    background: #ffd700;

    button {
      color: #000;
    }
  }
  .Toastify__toast--error {
    background: #ff0000;
  }
`;
