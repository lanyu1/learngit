/**
 * Created by jaywoods on 2017/7/4.
 */
import {observable, action, computed} from 'mobx';
import axios from '../../../common/axios';
import store from '../../../common/store';

@store("AdminEditVersionStore")
class AdminEditVersionStore{

  getVersionById=(organizationId,deploymentId,versionId)=>(
    axios.get(`deployment/v1/organization/${organizationId}/deployments/${deploymentId}/versions/${versionId}`)
  )

  updateDeploymentVersion=(organizationId,deploymentId,versionId,data)=>(
    axios.put(`deployment/v1/organization/${organizationId}/deployments/${deploymentId}/versions/${versionId}`,JSON.stringify(data))
  )
}

const adminEditVersionStore = new AdminEditVersionStore();

export default adminEditVersionStore;
