/**
 * Created by jaywoods on 2017/6/29.
 */
import React from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import asyncRouter from '../../../../../util/asyncRouter';

const Client = asyncRouter(()=>import('./Client'),()=>import('../../../stores/organization/adminClient/AdminClientStore'));
const CreateClient = asyncRouter(()=>import('./CreateClient'),()=>import('../../../stores/organization/adminClient/AdminClientStore'));
const EditClient = asyncRouter(()=>import('./EditClient'),()=>import('../../../stores/organization/adminClient/AdminClientStore'));

const ClientIndex=({ match })=>(
  <Switch>
    <Route exact path={match.url} component={Client} />
    <Route path={`${match.url}/new`} component={CreateClient} />
    <Route path={`${match.url}/edit/:id`} component={EditClient} />
  </Switch>
);

export default ClientIndex;
