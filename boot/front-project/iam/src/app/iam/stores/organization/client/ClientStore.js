/**
 * Created by jaywoods on 2017/6/25.
 */
import {observable, action, computed} from 'mobx';
import axios from '../../../common/axios';
import store from '../../../common/store';

@store("ClientStore")
class ClientStore {
  @observable clients=[];
  @observable totalSize;
  @observable totalPage;
  @observable isLoading = true;

  constructor(totalPage = 1, totalSize = 0) {
    this.totalPage = totalPage;
    this.totalSize = totalSize;
  }

  @action setClients(data) {
    this.clients = data;
  }

  @computed get getClients() {
    return this.clients.slice();
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

  loadClients(organizationId, page) {
    this.changeLoading(true);
    axios.get(`/uaa/v1/organization/${organizationId}/clients?page=${page}&size=10`).then(data => {
      if (data) {
        this.setClients(data.content);
        this.setTotalPage(data.totalPages);
        this.setTotalSize(data.totalElements);
      }
      this.changeLoading(false);
    });
  }

  getClientById(organizationId, id) {
    return axios.get(`/uaa/v1/organization/${organizationId}/clients/${id}`);
  };

  createClient(organizationId,client){
    return axios.post(`/uaa/v1/organization/${organizationId}/clients`,JSON.stringify(client));
  }

  updateClient(organizationId,client,id){
    return axios.put(`/uaa/v1/organization/${organizationId}/clients/${id}`,JSON.stringify(client));
  }

  deleteClientById(organizationId,id){
    return axios.delete(`/uaa/v1/organization/${organizationId}/clients/${id}`);
  }

}

const clientStore = new ClientStore();

export default clientStore;
