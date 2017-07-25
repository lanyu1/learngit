//Page1Index.js文件
import React from 'react';
import {
    Route,
    Switch
} from 'react-router-dom';
import asyncRouter from '../../../../../util/asyncRouter';

const HomePage = asyncRouter(()=>(import('./homePage.js')));
const HomeIndex=({ match })=>(
    <Switch>
        <Route exact path={match.url} component={HomePage} />
    </Switch>
);

export default HomeIndex;