/**
 * Created by hand on 2017/7/12.
 */


import React from 'react';
import {Route, Switch} from 'react-router-dom';
import asyncRouter from '../../../../../util/asyncRouter';
const AdminLabel = asyncRouter(()=>import('./AdminLabel'),()=>import('../../../stores/organization/adminLabelStore/AdminLabelStore'));
const AdminLabels = asyncRouter(()=>import('./AdminLabels'),()=>import('../../../stores/organization/adminLabelStore/AdminLabelStore'));

const AdminLadelIndex=({ match })=>(
  <Switch>
    <Route exact path={`${match.url}`} component={AdminLabel} />
    <Route  path={`${match.url}/labels/:id`} component={AdminLabels} />
  </Switch>
);

export default AdminLadelIndex;
