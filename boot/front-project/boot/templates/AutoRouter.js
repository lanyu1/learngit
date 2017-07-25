import React from 'react';
import {
  Route,
  Switch
} from 'react-router-dom'
import asyncRouter from '../../util/asyncRouter'
{{asyncRoutes}}

function AutoRouter() {
  return (
      <Switch>
        {{routes}}
      </Switch>
  );
}

export default AutoRouter;