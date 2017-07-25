/**
 * Created by jaywoods on 2017/6/24.
 */
import React, {Component} from 'react';
import {Menu, Icon} from 'antd';
import {FormattedMessage} from 'react-intl';
import {Icons} from '../../../../../../boot/src/containers/common/Icons';
import {Routes} from '../../../../../../boot/src/containers/common/RouterMap';
import {observer, inject} from 'mobx-react';
import menuStore from '../../stores/MenuStore';
import {withRouter, NavLink} from 'react-router-dom';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const styles = {
  menuIcon: {
    lineHeight: '22px',
    margin: '10px',
    marginLeft: '-12px',
    fontSize: '15px',
    textAlign: 'center'
  }
};
@observer
class MainMenu extends Component {
  constructor(props) {
    super(props);
  }

  loadResourceMenu = (service, path) => {
    const {history} = this.props;
    history.push(path);
    menuStore.setResourceMenuData(service);
    menuStore.changeMainVisible(false);
    //路由跳转
  };
  changeVisible = () => {
    let visble = menuStore.isVisible;
    menuStore.changeMainVisible(!visble);
  };

  render() {
    const menu = menuStore.getMenuData;
    let menus;
    let listTitle = [];
    let listService = [];
    let listResource = [];
    let serviceMenus;
    let resourceMenus;
    let modal = {
      position: 'fixed',
      top: 48,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(33,33,33,0.48)',
      display: 'none',
      zIndex: -1
    }
    const div = document.getElementById("menu");
    const content = document.getElementById("content");
    let i = 0;

    if (menu) {
      menus = menu;
      menus.map((key, indexTitle) => {
        serviceMenus = key.services || [];
        listService = [];
        serviceMenus.map((subItem, indexContent) => {
          resourceMenus = subItem.menus || [];
          listResource = [];
          resourceMenus.map((reItem, index2) => {
            listResource.push(
              <Menu.Item
                key={reItem.code}
              >
                <a onClick={this.loadResourceMenu.bind(this, subItem, Routes[reItem.code])}>
                <span>
                  <Icon style={styles.menuIcon} type={Icons[reItem.code]}/>
                  <span><FormattedMessage id={reItem.code != null ? reItem.code : 'null'}
                                          defaultMessage={reItem.code != null ? reItem.code : 'null'}/></span>
                </span>
                </a>
              </Menu.Item>
            );
          });

          listService.push(
            <SubMenu key={subItem.code}
                     title={<FormattedMessage id={subItem.code} defaultMessage={subItem.code}/>}>
              {listResource}
            </SubMenu>
          );
        });
        listTitle.push(
          <MenuItemGroup key={key.code} title={<FormattedMessage id={key.code} defaultMessage={key.code}/>}>
            {listService}
          </MenuItemGroup>
        );
      })
    }
    if (div) {
      if (menuStore.isVisible) {
        if (parseInt(div.style.left) < 0) {
          content.style.display = 'block';
          document.getElementsByTagName('body')[0].style.overflow = 'hidden';
          var z = setInterval(function () {
            // i = i + 50;
            if (parseInt(div.style.left) + i == 0) {
              clearInterval(z);
            } else {
              if (parseInt(div.style.left) == 0) {
                div.style.left = '0px';
                clearInterval(z);
              } else {
                div.style.left = parseInt(div.style.left) + 5 + 'px';

              }
            }
          }, 1);
        }

      } else {
        //变小
        if (parseInt(div.style.left) == 0) {
          var t = setInterval(function () {
            content.style.display = 'none';
            document.getElementsByTagName('body')[0].style.overflow = 'visible';
            i = i + 30;
            if (div.clientLeft < -9000) {
              clearInterval(t);
            } else {
              if ((div.clientWidth - i) < -20) {
                clearInterval(t);
              } else {
                div.style.left = (div.clientLeft - i) + 'px';
              }
            }

          }, 1);
        }

      }
    }
    return (
      <div style={{height: '100%'}}>
        <Menu mode="vertical" style={{height: '100%'}} defaultOpenKeys={["home"]} id="menu">
          {listTitle}
        </Menu>
        <div style={modal} id="content" onClick={this.changeVisible}></div>
      </div>

    );
  }

}

export default withRouter(MainMenu);
