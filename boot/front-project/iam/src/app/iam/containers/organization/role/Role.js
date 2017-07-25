/**
 * Created by cheon on 6/27/17.
 */
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {observer } from 'mobx-react'
import { Table, Icon, Button, Spin, Pagination, Tooltip } from 'antd';
import Remove from '../../../components/Remove';
import PageHeader, {PageHeadStyle} from '../../../components/PageHeader';

@observer
class Role extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      id: '',
      page: 0,
      size: 10,
    };
  };

  componentDidMount(){
    this.setState({
      page: 0
    });
    this.loadRole(this.state.page, this.state.size);
  };

  loadRole = (page, size) => {
    this.props.RoleStore.loadRole(page,size);
  };


  linkToChange = (url) => {
    const { history } = this.props;
    history.push(url);
  };

  handleOpen = (id) => {
    this.setState({ open: true, id: id });
  };

  handleClose = (event) => {
    this.setState({ open: false });
  };

  handleDelete = (event) => {
    const { id } = this.state;
    this.setState({
      open: false
    });
    this.props.RoleStore.deleteRoleById(id);
    this.loadRole(this.state.page, this.state.size);
  };

  onEdit = (id) => {
    this.linkToChange(`role/edit/${id}`);
  };

  render() {
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
    }, {
      title: <div style={{ textAlign: "center" }}>
        {HAP.languageChange("role.action")}
      </div>,
      className: "operateIcons",
      key: 'action',
      render: (text, record) => (
        <div ref="opeIcon">
          <Tooltip title={HAP.languageChange("role.edit")} placement="bottom" getTooltipContainer={(that) => that}>
            <a className="operateIcon small-tooltip" onClick={this.onEdit.bind(this, record.id)}>
              <Icon type="edit" />
            </a>
          </Tooltip>
          <Tooltip title={HAP.languageChange("role.delete")} placement="bottom" getTooltipContainer={(that) => that}>
            <a className="operateIcon small-tooltip" onClick={this.handleOpen.bind(this, record.id)}>
              <Icon type="delete" />
            </a>
          </Tooltip>
        </div>
      ),
    }];

    const loadingBar = (
      <div style={{ display: 'inherit', margin: '200px auto', textAlign: "center" }}>
        <Spin />
      </div>
    );
    return (
      <div>
        <Remove open={this.state.open} handleCancel={this.handleClose} handleConfirm={this.handleDelete.bind(this)} />
        <PageHeader title={HAP.languageChange("role.title")}>
          <Button className="header-btn" ghost={true} onClick={() => { this.loadRole(this.state.page, this.state.size) }} style={PageHeadStyle.leftBtn} icon="reload" >{HAP.languageChange("flush")}</Button>
        </PageHeader>
        {this.props.RoleStore.getIsLoading? loadingBar : (
          <div style={{ margin: 20, }}>
            <Table columns={columns} dataSource={this.props.RoleStore.getRoles} pagination={false} rowKey={function (record) { return record.id }} />
            <div style={{ marginTop: 10, float: 'right', display: this.props.RoleStore.isLoading ? 'none' : 'block' }}>
              <Pagination current={this.state.page + 1} pageSize={this.state.size} onChange={page => {this.setState({page: page-1}); this.loadRole(page-1, this.state.size)}} total={this.props.RoleStore.totalSize} />
            </div>
          </div>
        )}
      </div>
    )
  }
}
export default withRouter(Role)
