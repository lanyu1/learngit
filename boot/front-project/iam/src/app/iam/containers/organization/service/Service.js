/**
 * Created by lty on 2017/6/26.
 */
import React, { Component, PropTypes } from 'react'
import PageHeader, { PageHeadStyle } from '../../../components/PageHeader';
import { Table, Icon, Button, Spin, Pagination, Tooltip, Modal, Row, Col, Input, Tabs } from 'antd';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';

@inject("AppState")
@observer
class Service extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      open: false,
      page: 0,
      isLoading: true,
    };
  }
  componentDidMount() {
    const { page } = this.state;
    this.loadData(page);
  }

  loadData = (page) => {
    const { AppState, ServiceStore } = this.props;
    const menuType=AppState.currentMenuType;
    let organizationId=menuType.id;
    ServiceStore.loadServices(organizationId);
  };

  render() {
    const { AppState, ServiceStore } = this.props; 
    const columns = [
      {
        title: HAP.languageChange("service.id"),
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: HAP.languageChange("service.code"),
        dataIndex: "code",
        key: 'code'
      },
      {
        title: HAP.languageChange("service.name"),
        dataIndex: "name",
        key: 'name'
      },
      {
        title: HAP.languageChange("service.describe"),
        dataIndex: "description",
        key: 'description'
      }
    ];

    let dataSource = ServiceStore.getServices;
    let totalElement = ServiceStore.getTotalSize;


    const loading = (
        <div>
            <Spin size="default" style={{position: "fixed", bottom: "50%", left: "50%"}}/>
        </div>
    );

    return (
      <div>
        <PageHeader title={HAP.languageChange('service.organization')} >
          <Button className="header-btn" ghost={true} onClick={() => {
            this.loadData(this.state.page)
          }} style={PageHeadStyle.leftBtn} icon="reload">{HAP.languageChange("service.refresh")}</Button>
        </PageHeader>

        {this.props.ServiceStore.isLoading ? loading: (
            <div style={{margin: 10}}>
              <Table dataSource={dataSource} columns={columns} rowKey="id"
                     pagination={false}/>
              <div style={{marginTop: 10, float: 'right', display: this.state.isLoading ? 'none' : 'block'}}>
                <Pagination total={totalElement} pageSize={10} current={this.state.page + 1}
                            onChange={page => this.loadData(page - 1)}/>
              </div>
            </div>
        )}

      </div>
    );
  }
}

export default withRouter(Service);
