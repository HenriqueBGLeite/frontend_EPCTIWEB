import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { ToastAnimated } from './components/Toast';

import GlobalStyle from './styles/global';
import 'react-toastify/dist/ReactToastify.min.css';

import AppProvider from './hooks';

import Routes from './routes';

const App: React.FC = () => {
  return (
    <Router>
      <AppProvider>
        <ToastAnimated />
        <Routes />
      </AppProvider>

      <GlobalStyle />
    </Router>
  );
};

export default App;
