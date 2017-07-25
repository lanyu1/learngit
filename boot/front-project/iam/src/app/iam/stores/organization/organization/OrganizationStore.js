/**
 * Created by cheon on 6/26/17.
 */

import {observable, action, computed} from 'mobx';
import axios from '../../../common/axios';
import store from '../../../common/store';

@store("OrganizationStore")
class OrganizationStore {
    @observable organization = '';
    @observable isLoading=true;

    @action setOrganization(data){
        this.organization = data;
    };

    @computed get getOrganization(){
        return this.organization;
    }

    @action setIsLoading(flag){
        this.isLoading=flag;
    }

    @computed get getIsLoading(){
        return this.isLoading;
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

    updateOrganization(organizationId, organization){
        return axios.put(`uaa/v1/organizations/${organizationId}`, JSON.stringify(organization));
    }
}

const organizationStore = new OrganizationStore();
export default organizationStore;
