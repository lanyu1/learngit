/**
 * Created by jaywoods on 2017/6/24.
 */
import {observable, action, computed} from 'mobx';
import axios from '../common/axios';

class MenuStore {
  @observable menu;
  @observable resourceMenu;
  @observable visible;

  constructor() {
    this.visible = true;
    this.resourceMenu=[];
  }

  //加载主菜单数据
  loadMenuData(url) {
    axios.get(url).then(data => {
      menuStore.setMenuData(data);
    });
  }

  @action setMenuData(data) {
    this.menu = data;
  }

  @computed get getMenuData() {
    return this.menu;
  }

  @action setResourceMenuData(data) {
    this.resourceMenu = data;
  }

  @computed get getResourceMenuData() {
    return this.resourceMenu;
  }

  @action changeMainVisible(flag) {
    this.visible = flag;
  }

  @computed get isVisible() {
    return this.visible;
  }

}

const menuStore = new MenuStore();

export default menuStore;