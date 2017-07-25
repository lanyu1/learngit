/**
 * Created by jaywoods on 2017/6/26.
 */

import {observable, action, computed} from 'mobx';
import axios from '../../../common/axios';
import store from '../../../common/store';

@store("PasswordPolicyStore")
class PasswordPolicyStore {
  @observable passwordPolicy = {};
  @observable isLoading = true;

  @action setIsLoading(flag){
    this.isLoading=flag;
  }

  @computed get getIsLoading(){
    return this.isLoading;
  }

  @action setPasswordPolicy(data) {
    this.passwordPolicy = data;
  }

  @action cleanData(){
    this.passwordPolicy = {};
  }

  @computed get getPasswordPolicy() {
    return this.passwordPolicy;
  }

  loadPasswordPolicy(handleErr){
    this.setIsLoading(true);
    axios.get('/uaa/v1/passwordPolicies/querySelf').then(data=>{
      passwordPolicyStore.setPasswordPolicy(data);
    }).catch(error=>{
      this.cleanData();
      if(error.response.status === 400){
        this.setIsLoading(false);
        handleErr(HAP.getMessage("密码策略不存在","Policy is not found!"))
      }
    });
  };

  loadData(organizationId) {
    this.setIsLoading(true);
    axios.get(`/uaa/v1/organization/${organizationId}/passwordPolicies`).then(data => {
      if (data) {
        this.setPasswordPolicy(data);
      }
      this.setIsLoading(false);
    }).catch(error=>{
      this.cleanData();
      if(error.response.status === 400){
        console.log("密码策略不存在");
        this.setIsLoading(false);
      }else{
        message.error(error.response.data.message)
      }
    });
  };


  updatePasswordPolicy=(organizationId,data)=>(
    axios.put(`/uaa/v1/organization/${organizationId}/passwordPolicies`,JSON.stringify(data))
)
}

const passwordPolicyStore = new PasswordPolicyStore();

export default passwordPolicyStore;
