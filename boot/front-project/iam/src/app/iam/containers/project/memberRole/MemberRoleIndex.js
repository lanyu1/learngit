/**
 * Created by Lty on 2017/6/26.
 */
import React from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import asyncRouter from '../../../../../util/asyncRouter';
const ProjectMemberRole =asyncRouter(()=>import('./MemberRole.js'), () =>import('./../../../stores/project/memberRole/MemberRoleStore'));
// const ProjectMemberRole =asyncRouter(()=>import('./a'));
const ProjectMemberRoleIndex=({ match })=>(
    <Switch>
      <Route exact path={match.url} component={ProjectMemberRole} />
    </Switch>
);

export default ProjectMemberRoleIndex;
