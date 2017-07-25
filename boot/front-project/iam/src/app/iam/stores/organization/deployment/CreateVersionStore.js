/**
 * Created by jaywoods on 2017/7/4.
 */
import {observable, action, computed} from 'mobx';
import axios from '../../../common/axios';
import store from '../../../common/store';

@store("CreateVersionStore")
class CreateVersionStore{


  createDeploymentVersion=(organizationId,deploymentId,data)=>(
    axios.post(`deployment/v1/organization/${organizationId}/deployments/${deploymentId}/versions`,JSON.stringify(data))
  )
}

const createVersionStore = new CreateVersionStore();

export default createVersionStore;
