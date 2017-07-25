/**
 * Created by hand on 2017/7/6.
 */
import {observable, action, computed} from 'mobx';
import axios from '../../../common/axios';
import store from '../../../common/store';

@store("RunDeploymentStore")
class RunDeploymentStore {
  @observable version;
  @observable latestVersion;


  @action setLatestVersion(num) {
    this.latestVersion = num;
  }
  @computed get getLatestVersion(){
  return this.latestVersion;
}

  @action setVersion(data) {
    this.version = data;
  }

  @computed get getVersion() {
    return this.version;
  }
  loadDeploymentById(orgId,id) {
    return axios.get('/uaa/v1/organizations/querySelf').then(data => {
      return axios.get(`/deployment/v1/organization/${orgId}/deployments/${id}`)
    })
  }

  loadVersionByDeploymentId(orgId,dpmId) {
    return axios.get('/uaa/v1/organizations/querySelf').then(data1 => {
      return axios.get(`/deployment/v1/organization/${orgId}/deployments/${dpmId}/versions`)
    })

  }

  loadVersionByVersionId(orgId,devId, versionId) {
      return axios.get(`/deployment/v1/organization/${orgId}/deployments/${devId}/versions/${versionId}?json=true`)

  }
  updateVersionByVersionId(orgId,depId,versionId,value){
      return axios.put(`/deployment/v1/organization/${orgId}/deployments/${depId}/versions/${versionId}/render`,JSON.stringify(value));

  }
  rundeployment(proId,value){
      return axios.post(`/deployment/v1/project/${proId}/instances`,JSON.stringify(value));

  }
}

const runDeploymentStore= new RunDeploymentStore();

export default runDeploymentStore;
