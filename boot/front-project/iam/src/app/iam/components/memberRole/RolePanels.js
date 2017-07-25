/**
 * Created by lty on 2017/6/27.
 */

import React, { Component } from 'react'
import { Table, Collapse, Tooltip, Icon } from 'antd';
import RoleCas from './RoleCas';
const Panel = Collapse.Panel;

class RolePanels extends Component {
  constructor(props, context) {
    super(props, context);
  }
  render() {
    const {role,handleAssignShow,
      handleDeleteOpen, treeData, handleClose, defaultSelectKey,
      handleSubmit, showClose, inName, roleKeys,handleRoleSave, onClicks} = this.props;
    const columns=[{
      title: HAP.languageChange('type'),
      dataIndex: 'memberType',
      key: 'memberType',
      render: (text, record) => (
        <div>
          <Tooltip placement="right" title={text == "user" ? HAP.languageChange("用户") : HAP.languageChange("组织")}>
            {text == "user" ? <Icon type="user" /> : <Icon type="database" />}
          </Tooltip>
        </div>
      )
    }, {
      title: HAP.languageChange('member'),
      dataIndex: 'userName',
      key: 'userName',
      render: (item, record) => (
        <div>
          <p>{record.userName}</p>
          <p>{record.userEmail}</p>
        </div>
      )
    }, {
      title: HAP.languageChange('role'),
      dataIndex: 'roles',
      key: 'roles',
      render: (text, record) => (
        <RoleCas treeData={treeData} handleClose={handleClose} defaultSelectKey={roleKeys}
          handleSubmit={handleSubmit} showClose={true} inName={HAP.getMessage("分配", "distribute")} text={text} record={record} onClicks={onClicks} />
      )
    }, {
      title: <div style={{ textAlign: "center" }}>
        {HAP.languageChange('operation')}
      </div>,
      className: "operateIcons",
      key: 'action',
      render: (text, record) => (
        <div>
          <Tooltip title={HAP.languageChange('delete')} placement="bottom" getTooltipContainer={(that) => that}>
            <a className="operateIcon small-tooltip" onClick={handleDeleteOpen.bind(this, record)}>
              <Icon type="delete" />
            </a>
          </Tooltip>
        </div>
      ),
    }];


    const customPanelStyle = {
      background: '#FDFDFD',
      borderRadius: 3,
      marginBottom: 24,
      paddingTop: 0,
      paddingBottom: 12,
      border: -1,
    };
      const panel_head = role.roleName ? (
        <div>
          <p style={{ height: 8, marginBottom: 8, }}>{role.roleName.split(".")[1] + HAP.getMessage("（", "(") + role.member.length + HAP.getMessage(" 个成员）", " Members)")}</p>
          <p style={{ height: 8, }}>{role.roleDescription}</p>
        </div>
      ) : null;
    return (
      <Collapse style={{ border: 0, }}>
        <Panel header={panel_head}
          key={role.roleId} style={customPanelStyle}>
          <Table pagination={false} columns={columns} dataSource={role.member} size="small"
            rowKey={function (record) { return record.memberId }} />
        </Panel>
      </Collapse>
    )
  }
}

export default RolePanels;
