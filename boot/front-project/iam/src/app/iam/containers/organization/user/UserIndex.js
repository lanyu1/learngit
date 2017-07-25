/**
 * Created by jaywoods on 2017/6/26.
 */
import React from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import asyncRouter from '../../../../../util/asyncRouter';
const ModifyPassword=asyncRouter(()=>import('./ModifyPassword'),()=>import('../../../stores/organization/user/UserStore'));
const UserInfo=asyncRouter(()=>import('./UserInfo'),()=>import('../../../stores/organization/user/UserStore'));
const User = asyncRouter(()=>import('./User'),()=>import('../../../stores/organization/user/UserStore'));
const CreateUser = asyncRouter(()=>import('./CreateUser'),()=>import('../../../stores/organization/user/CreateUserStore'));
const EditUser = asyncRouter(()=>import('./EditUser'),()=>import('../../../stores/organization/user/CreateUserStore'));

const UserIndex=({ match })=>(
    <Switch>
      <Route exact path={match.url} component={User} />
      <Route path={`${match.url}/modifyPwd`} component={ModifyPassword} />
      <Route path={`${match.url}/info`} component={UserInfo} />
      <Route path={`${match.url}/new`} component={CreateUser} />
      <Route path={`${match.url}/edit/:id`} component={EditUser} />
    </Switch>
);

export default UserIndex;
