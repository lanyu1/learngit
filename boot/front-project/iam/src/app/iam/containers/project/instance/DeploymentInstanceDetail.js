/**
 * Created by Wangke on 2017/7/6.
 */


import React, {Component, PropTypes} from 'react';
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router-dom';
import PageHeader, {PageHeadStyle} from '../../../components/PageHeader';
import {
  Table, Spin, Pagination, Menu, Dropdown, Button, Icon, message, Input, Card, Col, Row, Tabs, Tooltip, Form
} from 'antd';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

const pageStyle = {
  nameDes: {
    padding: "20px 30px 10px 10px",
  },
  instanceName: {
    fontSize: 20,
  },
  deploymentName: {
    fontSize: 14,
    color: "#707070"
  }
};
const formItemLayout = {
  labelCol: {
    xs: {span: 22},
    sm: {span: 22},
  },
  wrapperCol: {
    xs: {span: 22},
    sm: {span: 22},
  },
};
@inject("AppState")
@observer

class DeploymentInstanceDetail extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      instanceInfo: '',
      id: this.props.match.params.id,
      page: 0,
      objectInfo: []
    }
  }

  componentDidMount() {
    const {DeploymentInstanceStore, AppState} = this.props;
    let projectId = AppState.menuType.id;
    let {page} = this.state;
    this.getInstanceById(page);
    DeploymentInstanceStore.getObjectById(projectId, this.state.id).then(data => {
      this.setState({
        objectInfo: data
      })
    });
  }

  getInstanceById = (page) => {
    const {DeploymentInstanceStore, AppState} = this.props;
    let projectId = AppState.menuType.id;
    this.setState({
      page: page,
    });
    DeploymentInstanceStore.getInstanceById(projectId, this.state.id, page);
  };

  handleSubmit = (e) => {
    // e.preventDefault();
    //校验表单
    const {AppState, DeploymentInstanceStore} = this.props;
    let updateInfo = DeploymentInstanceStore.getInstancesDetails;
    let instanceHistory;
    if (updateInfo.histories) {
      instanceHistory = updateInfo.histories.content.sort(this.compare('id'));
    }
    let topVariables = JSON.parse(instanceHistory[0].variables);
    const proId = AppState.menuType.id;
    this.props.form.validateFieldsAndScroll((err, data) => {
      if (!err) {
        topVariables.map((value, index)=> {
          if (value.name == "DATABASE_SERVICE_NAME") {
            value.value = data.DATABASE_SERVICE_NAME
          } else if (value.name == "MEMORY_LIMIT") {
            value.value = data.MEMORY_LIMIT
          } else if (value.name == "MYSQL_DATABASE") {
            value.value = data.MYSQL_DATABASE
          } else if (value.name == "MYSQL_PASSWORD") {
            value.value = data.MYSQL_PASSWORD
          } else if (value.name == "MYSQL_ROOT_PASSWORD") {
            value.value = data.MYSQL_ROOT_PASSWORD
          } else if (value.name == "MYSQL_USER") {
            value.value = data.MYSQL_USER
          }
        });
        DeploymentInstanceStore.updateDeploymentInstance(proId, this.state.id, topVariables).then(data=> {
          message.success(HAP.getMessage("更新成功！", "Update success!"));
            this.getInstanceById(this.state.page);
        }).catch(error=> {
          message.error(HAP.getMessage("更新失败！", "Update failed!"));
        });
      }
    });
  };

  openNewPage = (id, instanceId, num) => {
    this.linkToChange(`/iam/instance/${instanceId}/history/${id}`);
  };


  linkToChange = (url) => {
    const {history} = this.props;
    history.push(url);
  };

  handleReset = () => {
    this.linkToChange("/iam/instance");
  };

  compare = (property) => {
    return function (a, b) {
      let value1 = a[property];
      let value2 = b[property];
      return value2 - value1;
    }
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    const {DeploymentInstanceStore} = this.props;
    const {objectInfo} = this.state;
    const instanceInfo = DeploymentInstanceStore.getInstancesDetails;
    let hr = {
      backgroundColor: 'rgb(231, 231, 239)',
      height: 1,
      border: 'none',
      marginBottom: 10,
    };

    let instanceHistory;
    if (instanceInfo.histories) {
      instanceHistory = instanceInfo.histories.content.sort(this.compare('id'));
    }

    const loadingBar = (
      <div style={{display: 'inherit', margin: '200px auto', textAlign: "center"}}>
        <Spin />
      </div>
    );

    const columns = [{
      title: "#",
      dataIndex: "name",
      key: "name",
    }, {
      title: HAP.languageChange("deployment.versionStatus"),
      dataIndex: "status",
      key: "status",
    }, {
      title: <div style={{textAlign: "center"}}>
        {HAP.languageChange("deployment.operate")}
      </div>,
      className: "operateIcons",
      key: 'operate',
      render: (text, record) => (
        <div ref="opeIcon">
          <Tooltip title={HAP.languageChange("deployment.detail")} placement="bottom"
                   getTooltipContainer={(that) => that}>
            <a className="operateIcon small-tooltip"
               onClick={this.openNewPage.bind(this, record.id, this.state.id, record.num)}>
              <Icon type="search"/>
            </a>
          </Tooltip>
        </div>
      ),
    }];

    const columnsObject = [{
      title: HAP.languageChange("deployment.id"),
      dataIndex: "id",
      key: "id",
    }, {
      title: HAP.languageChange("instance.name"),
      dataIndex: "name",
      key: "name",
    }, {
      title: HAP.languageChange("instance.type"),
      dataIndex: "kind",
      key: "kind",
    }, {
      title: <div style={{textAlign: "center"}}>
        {HAP.languageChange("deployment.operate")}
      </div>,
      className: "operateIcons",
      key: 'operate',
      render: (text, record) => (
        <div ref="opeIcon">
          <Tooltip title={HAP.languageChange("deployment.detail")} placement="bottom"
                   getTooltipContainer={(that) => that}>
            <a className="operateIcon small-tooltip">
              <Icon type="search"/>
            </a>
          </Tooltip>
        </div>
      ),
    }];

    let item = [];
    if (instanceHistory) {
      let instanceVariables = JSON.parse(instanceHistory[0].variables);
      instanceVariables.map((value, index) => {
        if (value.generate && value.generate == "expression") {
          item.push(<Col span={11} key={index}>
              <FormItem

                {...formItemLayout}
                label={value.display}
                hasFeedback
              >
                {getFieldDecorator(value.name, {
                  initialValue: value.value,
                })(
                  <Input size="default" type="text"/>
                )}
                <span style={{color: '#03A9F4'}}>
                    {value.description}
                  </span>
              </FormItem>
            </Col>
          );
        } else {
          item.push(<Col span={11} key={index}>
              <FormItem

                {...formItemLayout}
                label={value.display}
                hasFeedback
              >
                {getFieldDecorator(value.name, {
                  rules: [{required: value.required, message: HAP.getMessage("该字段是必输的！", "This field is required!")}],
                  initialValue: value.value
                })(
                  <Input size="default" type="text"/>
                )}
                <span style={{color: '#03A9F4'}}>
                    {value.description}
                  </span>
              </FormItem>
            </Col>
          );
        }
      })
    }


    return (
      <div>
        <PageHeader title={HAP.languageChange("deployment.details")}>
          <Button className="header-btn" ghost={true} style={PageHeadStyle.leftBtn} onClick={this.handleReset}
                  icon="arrow-left">{HAP.languageChange("deployment.return")}</Button>
          <Button className="header-btn" ghost={true} onClick={() => {
            this.getInstanceById(this.state.page)
          }} style={PageHeadStyle.leftBtn} icon="reload">{HAP.languageChange("flush")}</Button>
        </PageHeader>
        {DeploymentInstanceStore.getIsLoading ? loadingBar : (
          <div>
            <div style={pageStyle.nameDes}>
              <span style={pageStyle.instanceName}>{instanceInfo.name}</span>
              <Button style={{float: "right"}} onClick={this.handleSubmit}>{HAP.languageChange("deployment.deploy")}</Button>
            </div>
            <div style={{marginLeft: 10, marginBottom: 10}}><span>{HAP.languageChange("deployment.belong")}：</span><span
              style={pageStyle.deploymentName}>{instanceInfo.deploymentName}</span></div>
            <div>
              <Tabs defaultActiveKey="1" style={{backgroundColor: "white", minHeight: 450, padding: 5}}
                    animated={false}>
                <TabPane tab="History" key="1">
                  <div style={{marginLeft: 10}}>
                    <p style={{marginBottom: '15px', fontSize: 16}}>
                      {HAP.getMessage("当前实例部署历史记录列表", "The current instance deployment history list")}
                    </p>
                    <hr style={hr}/>
                    <Table columns={columns} dataSource={instanceHistory} pagination={false} rowKey={function (record) {
                      return record.name
                    }}/>
                    <div style={{
                      marginTop: 10,
                      float: 'right',
                      display: DeploymentInstanceStore.details && DeploymentInstanceStore.details.length == 0 ? 'none' : 'block'
                    }}>
                      <Pagination total={DeploymentInstanceStore.getTotalSize} pageSize={5}
                                  current={this.state.page + 1}
                                  onChange={page => this.getInstanceById(page - 1)}/>
                    </div>
                  </div>
                </TabPane>
                <TabPane tab="Configuration" key="2">
                  <div style={{marginLeft: 10}}>
                    <p style={{marginBottom: '15px', fontSize: 16}}>
                      {HAP.getMessage("当前实例部署历史记录列表", "The current instance deployment history list")}
                    </p>
                    <hr style={hr}/>
                    <Table columns={columnsObject} dataSource={objectInfo} pagination={false}
                           rowKey={function (record) {
                             return record.id
                           }}/>
                  </div>
                </TabPane>
                <TabPane tab="Variables" key="3">
                  <div style={{marginLeft: 10}}>
                    <Row>
                      <Col>
                        <p style={{
                          marginBottom: '15px',
                          fontSize: 16
                        }}>{HAP.getMessage("当前部署实例状态变量", "Currently deployed instance state variables")}</p>
                        <hr style={hr}/>
                      </Col>
                    </Row>
                    <div >
                      <Form onSubmit={this.handleSubmit} className="test">
                        <Row>
                          {item}
                        </Row>
                      </Form>
                    </div>
                  </div>
                  <div style={{marginBottom: 10, marginLeft: 10}}>
                    <Row >
                      <Col span={2}>
                        <Button size="default" type="primary"
                                htmlType="submit"
                                onClick={this.handleSubmit.bind(this)}
                                className="login-form-button">
                          {HAP.languageChange("deployment.launch")}
                        </Button>
                      </Col>
                      <Col span={2}>
                        <Button size="default" htmlType="reset" onClick={() => {
                          this.getInstanceById(this.state.page)
                        }}
                                className="login-form-button">
                          {HAP.languageChange("form.cancel")}
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </TabPane>
              </Tabs>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default Form.create({})(withRouter(DeploymentInstanceDetail));


