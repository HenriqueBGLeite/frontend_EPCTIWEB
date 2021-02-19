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
    background: #ffd700;
  }
  .Toastify__toast--error {
    background: #ff0000;
  }
`;
