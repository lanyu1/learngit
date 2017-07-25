/**
 * Created by Lty on 2017/6/26.
 */
import React from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import asyncRouter from '../../../../../util/asyncRouter';
const Service =asyncRouter(()=>(import('./Service')), ()=>(import('./../../../stores/organization/service/ServiceStore')));

const ServiceIndex=({ match })=>(
    <Switch>
      <Route exact path={match.url} component={Service} />
    </Switch>
);

export default ServiceIndex;
