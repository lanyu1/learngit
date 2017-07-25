/**
 * Created by song on 2017/6/26.
 */

import {observable, action, computed} from 'mobx';
import {message} from 'antd';
import axios from '../../../common/axios';
import store from '../../../common/store';

@store("LDAPStore")
class LDAPStore {
  @observable ldapData = {};
  @observable isLoading = true;

  @action setIsLoading(flag) {
    this.isLoading = flag;
  }

  @computed get getIsLoading() {
    return this.isLoading;
  }

  @action setLDAPData(data) {
    this.ldapData = data;
  }

  @computed get getLDAPData() {
    return this.ldapData;
  }

  @action cleanData(){
    this.ldapData = {};
  }

  loadLDAP(organizationId) {
    this.setIsLoading(true);
    axios.get(`/uaa/v1/organization/${organizationId}/ldaps`).then(data => {
      if(data){
        this.setLDAPData(data);
      }
      this.setIsLoading(false);
    }).catch((error) => {
      this.cleanData();
      if (error.response.status && error.response.status === 400) {
        message.error(HAP.getMessage("LDAP 不存在！", "LDAP Not Exist!"));
        this.setIsLoading(false);
      } else{
        message.error(HAP.getMessage("加载失败！", "load failed!"));
      }
    });
  }

  loadOrganization(organizationId){
    this.setIsLoading(true);
    axios.get(`/uaa/v1/organizations/${organizationId}`).then(data => {
      if(data){
        this.setOrganization(data);
      }
      this.setIsLoading(false);
    });
  }

  updateLDAP(organizationId, ldap) {
    return axios.put(`/uaa/v1/organization/${organizationId}/ldaps`, JSON.stringify(ldap));
  }
}

const ldapStore = new LDAPStore();

export default ldapStore;
