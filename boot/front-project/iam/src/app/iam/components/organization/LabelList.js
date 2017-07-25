/**
 * Created by jaywoods on 2017/7/6.
 */
import React, {Component} from 'react'

import {Table, Icon, Button, Spin, Pagination, Tooltip, Modal, Row, Col, Input, Tabs, message} from 'antd';
import Remove from '../Remove';
import {observer, inject} from 'mobx-react';

class LabelList extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      open: false,
      selectedRowKeys: [],
      orgData: '',
      datas: [],
      id: '',
      isShow: false,
      isLoading: true,
    };
  }

  componentDidMount() {
    this.loadOrganization();
  }

  loadOrganization = () => {
    const {labelStore, organizationId} = this.props;
    labelStore.getOrganizationById(organizationId).then((data) => {
      if (data) {
        this.setState({
          orgData: data,
          datas: data.labels,
          isLoading: false,
        });
      }
    }).catch((error) => {
      message.error(HAP.getMessage('获取组织失败！', 'get organization failed!'));
    });
  };

  handleClose = (event) => {
    this.setState({open: false});
  };

  handleOpen = (id) => {
    this.setState({
      open: true,
      id: id
    });
  };

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({selectedRowKeys, selectedRows});
    const {labelStore} = this.props;
    labelStore.setRows(selectedRows)
  };

  handleDelete = (event) => {
    const {id} = this.state;
    this.setState({
      open: false
    });
    const {labelStore} = this.props;
    labelStore.deleteLabelById(id).then(() => {
     /* let {selectedRows} = this.state;
      let isExist = false;
      let removeIndex;
      let rows = selectedRows;
      console.log("已选择数据:", rows);
      rows.map((item, index) => {
        if (item.id === id) {
          isExist = true;
          removeIndex = index;
          console.log("删除ID", item.id);
          console.log("删除下标", removeIndex)
        }
      });
      if (isExist) {
        rows.splice(removeIndex, 1);
        labelStore.setRows(rows);
      }
      this.setState({
        open: false
      });*/
      HAP.getMessage('删除成功！', 'delete success!')
      this.loadOrganization();
    }).catch((error) => {
      message.error(HAP.getMessage('删除失败！', 'delete failed!'));
    });
  };

  render() {
    const {datas, selectedRowKeys} = this.state;
    let dataSource = datas;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const columns = [
      {
        title: HAP.languageChange("adminOrg.label"),
        dataIndex: "labelValue",
        key: 'labelValue'
      },
      {
        title: <div style={{textAlign: "center"}}>{HAP.languageChange("operation")}</div>,
        key: "action",
        render: (text, record) => (
          <div style={{textAlign: 'center'}}>
            <Tooltip title={HAP.languageChange("delete")} placement="bottom" getTooltipContainer={(that) => that}>
              <a className="operateIcon small-tooltip" onClick={this.handleOpen.bind(this, record.id)}>
                <Icon type="delete"/>
              </a>
            </Tooltip>
          </div>
        )
      },
    ];

    return (
      <div>
        <Remove open={this.state.open} handleCancel={this.handleClose} handleConfirm={this.handleDelete}/>
        <div style={{margin: 10}}>
          <Table dataSource={dataSource} columns={columns} rowKey="id"
                 pagination={false} rowSelection={rowSelection} loading={this.state.isLoading}/>
        </div>
      </div>
    );
  }
}

export default LabelList;
