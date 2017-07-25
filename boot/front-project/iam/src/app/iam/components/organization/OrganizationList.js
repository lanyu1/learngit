/**
 * Created by jaywoods on 2017/7/6.
 */
import React, {Component} from 'react'
import {Table, Icon, Spin, Pagination, Tooltip, message} from 'antd';
import Remove from '../Remove';


class OrganizationList extends Component {
  constructor(props, context) {
    super(props, context);
    this.loadOrganization = this.loadOrganization.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.state = {
      id: '',
      page: 0,
      open: false,
      selectedRowKeys: [],
      selectedRows: [],
      isLoading: true,
    };

  };

  // 加载
  loadOrganization = (page) => {
    const {AdminOrganizationStore} = this.props;
    AdminOrganizationStore.loadOrganizations(page).then(data => {
      if (data) {
        AdminOrganizationStore.setOrganizations(data.content);
        AdminOrganizationStore.setTotalPage(data.totalPages);
        AdminOrganizationStore.setTotalSize(data.totalElements);
        this.setState({
          page: page,
          isLoading: false,
        });
      }
    }).catch(() => {
      AdminOrganizationStore.setOrganizations();
    });

  };

  componentDidMount() {
    this.loadOrganization(0);
  }

  // 跳转
  linkToChange = (url) => {
    const {history} = this.props;
    history.push(url);
  };

  // 修改
  handleChange = (id) => {
    this.linkToChange(`/iam/admin-organization/edit/${id}`);
  };

  // 删除
  handleOpen = (id) => {
    this.setState({
      open: true,
      id: id
    });
  };

  // 行标签
  handleRowLabel = (id) => {
    this.linkToChange(`/iam/admin-organization/label/${id}`);
  };

  // 选择
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({selectedRowKeys, selectedRows});
    const {AdminOrganizationStore} = this.props;
    AdminOrganizationStore.setRows(selectedRows);

  };

  // 取消删除
  handleClose = (event) => {
    this.setState({open: false});
  };

  // 确认删除
  handleDelete = (event) => {
    const {id} = this.state;
    const {AdminOrganizationStore} = this.props;
    let lastDatas = AdminOrganizationStore.getTotalSize % 10;
    let totalPage = AdminOrganizationStore.getTotalPage;
    AdminOrganizationStore.deleteOrganizationById(id).then(() => {
      //删除后处理已选择的对象let {selectedRows} = this.state;
      let {selectedRows, selectedRowKeys} = this.state;
      let isExist = false;
      let removeIndex;
      let rows = selectedRows;
      console.log("已选择数据:",rows);
      rows.map((item, index) => {
        if (item.id === id) {
          isExist = true;
          removeIndex = index;
          console.log("删除ID",item.id);
          console.log("删除下标",removeIndex)
        }
      });
      if(isExist){
        rows.splice(removeIndex, 1);
        AdminOrganizationStore.setRows(rows);
      }
      this.setState({
        open: false
      });
      if (lastDatas == 1 && this.state.page + 1 == totalPage) {
        this.loadOrganization(this.state.page - 1)
      } else {
        this.loadOrganization(this.state.page)
      }

      message.success(HAP.getMessage('删除成功！', 'delete success!'));
    });
  };

  render() {
    const columns = [{
      title: HAP.languageChange('adminOrg.id'),
      dataIndex: 'id',
      key: 'id',
    }, {
      title: HAP.languageChange('adminOrg.orgName'),
      dataIndex: 'name',
      key: 'name',
    }, {
      title: <div style={{textAlign: "center"}}>
        {HAP.languageChange('operation')}
      </div>,
      className: "operateIcons",
      key: 'action',
      render: (text, record) => (
        <div>
          <Tooltip title={HAP.languageChange('edit')} placement="bottom" getTooltipContainer={(that) => that}>
            <a className="operateIcon small-tooltip" onClick={this.handleChange.bind(this, record.id)}>
              <Icon type="edit"/>
            </a>
          </Tooltip>
          <Tooltip title={HAP.languageChange('delete')} placement="bottom" getTooltipContainer={(that) => that}>
            <a className="operateIcon small-tooltip" onClick={this.handleOpen.bind(this, record.id)}>
              <Icon type="delete"/>
            </a>
          </Tooltip>
          <Tooltip title={HAP.languageChange('adminOrg.label')} placement="bottom" getTooltipContainer={(that) => that}>
            <a className="operateIcon small-tooltip" onClick={this.handleRowLabel.bind(this, record.id)}>
              <Icon type="tag-o"/>
            </a>
          </Tooltip>
        </div>
      ),
    }];

    const loadingBar = (
      <div style={{display: 'inherit', margin: '200px auto', textAlign: "center"}}>
        <Spin />
      </div>
    );

    const {AdminOrganizationStore} = this.props;
    const {selectedRowKeys} = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    let totalElement = AdminOrganizationStore ? AdminOrganizationStore.getTotalSize : 1;
    let dataSource = AdminOrganizationStore.getOrganizations;
    return (
      <div>
        <Remove open={this.state.open} handleCancel={this.handleClose} handleConfirm={this.handleDelete}/>

        <div style={{margin: 20,}}>
          {this.state.isLoading ? loadingBar : (
            <Table pagination={false} columns={columns} dataSource={dataSource} rowKey={function (record) {
              return record.id
            }} rowSelection={rowSelection}/>
          )}
          <div style={{marginTop: 10, float: 'right', display: dataSource.length == 0 ? 'none' : 'block'}}>
            <Pagination current={this.state.page + 1} pageSize={10}
                        onChange={page => this.loadOrganization(page - 1)} total={totalElement}/>
          </div>
        </div>
      </div>
    );
  }
}

export default OrganizationList;
