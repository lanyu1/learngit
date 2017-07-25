

/**
 * Created by jaywoods on 2017/6/24.
 */
import React, {Component} from 'react';
import {Icon, Modal, Button, Table} from 'antd';
import {observer, inject} from 'mobx-react'
import {Icons} from '../../../../../../boot/src/containers/common/Icons';
import axios from '../../common/axios';
import menuStore from '../../stores/MenuStore';
import {withRouter} from 'react-router-dom';
const ORGANIZATION_TYPE="organization";
const PROJECT_TYPE="project";

@inject("AppState")
@observer
class MenuType extends Component {
  constructor(props) {
    super(props);
    this.handleRowClick = this.handleRowClick.bind(this);
    this.state = {
      modalVisible: false,
    };
  };

  componentWillMount(){
    const {AppState} = this.props;
    axios.get('/uaa/v1/menus/select').then(res=>{
      let data = res.organizations;
      let projects = res.projects;
      //设置默认菜单类型
      if(data&&data.length!=0){
        let defaultOrganization=data[0];
        AppState.changeMenuType({
          id:defaultOrganization.id,
          type:ORGANIZATION_TYPE,
          name:defaultOrganization.name
        });
        menuStore.loadMenuData(`/uaa/v1/menus/organization/${defaultOrganization.id}`);
      }else if(projects&&projects.length!=0){
        let defaultProject=projects[0];
        AppState.changeMenuType({
          id:defaultProject.id,
          type:PROJECT_TYPE,
          organizationId:defaultProject.organizationId,
          name:defaultProject.name
        });
        menuStore.loadMenuData(`/uaa/v1/menus/project/${defaultProject.id}`);
      }}
      );
  }

  showModal = () => {
    this.loadData();
    this.setState({
      modalVisible: true,
    });
  };

  //加载有权限的组织和项目
  loadData = () => {
    axios.get('/uaa/v1/menus/select').then(res=>{
      let data = res.organizations;
      let projects = res.projects;
      data.map((item, index) => {
        item.key = "organization" + item.id;
        item.type = ORGANIZATION_TYPE;
        item.children = [];
        projects.map((project, index2) => {
          if (item.id == project.organizationId) {
            project.type = PROJECT_TYPE;
            project.key = "project" + project.id;
            item.children.push(project);
          }
        });
      });
      this.setState({
        data: data,
      });
    });

  };

  handleRowClick = (row) => {
    const {AppState,history} = this.props;
    let tmp={
      id:row.id,
      type:row.type,
      name:row.name
    },url;

    if(row.type==ORGANIZATION_TYPE){
      url ='/uaa/v1/menus/organization';
    }else{
      url = '/uaa/v1/menus/project';
      tmp={...tmp,organizationId:row.organizationId}
    }
    //更新菜单类型
    AppState.changeMenuType(tmp);
    this.setState({
      modalVisible: false,
    });
    
    menuStore.changeMainVisible(true);
    menuStore.setResourceMenuData([]);
    menuStore.loadMenuData(`${url}/${row.id}`);
    //跳转到首页
    history.push("/");
  };

  handleCancel = (e) => {
    this.setState({
      modalVisible: false,
      data:[]
    });
  };


  render() {
    const {AppState} = this.props;
    const menuType=AppState.currentMenuType;
    let name = menuType ? menuType.name : HAP.languageChange("choose");
    let type =menuType ? menuType.type:'select';

    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: '60%',
        render: (text, row, index) => {
          return (<span style={{cursor: "pointer"}}><Icon type={Icons[row.type]}/>&nbsp;{text}</span>);
        }
      }, {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: '40%',
      }
    ];

    return (
        <span>
        <a onClick={this.showModal} style={{color: "white"}}>
          <Icon type={Icons[type]}/>
          <span style={{marginRight: 2}}>{name}</span>
          <Icon type="caret-down"/>
        </a>
        <Modal
            title={HAP.languageChange("select")}
            visible={this.state.modalVisible}
            onCancel={this.handleCancel}
            width={800}
            footer={[
              <Button key="back" size="large"
                      onClick={this.handleCancel}>{HAP.languageChange("cancel")}</Button>
            ]}
        >
          <Table columns={columns}
                 bordered
                 scroll={{y: 300}}
                 onRowClick={this.handleRowClick}
                 size="middle"
                 defaultExpandAllRows={true}
                 className="components-table-demo-nested"
                 dataSource={this.state.data}
                 loading={this.state.loading}
                 pagination={false}
          />
        </Modal>
      </span>
    );
  }
}

export default withRouter(MenuType);
