/**
 * Created by jaywoods on 2017/6/29.
 */
import {observable, action, computed} from 'mobx';
import axios from '../../../common/axios';
import store from '../../../common/store';

@store("AdminClientStore")
class AdminClientStore {
  @observable clients = [];
  @observable totalSize;
  @observable totalPage;

  constructor(totalPage = 1, totalSize = 0) {
    this.totalPage = totalPage;
    this.totalSize = totalSize;
  }

  @action setClients(data) {
    this.clients = data;
  }

  @action setTotalSize(totalSize) {
    this.totalSize = totalSize;
  }

  @action setTotalPage(totalPage) {
    this.totalPage = totalPage;
  }

  loadClients = (page) => (
    axios.get(`/admin/v1/clients?page=${page}&size=10`).then(data => {
      if (data) {
        this.setClients(data.content);
        this.setTotalPage(data.totalPages);
        this.setTotalSize(data.totalElements);
      }
    })
  );

  createClient = (data) => (
    axios.post('/admin/v1/clients', JSON.stringify(data))
  );

  getClientById = (id) => (
    axios.get(`/admin/v1/clients/${id}`)
  );

  updateClient = (id, data) => (
    axios.put(`/admin/v1/clients/${id}`, JSON.stringify(data))
  );

  deleteClientById = (id) => (
    axios.delete(`/admin/v1/clients/${id}`)
  );

}

const adminClientStore=new AdminClientStore();

export default adminClientStore;
