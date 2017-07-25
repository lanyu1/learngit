/**
 * Created by cheon on 6/27/17.
 */

import React from 'react';
import {
    Route,
    Switch
} from 'react-router-dom';
import asyncRouter from '../../../../../util/asyncRouter';
const Role = asyncRouter(()=>(import('./Role')), ()=>(import('../../../stores/organization/role/RoleStore')));
const EditRole = asyncRouter(()=>(import('./EditRole')), ()=>import(('../../../stores/organization/role/RoleStore')));

const RoleIndex=({ match })=>(
    <Switch>
        <Route exact path={match.url} component={Role} />
        <Route path={`${match.url}/edit/:id`} component={EditRole} />
    </Switch>
);

export default RoleIndex;
