/**
 * Created by YANG on 2017/7/3.
 */

import React from 'react';
import {Route, Switch} from 'react-router-dom';
import asyncRouter from '../../../../../util/asyncRouter';
const DeploymentAdmin = asyncRouter(()=>import('./DeploymentAdmin'),()=>import('../../../stores/organization/deploymentAdmin/DeploymentAdminStore'));
const CreateDeploymentAdmin = asyncRouter(()=>import('./CreateDeploymentAdmin'),()=>import('../../../stores/organization/deploymentAdmin/DeploymentAdminStore'));
const EditDeploymentAdmin = asyncRouter(()=>import('./EditDeploymentAdmin'),()=>import('../../../stores/organization/deploymentAdmin/DeploymentAdminStore'));
const DeploymentVersion = asyncRouter(()=>import('./DeploymentVersion'),()=>import('../../../stores/organization/deploymentAdmin/DeploymentAdminStore'));
const DeploymentDetailAdmin = asyncRouter(()=>import('./DeploymentDetailAdmin'),()=>import('../../../stores/organization/deployment/RunDeploymentStore'));
const CreateDeploymentVersion=asyncRouter(()=>import('./CreateDeploymentVersion'),()=>import('../../../stores/organization/deploymentAdmin/AdminCreateVersionStore'));
const EditDeploymentVersion=asyncRouter(()=>import('./EditDeploymentVersion'),()=>import('../../../stores/organization/deploymentAdmin/AdminEditVersionStore'));
const AdminLabelIndex = asyncRouter(()=>import('../adminDeploymentLabel/AdminLabelIndex'));
const DeploymentIndex=({ match })=>(
  <Switch>
    <Route exact path={`${match.url}`} component={DeploymentAdmin} />
    <Route exact path={`${match.url}/new`} component={CreateDeploymentAdmin} />
    <Route exact path={`${match.url}/edit/:id`} component={EditDeploymentAdmin} />
    <Route exact path={`${match.url}/:id/version`} component={DeploymentVersion} />
    <Route exact path={`${match.url}/detail/:id`} component={DeploymentDetailAdmin} />
    <Route path={`${match.url}/:deploymentId/version/new`} component={CreateDeploymentVersion} />
    <Route path={`${match.url}/:deploymentId/version/edit/:versionId`} component={EditDeploymentVersion} />
  <Route path={`${match.url}/label`} component={AdminLabelIndex} />
  </Switch>
);

export default DeploymentIndex;
