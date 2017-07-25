/**
 * Created by YANG on 2017/7/3.
 */

import {observable, action, computed} from 'mobx';
import axios from '../../../common/axios';
import store from '../../../common/store';

@store("DeploymentAdminStore")
class DeploymentAdminStore {
  @observable totalPublicSize;
  @observable totalPublicPage;
  @observable totalPrivateSize;
  @observable totalPrivatePage;
  @observable category = [];
  @observable deployment;
  @observable publicDeployment;
  @observable version;
  @observable isLoading = true;
  @observable label;
  @observable labelDeployment;
  @observable isCategoryLoading = true;
  @observable layout = "card";
  @observable publicLayout = "card";
  //标签处理
  @observable labelShow=false;
  @observable selectRows;


  constructor(totalPage = 1, totalSize = 0) {
    this.totalPublicPage = totalPage;
    this.totalPublicSize = totalSize;
    this.totalPrivatePage = totalPage;
    this.totalPrivateSize = totalSize;
  }

  @action setTotalPublicPage(page) {
    this.totalPublicPage = page;
  }

  @computed get getTotalPublicPage() {
    return this.totalPublicPage
  }

  @action setTotalPublicSize(size) {
    this.totalPublicSize = size;
  }

  @computed get getTotalPublicSize() {
    return this.totalPublicSize;
  }

  @action setTotalPrivatePage(page) {
    this.totalPrivatePage = page;
  }

  @computed get getTotalPrivatePage() {
    return this.totalPrivatePage
  }

  @action setTotalPrivateSize(size) {
    this.totalPrivateSize = size;
  }

  @computed get getTotalPrivateSize() {
    return this.totalPrivateSize;
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

  @action setPublicDeployment(data) {
    this.publicDeployment = data;
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

  @action setPublicLayout(value){
    return this.publicLayout = value;
  }

  @action changeLabelShow(flag){
    this.labelShow=flag;
  }
  @action setRows(rows){
    this.selectRows=rows;
  }

  @computed get getSelectRows() {
    return this.selectRows?this.selectRows.slice():[];
  }

  loadDeployment(orgId, privatePage, publicPage) {
    this.changeLoading(true);
    this.changeCategoryLoading(true);
    axios.get(`/deployment/v1/organization/${orgId}/deployments/awesomeSelect?page=${publicPage}&size=8&isPublic=true`).then(datas=> {
      this.setTotalPublicPage(datas.totalPages);
      this.setTotalPublicSize(datas.totalElements);
      this.changeLoading(false);
      this.changeCategoryLoading(false);
      this.setPublicDeployment(datas);
    });

    axios.get(`/deployment/v1/organization/${orgId}/deployments/awesomeSelect?page=${privatePage}&size=8&isPublic=false`).then(datas=> {
      this.setTotalPrivatePage(datas.totalPages);
      this.setTotalPrivateSize(datas.totalElements);
      this.setDeployment(datas);
    });
  }

  loadDeploymentFilter = (orgId, value, id, page, isPublic) => {
    this.changeCategoryLoading(true);
    axios.get(`/deployment/v1/organization/${orgId}/deployments/awesomeSelect?page=${page}&size=8&categoryId=${id}&queryMessage=${value}&isPublic=${isPublic}`).then(datas=> {
      if (isPublic) {
        this.setTotalPublicPage(datas.totalPages);
        this.setTotalPublicSize(datas.totalElements);
        this.setPublicDeployment(datas);
      } else {
        this.setTotalPrivatePage(datas.totalPages);
        this.setTotalPrivateSize(datas.totalElements);
        this.setDeployment(datas);
      }
      this.changeCategoryLoading(false);
    })
  };

  loadCategory = (orgId)=> {
    return axios.get(`/deployment/v1/organization/${orgId}/categories`).then(datas => {
      this.setCategory(datas);
      return Promise.resolve(datas);
    })
  };

  createCategory = (orgId, catalog) => {
    return axios.post(`/deployment/v1/organization/${orgId}/categories`, JSON.stringify(catalog))
  };

  editCategory = (orgId, id, catalog) => {
    return axios.put(`/deployment/v1/organization/${orgId}/categories/${id}`, JSON.stringify(catalog))
  };

  deleteCategory = (orgId, id) => {
    return axios.delete(`/deployment/v1/organization/${orgId}/categories/${id}`)
  };

  batchAddCategory = (orgId, categories) => {
    return axios.post(`/deployment/v1/organization/${orgId}/categories/batchAdd`, JSON.stringify(categories))
  };

  batchDeleteCategory = (orgId, ids) => {
    return axios.post(`/deployment/v1/organization/${orgId}/categories/batchDelete`, JSON.stringify(ids))
  };

  batchEditCategory = (orgId, categories) => {
    return axios.put(`/deployment/v1/organization/${orgId}/categories/batchUpdate`, JSON.stringify(categories))
  };

  batchCategory = (orgId, newCategories, updateCategories, deleteCategoryIds) => {
    return this.batchDeleteCategory(orgId, deleteCategoryIds).then(() => {
      return this.batchEditCategory(orgId, updateCategories).then(() => {
        return this.batchAddCategory(orgId, newCategories).then(() => {
          return {code:200};
        }).catch((error) => {
          return {code:error.response.status, type:"add"};
        });
      }).catch((error) => {
        return {code:error.response.status, type:"edit"};
      });
    }).catch((error) => {
      return {code:error.response.status, type:"delete"};
    });
  };

  createDeployment(data) {
    return axios.post(`/deploymentAdmin/v1/admin/deployments`, JSON.stringify(data))
  }

  loadDeploymentById(id) {
    return axios.get(`/deploymentAdmin/v1/admin/deployments/${id}`)
  }

  updateDeployment(id, data) {
    return axios.put(`/deploymentAdmin/v1/admin/deployments/${id}`, JSON.stringify(data))
  }

  loadVersionByDeploymentId(orgId, dpmId) {
    this.changeLoading(true);
    axios.get(`/deployment/v1/organization/${orgId}/deployments/${dpmId}/versions`).then(data => {
      this.setVersion(data);
      this.changeLoading(false);
    })

  }

  deleteVersion(orgId, dpmId, versionId) {
    return axios.delete(`/deployment/v1/organization/${orgId}/deployments/${dpmId}/versions/${versionId}`)
  }

  loadLabel() {
    axios.get(`/deploymentAdmin/v1/labels`).then(data => {
      this.setLabel(data);
    })
  }

  setDeploymentLabel(data) {
    return axios.put(`/deploymentAdmin/v1/labels/setDeploymentLabels/${id}`, JSON.stringify(data))
  }

  deleteDeployment(id) {
    return axios.get("/uaa/v1/organizations/querySelf").then(data => {
      return axios.delete(`/deployment/v1/organization/${data.id}/deployments/${id}`)
    })
  }

  loadLabelDeployment() {
    this.changeLoading(true)
    axios.get(`/deploymentAdmin/v1/labels/values`).then(data => {
      this.setLabelDeployment(data);
      this.changeLoading(false);
    })
  }
  //查询label
  selectLabelById(id){
    return axios.get(`deploymentAdmin/v1/labels/getDeploymentLabels/${id}`)
  }

}

const deploymentAdminStore = new DeploymentAdminStore();

export default deploymentAdminStore;
