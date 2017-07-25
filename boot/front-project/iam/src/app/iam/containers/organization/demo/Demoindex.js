//DemoIndex.js文件
import React from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import asyncRouter from '../../../../../util/asyncRouter';
//DemoIndex.js文件中异步加载DemoStore
const Demo = asyncRouter(()=>import("./Demo"), ()=>import('../../../stores/organization/demo/DemoStore'));

const DemoIndex=({ match })=>(
  <Switch>
    <Route exact path={match.url} component={Demo} />
  </Switch>
);

export default DemoIndex;
