/**
 * Created by jaywoods on 2017/6/26.
 */
import {observable, action, computed} from 'mobx';
import axios from '../../../common/axios';
import store from '../../../common/store';

@store("UserStore")
class UserStore{

  @observable isLoading=true;

  //密码策略用于修改密码时校验
  @observable passwordPolicy;
  @observable userInfo;
  @observable language;
  @observable organization;
  @observable timeZone;
  @observable checkEmail;

  @observable users;//用户列表
  @observable totalSize;
  @observable totalPage;

  constructor(totalPage = 1, totalSize = 0) {
    this.totalPage = totalPage;
    this.totalSize = totalSize;
  }

  @action setIsLoading(flag){
    this.isLoading=flag;
  }

  @computed get getIsLoading(){
    return this.isLoading;
  }

  @action setPasswordPolicy(data){
    this.passwordPolicy=data;
  }

  @action setUserInfo(data) {
    this.userInfo = data;
  }

  @computed get getUserInfo(){
    return this.userInfo;
  }

  @action setLanguage(data) {
    this.language = data;
  }

  @action setOrganization(data) {
    this.organization = data;
  }

  @action setTimeZone(data){
    this.timeZone = data;
  }

  @action setCheckEmail(data){
    this.checkEmail = data;
  }

  @action setUsers(data){
    this.users=data;
  }

  @computed get getUsers(){
    return this.users;
  }

  @action setTotalSize(totalSize) {
    this.totalSize = totalSize;
  }

  @action setTotalPage(totalPage) {
    this.totalPage = totalPage;
  }

  async loadPasswordPolicy(){
    const res =await axios.get('/uaa/v1/passwordPolicies/querySelf');
    //默认会生成get set 方法
    userStore.setPasswordPolicy(res);
  }

  updatePassword=(originPassword,hashedPassword)=>{
    return axios.put(`/uaa/v1/password/updateSelf?originPassword=${originPassword}&password=${hashedPassword}`).then(data=>{
      return Promise.resolve(data);
    }).catch(error=>{
      return Promise.reject(error);
    })
  };


  //用户信息维护
  async loadUserInfo(){
    this.setIsLoading(true);
    axios.get('/uaa/v1/users/querySelf').then(data=>{
      if(data){
        userStore.setUserInfo(data);
      }
      this.setIsLoading(false);
    });
  };

  async loadLanguage(){
    axios.get('/fws/v1/languages?page=0&size=999').then(data=>{
      userStore.setLanguage(data);
    })
  };

  async loadOrganization(){
    axios.get('/uaa/v1/organizations/querySelf').then(data=>{
      userStore.setOrganization(data);
      axios.get(`/fws/v1/organization/${data.id}/lookup/findByCode/TIME_ZONE`).then(datas=>{
        userStore.setTimeZone(datas);
      })
    })
  };

  checkEmails=(id,email)=>{
    return axios.get(`/uaa/v1/organization/${id}/users/checkEmail?email=${email}`).then(data=>{
     return Promise.resolve(data);
    }).catch(err=>{
      return Promise.reject(err);
    })
  };

  updateUserInfo=(user)=>{
    return axios.put('/uaa/v1/users/updateSelf',JSON.stringify(user)).then(data=>{
      return Promise.resolve(data);
    }).catch(err=>{
      return Promise.reject(err);
    });
  }

  //加载用户列表
  loadUsers=(organizationId,page,callback)=>(
    axios.get(`/uaa/v1/organization/${organizationId}/users?page=${page}&size=10`).then(data=>{
      userStore.setUsers(data.content);
      userStore.setTotalPage(data.totalPages);
      userStore.setTotalSize(data.totalElements);
    }).catch(error=>{
      callback(error)
    })
  );

  deleteUserById=(organizationId,id)=>(
    axios.delete(`/uaa/v1/organization/${organizationId}/users/${id}`)
);
}



const userStore=new UserStore();

export default userStore;
