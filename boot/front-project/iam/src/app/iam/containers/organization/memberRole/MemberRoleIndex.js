/**
 * Created by Lty on 2017/6/26.
 */
import React from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import asyncRouter from '../../../../../util/asyncRouter';

const OrganizationMemberRole =asyncRouter(()=>import('./MemberRole'), ()=>import('./../../../stores/organization/memberRole/MemberRoleStore'));
const OrganizationMemberRoleIndex=({ match })=>(
    <Switch>
      <Route exact path={match.url} component={OrganizationMemberRole} />
    </Switch>
);

export default OrganizationMemberRoleIndex;
