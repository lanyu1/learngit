/**
 * Created by Lty on 2017/6/25.
 */
import {observable, action, computed} from 'mobx';
import axios from '../../../common/axios';
import store from '../../../common/store';

@store("ExcelStore")
class ExcelStore {
  @observable isLoading = true;

  @action changeLoading(flag) {
    this.isLoading = flag;
  }

  @computed get getIsLoading() {
    return this.isLoading;
  }

  loadExcel() {
    this.changeLoading(true);
    axios.get(`/uaa/v1/excels`)
      .then(data => {
        const fileDownload = require('react-file-download');
        fileDownload(data, 'users.xls', 'application/vnd.ms-excel');});
}
}
const excelStore = new ExcelStore();

export default excelStore;
