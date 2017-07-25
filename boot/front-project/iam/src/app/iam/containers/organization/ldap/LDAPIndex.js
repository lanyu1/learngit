/**
 * Created by song on 2017/6/26.
 */
import React from 'react';
import {
    Route,
    Switch
} from 'react-router-dom';
import asyncRouter from '../../../../../util/asyncRouter';

const EditLDAP = asyncRouter(()=>import("./EditLDAP"), ()=>import('../../../stores/organization/ldap/LDAPStore'));

const LDAPIndex=({ match })=>(
    <Switch>
        <Route exact path={match.url} component={EditLDAP} />
    </Switch>
);

export default LDAPIndex;
