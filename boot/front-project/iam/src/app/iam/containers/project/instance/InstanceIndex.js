/**
 * Created by Wangke on 2017/7/6.
 */


import React from 'react';
import {Route, Switch} from 'react-router-dom';
import asyncRouter from '../../../../../util/asyncRouter';

const DeploymentInstance = asyncRouter(()=>import('./DeploymentInstance'),()=>import('../../../stores/project/instance/DeploymentInstanceStore'));
const DeploymentInstanceDetail = asyncRouter(()=>import('./DeploymentInstanceDetail'),()=>import('../../../stores/project/instance/DeploymentInstanceStore'));
const InstanceHistory = asyncRouter(()=>import('./InstanceHistory'),()=>import('../../../stores/project/instance/DeploymentInstanceStore'));

const InstanceIndex=({ match })=>(
  <Switch>
    <Route exact path={`${match.url}`} component={DeploymentInstance} />
    <Route exact path={`${match.url}/detail/:id`} component={DeploymentInstanceDetail} />
    <Route exact path={`${match.url}/:instanceId/history/:id`} component={InstanceHistory} />
  </Switch>
);

export default InstanceIndex;
