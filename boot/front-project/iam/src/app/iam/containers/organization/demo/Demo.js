import React, {Component} from 'react';
import { Table, Icon, Button, Spin, Pagination, Tooltip } from 'antd';
import {observer } from 'mobx-react'
import {withRouter} from 'react-router-dom';
import store from '../../../common/store';
//store注解符令组件可以通过DemoStore来找到该组件
@store("DemoStore")
@observer
class Demo extends Component {

  componentDidMount(){
    this.props.DemoStore.loadRole();
  };

  render(){
    const columns = [{
      title: HAP.languageChange("role.name"),
      dataIndex: "name",
      key: "name"
    },{
      title: HAP.languageChange("role.level"),
      dataIndex: "roleLevel",
      key: "roleLevel"
    }, {
      title: HAP.languageChange("role.description"),
      dataIndex: "description",
      key: "description",
    }, {
      title: HAP.languageChange("role.serviceName"),
      dataIndex: "serviceName",
      key: "serviceName",
    }];
    return (
      <div style={{ margin: 20, }}>
        <Table columns={columns} dataSource={this.props.DemoStore.getRoles} pagination={true} rowKey={function (record) { return record.id }} />
      </div>
    )
  }
}
//withRouter添加history支持
export default withRouter(Demo)
