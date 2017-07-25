/**
 * Created by hand on 2017/6/27.
 */

import React from 'react';
import {
    Route,
    Switch
} from 'react-router-dom';
import asyncRouter from '../../../../../util/asyncRouter';
const Project = asyncRouter(()=>import('./Project'), ()=>import('../../../stores/organization/project/ProjectStore'));
const CreateProject  = asyncRouter(()=>(import("./CreateProject")), ()=>import('../../../stores/organization/project/ProjectStore'));
const EditProject = asyncRouter(()=>import("./EditProject"), ()=>import('../../../stores/organization/project/ProjectStore'));

const ProjectIndex=({ match })=>(
    <Switch>
        <Route exact path={match.url} component={Project} />
        <Route path={`${match.url}/new`} component={CreateProject} />
        <Route path={`${match.url}/edit`} component={EditProject} />
    </Switch>
);

export default ProjectIndex;