/**
 * Created by cheon on 6/26/17.
 */

import React from 'react';
import {
    Route,
    Switch
} from 'react-router-dom';
import asyncRouter from '../../../../../util/asyncRouter';
const Organization =asyncRouter(()=>(import('./Organization')), ()=>import('../../../stores/organization/organization/OrganizationStore'));

const OrganizationIndex=({ match })=>(
    <Switch>
        <Route exact path={match.url} component={Organization} />
    </Switch>
);

export default OrganizationIndex;
