/**
 * Created by cheon on 6/28/17.
 */
import {observable, action, computed} from 'mobx';
import {message} from 'antd';
import axios from '../../../common/axios';
import store from '../../../common/store';

@store("LookupStore")
class LookupStore {
    @observable lookups = [];
    @observable totalPage;
    @observable totalSize;
    @observable isLoading = true;

    constructor(totalPage=1, totalSize=0){
        this.totalPage = totalPage;
        this.totalSize = totalSize;
    }

    @computed get getLookups(){
        return this.lookups.slice();
    }

    @action setLookups(data){
        this.lookups = data;
    }

    @computed get getIsLoading(){
        return this.isLoading;
    }

    @action setIsLoading(flag){
        this.isLoading = flag;
    }

    @computed get getTotalPage(){
        return this.totalPage;
    }

    @action setTotalPage(totalPage){
        this.totalPage = totalPage;
    }

    @computed get getTotalSize(){
        return this.totalSize;
    }

    @action setTotalSize(totalSize){
        this.totalSize = totalSize;
    }

    loadLookups(organizationId, page, size){
        this.setIsLoading(true);
        axios.get(`/fws/v1/organization/${organizationId}/lookup?page=${page}&size=${size}`).then(data => {
            if(data){
                lookupStore.setLookups(data.content);
                this.setTotalPage(data.totalPages);
                this.setTotalSize(data.totalElements);
                this.setIsLoading(false);
            }
        }).catch((err)=>{
          switch (err.response.status){
            case 400:
              message.error(HAP.getMessage("代码必须唯一", "Duplicate key"));
              break;
            case 401:
              message.error(HAP.getMessage("未登录", "Unauthorized"));
              break;
            case 403:
              message.error(HAP.getMessage("禁止访问", "Forbidden"));
              break;
            case 404:
              message.error(HAP.getMessage("未找到", "Not Found"));
              break;
            default:
              message.error(HAP.getMessage("未知的错误", "error occur"));
          }
          this.setIsLoading(false);
        });
    }

    getLookupByCode(organizationId,code){
        return axios.get(`/fws/v1/organization/${organizationId}/lookup/findByCode/${code}`);
    }

    getLookupById(organizationId, id){
        return axios.get(`/fws/v1/organization/${organizationId}/lookup/${id}`);
    }

    createLookup(organizationId, data){
        return axios.post(`/fws/v1/organization/${organizationId}/lookup`, JSON.stringify(data));
    }

    updateLookupById(organizationId, id, data){
        return axios.put(`/fws/v1/organization/${organizationId}/lookup/${id}`, JSON.stringify(data))
    }

    deleteLookupById(organizationId, id){
        return axios.delete(`/fws/v1/organization/${organizationId}/lookup/${id}`);
    }

}

const lookupStore = new LookupStore();

export default lookupStore;
