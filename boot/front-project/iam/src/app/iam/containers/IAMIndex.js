import React from 'react';
import 'babel-polyfill';
import {
  Route,
  Switch
} from 'react-router-dom'
import {inject} from 'mobx-react'

import asyncRouter from '../../../util/asyncRouter'
import asyncLocaleProvider from '../../../util/asyncLocaleProvider'

const ClientIndex = asyncRouter(() => import('./organization/client/ClientIndex'));

const PasswordPolicyIndex = asyncRouter(() => import('./organization/passwordPolicy/PasswordPolicyIndex'));
const LDAPIndex = asyncRouter(() => import('./organization/ldap/LDAPIndex'));
const OrganizationIndex = asyncRouter(() => import('./organization/organization/OrganizationIndex'));
const ServiceIndex = asyncRouter(() => import('./organization/service/ServiceIndex'));
const TokenIndex = asyncRouter(() => import('./organization/token/TokenIndex'));
const Home = asyncRouter(() => import('./Home'));
const UserIndex = asyncRouter(() => import('./organization/user/UserIndex'));
const ExcelIndex = asyncRouter(() => import('./organization/excel/ExcelIndex'));
const RoleIndex = asyncRouter(() => import('./organization/role/RoleIndex'));
const LookupIndex = asyncRouter(() => import('./organization/lookup/LookupIndex'));
const LanguageIndex = asyncRouter(() => import('./project/language/LanguageIndex'));
const ProjectIndex=asyncRouter(() => import('./organization/project/ProjectIndex'));
const AdminClientIndex = asyncRouter(() => import('./organization/adminClient/ClientIndex'));
const AdminOrganizationIndex = asyncRouter(() => import('./organization/adminOrganization/AdminOrganizationIndex'));
const OriganizationMemberRoleIndex = asyncRouter(() => import('./organization/memberRole/MemberRoleIndex'));
const CatalogIndex = asyncRouter(()=>import('./organization/catalog/CatalogIndex'));
const ProjectMemberRoleIndex = asyncRouter(() => import('./project/memberRole/MemberRoleIndex'));
const DeploymentIndex = asyncRouter(()=>import('./organization/deployment/DeploymentIndex'));
const DeploymentAdminIndex = asyncRouter(()=>import('./organization/deploymentAdmin/DeploymentAdminIndex'));
const InstanceIndex = asyncRouter(() => import('./project/instance/InstanceIndex'));
const DemoIndex = asyncRouter(()=>import('./organization/demo/DemoIndex'));


@inject("AppState")
class IAMIndex extends React.Component {
  render() {
    const { match, AppState } = this.props;
    const langauge = AppState.currentLanguage;
    const IntlProviderAsync = asyncLocaleProvider(langauge, () => import(`../locale/${langauge}`));
    return (
        <IntlProviderAsync>
          <div>
            <Switch>
              <Route exact path={match.url} component={Home} />
              <Route path={`${match.url}/client`} component={ClientIndex} />
              <Route path={`${match.url}/password-policy`} component={PasswordPolicyIndex} />
              <Route path={`${match.url}/user`} component={UserIndex} />
              <Route path={`${match.url}/ldap`} component={LDAPIndex} />
              <Route path={`${match.url}/organization`} component={OrganizationIndex} />
              <Route path={`${match.url}/service`} component={ServiceIndex} />
              <Route path={`${match.url}/excel`} component={ExcelIndex} />
              <Route path={`${match.url}/token`} component={TokenIndex} />
              <Route path={`${match.url}/role`} component={RoleIndex} />
              <Route path={`${match.url}/lookup`} component={LookupIndex} />
              <Route path={`${match.url}/language`} component={LanguageIndex} />
              <Route path={`${match.url}/project`} component={ProjectIndex} />
              <Route path={`${match.url}/admin-client`} component={AdminClientIndex} />
              <Route path={`${match.url}/admin-organization`} component={AdminOrganizationIndex} />
              <Route path={`${match.url}/origanizationMemberRole`} component={OriganizationMemberRoleIndex} />
              <Route path={`${match.url}/catalog`} component={CatalogIndex} />
              <Route path={`${match.url}/projectMemberRole`} component={ProjectMemberRoleIndex} />
              <Route path={`${match.url}/deployment`} component={DeploymentIndex} />
              <Route path={`${match.url}/deploymentAdmin`} component={DeploymentAdminIndex} />
              <Route path={`${match.url}/instance`} component={InstanceIndex} />
			        <Route path={`${match.url}/demo`} component={DemoIndex} />
            </Switch>
          </div>
        </IntlProviderAsync>
    );
  }
}

export default IAMIndex;
