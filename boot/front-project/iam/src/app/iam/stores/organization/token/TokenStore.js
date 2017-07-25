/**
 * Created by song on 2017/6/27.
 */

import {observable, action, computed} from 'mobx';
import axios from '../../../common/axios';
import store from '../../../common/store';

@store("TokenStore")
class TokenStore {
    @observable TokenData = [];
    @observable totalSize;
    @observable totalPage;
    @observable isLoading = true;

    constructor(totalPage = 1, totalSize = 0) {
        this.totalPage = totalPage;
        this.totalSize = totalSize;
    }

    @action setTokenData(data) {
        this.TokenData = data;
    }

    @computed get getTokenData() {
        return this.TokenData.slice();
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

    loadToken(page, size) {
        this.changeLoading(true);
        axios.get(`/uaa/v1/tokens/self?page=${page}&size=${size}`).then(data => {
            if (data) {
                this.setTokenData(data.content);
                this.setTotalPage(data.totalPages);
                this.setTotalSize(data.totalElements);
                this.changeLoading(false);
            }
        });
    }

    deleteToken(clientName){
        return axios.delete(`/uaa/v1/tokens/self/${clientName}`);
    }
}

const tokenStore = new TokenStore();

export default tokenStore;
