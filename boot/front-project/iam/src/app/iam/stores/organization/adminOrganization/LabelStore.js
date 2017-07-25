/**
 * Created by jaywoods on 2017/7/5.
 */
import {observable, action, computed} from 'mobx';
import axios from '../../../common/axios';
import store from '../../../common/store';

@store("LabelStore")
class LabelStore {

  @observable show = false;
  @observable selectRows = [];

  @action changeShow(flag) {
    this.show = flag;
  }

  @action setRows(rows) {
    this.selectRows = rows;
  }

  @computed get getSelectRows() {
    return this.selectRows ? this.selectRows.slice() : [];
  }


  getOrganizationById = (id) => axios.get(`/admin/v1/organizations/${id}`);

  deleteLabelById = (id) => axios.delete(`/admin/v1/labels/${id}`);

  getServiceByLabel = (labels) => axios.get(`/admin/v1/labels/${labels}/services`);

  getDeploymentByLabel =(labels) => axios.get(`/deploymentAdmin/v1/labels/getDeployments/${labels}`);

}
const labelStore = new LabelStore();

export default labelStore;
