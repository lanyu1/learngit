/**
 * Created by Lty on 2017/6/19.
 */

import React, { Component, PropTypes } from 'react'

import {
  Table,
  Icon,
  Button,
  Spin,
  Tooltip,
  Modal,
  Row,
  Col,
  Input,
  Tabs,
  Checkbox,
  BackTop,
  Select,
  Tree,
  Menu,
  message,
  Mention
} from 'antd';
import Remove from '../../../components/Remove';
import RoleList from '../../../components/memberRole/RoleList'
import RolePanels from '../../../components/memberRole/RolePanels';
import RoleCas from '../../../components/memberRole/RoleCas';
import { withRouter } from 'react-router-dom';
import PageHeader, { PageHeadStyle } from '../../../components/PageHeader';
import { observer, inject } from 'mobx-react';
import './all.css';
import uniq from 'lodash/uniq';

const style = {
  container: {
    display: 'flex',
    flex: '1 1 auto',
    backgroundColor: '#fafafa',
    flexDirection: 'column',
    height: '100%'
  },
  top: {
    top: 0,
    height: 48,
    flexDirection: 'row'
  },
  bottom: {
    flex: '1 1 0%',
    display: 'flex',
    flexDirection: 'row'
  },
  left: {
    flex: '1 1 0',
    order: 1,
    width: '60%',
    flexDirection: 'row',
    flexGrow: '3',
  },
  right: {
    flex: '1 1 0',
    order: 2,
    flexDirection: 'row',
    //paddingLeft:'10px',
    borderLeft: '1px solid #F4F4F4',
    flexGrow: '1',
  },
  tip: {
    backgroundColor: '#fafafa',
  }
};
const TabPane = Tabs.TabPane;
const SubMenu = Menu.SubMenu;
const Option = Select.Option;
const Search = Input.Search;
const toContentState = Mention.toContentState;

@inject("AppState")
@observer
class ProjectMemberRole extends Component {
  constructor(props, context) {
    super(props, context);
    this.loadRoles = this.loadRoles.bind(this);
    this.loadMemberRoles = this.loadMemberRoles.bind(this);
    this.state = {
      isLoading: true,
      selectedRowKeys: [],
      selectedRow: [],
      roleData: [],
      userData: [],
      isUser: false,
      organizationId: 1,
      isShow: false,
      roleKeys: [],
      memberId: '',
      addModelVisible: false,
      selectRoleModalVisible: false,
      SelectButtonText: HAP.getMessage("未选择", "Not Select"),
      addModalRoleData: [],
      removeMemberId: {},
      organizationSelectId: null,
      valueMention: toContentState(' '),
    };
  }

  componentDidMount() {
    this.loadMemberRoles();
  }
  componentWillMount() {
    const { AppState, ProjectMemberRoleStore } = this.props;
    const menuType = AppState.currentMenuType;
    let organizationId = menuType.organizationId;
    let projectId = menuType.id;
    this.loadRoles();
    this.loadUserData(organizationId);
  }

  //加载角色列表数据
  loadRoles = () => {
    const { AppState, ProjectMemberRoleStore } = this.props;
    const menuType = AppState.currentMenuType;
    let organizationId = menuType.organizationId;
    let projectId = menuType.id;
    ProjectMemberRoleStore.loadRoles(organizationId);
    // fetch(`${API_ROLE}?page=0&size=999`, {
    //   headers: HAP.getHeader()
    // }).then(HAP.convertResponse(this)).then((data) => {
    //   if (data) {
    //     //dispatch(rolesLoaded(data))
    //     this.setState({
    //       roleData: data.content
    //     });
    //   }
    // }).catch(HAP.catchHttpError());
  };

  //查询分配了角色的成员数据
  loadMemberRoles = () => {
    const { AppState, ProjectMemberRoleStore } = this.props;
    const menuType = AppState.currentMenuType;
    let organizationId = menuType.organizationId;
    let projectId = menuType.id;
    ProjectMemberRoleStore.loadMemberRoles(projectId);
    // fetch(`${USER_API_HOST}/organization/${organizationId}/memberRoles`, {
    //   headers: HAP.getHeader()
    // }).then(HAP.convertResponse(this)).then((data) => {
    //   if (data) {
    //     dispatch(memberRolesLoaded(data));
    //     this.setState({
    //       isLoading: false,
    //       isShow:false,
    //     });
    //   }
    // }).catch(HAP.catchHttpError());
  };

  //查询组织下的用户数据
  loadUserData = () => {
    const { AppState, ProjectMemberRoleStore } = this.props;
    const menuType = AppState.currentMenuType;
    let organizationId = menuType.organizationId;
    let projectId = menuType.id;
    ProjectMemberRoleStore.loadUserData(organizationId);
    // fetch(`${USER_API_HOST}/organization/${organizationId}/users?page=0&size=999`, {
    //   headers: HAP.getHeader()
    // }).then(HAP.convertResponse(this)).then((data) => {
    //   if (data) {
    //     this.setState({
    //       userData: data.content
    //     });
    //   }
    // }).catch(HAP.catchHttpError());
  };

  //将成员角色数据按成员或角色分组
  getDataSource = (data) => {
    //gruop by member
    let objArr = [];
    data.map((item, index) => {
      let memberId = item.memberId;
      if (!objArr[memberId]) {
        objArr[memberId] = {};
        objArr[memberId]["memberId"] = item.memberId;
      }
      if (!objArr[memberId]["memberType"]) {
        objArr[memberId]["memberType"] = item.memberType;
      }
      if (!objArr[memberId]["userName"]) {
        objArr[memberId]["userName"] = item.userName;
      }
      if (!objArr[memberId]["userEmail"]) {
        objArr[memberId]["userEmail"] = item.userEmail;
      }
      if (!objArr[memberId]["roles"]) {
        objArr[memberId]["roles"] = [];
      }
      let role = {
        "id": item.id,
        "roleId": item.roleId,
        "roleName": item.roleName,
        "roleDescription": item.roleDescription,
      };
      objArr[memberId]["roles"].push(role);
    });
    let memberDataSource = objArr.filter(item => typeof (item != undefined));
    // groupby role
    let roleArr = [];
    data.map((item, index) => {
      let roleId = item.roleId;
      if (!roleArr[roleId]) {
        roleArr[roleId] = {};
        roleArr[roleId]["roleId"] = item.roleId;
      }
      if (!roleArr[roleId]["roleName"]) {
        roleArr[roleId]["roleName"] = item.roleName;
      }
      if (!roleArr[roleId]["roleDescription"]) {
        roleArr[roleId]["roleDescription"] = item.roleDescription;
      }
      if (!roleArr[roleId]["member"]) {
        roleArr[roleId]["member"] = [];
      }
      let member = {
        "memberId": item.memberId,
        "memberType": item.memberType,
        "userName": item.userName,
        "userEmail": item.userEmail,
        "roles": objArr[item.memberId]["roles"]
      };
      roleArr[roleId]["member"].push(member);
    });
    let rolesdataSource = roleArr.filter(item => typeof (item != undefined));
    return { "memberDataSource": memberDataSource, "rolesdataSource": rolesdataSource }
  };


  //将角色数据转换成tree数据
  convertRolesToTreeData = (roles) => {
    const { AppState } = this.props;
    let language = AppState.currentLanguage;
    let tree = [], objArr = {};
    roles.map((item, index) => {
      let child = [];
      let name = item.name.split('/')[1];
      let tmp = name.split('.');
      let serviceCode = tmp[0];
      if (!objArr[serviceCode]) {
        objArr[serviceCode] = {
          "label": item.serviceName,
          "value": serviceCode,
          "key": serviceCode,
          "children": []
        };
      }
      let childNode = {
        "label": item.description,
        "value": item.id.toString(),
        "key": item.name,
      };
      objArr[serviceCode]["children"].push(childNode);

    });

    for (let i in objArr) {
      tree.push(objArr[i]);
    }
    return tree;
  };

  //处理主界面表单前的选择框
  onSelectChange = (selectedRowKeys, selectedRow) => {
    this.setState({ selectedRowKeys, selectedRow });
  };

  //处理表格中角色分配按钮，点击显示角色分配树，以及传递已分配角色的id和成员id
  handleAssignShow = (recode) => {
    const { ProjectMemberRoleStore } = this.props;
    const isShow = ProjectMemberRoleStore.getIsShow;
    if (isShow) {
      return;
    }
    if (recode) {
      let roles = recode.roles;
      let tmp = [];
      roles.map(item => {
        tmp.push(item.roleId.toString())
      });
      ProjectMemberRoleStore.setShow(true);
      this.setState({
        roleKeys: tmp,
        memberId: recode.memberId
      });
    }
  };

  //打开单个删除提示框
  handleRemoveOpen = (member) => {
    this.setState({ open: true, removeMember: member, });

  };

  //关闭单个删除提示框
  handleRemoveClose = () => {
    this.setState({ open: false });
  };

  //处理单个删除
  handleDelete = () => {
    const { ProjectMemberRoleStore } = this.props;
    const { removeMember } = this.state;
    let roles = removeMember.roles;
    let success = 0, total = roles.length;
    roles.map(item => {
      ProjectMemberRoleStore.handleDelete(item.id, success, total, this.loadMemberRoles());
      //  fetch(`${API_MEMBER_ROLE}/${item.id}`,{
      //  headers:HAP.getHeader(),
      //  method:"DELETE"
      //  }).then(HAP.convertResponse(this)).then(()=>{
      //    success++;
      //    if(success==total){
      //      this.loadMemberRoles();
      //      this.setState({open: false});
      //    }
      //  }).catch(HAP.catchHttpError());
      this.setState({ open: false });
    });
    this.loadMemberRoles();
  };

  //打开批量删除提示框
  handleBatchRemoveOpen = () => {
    const { selectedRow } = this.state;
    if (selectedRow.length == 0) {
      message.warning(HAP.getMessage("未选择任何项", "Not select anything"));
      return;
    }
    this.setState({ batchDeleteOpen: true });
  };

  //关闭批量删除提示框
  handleBatchRemoveClose = () => {
    this.setState({ batchDeleteOpen: false });
  };

  //处理批量删除
  handleBatchDelete = () => {
    const { selectedRow } = this.state;
    const { ProjectMemberRoleStore } = this.props;
    let memberRoleIds = [];
    selectedRow.map(item => {
      let roles = item.roles;
      roles.map(role => {
        memberRoleIds.push(role.id);
      });
    });
    let success = 0, total = memberRoleIds.length;
    memberRoleIds.map(id => {
      ProjectMemberRoleStore.handleBatchDelete(id, success, total, this.loadMemberRoles());
      // fetch(`${API_MEMBER_ROLE}/${id}`,{
      //   headers:HAP.getHeader(),
      //   method:"DELETE"
      // }).then(HAP.convertResponse(this)).then(()=>{
      //   success++;
      //   if(success==total){
      //     this.loadMemberRoles();
      //     this.setState({batchDeleteOpen: false,selectedRowKeys:[],selectedRow:[]});
      //   }
      // }).catch(HAP.catchHttpError());
    });
    this.setState({
      batchDeleteOpen: false,
      selectedRowKeys: [],
      selectedRow: []
    });
    this.loadMemberRoles();
  };

  //隐藏右边角色树
  handleClose = () => {
    const { ProjectMemberRoleStore } = this.props;
    const isShow = ProjectMemberRoleStore.setShow(false);
  };

  //作为属性传入RoleList组件，用来处理修改角色保存
  handleRoleSave = (data) => {
    const { AppState, ProjectMemberRoleStore } = this.props;
    const menuType = AppState.currentMenuType;
    let organizationId = menuType.organizationId;
    let projectId = menuType.id;
    if (data.length == 0) {
      message.warning(HAP.getMessage("未修改或未选择任何项", "Not select or fix anything"));
      return;
    }
    const { memberId } = this.state;
    let role = {
      "memberId": memberId,
      "memberType": "user",
      "resourceId": projectId,
      "resourceType": "project",
      "roles": data
    };
    ProjectMemberRoleStore.handleRoleSave(role, this.loadMemberRoles());
    setInterval(this.loadMemberRoles(), 1);
    // fetch(`${API_MEMBER_ROLE}/setMemberRole`,{
    //   headers:HAP.getHeader(),
    //   method:"PUT",
    //   body:JSON.stringify(role)
    // }).then((res)=>{
    //   if(res.ok){
    //     message.info("修改成功");
    //     this.loadMemberRoles();
    //     this.setState({isShow:false});
    //   }
    // }).catch(HAP.catchHttpError());
    this.loadMemberRoles();
  };

  //处理添加成员时，窗口的保存按钮
  handleAddOk = () => {
    let memberName = this.state.valueMention;
    if (!memberName) {
      message.warning(HAP.getMessage("请输入成员名称或邮箱", "Please input name or email of member"));
      return;
    }
    const { AppState, ProjectMemberRoleStore } = this.props;
    const menuType = AppState.currentMenuType;
    let organizationId = menuType.id;
    let projectId = menuType.id;
    const userData = ProjectMemberRoleStore.getuserData;
    let { addModalRoleData } = this.state;
    if (addModalRoleData.length == 0) {
      message.warning(HAP.getMessage("请选择角色", "Please select member"));
      return;
    }
    let tmp = userData.filter(item => (item.name == memberName || item.email == memberName));
    if (tmp.length > 0) {
      let memberId = tmp[0].id;
      let data = [];
      addModalRoleData.map(item => {
        data.push({
          "memberId": memberId,
          "memberType": "user",
          "resourceId": projectId,
          "resourceType": "project",
          "roleId": item,
          "userEmail": tmp.email,
          "userName": tmp.name
        });
      });
      let success = 0, total = data.length;
      data.map(item => {
        ProjectMemberRoleStore.handleAddOk(projectId, item, this.loadMemberRoles(), this.handleAddCancel());
      });
      this.loadMemberRoles();
    } else {
      message.error(HAP.getMessage("用户不存在", "The member isn't existencen"));
    }
  };

  //添加成员角色关系窗口关闭
  handleAddCancel = () => {
    this.setState({
      valueMention: toContentState(' '),
      addModelVisible: false,
    });
  };

  //添加成员角色窗口显示
  handleAddModalShow = () => {
    this.setState({
      valueMention: toContentState(' '),
      addModelVisible: true,
    });
  };

  //添加成员角色，选择角色窗口显示
  handleSelectRoleModalVisibleShow = () => {
    this.setState({
      selectRoleModalVisible: true
    });
  };

  //添加成员角色，选择角色窗口关闭
  handleSelectRoleModalVisibleCancel = () => {
    this.setState({
      selectRoleModalVisible: false
    });
  };

  //添加成员角色，选择角色窗口保存
  handleSelectRoleModalSave = (data) => {
    if (data.length != 0) {
      this.setState({
        SelectButtonText: HAP.getMessage("多个角色选择", "More members selected"),
        selectRoleModalVisible: false,
        addModalRoleData: data,
      })
    } else {
      this.setState({
        SelectButtonText: HAP.getMessage("未选择", "Not select"),
        selectRoleModalVisible: false,
        addModalRoleData: data,
      })
    }
  };

  //切换成员角色展现形式(用户分组和角色分组)
  handleChange = (value) => {
    const { ProjectMemberRoleStore } = this.props;

    if (value == "user") {
      ProjectMemberRoleStore.setIsUser(true);
      ProjectMemberRoleStore.setShow(false);
    } else if (value == "role") {
      ProjectMemberRoleStore.setIsUser(false);
      ProjectMemberRoleStore.setShow(false);
    } else {
      ProjectMemberRoleStore.setIsUser(true);
      ProjectMemberRoleStore.setShow(false);
    }
  };
    mentionSelect = (editorState) => {
    this.setState({
      valueMention: editorState,
    });
  }
  handleSearch = (value) => {
    if (value) {
      const { AppState, ProjectMemberRoleStore } = this.props;
      const menuType = AppState.currentMenuType;
      let organizationId = menuType.id;
      let projectId = menuType.id;
      ProjectMemberRoleStore.handleSearch(projectId, value);
      // fetch(`${USER_API_HOST}/organization/${organizationId}/memberRoles`, {
      //   headers: HAP.getHeader()
      // }).then(HAP.convertResponse(this)).then((data) => {
      //   if (data) {
      //     let pattern = eval("/.*"+value+".*/");
      //     let filterData=data.filter(item=>(pattern.test(item.userName)||pattern.test(item.userEmail)||pattern.test(item.roleName)));
      //     dispatch(memberRolesLoaded(filterData));
      //   }
      // }).catch(HAP.catchHttpError());
    } else {
      this.loadMemberRoles();
    }
  };
  //渲染函数
  render() {
    const { selectedRowKeys, roleKeys, SelectButtonText } = this.state;
    const { ProjectMemberRoleStore } = this.props;
    const memberRole = ProjectMemberRoleStore.getMemberRole;
    const isLoading = ProjectMemberRoleStore.getIsLoading;
    const isShow = ProjectMemberRoleStore.getIsShow;
    const roleData = ProjectMemberRoleStore.getRoleData;
    const isUser = ProjectMemberRoleStore.getIsUser;
    const userData = ProjectMemberRoleStore.getuserData;
    //定义加载样式
    const loadingBar = (
      <div style={{ display: 'inherit', margin: '200px auto', textAlign: "center" }}>
        <Spin />
      </div>
    );
    let suggestionsArray = [];
    userData.map(value => {
      suggestionsArray.push(value.name);
      suggestionsArray.push(value.email);
    });
    suggestionsArray = uniq(suggestionsArray);
    //定义表格的列
    const columns = [{
      title: HAP.languageChange('projectMemberRole.type'),
      dataIndex: 'memberType',
      key: 'memberType',
      render: (text, record) => (
        <div>
          <Tooltip placement="right" title={text == "user" ? HAP.languageChange("projectMemberRole.user") : HAP.languageChange("projectMemberRole.organization")}>
            {text == "user" ? <Icon type="user" /> : <Icon type="database" />}
          </Tooltip>
        </div>
      )
    }, {
      title: HAP.languageChange('projectMemberRole.member'),
      dataIndex: 'userName',
      key: 'userName',
      render: (item, record) => (
        <div>
          <p>{record.userName}</p>
          <p>{record.userEmail}</p>
        </div>
      )
    }, {
      title: HAP.languageChange('projectMemberRole.role'),
      dataIndex: 'roles',
      key: 'roles',
      render: (text, record) => (
        // <a className="operateIcon small-tooltip" onClick={this.handleAssignShow.bind(this, record)}>
        //   分配
        // </a>
        <RoleCas treeData={treeData}
          handleClose={this.handleClose}
          defaultSelectKey={roleKeys}
          handleSubmit={this.handleRoleSave}
          showClose={true}
          inName={HAP.getMessage("分配", "distribute")}
          text={text} record={record}
          onClicks={this.handleAssignShow} />
      )
    }, {
      title: <div style={{ textAlign: "center" }}>
        {HAP.languageChange('projectMemberRole.operate')}
      </div>,
      className: "operateIcons",
      key: 'action',
      render: (text, record) => (
        <div>
          <Tooltip title={HAP.languageChange('projectMemberRole.cancel')} placement="bottom" getTooltipContainer={(that) => that}>
            <a className="operateIcon small-tooltip" onClick={this.handleRemoveOpen.bind(this, record)}>
              <Icon type="delete" />
            </a>
          </Tooltip>
        </div>
      ),
    }];
    let memberDataSource = [], rolesDataSource = [];
    let listRoleMember = [];
    if (memberRole) {
      let dataSource = this.getDataSource(memberRole);
      memberDataSource = dataSource.memberDataSource;
      rolesDataSource = dataSource.rolesdataSource;
    }

    let treeData = [];
    if (roleData) {
      treeData = this.convertRolesToTreeData(roleData);
    }

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    if (rolesDataSource) {
      rolesDataSource.map(
        (role, index) => {
          listRoleMember.push(<RolePanels key={index}
            treeData={treeData}
            role={role}
            handleDeleteOpen={this.handleRemoveOpen}
            handleClose={this.handleClose}
            defaultSelectKey={roleKeys}
            handleSubmit={this.handleRoleSave}
            inName={HAP.getMessage("分配", "distribute")}
            onClicks={this.handleAssignShow} />)
        }
      )
    }

    return (
      <div style={style.container}>
        <div style={style.top}>
          <PageHeader title={HAP.languageChange('projectMemberRole.MemberRoleOrganization')}>
            <Button className="header-btn" ghost={true} style={PageHeadStyle.leftBtn}
              icon="user-add" onClick={this.handleAddModalShow}>{HAP.languageChange('projectMemberRole.add')}</Button>
            <Modal
              title={HAP.getMessage("添加成员", "Add member")}
              onOk={this.handleAddOk}
              visible={this.state.addModelVisible}
              onCancel={this.handleAddCancel}
              maskClosable={false}
            >
              <Row>
                <Col>
                  <p>{HAP.getMessage("请在下面输入一个成员，然后为这些成员选择角色，以便授予他们访问您资源的权限。您可以分配多个角色。",
                    "Please enter a member below and then select roles for these members in order to grant them access to your resources. You can assign multiple roles.")}</p>
                </Col>
              </Row>
              <br />
              <Row>
                <Col span={4}>
                  <label>{HAP.languageChange("projectMemberRole.user")}:</label>
                </Col>
                <Col span={7}>
                  <Mention
                    ref={ele => this.mention = ele}
                    suggestions={suggestionsArray}
                    value={this.state.valueMention}
                    onChange={this.mentionSelect}
                    prefix={""}
                  />
                </Col>
                <Col span={4} offset={2}>
                  <label>{HAP.languageChange("projectMemberRole.role")}:</label>
                </Col>
                <Col span={7}>
                  <RoleCas treeData={treeData}
                    handleClose={this.handleClose}
                    defaultSelectKey={roleKeys}
                    handleSubmit={this.handleSelectRoleModalSave}
                    inName={HAP.getMessage("分配", "distribute")}
                    onClicks={this.handleAssignShow} />
                  {/*<Button style={{ marginLeft: -20 }} onClick={this.handleSelectRoleModalVisibleShow}>
                    {SelectButtonText} <Icon type="down" />
                  </Button>
                  <Modal
                    title={HAP.getMessage("选择角色","Select member")}
                    visible={this.state.selectRoleModalVisible}
                    footer={null}
                    width="350px"
                    maskClosable={false}
                    onCancel={this.handleSelectRoleModalVisibleCancel}
                  >
                    <RoleList treeData={treeData} handleClose={() => {
                      this.setState({ selectRoleModalVisible: false })
                    }}
                      handleSubmit={this.handleSelectRoleModalSave} defaultSelectKey={[]} showClose={false} />
                  </Modal>*/}
                </Col>
              </Row>
            </Modal>
            <Button className="header-btn" ghost={true} style={PageHeadStyle.leftBtn} onClick={this.handleBatchRemoveOpen}
              icon="user-delete">{HAP.languageChange('projectMemberRole.cancel')}</Button>
            <Button className="header-btn" ghost={true} onClick={() => {
              this.loadMemberRoles()
            }} style={PageHeadStyle.leftBtn} icon="reload">{HAP.languageChange("projectMemberRole.refresh")}</Button>
          </PageHeader>
        </div>
        <div style={style.bottom}>
          <div style={style.left}>
            <Remove open={this.state.open} handleCancel={this.handleRemoveClose} handleConfirm={this.handleDelete} />
            <Remove open={this.state.batchDeleteOpen} handleCancel={this.handleBatchRemoveClose} handleConfirm={this.handleBatchDelete} />
            <div style={{ margin: 20, }}>
              <Search
                placeholder={HAP.getMessage("按名称或角色过滤", "Filter by Name or Role")}
                style={{ width: 200 }}
                onSearch={this.handleSearch.bind(this)}
              />
              <span style={{ marginLeft: 15 }}>{HAP.languageChange('projectMemberRole.lookMethod')}</span>
              <Select defaultValue="user" style={{ width: 120, marginLeft: 15 }} onChange={this.handleChange}>
                <Option value="user">{HAP.languageChange("projectMemberRole.member")}</Option>
                <Option value="role">{HAP.languageChange("projectMemberRole.role")}</Option>
              </Select>
            </div>

            {isUser ?
              (<div style={{ margin: 20, }}>
                {isLoading ? loadingBar : (
                  <Table pagination={false} columns={columns} dataSource={memberDataSource} rowKey={function (record) {
                    return record.memberId
                  }} rowSelection={rowSelection} />
                )}
              </div>)
              :
              (<div style={{ margin: 20, }}>
                {isLoading ? loadingBar : listRoleMember}
              </div>)
            }

          </div>
          {/*<div style={style.right}>
            {isShow ?
              <Tabs defaultActiveKey="1">
                <TabPane tab={HAP.getMessage('角色分配', 'Role Assignment')} key="1">
                  <RoleList treeData={treeData} handleClose={this.handleClose} defaultSelectKey={roleKeys}
                    handleSubmit={this.handleRoleSave} showClose={true} />
                </TabPane>
              </Tabs>
              : ''
            }
          </div>*/}

        </div>
        <BackTop />
      </div>
    );
  }
}

export default withRouter(ProjectMemberRole);
