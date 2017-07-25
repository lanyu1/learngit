/**
 * Created by jaywoods on 2017/6/23.
 */

import React, { Component } from 'react';
import axios from '../common/axios';
import { observer, inject } from 'mobx-react';
import { Menu, Icon, Popover, Button, Card, Select, Modal, Spin, Row, Col, Table } from 'antd';
import AutoRouter from '../../generate/AutoRouter';
import '../assets/css/main.less';
import jsa from '../assets/images/jsa-128.jpg';
import MenuType from '../components/menu/MenuType';
import MainMenu from '../components/menu/MainMenu';
import ResourceMenu from '../components/menu/ResourceMenu';
import menuStore from '../stores/MenuStore';
import {Routes} from '../../../../../boot/src/containers/common/RouterMap';
import UserPreferences from './UserPreferences';

@inject("AppState")
@observer
class Masters extends Component {
  getStyles() {
    const styles = {
      main: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        zIndex: 100
      },
      body: {
        flex: '1 1 0%',
        display: 'flex',
        //paddingTop: `${config.DEFAULT_THEME.spacing.desktopKeylineIncrement}px`,
      },
      appBar: {
        backgroundColor: '#3b78e7',
        // Needed to overlap the examples
        top: 0,
        height: 48,
      },
      titleStyle: {
        fontSize: '18px'
      },

      listItem: {
        paddingTop: '0',
        paddingBottom: '0',
        paddingRight: '0'
      },
      iconMenu: {
        width: '280px',
      },
      help: {
        marginTop: '12px',
        //minWidth: '65px',
        fontSize: '12px'
      },
      signOut: {
        marginTop: '12px',
        //minWidth: '65px',
        fontSize: '12px'
      },
      personalInfo: {
        marginTop: '12px',
        marginBottom: '8px',
        textAlign: 'center',
      },
      rsButtonDiv: {
        backgroundColor: '#F5F5F5',
        height: '60px'
      },
      labelStyle: {
        fontSize: '12px'
      },
      cascader: {
        width: '95px',
        position: "absolute",
        top: "10px",
        right: "100px",
        zIndex: "1100"
      },
      content: {
        flex: '1 1 0',
        order: 2,
        flexDirection: 'column',
      },
      resourceMenu: {
        flex: '0 0 14em',
        order: 1,
        zIndex: 3,
        backgroundColor: '#fafafa',
       // height: this.state.height
        //marginLeft:'-20em',
      },
      mainMenu: {
        flex: 'none',
        width: '16em',
        height: '100%',
        position: 'absolute',
        left: '0',
        float: 'left',
        zIndex: '6',
      },
      menuIcon: {
        lineHeight: '22px',
        margin: '10px',
        marginLeft: '-12px',
        fontSize: '15px',
        textAlign: 'center'
      },
      container: {
        display: 'flex',
        flex: '1 1 auto',
        backgroundColor: '#fafafa',
        //height: this.state.height
      },
      menuStyle: {
        height: '100%'
      }
    };

    return styles;
  }

  constructor(props) {
    super(props);
    this.state = {
      height: document.body.clientHeight-48,
      containerHeight: "auto"
    }
  }
  // myBrowser = () => {
  //   let userAgent = navigator.userAgent;
  //   let isOpera = userAgent.indexOf("Opera") > -1;
  //   if (isOpera) {
  //     this.setState({
  //               containerHeight: "auto",
  //       height: "100%"
  //     })
  //   }
  //   if (userAgent.indexOf("Firefox") > -1) {
  //     this.setState({
  //               containerHeight: "auto",
  //       height: "100%"
  //     })
  //   }
  //   if (userAgent.indexOf("Chrome") > -1) {
  //     this.setState({
  //       containerHeight: "auto",
  //       height: "100%"
  //     })
  //   }
  //   if (userAgent.indexOf("Safari") > -1) {
  //     this.setState({
  //       containerHeight: "100%",
  //       height: document.body.clientHeight
  //     })
  //   }
  //   if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
  //     this.setState({
  //               containerHeight: "auto",
  //       height: "100%"
  //     })
  //   }
  // };

  componentWillMount() {
    this.handleAuth();
  }

  handleAuth = () => {
    const { AppState, history } = this.props;
    let token = HAP.getAccessToken(window.location.hash);
    if (token) {
      HAP.setAccessToken(token, 60 * 60);
    }
    axios.get('/uaa/v1/users/querySelf').then(response => {
      let user = response;
      if (user.name) {
        AppState.setAuthenticated(true);
        if ("en_US" == user.language) {
          AppState.changeLanguageTo('en');
        } else {
          AppState.changeLanguageTo('zh');
        }
        AppState.setCurrentUser(user);
        history.replace("/");
      }
    });

  };
  handleClick = () => {
    console.log("handleClick");
  };
  handleTouchTapLeftIconButton = () => {
    let visible = menuStore.isVisible;
    /*this.setState({
      height: document.body.clientHeight,
    })*/
    menuStore.changeMainVisible(!visible);
  };

  render() {
    const { AppState, children, history } = this.props;
    const styles = this.getStyles();
    let paperStyle = {

      height: '100%',
      position: 'fixed',
      left: 0,
      width: 250,
      zIndex: 6,

      //...styles.mainMenu,
      //display: menuStore.isVisible ? 'block' : 'none'
    };
    return (
      <div>
        {AppState.isAuth ?
          (
            <div style={styles.main}>
              <Menu
                mode="horizontal"
                style={styles.appBar}
              >
                <Menu.Item style={{ float: 'left' }}>
                  <a onClick={this.handleTouchTapLeftIconButton} className="menuIcon"></a>
                </Menu.Item>
                <Menu.Item>
                  <span style={{ fontSize: 18, color: "white", marginLeft: -20 }}>Hand Cloud Platform</span>
                </Menu.Item>
                <Menu.Item>
                  <MenuType />
                </Menu.Item>
                <Menu.Item style={{ float: 'right', paddingTop: '6px' }}>
                  {/*   用户信息弹框*/}
                  <UserPreferences history={history} />
                </Menu.Item>
              </Menu>
              <div style={styles.body}>
                <div style={styles.container}>
                  <div style={styles.content}>
                    <AutoRouter />
                  </div>
                  <div style={styles.resourceMenu} id="menuItem">
                    <ResourceMenu />
                  </div>
                  {/*侧边导航栏*/}
                  <div style={paperStyle} id="menu">
                    <MainMenu />
                  </div>

                </div>
              </div>
            </div>
          ) : (<Spin
            style={{ marginTop: 300, display: 'inherit', marginLeft: '50%', marginRight: 'auto', }} />)}
      </div>);

  }
}

export default Masters;
