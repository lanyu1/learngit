/**
 * Created by YANG on 2017/7/4.
 */


import React, {Component, PropTypes} from 'react';
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router-dom';
import PageHeader, {PageHeadStyle} from '../../../components/PageHeader';
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
    borderBottom: '1px solid  #d4cdcd',
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
    zIndex: '4',
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
  }
};
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;

@inject("AppState")
@observer
class Deployment extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleLayoutChange = this.handleLayoutChange.bind(this);
    this.state = {
      libraryManageOpen: false,
      colNum: 6,
      seacrhColNum: 15,
      layoutCol: 3,
      newForm: [],   // 存储新增分类DOM
      formDom: [],   // 存储原有分类DOM
      publicPage: 1,
      privatePage: 1,
      publicCategory: -1,
      privateCategory: -1,
      categoryManageOpen: false,
      newCategoryIds: [],      // 记录新增分类的key
      updateCategoryIds: [],   // 记录更新分类的key
      deleteCategoryIds: [],   // 记录删除分类的id
      categories: [],          // 记录原有分类数据
      newKey: -1,              // 新增分类的key
      loading: false,
      categoryAccess: true,
      isPublic: false,
    }
  }

  getKey = (num) => {
    return num + 1;
  };

  // 重新加载分类
  reloadCategory = () => {
    const {DeploymentStore, AppState} = this.props;
    const organizationId = AppState.currentMenuType.organizationId;
    let formDom = [];
    let updateCategoryIds = [];
    this.setState({
      deleteCategoryIds: [],
      newCategoryIds: [],
      newForm: [],
      formDom: formDom,
      newKey: -1,
      loading: true,
    });
    DeploymentStore.loadCategory(organizationId).then((datas) => {
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
        DeploymentStore.setCategory([]);
      }
    });
  };

  componentDidMount() {
    const {DeploymentStore, AppState} = this.props;
    const organizationId = AppState.currentMenuType.organizationId;
    DeploymentStore.loadDeployment(organizationId, 0, 0);
    this.reloadCategory();
  }

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
  };

  openNewPage = () => {
    this.linkToChange(`deployment/new`);
  };

  linkToChange = (url) => {
    const {history} = this.props;
    history.push(url);
  };

  loadDeployment = () => {
    const {DeploymentStore, AppState} = this.props;
    const organizationId = AppState.currentMenuType.organizationId;
    DeploymentStore.loadDeployment(organizationId, this.state.privatePage - 1, this.state.publicPage - 1);
  };
  // 处理查询
  loadDeploymentFilter = (value, id, page, isPublic) => {
    const {DeploymentStore, AppState} = this.props;
    const organizationId = AppState.currentMenuType.organizationId;
    if (id == -1) {
      id = "";
    }
    DeploymentStore.loadDeploymentFilter(organizationId, value.trim(), id, page, isPublic);
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
    this.linkToChange(`deployment/detail/${id}`)
  };

  handleLayoutChange = (e, isPublic) => {
    e.preventDefault();
    const {DeploymentStore} = this.props;
    if (isPublic) {
      if (DeploymentStore.publicLayout != e.target.value) {
        DeploymentStore.setPublicLayout(e.target.value)
      }
    } else {
      if (DeploymentStore.layout != e.target.value) {
        DeploymentStore.setLayout(e.target.value)
      }
    }
  };

  onTabChange = (key) => {
    if (key == "public") {
      this.setState({isPublic: true});
    } else {
      this.setState({isPublic: false});
    }
  };

  render() {
    const {DeploymentStore} = this.props;
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
          </div>
        )
      },
    ];


    var publicDeploymentDom = [];

    if (DeploymentStore && DeploymentStore.publicDeployment) {
      const publicDeployment = DeploymentStore.publicDeployment;
      const that = this;
      if (publicDeployment.content) {
        if (DeploymentStore.publicLayout == "card") {
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
              <Table pagination={false} columns={columns} dataSource={[...publicDeployment.content]} rowKey="id"/>
            </div>
          )
        }
      }
    }

    var privateDeploymentDom = [];

    if (DeploymentStore && DeploymentStore.deployment) {
      const deployment = DeploymentStore.deployment;
      const that = this;
      if (deployment.content) {
        if (DeploymentStore.layout == "card") {
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
            privateDeploymentDom.push(dom);
          })
        } else {
          privateDeploymentDom = (
            <div style={{marginTop: 15}}>
              <Table pagination={false} columns={columns} dataSource={[...deployment.content]} rowKey="id"/>
            </div>
          )
        }
      }
    }

    // 初始化分类按钮
    const categoryOptions = [<Option key="-1" value="-1">{HAP.languageChange("deployment.all")}</Option>];
    DeploymentStore.getCategory.map((category, index) => {
      categoryOptions.push(<Option key={index} value={category.id.toString()}>{category.name}</Option>);
    });

    const loadingBar = (
      <div style={{display: 'inherit', margin: '200px auto', textAlign: "center"}}>
        <Spin />
      </div>
    );
    return (
      <div style={{height: '100%'}}>
        {/*pageHeader*/}
        <PageHeader title={HAP.languageChange("deployment")}>
          <Button className="header-btn" ghost={true} onClick={() => {
              this.loadDeployment()
            }}
            style={PageHeadStyle.leftBtn} icon="reload">{HAP.languageChange("flush")}</Button>
        </PageHeader>
        {DeploymentStore.isLoading ? loadingBar : (
          <div ref="pageContent" id="pageContent" style={{margin: 20, float: 'left', width: "96%"}}>
            <Tabs activeKey={this.state.isPublic ? "public" : "private"} onChange={this.onTabChange}>
              <TabPane tab={HAP.getMessage("私有", "Private")} key="private">
                <div>
                  <div>
                    <Row>
                      <Col span={this.state.seacrhColNum}>
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
                            style={{width: '100%'}}
                            defaultValue="-1"
                            onChange={(id) => {this.handleChange(id, false)}}
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
                        <RadioGroup defaultValue={DeploymentStore.layout} onChange={(e) => {this.handleLayoutChange(e, false)}}>
                          <RadioButton value="card">{HAP.languageChange("deployment.card")}</RadioButton>
                          <RadioButton value="table">{HAP.languageChange("deployment.list")}</RadioButton>
                        </RadioGroup>
                      </Col>
                    </Row>
                  </div>
                  <div style={pageStyle.clear}></div>
                  {DeploymentStore.isCategoryLoading ? loadingBar : (
                    <div>
                      {/*Card布局*/}
                      <div style={{textAlign: 'center'}}>
                        <Row gutter={32} justify="space-around">
                          {privateDeploymentDom}
                        </Row>
                      </div>
                      <div style={{clear: 'both'}}></div>
                      {DeploymentStore.deployment && DeploymentStore.deployment.content.length > 0 ?
                        <Pagination current={this.state.privatePage} onChange={(page) => {this.onPageChange(page, false)}}
                                    style={{marginTop: 20, float: 'right'}} total={DeploymentStore.totalPrivateSize}
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
                      <Col span={this.state.seacrhColNum}>
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
                            style={{width: '100%'}}
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
                        <RadioGroup defaultValue={DeploymentStore.publicLayout} onChange={(e) => {this.handleLayoutChange(e, true)}}>
                          <RadioButton value="card">{HAP.languageChange("deployment.card")}</RadioButton>
                          <RadioButton value="table">{HAP.languageChange("deployment.list")}</RadioButton>
                        </RadioGroup>
                      </Col>
                    </Row>
                  </div>
                  <div style={pageStyle.clear}></div>
                  {DeploymentStore.isCategoryLoading ? loadingBar : (
                    <div>
                      {/*Card布局*/}
                      <div style={{textAlign: 'center'}}>
                        <Row gutter={32} justify="space-around">
                          {publicDeploymentDom}
                        </Row>
                      </div>
                      <div style={{clear: 'both'}}></div>
                      {DeploymentStore.publicDeployment && DeploymentStore.publicDeployment.content.length > 0 ?
                        <Pagination current={this.state.publicPage} onChange={(page) => {this.onPageChange(page, true)}}
                                    style={{marginTop: 20, float: 'right'}} total={DeploymentStore.totalPublicSize}
                                    pageSize={8}/> : null
                      }
                    </div>
                  )}
                </div>
              </TabPane>
            </Tabs>
          </div>
        )}
      </div>
    )
  }
}

export default withRouter(Deployment);
