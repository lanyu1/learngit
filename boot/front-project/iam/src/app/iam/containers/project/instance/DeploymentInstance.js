/**
 * Created by Wangke on 2017/7/6.
 */


import React, {Component, PropTypes} from 'react';
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router-dom';
import PageHeader, {PageHeadStyle} from '../../../components/PageHeader';
import Remove from '../../../components/Remove';
import {Table, Spin, Pagination, Menu, Dropdown, Button, Icon, message, Input, Card, Col, Row, Tooltip} from 'antd';

@inject("AppState")
@observer
class DeploymentInstance extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      open: false,
      page: 0,
      id: ''
    }
  }

  componentDidMount() {
    let { page } = this.state;
    this.loadInstances(page);
  }

  loadInstances=(page)=>{
    const {AppState,DeploymentInstanceStore}= this.props;
    const menuType=AppState.currentMenuType;
    let projectId=menuType.id;
    this.setState({
      page:page,
    });
    DeploymentInstanceStore.loadInstances(projectId,page);
};

  openNewPage = (id) => {
    this.linkToChange(`instance/detail/${id}`);
  };

  linkToChange = (url) => {
    const {history} = this.props;
    history.push(url);
  };

  handleOpen = (id) => {
    this.setState({ open: true, id: id });
  };

  handleClose = (event) => {
    this.setState({ open: false, id: '' });
  };

  handleDelete = (event) => {
    const {AppState,DeploymentInstanceStore}= this.props;
    const {id} = this.state;
    let lastDatas = DeploymentInstanceStore.getTotalSize % 10;
    const menuType=AppState.currentMenuType;
    let projectId=menuType.id;
    DeploymentInstanceStore.deleteInstanceById(projectId,id).then(data=>{
      message.success("Success");
      if (lastDatas == 1 && this.state.page + 1 == DeploymentInstanceStore.getTotalPage) {
        this.loadInstances(this.state.page - 1);
      } else {
        this.loadInstances(this.state.page);
      }
      this.handleClose();
    })
  };

  render() {
    const {DeploymentInstanceStore}= this.props;
    const instances = DeploymentInstanceStore.getInstances;
    const loadingBar = (
      <div style={{display: 'inherit', margin: '200px auto', textAlign: "center"}}>
        <Spin />
      </div>
    );

    const columns = [{
      title: HAP.languageChange("deployment.id"),
      dataIndex: "id",
      key: "id"
    }, {
      title: HAP.languageChange("deployment.instanceName"),
      dataIndex: "name",
      key: "name"
    }, {
      title: HAP.languageChange("deployment.name"),
      dataIndex: "deploymentName",
      key: "deploymentName",
    }, {
      title: HAP.languageChange("deployment.latestVersionName"),
      dataIndex: "latestVersion",
      key: "latestVersion",
    }, {
      title: HAP.languageChange("deployment.versionStatus"),
      dataIndex: "latestStatus",
      key: "latestStatus",
    }, {
      title: <div style={{textAlign: "center"}}>
        {HAP.languageChange("deployment.operate")}
      </div>,
      className: "operateIcons",
      key: 'operate',
      render: (text, record) => (
        <div ref="opeIcon">
          <Tooltip title={HAP.languageChange("deployment.details")} placement="bottom"
                   getTooltipContainer={(that) => that}>
            <a className="operateIcon small-tooltip" onClick={this.openNewPage.bind(this, record.id)}>
              <Icon type="search"/>
            </a>
          </Tooltip>
          <Tooltip title={HAP.languageChange("delete")} placement="bottom" getTooltipContainer={(that) => that}>
            <a className="operateIcon small-tooltip" onClick={this.handleOpen.bind(this, record.id)}>
              <Icon type="delete" />
            </a>
          </Tooltip>
        </div>
      ),
    }];

    return (
      <div>
        <Remove open={this.state.open} handleCancel={this.handleClose}
                handleConfirm={this.handleDelete}/>
        <PageHeader title={HAP.languageChange("deployment.instance")}>
          <Button className="header-btn" ghost={true} onClick={() => {this.loadInstances(this.state.page)
          }} style={PageHeadStyle.leftBtn} icon="reload">{HAP.languageChange("flush")}</Button>
        </PageHeader>
        {DeploymentInstanceStore.getIsLoading ? loadingBar : (
        <div style={{margin: 10}}>
          <Table columns={columns} dataSource={instances} pagination={false} rowKey={function (record) {
            return record.id
          }} />
          <div style={{marginTop: 10, float: 'right', display: instances.length == 0  ? 'none' : 'block'}}>
            <Pagination total={DeploymentInstanceStore.getTotalSize} pageSize={10} current={this.state.page + 1}
                        onChange={page => this.loadInstances(page - 1)}/>
          </div>
        </div>
        )}
      </div>
    )
  }
}

export default withRouter(DeploymentInstance);


