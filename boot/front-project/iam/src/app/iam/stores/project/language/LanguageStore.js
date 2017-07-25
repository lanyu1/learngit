/**
 * Created by song on 2017/6/27.
 */

import {observable, action, computed} from 'mobx';
import axios from '../../../common/axios';
import store from '../../../common/store';

@store("LanguageStore")
class LanguageStore {
  @observable LanguageData = [];
  @observable totalSize;
  @observable totalPage;
  @observable isLoading = true;

  constructor(totalPage = 1, totalSize = 0) {
    this.totalPage = totalPage;
    this.totalSize = totalSize;
  }

  @action setLanguageData(data) {
    this.LanguageData = data;
  }

  @computed get getLanguageData() {
    return this.LanguageData.slice();
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

  loadLanguage(page, size) {
    this.changeLoading(true);
    axios.get(`/fws/v1/languages?page=${page}&size=${size}`).then(data => {
      if (data) {
        this.setLanguageData(data.content);
        this.setTotalPage(data.totalPages);
        this.setTotalSize(data.totalElements);
        this.changeLoading(false);
      }
    });
  }

  getLanguageByCode(code) {
    return axios.get(`/fws/v1/languages/${code}`);
  }

  updateLanguage(code, language) {
    return axios.put(`/fws/v1/languages/${code}`,JSON.stringify(language));
  }
}

const languageStore = new LanguageStore();

export default languageStore;
