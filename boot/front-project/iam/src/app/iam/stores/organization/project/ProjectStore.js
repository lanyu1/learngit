/**
 * Created by jinqin.ma on 2017/6/27.
 */
import {observable, action, computed} from 'mobx';
import axios from '../../../common/axios';
import store from '../../../common/store';

@store("ProjectStore")
class ProjectStore{
    @observable projectData=[];
    @observable totalSize;
    @observable totalPage;
    @observable isLoading=true;
    constructor(totalPage = 1, totalSize = 0) {
        this.totalPage = totalPage;
        this.totalSize = totalSize;
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
    @action setProjectData(data) {
        this.projectData = data;
    }

    @computed get getProjectData() {
        return this.projectData.slice();
    }

    @action changeLoading(flag) {
        this.isLoading = flag;
    }

    @computed get getIsLoading() {
        return this.isLoading;
    }
    loadProject(organizationId, page) {
        this.changeLoading(true);
        axios.get(`/uaa/v1/organization/${organizationId}/projects?page=${page}&size=10`).then(data => {
            if (data) {
                this.setProjectData(data.content);
                this.setTotalPage(data.totalPages);
                this.setTotalSize(data.totalElements);
            }
            this.changeLoading(false);
        });
    }
    createProject(organizationId,projectData){
        return axios.post(`/uaa/v1/organization/${organizationId}/projects`,JSON.stringify(projectData));
    }

    updateProject(organizationId,projectData,id){
        return axios.put(`/uaa/v1/organization/${organizationId}/projects/${id}`,JSON.stringify(projectData));
    }
    getProjectById(organizationId, id) {
        return axios.get(`/uaa/v1/organization/${organizationId}/projects/${id}`);
    };
    deleteProjectById(organizationId,id){
        return axios.delete(`/uaa/v1/organization/${organizationId}/projects/${id}`);
    }
}
const projectStore=new ProjectStore();
export default projectStore;
