//Page1Index.js文件
import React from 'react';
import {
    Route,
    Switch
} from 'react-router-dom';
import asyncRouter from '../../../../util/asyncRouter';


const Page2 = asyncRouter(()=>(import('./Page2')));
const Page2Index=({ match })=>(
    <Switch>
        <Route exact path={match.url} component={Page2} />
    </Switch>
);

export default Page2Index;