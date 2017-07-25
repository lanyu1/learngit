/**
 * Created by song on 2017/6/28.
 */

import React from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import asyncRouter from '../../../../../util/asyncRouter';
const AdminOrganization =asyncRouter(()=>import('./AdminOrganization'),()=>import('../../../stores/organization/adminOrganization/AdminOrganizationStore'));
const CreateAdminOrganization=asyncRouter(()=>import("./CreateAdminOrganization"),()=>import('../../../stores/organization/adminOrganization/AdminOrganizationStore'));
const EditAdminOrganization=asyncRouter(()=>import("./EditAdminOrganization"),()=>import('../../../stores/organization/adminOrganization/AdminOrganizationStore'));
const AdminOrganizationLabel=asyncRouter(()=>import("./AdminOrganizationLabel"),()=>import('../../../stores/organization/adminOrganization/LabelStore'));

const AdminOrganizationIndex=({ match })=>(
  <Switch>
    <Route exact path={match.url} component={AdminOrganization} />
    <Route path={`${match.url}/new`} component={CreateAdminOrganization} />
    <Route path={`${match.url}/edit/:organizationId`} component={EditAdminOrganization} />
    <Route path={`${match.url}/label/:organizationId`} component={AdminOrganizationLabel} />
  </Switch>
);

export default AdminOrganizationIndex;
