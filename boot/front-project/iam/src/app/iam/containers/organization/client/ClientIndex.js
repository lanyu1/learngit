/**
 * Created by jaywoods on 2017/6/25.
 */
import React from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import asyncRouter from '../../../../../util/asyncRouter';
const Clients =asyncRouter(()=>import('./Clients'),()=>import('../../../stores/organization/client/ClientStore'));
const CreateClient=asyncRouter(()=>import("./CreateClient"),()=>import('../../../stores/organization/client/ClientStore'));
const EditClient=asyncRouter(()=>import("./EditClient"),()=>import('../../../stores/organization/client/ClientStore'));

const ClientIndex=({ match })=>(
    <Switch>
      <Route exact path={match.url} component={Clients} />
      <Route path={`${match.url}/new`} component={CreateClient} />
      <Route path={`${match.url}/edit/:id`} component={EditClient} />
    </Switch>
);

export default ClientIndex;