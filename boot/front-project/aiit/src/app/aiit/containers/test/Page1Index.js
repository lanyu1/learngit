//Page1Index.js文件
import React from 'react';
import {
    Route,
    Switch
} from 'react-router-dom';
import asyncRouter from '../../../../util/asyncRouter';


const Page1 = asyncRouter(()=>(import('./Page1')));
const Page1Index=({ match })=>(
    <Switch>
        <Route exact path={match.url} component={Page1} />
    </Switch>
);

export default Page1Index;