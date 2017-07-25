/**
 * Created by jaywoods on 2017/6/28.
 */
import {observable, action, computed} from 'mobx';
import axios from '../../../common/axios';
import store from '../../../common/store';

@store("CreateUserStore")
class CreateUserStore {
  @observable language;
  @observable organization;
  @observable passwordPolicy;

  @action setLanguage(lang) {
    this.language = lang;
  }

  @computed get getLanguage() {
    return this.language;
  }

  @action setOrganization(data) {
    this.organization = data;
  }

  @computed get getOrganization() {
    return this.organization;
  }

  @action setPasswordPolicy(data) {
    this.passwordPolicy(data);
  }

  @computed get getPasswordPolicy() {
    return this.passwordPolicy;
  }

  loadOrganizationById = (organizationId, callback) => (
    axios.get(`/uaa/v1/organizations/${organizationId}`).then(data => {
      createUserStore.setOrganization(data);
    }).catch(error => {
      console.log("组织加载失败store");
      callback(error)
    })
  );

  loadPasswordPolicyById = (id) => (
    axios.get(`/uaa/v1/passwordPolicies/${id}`).then(data => {
      createUserStore.setPasswordPolicy(data);
    })
  );

  loadLanguage=(callback)=>(
    axios.get(`/fws/v1/languages?page=0&size=999`).then(data=>{
      createUserStore.setLanguage(data)
    }).catch(error=>{
      callback(error)
    })
  );

  checkUsername=(id,name,callback)=>(
    axios.get(`/uaa/v1/organization/${id}/users/checkName?name=${name}`).then(data=>{
      return Promise.resolve({});
    }).catch(error=>{
      if(error.response.status==400){
        callback(error.response.data)
      }
    })
  );

  checkEmailAddress=(id,email,callback)=>(
    axios.get(`/uaa/v1/organization/${id}/users/checkEmail?email=${email}`).then(data=>{
      return Promise.resolve({});
    }).catch(error=>{
      if(error.response.status==400){
        callback(error.response.data)
      }
    })
  );

  createUser=(user,id)=>(
    axios.post(`/uaa/v1/organization/${id}/users`,JSON.stringify(user))
  );

  getUserInfoById=(orgId,id)=>(
    axios.get(`/uaa/v1/organization/${orgId}/users/${id}`)
  );

  updateUser=(orgId,id,user)=>(
    axios.put(`/uaa/v1/organization/${orgId}/users/${id}`,JSON.stringify(user))
  )
}

const createUserStore=new CreateUserStore();

export default createUserStore;
