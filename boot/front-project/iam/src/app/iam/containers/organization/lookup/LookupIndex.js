/**
 * Created by cheon on 6/28/17.
 */

import React from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import asyncRouter from '../../../../../util/asyncRouter';
const Lookup = asyncRouter(()=>(import('./Lookup')), ()=>(import('../../../stores/organization/lookup/LookupStore')));
const EditLookup = asyncRouter(()=>(import('./EditLookup')), ()=>import(('../../../stores/organization/lookup/LookupStore')));
const CreateLookup = asyncRouter(()=>(import('./CreateLookup')), ()=>import(('../../../stores/organization/lookup/LookupStore')));

const RoleIndex=({ match })=>(
  <Switch>
    <Route exact path={match.url} component={Lookup} />
    <Route path={`${match.url}/edit/:id`} component={EditLookup} />
    <Route path={`${match.url}/create`} component={CreateLookup} />
  </Switch>
);

export default RoleIndex;
