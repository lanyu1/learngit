/**
 * Created by jaywoods on 2017/7/4.
 */
import {observable, action, computed} from 'mobx';
import axios from '../../../common/axios';
import store from '../../../common/store';

@store("AdminCreateVersionStore")
class AdminCreateVersionStore{


  createDeploymentVersion=(organizationId,deploymentId,data)=>(
    axios.post(`deployment/v1/organization/${organizationId}/deployments/${deploymentId}/versions`,JSON.stringify(data))
  )
}

const adminCreateVersionStore = new AdminCreateVersionStore();

export default adminCreateVersionStore;
