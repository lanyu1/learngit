/**
 * Created by song on 2017/6/28.
 */

import {observable, action, computed} from 'mobx';
import axios from '../../../common/axios';
import store from '../../../common/store';

@store("AdminOrganizationStore")
class AdminOrganizationStore {
  @observable organizations=[];
  @observable totalSize;
  @observable totalPage;
  @observable selectRows;
  @observable labelShow=false;

  constructor(totalPage = 1, totalSize = 0) {
    this.totalPage = totalPage;
    this.totalSize = totalSize;
  }

  @action setOrganizations(data) {
    this.organizations = [];
    if (data)
      this.organizations = data;
  }

  @computed get getOrganizations() {
    return this.organizations.slice();
  }

  @action setTotalSize(totalSize) {
    this.totalSize = totalSize;
  }

  @computed get getTotalSize() {
    return this.totalSize;
  }

  @action setTotalPage(totalPage) {
    this.totalPage = totalPage;
  }

  @computed get getTotalPage() {
    return this.totalPage;
  }

  @action setRows(rows){
    this.selectRows=rows;
  }

  @computed get getSelectRows() {
    return this.selectRows?this.selectRows.slice():[];
  }

  @action changeLabelShow(flag){
    this.labelShow=flag;
  }

  loadOrganizations=(page)=> (
    axios.get(`/admin/v1/organizations?page=${page}&size=10`)
  );



  getOrganizationById(id) {
    return axios.get(`/admin/v1/organizations/${id}`);
  };

  createOrganization(organization){
    return axios.post(`/admin/v1/organizations`,JSON.stringify(organization));
  }

  updateOrganization(id, organization){
    return axios.put(`/admin/v1/organizations/${id}`,JSON.stringify(organization));
  }

  deleteOrganizationById(id){
    return axios.delete(`/admin/v1/organizations/${id}`);
  }

  createLabel = (label) => (
    axios.post(`/admin/v1/labels`, JSON.stringify(label))
  );

  getLabelById = (id) => (
    axios.get(`/admin/v1/organizations/${id}`)
  );

  deleteLabelById = (id) => (
    axios.delete(`/admin/v1/labels/${id}`)
  );

}

const adminOrganizationStore = new AdminOrganizationStore();

export default adminOrganizationStore;
