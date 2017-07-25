/**
 * Created by hand on 2017/7/3.
 */
import React, {Component} from 'react';
import axios from '../common/axios';
import {observer, inject} from 'mobx-react';
import {Menu, Icon, Popover, Button, Card, Select, Modal, Spin, Row, Col, Table} from 'antd';
import '../assets/css/main.less';
import jsa from '../assets/images/jsa-128.jpg';
import menuStore from '../stores/MenuStore';
import {Routes} from '../../../../../boot/src/containers/common/RouterMap'
@inject("AppState")
@observer
class UserPreferences extends Component {
  getStyles() {
    const styles = {
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
    };
    return styles;
  }

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    }
  }

  componentWillMount() {
  }

  preferences = () => {
    const {history}= this.props;
    axios.get('/uaa/v1/menus/user').then(data=> {
      if (data) {
        let userMenu = data[0].services[0];
        userMenu.code = "user.preferences";
        menuStore.setResourceMenuData(userMenu);
        menuStore.changeMainVisible(false);
        let resources = userMenu.resources;
        history.push(Routes[resources[0].code]);
      }
    })
    this.setState({
      visible: false,
    })

  };

  handleClick = () => {
    console.log("handleClick");
  };

  handleVisibleChange = (visible) => {
    this.setState({visible});
  };

  render() {
    const {AppState, children} = this.props;
    const styles = this.getStyles();
    const user = AppState.currentUser;
    const AppBarIconRight = (
      <div>
        <Row>
          <Col span={24} style={{textAlign: 'center'}}><img src={jsa}
                                                            style={{width: 80, borderRadius: '50%', marginTop: 15}}/>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{textAlign: 'center'}}>{user ? user.name : ''}
          </Col>
        </Row>
        < Row style={styles.rsButtonDiv}>
          <Col style={{marginLeft: "14px", float: "left"}}>
            <Button style={styles.help}
                    onClick={this.preferences.bind(this)}>{HAP.languageChange("user.preferences")}</Button>
          </Col>
          <Col style={{marginRight: "14px", float: "right"}}>
            <Button style={styles.signOut} type="primary" onClick={() => {
              HAP.logout()
            }}>{HAP.languageChange("signOut")}</Button>
          </Col>
        </Row>
      </div>
    );
    return (
      <Popover overlayClassName="menuPop" content={AppBarIconRight} trigger="click"
               style={{padding: '0!import'}}
               visible={this.state.visible}
               placement="bottomRight"
               onVisibleChange={this.handleVisibleChange}
      >
        <img className="popClass" src={jsa} alt="" style={{width: 30, borderRadius: '50%'}}/>
      </Popover>
    );
  }
}

export default UserPreferences;
