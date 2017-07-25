/**
 * Created by YANG on 2017/6/29.
 */

import React from 'react';
import {Route, Switch} from 'react-router-dom';
import asyncRouter from '../../../../../util/asyncRouter';
const Catalog = asyncRouter(()=>import('./Catalog'),()=>import('../../../stores/organization/catalog/CatalogStore'));
const EditCatalog=asyncRouter(()=>import('./EditCatalog'));
const CreateCatalog = asyncRouter(()=>import('./CreateCatalog'),()=>import('../../../stores/organization/catalog/CatalogStore'));

const CatalogIndex=({ match })=>(
  <Switch>
    <Route exact path={`${match.url}`} component={Catalog} />
    <Route path={`${match.url}/edit`} component={EditCatalog} />
    <Route exact path={`${match.url}/new`} component={CreateCatalog} />
  </Switch>
);

export default CatalogIndex;
