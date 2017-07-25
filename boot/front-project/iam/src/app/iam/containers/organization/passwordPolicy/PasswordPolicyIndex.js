/**
 * Created by jaywoods on 2017/6/26.
 */
import React from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import asyncRouter from '../../../../../util/asyncRouter';
/*const PasswordPolicy =asyncRouter(()=>import('./PasswordPolicy'),()=>import('../../../stores/organization/passwordPolicy/PasswordPolicyStore'));*/
const UpdatePasswordPolicy =asyncRouter(()=>import('./UpdatePasswordPolicy'),()=>import('../../../stores/organization/passwordPolicy/PasswordPolicyStore'));
const PasswordPolicyIndex=({ match })=>(
    <Switch>
      <Route exact path={match.url} component={UpdatePasswordPolicy} />
     {/* <Route  path={`${match.url}/edit`} component={UpdatePasswordPolicy} />
      <Route  path={`${match.url}/new`} component={UpdatePasswordPolicy} />*/}
    </Switch>
);

export default PasswordPolicyIndex;
