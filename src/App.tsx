import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';

import GlobalStyle from './styles/global';
import 'react-toastify/dist/ReactToastify.min.css';

import AppProvider from './hooks';

import Routes from './routes';

const App: React.FC = () => {
  return (
    <Router>
      <AppProvider>
        <ToastContainer
          position="top-center"
          autoClose={4000}
          newestOnTop
          closeOnClick
        />
        <Routes />
      </AppProvider>

      <GlobalStyle />
    </Router>
  );
};

export default App;
