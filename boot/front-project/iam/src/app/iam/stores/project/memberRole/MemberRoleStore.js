/**
 * Created by Lty on 2017/6/25.
 */

import { observable, action, computed } from 'mobx';
import axios from '../../../common/axios';
import store from '../../../common/store';

@store("ProjectMemberRoleStore")
class ProjectMemberRoleStore {
  @observable roleData = [];
  @observable isLoading = true;
  @observable selectedRowKeys = [];
  @observable selectedRow = [];
  @observable userData = [];
  @observable isUser = true;
  @observable isShow = true;
  @observable roleKeys = [];
  @observable memberId = '';
  @observable addModelVisible = false;
  @observable selectRoleModalVisible = false;
  @observable SelectButtonText = "未选择";
  @observable addModalRoleData = [];
  @observable removeMemberId = {};
  @observable memberRole = [];
  @observable open = false;

  @action setOpen(flag) {
    this.open = flag;
  }

  @computed get getOpen() {
    return this.open;
  }
  @action setMemberRole(data) {
    this.memberRole = data;
  }

  @computed get getMemberRole() {
    return this.memberRole.slice();
  }
  @action setIsUser(flag) {
    this.isUser = flag;
  }

  @computed get getIsUser() {
    return this.isUser;
  }
  @action setLoading(flag) {
    this.isLoading = flag;
  }

  @computed get getIsLoading() {
    return this.isLoading;
  }
  @action setShow(flag) {
    this.isShow = flag;
  }
  @computed get getIsShow() {
    return this.isShow;
  }
  @action setRoleData(content) {
    this.roleData = content;
  }

  @computed get getRoleData() {
    return this.roleData;
  }

  @action setuserData(content) {
    this.userData = content;
  }

  @computed get getuserData() {
    return this.userData.slice();
  }
  loadRoles(id) {
    axios.get(`/uaa/v1/roles/selectProjectRole/${id}`)
      .then(data => {
        this.setRoleData(data);
      });
  }

  loadMemberRoles(projectId) {
    axios.get(`/uaa/v1/project/${projectId}/memberRoles`)
      .then(data => {
        if (data) {
          this.setLoading(false);
          this.setShow(false);
          this.setMemberRole(data);
        }
      });
  }
  loadUserData(organizationId) {
    axios.get(`/uaa/v1/organization/${organizationId}/users?page=0&size=999`)
      .then(data => { if (data) 
        { 
          this.setuserData(data.content);
        }});
  }
  handleDelete(id, success, total, fn) {
    axios.delete(`/uaa/v1/memberRoles/${id}`)
      .then(() => {
        console.log("handleDelete");
        success++;
        if (success == total) {
          fn;
          this.setOpen(false);
        }
      })
  }

  handleBatchDelete(id, success, total, fn) {
    axios.delete(`/uaa/v1/memberRoles/${id}`)
      .then(() => {
        success++;
        if (success == total) {
          fn;
        }
      });
  }
  handleRoleSave(role, fn) {
    axios.put(`/uaa/v1/memberRoles/setMemberRole`, JSON.stringify(role))
      .then(res => {
        if (res.ok) {
          console.log("handleRoleSave");
          fn;
          this.setShow(false);
        }
      });
  }

  handleAddOk(id, data, success, total, fn, fnTwo) {
    axios.post(`/uaa/v1/project/${id}/memberRoles`, JSON.stringify(data))
      .then(() => {
        success++;
        if (success == total) {
          fn;
          fnTwo;
          console.log("handleAddOk");
        }
      });
  }
  handleSearch(id, value) {
    axios.get(`/uaa/v1/project/${id}/memberRoles`)
      .then(data => {
        if (data) {
          let pattern = eval("/.*" + value + ".*/");
          console.log(pattern);
          let filterData = data.filter(item => (pattern.test(item.userName) || pattern.test(item.userEmail) || pattern.test(item.roleName)));
          this.setMemberRole(filterData);
        };
      });
  }
}
const projectMemberRoleStore = new ProjectMemberRoleStore();

export default projectMemberRoleStore;
