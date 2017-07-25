/**
 * Created by YANG on 2017/7/3.
 */

import {observable, action, computed} from 'mobx';
import axios from '../../../common/axios';
import store from '../../../common/store';

@store("DeploymentStore")
class DeploymentStore {
  @observable totalPublicSize;
  @observable totalPublicPage;
  @observable totalPrivateSize;
  @observable totalPrivatePage;
  @observable category=[];
  @observable deployment;
  @observable publicDeployment;
  @observable version;
  @observable isLoading = true;
  @observable isCategoryLoading = true;
  @observable layout = "card";
  @observable publicLayout = "card";


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

  @action changeCategoryLoading(flag) {
    this.isCategoryLoading = flag;
  }

  @computed get getCategoryLoading() {
    return this.isCategoryLoading;
  }

  @computed get getCategory() {
    return this.category.slice();
  }

  @action setLayout(value){
    return this.layout = value;
  }

  @action setPublicLayout(value){
    return this.publicLayout = value;
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

  loadCategory = ()=> {
    return axios.get(`/uaa/v1/organizations/querySelf`).then(org => {
      return axios.get(`/deployment/v1/organization/${org.id}/categories`).then(datas => {
        this.setCategory(datas);
        return Promise.resolve(datas);
      })
    })
  };

  createDeployment(data) {
    return axios.get(`/uaa/v1/organizations/querySelf`).then(org => {
      return axios.post(`/deployment/v1/organization/${org.id}/deployments`, JSON.stringify(data))
    })
  }

  loadDeploymentById(orgId, id) {
    return axios.get('/uaa/v1/organizations/querySelf').then(data => {
      return axios.get(`/deployment/v1/organization/${data.id}/deployments/${id}`)
    })
  }

  updateDeployment(orgId, id, data) {
    return axios.put(`/deployment/v1/organization/${orgId}/deployments/${id}`, JSON.stringify(data))
  }

  loadVersionByDeploymentId(orgId, dpmId) {
    this.changeLoading(true);
    return axios.get('/uaa/v1/organizations/querySelf').then(data1 => {
      return axios.get(`/deployment/v1/organization/${data1.id}/deployments/${dpmId}/versions`).then(data => {
        this.setVersion(data);
        this.changeLoading(false);
      })

    })

  }

  deleteVersion(orgId, dpmId, versionId) {
    return axios.delete(`/deployment/v1/organization/${orgId}/deployments/${dpmId}/versions/${versionId}`)
  }

  deleteDeployment(id){
    return axios.get("/uaa/v1/organizations/querySelf").then(data => {
      return axios.delete(`/deployment/v1/organization/${data.id}/deployments/${id}`)
    })
  }

}

const deploymentStore = new DeploymentStore();

export default deploymentStore;
