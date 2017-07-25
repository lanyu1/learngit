/**
 * Created by hand on 2017/7/12.
 */
/**
 * Created by YANG on 2017/7/3.
 */

import {observable, action, computed} from 'mobx';
import axios from '../../../common/axios';
import store from '../../../common/store';

@store("AdminLabelStore")
class AdminLabelStore {
  @observable totalSize;
  @observable totalPage;
  @observable category = [];
  @observable deployment;
  @observable version;
  @observable isLoading = true;
  @observable label;
  @observable labelDeployment;
  @observable isCategoryLoading = true;
  @observable layout = "table";
  //标签处理
  @observable labelShow=true;
  //@observable selectRows;
  @observable show = false;
  @observable selectRows = [];
  @observable rows=[];


  constructor(totalPage = 1, totalSize = 0) {
    this.totalPage = totalPage;
    this.totalSize = totalSize;
  }

  @action setTotalPage(page) {
    this.totalPage = page;
  }

  @computed get getTotalPage() {
    return this.totalPage
  }

  @action setTotalSize(size) {
    this.totalSize = size;
  }

  @computed get getTotalSize() {
    return this.totalSize;
  }

  @action setCategory(data) {
    this.category = data;
  }

  @computed get getCategory() {
    return this.category.slice();
  }

  @action setDeployment(data) {
    this.deployment = data;
  }

  @action setVersion(data) {
    this.version = data;
  }

  @computed get getVersion() {
    return this.version;
  }

  @action changeLoading(flag) {
    this.isLoading = flag;
  }

  @computed get getLoading() {
    return this.isLoading;
  }

  @action setLabel(data) {
    this.label = data;
  }

  @action setLabelDeployment(data) {
    this.labelDeployment = data;
  }

  @action changeCategoryLoading(flag) {
    this.isCategoryLoading = flag;
  }

  @computed get getCategoryLoading() {
    return this.isCategoryLoading;
  }

  @action setLayout(value) {
    return this.layout = value;
  }
  @action changeLabelShow(flag){
    this.labelShow=flag;
  }
  @action changeShow(flag){
    this.show=flag;
  }
  @action setRows(rows){
   this.rows=rows;
  }
  @action setSelectRows(rows){
    this.selectRows=rows;
  }

  @computed get getSelectRows() {
    return this.selectRows?this.selectRows.slice():[];
  }
  @computed get getRows() {
    return this.rows?this.rows.slice():[];
  }

  loadDeployment(orgId,page) {
    this.changeLoading(true);
    this.changeCategoryLoading(true);
      axios.get(`/deployment/v1/organization/${orgId}/deployments/awesomeSelect?page=${page}&size=8`).then(datas=> {
        this.setTotalPage(datas.totalPages);
        this.setTotalSize(datas.totalElements);
        this.changeLoading(false);
        this.changeCategoryLoading(false);
        this.setDeployment(datas);
      })

  }





  loadDeploymentByFilter = (orgId, id, value, page) => {
    this.changeCategoryLoading(true);
    axios.get(`deployment/v1/organization/${orgId}/deployments/vagueSelect/${id}/${value}?page=${page}&size=8`).then(datas=> {
      this.setTotalPage(datas.totalPages);
      this.setTotalSize(datas.totalElements);
      this.changeCategoryLoading(false);
      this.setDeployment(datas);
    })
  };

  loadDeploymentByOrgId = (orgId, page) => {
    this.changeCategoryLoading(true);
    axios.get(`deployment/v1/organization/${orgId}/deployments/awesomeSelect?page=${page}&size=8`).then(datas=> {
      this.setTotalPage(datas.totalPages);
      this.setTotalSize(datas.totalElements);
      this.changeCategoryLoading(false);
      this.setDeployment(datas);
    })
  };


  loadDeploymentById(id) {
    return axios.get(`/deploymentAdmin/v1/admin/deployments/${id}`)
  }

  //查询label
  selectLabelById(id){
    return axios.get(`deploymentAdmin/v1/labels/getDeploymentLabels/${id}`)
  }

  createLabel(data){
    return axios.post(`deploymentAdmin/v1/admin/deployments/createLabel`,JSON.stringify(data))
  }
  deleteLabelById(id){
    return axios.delete(`deploymentAdmin/v1/admin/deployments/deleteLabel/${id}`)
  }
  getDeploymentByLabels =(labels) => axios.get(`/deploymentAdmin/v1/labels/getDeploymentLabels/${labels}`);

  getOrgByLabel = (labels) => axios.get(`/admin/v1/labels/${labels}/organizations`);

}

const adminLabelStore = new AdminLabelStore();

export default adminLabelStore;
