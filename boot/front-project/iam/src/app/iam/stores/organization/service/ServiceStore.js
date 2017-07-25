/**
 * Created by jaywoods on 2017/6/25.
 */
import {observable, action, computed} from 'mobx';
import axios from '../../../common/axios';
import store from '../../../common/store';

@store("ServiceStore")
class ServiceStore {
  @observable service=[];
  @observable totalSize;
  @observable totalPage;
  @observable isLoading = true;

  constructor(totalPage = 1, totalSize = 0) {
    this.totalPage = totalPage;
    this.totalSize = totalSize;
  }

  @action setService(data) {
    this.service = data;
  }

  @computed get getServices() {
    return this.service.slice();
  }

  @action setTotalSize(totalSize) {
    this.totalSize = totalSize;
  }

  @computed get getTotalSize() {
    return this.totalSize;
  }

  @action setTotalPage(totalPage) {
    this.totalPage = totalPage;
  }

  @computed get getTotalPage() {
    return this.totalPage;
  }

  @action changeLoading(flag) {
    this.isLoading = flag;
  }

  @computed get getIsLoading() {
    return this.isLoading;
  }

  loadServices(organizationId) {
    this.changeLoading(true);
    axios.get(`/uaa/v1/services/queryByOrganization/${organizationId}`).then(data => {
      if (data) {
        this.setService(data);
        this.setTotalPage(data.totalPages);
        this.setTotalSize(data.totalElements);
      }
      this.changeLoading(false);
    }).catch((err)=>{
        console.log(err);
    });
  }

  getService(id) {
    return axios.get(`/uaa/v1/services?page=${page}&size=10`);
  };
}

const serviceStore = new ServiceStore();

export default serviceStore;
