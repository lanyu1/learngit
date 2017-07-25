/**
 * Created by cheon on 6/27/17.
 */

import {observable, action, computed} from 'mobx';
import axios from '../../../common/axios';
import store from '../../../common/store';

@store("RoleStore")
class RoleStore {
    @observable roles = [];
    @observable isLoading = true;
    @observable totalPage;
    @observable totalSize;

    constructor(totalPage=1, totalSize=0){
        this.totalPage = totalPage;
        this.totalSize = totalSize;
    }

    @computed get getRoles(){
        return this.roles.slice();
    }

    @action setRoles(data){
        this.roles = data;
    }

    @computed get getIsLoading(){
        return this.isLoading;
    }

    @action setIsLoading(flag){
        this.isLoading=flag;
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

    loadRole(page,size){
        this.setIsLoading(true);
        axios.get(`uaa/v1/roles?page=${page}&size=${size}`).then(data => {
            if (data){
                this.setRoles(data.content);
                this.setTotalPage(data.totalPages);
                this.setTotalSize(data.totalElements);
            }
            this.setIsLoading(false);
        })
    }

    getRoleById(id){
        return axios.get(`uaa/v1/roles/${id}`);
    }

    updateRoleById(id,role){
        return axios.put(`/uaa/v1/roles/${id}`, JSON.stringify(role));
    }

    deleteRoleById(id){
        return axios.delete(`/uaa/v1/roles/${id}`);
    }

}

const roleStore = new RoleStore();

export default roleStore;
