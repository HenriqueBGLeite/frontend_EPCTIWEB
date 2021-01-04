import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

import SignIn from '../pages/SignIn';
import Dashboard from '../pages/dashboard';
import Rotina9950 from '../pages/dashboard/rotina-9950';
import Rotina9901 from '../pages/dashboard/rotina-9901';
import DadosLogistico from '../pages/dashboard/rotina-9901/dados-Logisticos';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={SignIn} />

    <Route path="/dashboard" exact component={Dashboard} isPrivate />

    {/* LOGISITICA -> CADASTRO */}
    <Route
      path="/dashboard/dados-logisticos"
      component={Rotina9901}
      exact
      isPrivate
    />

    <Route
      path="/dashboard/dados-logisticos/editar"
      component={DadosLogistico}
      isPrivate
    />

    {/* LOGISITICA -> EXPEDIÇÃO */}
    <Route path="/dashboard/wms-grupo" component={Rotina9950} isPrivate />
  </Switch>
);

export default Routes;
