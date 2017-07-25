/**
 * Created by song on 2017/6/27.
 */

import React from 'react';
import {
    Route,
    Switch
} from 'react-router-dom';
import asyncRouter from '../../../../../util/asyncRouter';
const Token = asyncRouter(()=>import("./Token"), ()=>import('../../../stores/organization/token/TokenStore'));

const TokenIndex=({ match })=>(
    <Switch>
        <Route exact path={match.url} component={Token} />
    </Switch>
);

export default TokenIndex;