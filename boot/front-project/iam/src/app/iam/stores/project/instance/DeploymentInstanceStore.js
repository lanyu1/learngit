/**
 * Created by Wangke on 2017/7/6.
 */


import {observable, action, computed} from 'mobx';
import axios from '../../../common/axios';
import store from '../../../common/store';

@store("DeploymentInstanceStore")

class DeploymentInstanceStore {
  @observable instances = [];
  @observable details = [];
  @observable isLoading = true;
  @observable totalSize;
  @observable totalPages;

  constructor(totalPage = 1, totalSize = 0) {
    this.totalPages = totalPage;
    this.totalSize = totalSize;
  }

  @action setTotalPage(page) {
    this.totalPages = page;
  }

  @computed get getTotalPage() {
    return this.totalPages
  }

  @action setTotalSize(size) {
    this.totalSize = size;
  }

  @computed get getTotalSize() {
    return this.totalSize;
  }

  @action setIsLoading(flag) {
    this.isLoading = flag;
  }

  @computed get getIsLoading() {
    return this.isLoading;
  }

  @action setInstances(data) {
    this.instances = data;
  }

  @action setInstancesDetails(data) {
    this.details = data;
  }

  @computed get getInstances() {
    return this.instances.slice();
  }

  @computed get getInstancesDetails() {
    return this.details;
  }

  loadInstances(projectId, page) {
    this.setIsLoading(true);
    axios.get(`/deployment/v1/project/${projectId}/instances?page=${page}&size=10`).then(data => {
      if (data) {
        this.setInstances(data.content);
        this.setTotalPage(data.totalPages);
        this.setTotalSize(data.totalElements);
      }
      this.setIsLoading(false);
    });
  }

  getInstanceById(projectId, id, page) {
    this.setIsLoading(true);
    axios.get(`/deployment/v1/project/${projectId}/instances/${id}?page=${page}&size=5`).then(data => {
      if (data) {
        this.setInstancesDetails(data);
        this.setTotalPage(data.histories.totalPages);
        this.setTotalSize(data.histories.totalElements);
      }
      this.setIsLoading(false);
    })
  }

  updateDeploymentInstance(projectId, id, instanceHistory) {
    return axios.put(`/deployment/v1/project/${projectId}/instances/${id}`, JSON.stringify(instanceHistory));
  }

  getObjectById(projectId, id) {
    return axios.get(`/deployment/v1/project/${projectId}/instances/queryByInstanceId/${id}`);
  }

  getHistoryById(projectId, instanceId, id) {
    return axios.get(`/deployment/v1/project/${projectId}/instance/${instanceId}/histories/select/${id}`);
  }

  deleteInstanceById(projectId, id) {
    return axios.delete(`/deployment/v1/project/${projectId}/instances/${id}`);
  }

  RollBackById(projectId, instanceId, id) {
    return axios.put(`/deployment/v1/project/${projectId}/instance/${instanceId}/histories/rollBack/${id}`);
  }

}

const deploymentInstanceStore = new DeploymentInstanceStore();

export default deploymentInstanceStore;
