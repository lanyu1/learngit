/**
 * Created by YANG on 2017/6/29.
 */

import {observable, action, computed} from 'mobx';
import axios from '../../../common/axios';
import store from '../../../common/store';

@store("CatalogStore")
class CatalogStore {
  @observable totalSize;
  @observable totalPage;
  @observable catalog;
  @observable organizationId;
  @observable catagories;
  @observable categories=[];


  constructor(totalPage = 1, totalSize = 0) {
    this.totalPage = totalPage;
    this.totalSize = totalSize;
  }

  @action setCatalog(data){
    this.catalog = data;
  }

  @action setOrganizationId(data){
    this.organizationId = data;
  }
  @action setCategories(data){
    this.categories=data;
  }
  @action setCatagories(data){
    this.catagories = data;
  }

  loadOrganizationId = () => {
    axios.get(`/uaa/v1/organizations/querySelf`).then(data=>{
      this.setOrganizationId(data.id)
    })
  }

  loadCatalog=()=>{
    axios.get(`/uaa/v1/organizations/querySelf`).then(data=>{
      const id = data.id;
      axios.get(`/catalog/v1/organization/${id}/catalogs?page=0&size=888`).then(datas=>{
        catalogStore.setCatalog(datas)
      })
    })

  }

  loadCatagories = () =>{
    axios.get(`/uaa/v1/organizations/querySelf`).then(data=>{
      const orgId = data.id;
      axios.get(`/catalog/v1/organization/${orgId}/catalogs?page=0&size=888`).then(datas=>{
        catalogStore.setCatagories(datas)
      })
    })
  }
  searchCategory=()=>{
    axios.get(`/uaa/v1/organizations/querySelf`).then(data=>{
      const id = data.id;
      return axios.get(`/catalog/v1/organization/${id}/catalogs/selectCategories`).then(datas=>{
        catalogStore.setCategories(datas)
      })
    })

  }
  createCatalog=(catalog)=>{
    return axios.get(`/uaa/v1/organizations/querySelf`).then(data=>{
      const id = data.id;
      return axios.post(`/catalog/v1/organization/${id}/catalogs`,JSON.stringify(catalog))
    })
  }

}

const catalogStore = new CatalogStore();

export default catalogStore;
