/**
 * Created by song on 2017/6/27.
 */

import React from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import asyncRouter from '../../../../../util/asyncRouter';
const Language = asyncRouter(()=>import("./Language"), ()=>import('../../../stores/project/language/LanguageStore'));
const EditLanguage = asyncRouter(()=>import("./EditLanguage"), ()=>import('../../../stores/project/language/LanguageStore'));

const LanguageIndex=({ match })=>(
  <Switch>
    <Route exact path={match.url} component={Language} />
    <Route exact path={`${match.url}/edit/:code`} component={EditLanguage} />
  </Switch>
);

export default LanguageIndex;
