/**
 * Created by Lty on 2017/6/26.
 */
import React from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import asyncRouter from '../../../../../util/asyncRouter';

const Excel =asyncRouter(()=>import('./Excel'), ()=>import('./../../../stores/organization/excel/ExcelStore'));
const ExcelIndex=({ match })=>(
    <Switch>
      <Route exact path={match.url} component={Excel} />
    </Switch>
);

export default ExcelIndex;
