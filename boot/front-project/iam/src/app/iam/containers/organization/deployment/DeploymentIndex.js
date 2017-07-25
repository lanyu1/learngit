/**
 * Created by YANG on 2017/7/3.
 */

import React from 'react';
import {Route, Switch} from 'react-router-dom';
import asyncRouter from '../../../../../util/asyncRouter';
const Deployment = asyncRouter(()=>import('./Deployment'),()=>import('../../../stores/organization/deployment/DeploymentStore'));
const CreateDeployment = asyncRouter(()=>import('./CreateDeployment'),()=>import('../../../stores/organization/deployment/DeploymentStore'));
const EditDeployment = asyncRouter(()=>import('./EditDeployment'),()=>import('../../../stores/organization/deployment/DeploymentStore'));
const DeploymentVersion = asyncRouter(()=>import('./DeploymentVersion'),()=>import('../../../stores/organization/deployment/DeploymentStore'));
const CreateDeploymentVersion=asyncRouter(()=>import('./CreateDeploymentVersion'),()=>import('../../../stores/organization/deployment/CreateVersionStore'));
const EditDeploymentVersion=asyncRouter(()=>import('./EditDeploymentVersion'),()=>import('../../../stores/organization/deployment/EditVersionStore'));
const DeploymentDetail =asyncRouter(()=>import('./DeploymentDetail'),()=>import('../../../stores/organization/deployment/RunDeploymentStore'));

const DeploymentIndex=({ match })=>(
  <Switch>
    <Route exact path={`${match.url}`} component={Deployment} />
    <Route exact path={`${match.url}/new`} component={CreateDeployment} />
    <Route exact path={`${match.url}/edit/:id`} component={EditDeployment} />
    <Route exact path={`${match.url}/:id/version`} component={DeploymentVersion} />
    <Route exact path={`${match.url}/detail/:id`} component={DeploymentDetail} />
    <Route path={`${match.url}/:deploymentId/version/new`} component={CreateDeploymentVersion} />
    <Route path={`${match.url}/:deploymentId/version/edit/:versionId`} component={EditDeploymentVersion} />
  </Switch>
);

export default DeploymentIndex;
