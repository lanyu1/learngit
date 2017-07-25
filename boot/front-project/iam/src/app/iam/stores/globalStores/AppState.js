import {observable, action, computed} from 'mobx';

class AppState {
  @observable timer = 0;
  @observable language = "zh";
  @observable user;
  @observable isAuthenticated;
  @observable menuType;


  constructor(isAuthenticated=false) {
    this.isAuthenticated=isAuthenticated;
  }

  @computed get currentLanguage() {
    return this.language;
  }

  @computed get currentUser() {
    return this.user;
  }

  @computed get isAuth() {
    return this.isAuthenticated;
  }

  @computed get currentMenuType() {
    return this.menuType;
  }

  @action changeLanguageTo(language) {
    this.language = language;
  }

  @action setCurrentUser(user){
    this.user=user;
  }

  @action setAuthenticated(flag){
    this.isAuthenticated=flag;
  }

  @action changeMenuType(type) {
    this.menuType = type;
  }

  @action resetTimer() {
    this.timer = 0;
  }
}

const appState = new AppState();
export default appState;