/**
 * Created by YANG on 2017/7/4.
 */


import React, {Component, PropTypes} from 'react';
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router-dom';
import PageHeader, {PageHeadStyle} from '../../../components/PageHeader';
import axios from '../../../common/axios';
//import {Spin,Pagination,Menu, Dropdown, Button,Radio, Icon, message, Input, Card, Col, Row, Select,Table} from 'antd';
import {
  Tooltip,
  Table,
  Radio,
  Spin,
  Pagination,
  Menu,
  Dropdown,
  Button,
  Icon,
  message,
  Input,
  Card,
  Col,
  Row,
  Select,
  Avatar,
  Tabs
} from 'antd';
const Option = Select.Option;
const Search = Input.Search;
const TabPane = Tabs.TabPane;

const pageStyle = {
  input: {
    float: 'left',
    width: '100%'
  },
  clear: {
    clear: 'both'
  },
  fontStyle: {
    fontSize: '10px',
    color: '#333333',
    //float:'left'
  },
  iconStyle: {
    fontSize: "65px",
    paddingBottom: '20px',
  },
  cardStyle: {
    textAlign: 'center',
    borderBottom: '1px solid  #d4cdcd'
  },
  dropDownStyle: {
    width: '80%',
    textAlign: 'left',
  },
  rightdropDownStyle: {
    width: '80%',
    textAlign: 'left',
  },
  dropDownIconStyle: {
    float: 'right',
    lineHeight: 'inherit'
  },
  nameStyle: {
    fontWeight: 600,
    paddingBottom: 4,
    fontSize: 16,

  },
  categoryManage: {
    position: 'absolute',
    right: 0,
    width: '350px',
    minHeight: '100%',
    backgroundColor: 'white',
    zIndex: '5',
    padding: '10px 15px',
  },
  buttonLeft: {
    lineHeight: '24px',
    height: '28px',
    color: 'rgb(59, 120, 231)',
    float: "left",
    marginLeft: -15,
    marginRight: 20,
  },
  categoryLabel: {
    textAlign: "right",
    fontSize: 12,
  },
  libraryInput: {
    marginBottom: 10,
  },
  description: {
    paddingTop: 4,
    height: 52,
    fontSize: 14,
  },
  //标签
  right: {
    flex: '1 1 0',
    order: 2,
    flexDirection: 'row',
    //paddingLeft:'10px',
    borderLeft: '1px solid #F4F4F4',
    flexGrow: '1',
  },
};
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
@inject("AppState")
@observer
class Deployment extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleCreateCategory = this.handleCreateCategory.bind(this);
    this.checkButtonState = this.checkButtonState.bind(this);
    this.state = {
      libraryManageOpen: false,
      colNum: 6,
      newForm: [],   // 存储新增分类DOM
      formDom: [],   // 存储原有分类DOM
      publicPage: 1,
      privatePage: 1,
      publicCategory: -1,
      privateCategory: -1,
      layoutCol: 3,
      categoryManageOpen: false,
      newCategoryIds: [],      // 记录新增分类的key
      updateCategoryIds: [],   // 记录更新分类的key
      deleteCategoryIds: [],   // 记录删除分类的id
      categories: [],          // 记录原有分类数据
      newKey: -1,              // 新增分类的key
      loading: false,
      categoryAccess: true,
      isFlushButton: true,
      isSaveButton: true,
      selectedRowKeys: [],
      isPublic: false,
    }
  }

  getKey = (num) => {
    return num + 1;
  };

  // 重新加载分类
  reloadCategory = () => {
    const {DeploymentAdminStore, AppState} = this.props;
    const organizationId = AppState.currentMenuType.id;
    let formDom = [];
    let updateCategoryIds = [];
    this.setState({
      deleteCategoryIds: [],
      newCategoryIds: [],
      newForm: [],
      formDom: formDom,
      newKey: -1,
      loading: true,
      isFlushButton: true,
      isSaveButton: true,
    });
    DeploymentAdminStore.loadCategory(organizationId).then((datas) => {
      let key = 0;
      datas.map((data) => {
        updateCategoryIds.push(key);
        formDom.push(
          <div key={data.name} style={{marginBottom: 20}}>
            <Row gutter={16}>
              <Col span={18}>
                <Input id={"old" + key} onChange={this.checkNullName.bind(this, "old" + key, "oldError" + key)}
                       placeholder={HAP.getMessage("请输入名称", "Pelase Input Name")} defaultValue={data.name}/>
              </Col>
              <Col span={4}>
                <Button onClick={this.handleCategoryDelete.bind(this, key)} className="header-btn" ghost={true}
                        style={pageStyle.buttonLeft} icon="delete"></Button>
              </Col>
            </Row>
            <div id={"oldError" + key}
                 style={{display: "none", color: "#FF0000"}}>{HAP.languageChange("deployment.blankError")}</div>
          </div>
        );
        key += 1;
      });
      this.setState({
        updateCategoryIds: updateCategoryIds,
        formDom: formDom,
        loading: false,
        categories: datas,
      });
    }).catch((error) => {
      if (error.response && error.response.status == 403) {
        this.setState({
          categoryAccess: false,
        });
        DeploymentAdminStore.setCategory([]);
      }
    });
  };

  componentDidMount() {
    const {DeploymentAdminStore, AppState} = this.props;
    const organizationId = AppState.currentMenuType.id;
    DeploymentAdminStore.loadDeployment(organizationId, 0, 0);
    this.reloadCategory();
  }

  // save&close
  handleManageCategorySaveClose = () => {
    const {DeploymentAdminStore, AppState} = this.props;
    const organizationId = AppState.currentMenuType.id;
    const updateCategoryIds = [...this.state.updateCategoryIds];
    const deleteCategoryIds = [...this.state.deleteCategoryIds];
    const newCategoryIds = [...this.state.newCategoryIds];
    const categories = [...this.state.categories];
    const newCategories = [];
    const updateCategories = [];

    // 批量新增
    newCategoryIds.map((id) => {
      if (id != -1) {
        const name = document.getElementById("new" + id).value;
        if (name.trim() != "") {
          newCategories.push({
            "name": name,
            "objectVersionNumber": undefined
          });
        }
      }
    });

    // 批量修改
    updateCategoryIds.map((id) => {
      if (id != -1) {
        const name = document.getElementById("old" + id).value;
        if (name != categories[id].name && name.trim() != "") {
          updateCategories.push({
            "name": name,
            "objectVersionNumber": categories[id].objectVersionNumber,
            "id": categories[id].id,
          });
        }
      }
    });

    DeploymentAdminStore.batchCategory(organizationId, newCategories, updateCategories, deleteCategoryIds).then((response) => {
      if (response.code == 200) {
        //DeploymentAdminStore.loadCategory(organizationId);
        message.success(HAP.getMessage("更新成功！", "Update Success!"));
        this.reloadCategory();
      } else if (response.code == 400) {
        if (response.type == "add" || response.type == "edit") {
          message.error(HAP.getMessage("类别名称不能重复！", "Category Name Can't Be Repeated!"));
        } else {
          message.error(HAP.getMessage("不能删除正在使用的类别！", "Can't Delete ategories In Use!"));
        }
      } else {
        message.error(HAP.getMessage("更新失败！", "Update Failed!"));
      }
    });
  };

  // close
  handleManageCategoryClose = () => {
    this.refs.pageContent.style.width = "96%";
    this.setState({
      categoryManageOpen: false,
      colNum: 6,
      isNewDisplay: false,
      newForm: [],
    });
  };

  // open
  handleManageCategory = () => {
    this.reloadCategory();
    this.setState({layoutCol: 4})
    if (this.state.categoryManageOpen) {
      this.handleManageCategoryClose();
    } else {
      this.refs.pageContent.style.width = "65%";
      this.setState({
        categoryManageOpen: true,
        colNum: 8,
      });
    }
  };

  // 判断按钮状态
  checkButtonState = () => {
    const updateCategoryIds = [...this.state.updateCategoryIds];
    const newCategoryIds = [...this.state.newCategoryIds];
    const deleteCategoryIds = [...this.state.deleteCategoryIds];
    const categories = [...this.state.categories];
    let change = false;
    let blank = false;
    updateCategoryIds.map((categoryId) => {
      if (categoryId != -1) {
        const el = document.getElementById("old"+categoryId);
        if (el && el.value.trim() == "") {
          blank = true;
        } else if (el && el.value != categories[categoryId].name) {
          change = true;
        }
      }
    });
    newCategoryIds.map((categoryId) => {
      if (categoryId != -1) {
        const el = document.getElementById("new"+categoryId);
        if (el && el.value.trim() == "") {
          blank = true;
        }else if (el && el.value.trim() != "") {
          change = true;
        }
      }
    });
    let newLength = 0;
    newCategoryIds.map((id) => {
      if (id != -1) {
        newLength ++;
      }
    });
    if (newLength.length > 0 || deleteCategoryIds.length > 0) {
      change = true;
    }
    if (blank) {
      this.setState({
        isFlushButton: false,
        isSaveButton: true,
      });
    }else {
      if (change) {
        this.setState({
          isFlushButton: false,
          isSaveButton: false,
        });
      }else {
        this.setState({
          isFlushButton: true,
          isSaveButton: true,
        });
      }
    }
  };

  // 校验分类是否为空
  checkNullName = (input, tip) => {
    const inputEL = document.getElementById(input);
    const tipEL = document.getElementById(tip);
    if (inputEL.value.trim() == "") {
      inputEL.style.borderColor = "#FF0000";
      inputEL.style.boxShadow = "0 0 0 2px rgba(240, 65, 52, 0.2)";
      tipEL.style.display = "block";
    } else {
      inputEL.style.borderColor = "#49A9EE";
      inputEL.style.boxShadow = "0 0 0 2px rgba(16, 142, 233, 0.2)";
      tipEL.style.display = "none";
    }
    this.checkButtonState();
  };

  // 删除已有分类
  handleCategoryDelete = (key) => {
    const updateCategoryIds = [...this.state.updateCategoryIds];
    const deleteCategoryIds = [...this.state.deleteCategoryIds];
    const categories = [...this.state.categories];
    const formDom = [...this.state.formDom];

    deleteCategoryIds.push(categories[key].id);
    updateCategoryIds[key] = -1;
    formDom[key] = "";
    this.setState({
      updateCategoryIds: updateCategoryIds,
      deleteCategoryIds: deleteCategoryIds,
      formDom: formDom,
    }, () => {
      this.checkButtonState();
    });
  };

  // 删除新分类
  handleNewCategoryDelete = (key) => {
    const newCategoryIds = [...this.state.newCategoryIds];
    const newForm = [...this.state.newForm];
    newCategoryIds[key] = -1;
    newForm[key] = "";
    this.setState({
      newForm: newForm,
      newCategoryIds: newCategoryIds,
    }, () => {
      this.checkButtonState();
    });
  };

  // 创建分类
  handleCreateCategory = () => {
    const newCategoryIds = [...this.state.newCategoryIds];
    const newForm = [...this.state.newForm];
    const key = this.getKey(this.state.newKey);
    const form = (
      <div key={key} style={{marginBottom: 20}}>
        <Row gutter={16}>
          <Col span={18}>
            <Input id={"new" + key} onChange={this.checkNullName.bind(this, "new" + key, "newError" + key)}
                   placeholder={HAP.getMessage("请输入名称", "Please Input Name")}/>
          </Col>
          <Col span={4}>
            <Button onClick={this.handleNewCategoryDelete.bind(this, key)} className="header-btn" ghost={true} style={pageStyle.buttonLeft} icon="delete"></Button>
          </Col>
        </Row>
        <div id={"newError" + key}
             style={{display: "none", color: "#FF0000"}}>{HAP.languageChange("deployment.blankError")}</div>
      </div>
    );
    newForm.push(form);
    newCategoryIds.push(key);
    this.setState({
      newForm: newForm,
      newKey: key,
      newCategoryIds: newCategoryIds,
    }, () => {
      this.checkButtonState();
    });
  };

  openNewPage = () => {
    this.handleManageCategoryClose();
    this.linkToChange(`deploymentAdmin/new`);
  };

  linkToChange = (url) => {
    const {history} = this.props;
    history.push(url);
  };

  loadDeployment = () => {
    if (this.state.categoryManageOpen) {
      this.handleManageCategoryClose();
    }
    const {DeploymentAdminStore, AppState} = this.props;
    const organizationId = AppState.currentMenuType.id;
    DeploymentAdminStore.loadDeployment(organizationId, this.state.privatePage - 1, this.state.publicPage - 1);
  };

  handleEdit = (id) => {
    this.linkToChange(`deploymentAdmin/edit/${id}`)
  };

  handleVersionManage = (id) => {
    this.linkToChange(`deploymentAdmin/${id}/version`)
  };

  // 处理查询
  loadDeploymentFilter = (value, id, page, isPublic) => {
    if (this.state.categoryManageOpen) {
      this.handleManageCategoryClose();
    }
    const {DeploymentAdminStore, AppState} = this.props;
    const organizationId = AppState.currentMenuType.id;
    if (id == -1) {
      id = "";
    }
    DeploymentAdminStore.loadDeploymentFilter(organizationId, value.trim(), id, page, isPublic);
  };

  // 搜索框触发查询
  loadDeploymentBySearch = (search, isPublic) => {
    let id = "";
    if (isPublic) {
      id = this.state.publicCategory;
    } else {
      id = this.state.privateCategory;
    }
    this.loadDeploymentFilter(search, id, 0, isPublic);
  };

  // 翻页触发查询
  onPageChange = (page, isPublic) => {
    let search = "";
    let id = "";
    if (isPublic) {
      this.setState({publicPage: page});
      search = this.refs.searchPublicFilter.input.refs.input.value;
      id = this.state.publicCategory;
    } else {
      this.setState({privatePage: page});
      search = this.refs.searchPrivateFilter.input.refs.input.value;
      id = this.state.privateCategory;
    }
    this.loadDeploymentFilter(search, id, page - 1, isPublic);
  };

  // 分类触发查询
  handleChange = (id, isPublic) => {
    let search = "";
    if (isPublic) {
      this.setState({publicCategory: id});
      search = this.refs.searchPublicFilter.input.refs.input.value;
    } else {
      this.setState({privateCategory: id});
      search = this.refs.searchPrivateFilter.input.refs.input.value;
    }
    this.loadDeploymentFilter(search, id, 0, isPublic)
  };

  handleDetail = (id) => {
    this.linkToChange(`deploymentAdmin/detail/${id}`)
  };

  handleLayoutChange = (e, isPublic) => {
    e.preventDefault();
    const {DeploymentAdminStore} = this.props;
    if (isPublic) {
      if (DeploymentAdminStore.publicLayout != e.target.value) {
        DeploymentAdminStore.setPublicLayout(e.target.value)
      }
    } else {
      if (DeploymentAdminStore.layout != e.target.value) {
        DeploymentAdminStore.setLayout(e.target.value)
      }
    }
  };
  //标签管理相关函数
  //选择列函数

  onTabChange = (key) => {
    if (key == "public") {
      if (this.state.categoryManageOpen) {
        this.handleManageCategoryClose();
      }
      this.setState({isPublic: true});
    } else {
      this.setState({isPublic: false});
    }
  };

  render() {
    const {DeploymentAdminStore} = this.props;
    var publicDeploymentDom = [];
    const columns = [
      {
        title: HAP.languageChange("deployment.icon"),
        width: "15%",
        dataIndex: 'icon',
        key: 'icon',
        render: (text, record) => (
          <div>
            <img src={record.icon} alt="" style={{maxHeight: 80, maxWidth: 80}}/>
          </div>
        )
      }, {
        title: HAP.languageChange("deployment.name"),
        width: "15%",
        dataIndex: 'name',
        key: 'name'
      }, {
        title: HAP.languageChange("deployment.description"),
        width: "50%",
        dataIndex: 'description',
        key: 'description'
      }, {
        title: <div style={{textAlign: "center"}}>
          {HAP.languageChange("operation")}
        </div>,
        className: "operateIcons",
        key: "action",
        render: (text, record) => (
          <div>

            <Tooltip title={HAP.languageChange("deployment.viewDetail")} placement="bottom"
                     getTooltipContainer={(that) => that}>
              <a className="operateIcon small-tooltip" onClick={this.handleDetail.bind(this, record.id)}>
                <Icon type="info-circle-o"/>
              </a>
            </Tooltip>

            <Tooltip title={HAP.languageChange("deployment.edit")} placement="bottom"
                     getTooltipContainer={(that) => that}>
              <a className="operateIcon small-tooltip" onClick={this.handleEdit.bind(this, record.id)}>
                <Icon type="edit"/>
              </a>
            </Tooltip>

            <Tooltip title={HAP.languageChange("deployment.version")} placement="bottom"
                     getTooltipContainer={(that) => that}>
              <a className="operateIcon small-tooltip" onClick={this.handleVersionManage.bind(this, record.id)}>
                <div className="versionIcon"></div>
              </a>
            </Tooltip>
          </div>
        )
      },
    ];
    //标签管理相关函数
    if (DeploymentAdminStore && DeploymentAdminStore.publicDeployment) {
      const publicDeployment = DeploymentAdminStore.publicDeployment;
      const that = this;
      if (publicDeployment.content) {
        if (DeploymentAdminStore.publicLayout == "card") {
          publicDeploymentDom = [];
          publicDeployment.content.map((item, index)=> {
            let dom = (<Col span={that.state.colNum} key={index}>
              <Card bordered={true}
                    style={{padding: '20px 0 25px 0', borderRadius: 0, marginTop: 20, width: '90%'}}
                    bodyStyle={{padding: '12px 20px'}}>
                <div style={pageStyle.cardStyle}>
                  <div style={{height: 78, verticalAlign: 'middle'}}>
                    {item.icon ? <img src={item.icon} alt="" style={{maxHeight: 78, maxWidth: '100%'}}/> :
                      <Icon style={pageStyle.iconStyle} type="smile-o"/>}
                  </div>
                  <div style={pageStyle.nameStyle}><a className="a">{item.name}</a>
                  </div>
                </div>
                <div style={{textAlign: 'center'}}>
                  <div className="deployment">{item.description}</div>
                  <div style={{margin: '0 auto', width: '100%'}}>
                    <Button type="primary" style={{width:'80%'}} onClick={this.handleDetail.bind(this, item.id)}>{HAP.languageChange("deployment.detail")}</Button>
                  </div>
                </div>
              </Card>
            </Col>);
            publicDeploymentDom.push(dom);

          })
        } else {
          publicDeploymentDom = (
            <div style={{marginTop: 15}}>
              <Table pagination={false} columns={columns} dataSource={[...publicDeployment.content]} rowKey="id" />
            </div>
          )
        }
      }
    }

    var privateDeploymentDom = [];

    if (DeploymentAdminStore && DeploymentAdminStore.deployment) {
      const deployment = DeploymentAdminStore.deployment;
      const that = this;
      if (deployment.content) {
        if (DeploymentAdminStore.layout == "card") {
          privateDeploymentDom = [];
          deployment.content.map((item, index)=> {
            let dom = (<Col span={that.state.colNum} key={index}>
              <Card bordered={true}
                    style={{padding: '20px 0 25px 0', borderRadius: 0, marginTop: 20, width: '90%'}}
                    bodyStyle={{padding: '12px 20px'}}>
                <div style={pageStyle.cardStyle}>
                  <div style={{height: 78, verticalAlign: 'middle'}}>
                    {item.icon ? <img src={item.icon} alt="" style={{maxHeight: 78, maxWidth: '100%'}}/> :
                      <Icon style={pageStyle.iconStyle} type="smile-o"/>}
                  </div>
                  <div style={pageStyle.nameStyle}><a className="a"
                                                      onClick={this.handleDetail.bind(this, item.id)}>{item.name}</a>
                  </div>
                </div>
                <div style={{textAlign: 'center'}}>
                  <div className="deployment">{item.description}</div>
                  <div style={{margin: '0 auto', width: '100%'}}>
                    <div style={{display: 'inline-block'}}><Button type="default" style={{padding: '0 10px', width: 70}}
                                                                   onClick={this.handleEdit.bind(this, item.id)}>{HAP.languageChange("deployment.edit")}</Button>
                    </div>
                    <div style={{display: 'inline-block', marginLeft: '6%'}}>
                      <Button type="default" style={{
                        padding: '0 10px',
                        width: 70
                      }}
                        onClick={this.handleVersionManage.bind(this, item.id)}>{HAP.languageChange("deployment.version")}</Button>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>);
            privateDeploymentDom.push(dom);
          })
        } else {
          privateDeploymentDom = (
            <div style={{marginTop: 15}}>
              <Table pagination={false} columns={columns} dataSource={[...deployment.content]} rowKey="id" />
            </div>
          )
        }
      }
    }


    // 初始化分类按钮
    const categoryOptions = [<Option key="-1" value="-1">{HAP.languageChange("deployment.all")}</Option>];
    DeploymentAdminStore.getCategory.map((category) => {
      categoryOptions.push(<Option key={category.id.toString()}
                                   value={category.id.toString()}>{category.name}</Option>);
    });

    const loadingBar = (
      <div style={{display: 'inherit', margin: '200px auto', textAlign: "center"}}>
        <Spin />
      </div>
    );

    const operations = <a onClick={this.handleManageCategoryClose} style={{marginRight: '5px'}}><Icon type="close" /></a>;

    const categoryManageDom = (
        <Tabs defaultActiveKey="1" tabBarExtraContent={operations} style={{marginTop:10}}>
          <TabPane tab={HAP.languageChange("deployment.categoryManagement")} key="1">
            <p style={{color:'rgb(58, 184, 246)',marginBottom:5}}>添加分类</p>
            <Card>
            {this.state.categoryAccess ? (
              <div>
                <div style={{clear:'both'}}></div>
                {this.state.loading ? loadingBar : (
                  <div>
                    <div ref="categoryManage" style={{padding:"0 10"}}>
                      {this.state.formDom}
                      {this.state.newForm}
                    </div>
                    <div style={{marginTop:10}}>
                      <Button style={{ color:"#3367D6", width:'75%' }}
                              onClick={this.handleCreateCategory}
                              icon="plus">{HAP.languageChange("form.create")}</Button>
                    </div>
                    <div style={{marginTop:20}}>
                      <Button style={{marginLeft:30}} type="primary" disabled={this.state.isSaveButton}
                              onClick={this.handleManageCategorySaveClose}>{HAP.languageChange("deployment.saveClose")}</Button>
                      <Button style={{marginLeft:40}} disabled={this.state.isFlushButton}
                              onClick={this.reloadCategory}>{HAP.languageChange("deployment.cancel")}</Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{textAlign: 'left', color: '#FF0000', marginTop:'20'}}>{HAP.languageChange("deployment.access")}</div>
            )}
            </Card>
          </TabPane>
        </Tabs>
    );

    return (
      <div style={{height: '100%'}}>
        {/*pageHeader*/}
        <PageHeader title={HAP.languageChange("deployment")}>
          {this.state.isPublic ? null : (
            <Button ref="createDeploymentBtn" className="header-btn" ghost={true} onClick={() => {
              this.openNewPage()
            }} style={PageHeadStyle.leftBtn} icon="user-add">{HAP.languageChange("deployment.create")}</Button>
          )}
          <Button className="header-btn" ghost={true} onClick={() => {
            this.loadDeployment()
          }} style={PageHeadStyle.leftBtn} icon="reload">{HAP.languageChange("flush")}</Button>
        </PageHeader>
        {DeploymentAdminStore.isLoading ? loadingBar : (
          <div ref="pageContent" id="pageContent" style={{margin: 20, float: 'left', width: "96%"}}>
            <Tabs activeKey={this.state.isPublic ? "public" : "private"} onChange={this.onTabChange}>
              <TabPane tab={HAP.getMessage("私有", "Private")} key="private">
                <div>
                  <div>
                    <Row>
                      <Col span={15}>
                        <div style={pageStyle.input}>
                          <div style={pageStyle.fontStyle}>
                            {HAP.languageChange("deployment.search")}
                          </div>
                          <Col span={25}>
                            <Search
                              ref="searchPrivateFilter"
                              placeholder={HAP.getMessage("搜索名称，描述", "Filter By Name or Description")}
                              style={{width: '95%'}}
                              onSearch={(value) => {
                                this.loadDeploymentBySearch(value, false)
                              }}
                            />
                          </Col>
                        </div>
                      </Col>
                      <Col span={5}>
                        <div style={pageStyle.input}>
                          <div style={pageStyle.fontStyle}>
                            {HAP.languageChange("deployment.category")}
                          </div>
                          <Select
                            style={{width: '79%'}}
                            defaultValue="-1"
                            onChange={(id) => {this.handleChange(id, false)}}
                            showSearch
                            optionFilterProp="children"
                            notFoundContent={HAP.getMessage("没有匹配的选项", "No Matching Options")}
                          >
                            {categoryOptions}
                          </Select>
                          <a className="operateIcon small-tooltip" onClick={this.handleManageCategory}>
                            <Icon type="setting"/>
                          </a>
                        </div>
                      </Col>
                      <Col span={this.state.layoutCol} style={{float: 'right'}}>
                        <div style={pageStyle.fontStyle}>
                          {HAP.languageChange("deployment.layout")}
                        </div>
                        <RadioGroup defaultValue={DeploymentAdminStore.layout} onChange={(e) => {this.handleLayoutChange(e, false)}}>
                          <RadioButton value="card">{HAP.languageChange("deployment.card")}</RadioButton>
                          <RadioButton value="table">{HAP.languageChange("deployment.list")}</RadioButton>
                        </RadioGroup>
                      </Col>
                    </Row>
                  </div>
                  <div style={pageStyle.clear}></div>
                  {DeploymentAdminStore.isCategoryLoading ? loadingBar : (
                    <div>
                      {/*Card布局*/}
                      <div style={{textAlign: 'center'}}>
                        <Row gutter={32} justify="space-around">
                          {privateDeploymentDom}
                        </Row>
                      </div>
                      <div style={{clear: 'both'}}></div>
                      {DeploymentAdminStore.deployment && DeploymentAdminStore.deployment.content.length > 0 ?
                        <Pagination current={this.state.privatePage} onChange={(page) => {this.onPageChange(page, false)}}
                                    style={{marginTop: 20, float: 'right'}} total={DeploymentAdminStore.totalPrivateSize}
                                    pageSize={8}/> : null
                      }
                    </div>
                  )}
                </div>
              </TabPane>
              <TabPane tab={HAP.getMessage("公有", "Public")} key="public">
                <div>
                  <div>
                    <Row>
                      <Col span={15}>
                        <div style={pageStyle.input}>
                          <div style={pageStyle.fontStyle}>
                            {HAP.languageChange("deployment.search")}
                          </div>
                          <Col span={25}>
                            <Search
                              ref="searchPublicFilter"
                              placeholder={HAP.getMessage("搜索名称，描述", "Filter By Name or Description")}
                              style={{width: '95%'}}
                              onSearch={(value) => {
                                this.loadDeploymentBySearch(value, true)
                              }}
                            />
                          </Col>
                        </div>
                      </Col>
                      <Col span={5}>
                        <div style={pageStyle.input}>
                          <div style={pageStyle.fontStyle}>
                            {HAP.languageChange("deployment.category")}
                          </div>
                          <Select
                            style={{width: '79%'}}
                            defaultValue="-1"
                            onChange={(id) => {this.handleChange(id, true)}}
                            showSearch
                            optionFilterProp="children"
                            notFoundContent={HAP.getMessage("没有匹配的选项", "No Matching Options")}
                          >
                            {categoryOptions}
                          </Select>
                        </div>
                      </Col>
                      <Col span={this.state.layoutCol} style={{float: 'right'}}>
                        <div style={pageStyle.fontStyle}>
                          {HAP.languageChange("deployment.layout")}
                        </div>
                        <RadioGroup defaultValue={DeploymentAdminStore.publicLayout} onChange={(e) => {this.handleLayoutChange(e, true)}}>
                          <RadioButton value="card">{HAP.languageChange("deployment.card")}</RadioButton>
                          <RadioButton value="table">{HAP.languageChange("deployment.list")}</RadioButton>
                        </RadioGroup>
                      </Col>
                    </Row>
                  </div>
                  <div style={pageStyle.clear}></div>
                  {DeploymentAdminStore.isCategoryLoading ? loadingBar : (
                    <div>
                      {/*Card布局*/}
                      <div style={{textAlign: 'center'}}>
                        <Row gutter={32} justify="space-around">
                          {publicDeploymentDom}
                        </Row>
                      </div>
                      <div style={{clear: 'both'}}></div>
                      {DeploymentAdminStore.publicDeployment && DeploymentAdminStore.publicDeployment.content.length > 0 ?
                        <Pagination current={this.state.publicPage} onChange={(page) => {this.onPageChange(page, true)}}
                                    style={{marginTop: 20, float: 'right'}} total={DeploymentAdminStore.totalPublicSize}
                                    pageSize={8}/> : null
                      }
                    </div>
                  )}
                </div>
              </TabPane>
            </Tabs>
          </div>
        )}
        {/*右侧滑动面板*/}
        {this.state.categoryManageOpen ? categoryManageDom : null}
      </div>
    )
  }
}

export default withRouter(Deployment);
