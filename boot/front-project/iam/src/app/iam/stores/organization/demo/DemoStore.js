// store/organization/demo/DemoStore.js文件

import {observable, action, computed} from 'mobx';
//该axios是封装过的，设置了请求头信息和响应拦截器
import axios from '../../../common/axios';
import store from '../../../common/store';

//store注解符令组件可以通过DemoStore来找到该store
@store("DemoStore")
class DemoStore {
  @observable roles = [];

  @computed get getRoles(){
    return this.roles.slice();
  }

  @action setRoles(data){
    this.roles = data;
  }

  loadRole(){
    axios.get(`uaa/v1/roles?page=0&size=100`).then(data => {
      if (data){
        this.setRoles(data.content);
      }
    }).catch((err)=>{
      console.log(err)
    })
  }
}

const demoStore = new DemoStore();

export default demoStore;
