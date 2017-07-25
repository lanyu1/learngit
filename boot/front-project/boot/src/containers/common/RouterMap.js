/**
 * Created by jaywoods on 2017/6/12.
 */

//前后端菜单路由映射
export const Routes={
  "hap-user-service.client":"/iam/client",
  "hap-user-service.excel":"/iam/excel",
  "hap-user-service.ldap":"/iam/ldap",
  "hap-user-service.organization":"/iam/organization",
  "hap-user-service.password-policy":"/iam/password-policy",
  "hap-user-service.role":"/iam/role",
  "hap-user-service.service":"/iam/service",//组织菜单=》服务管理
  "hap-user-service.user":"/iam/user",
  "hap-user-service.project":"/iam/project",
  "hap-user-service.member-role-organization":"/iam/origanizationMemberRole",//组织菜单=》用户服务=》角色分配
  "hap-user-service.member-role-project":"/iam/projectMemberRole",//项目菜单=》用户服务=》角色分配
  "hap-framework-service.lookup":"/iam/lookup",
  "hap-framework-service.language":"/iam/language",
  "hap-user-admin-service.label":"/iam",//管理员=》标签管理
  "hap-user-admin-service.organization":"/iam/admin-organization",
  "hap-user-admin-service.client":"/iam/admin-client",//管理员=》客户端管理
  "hap-user-service.token":"/iam/token",
  "hap-user-service.user-info":"/iam/user/info",//个人菜单=》用户信息维护
  "hap-user-service.password":"/iam/user/modifyPwd",
  "hap-catalog-service.catalog":"/iam/catalog",//商品模板管理
  "hap-catalog-admin-service.catalog":"/iam",
  "hap-catalog-admin-service.label":"/iam",
  "hap-deployment-service.category":"/iam",
  "hap-deployment-service.deployment":"/iam/deploymentAdmin",
  "hap-deployment-admin-service.catalog":"/iam/deploymentAdmin",
  "hap-deployment-admin-service.label":"/iam/deploymentAdmin/label",
  "hap-deployment-service.deployment-version":"/iam/deployment/version",
  "hap-deployment-admin-service.deployment":"/iam",
  "hap-user-service.menu":"/iam",
  "hap-deployment-service.deployment.project":"/iam/deployment",
  "hap-deployment-service.instance":"/iam/instance",
  "hap-deployment-service.kanban": "/aiit/HomeIndex"
};
