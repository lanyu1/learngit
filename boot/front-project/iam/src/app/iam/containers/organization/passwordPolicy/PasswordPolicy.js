/**
 * Created by jaywoods on 2017/6/26.
 */
import React, { Component } from 'react';
import PageHeader, {PageHeadStyle} from '../../../components/PageHeader';
import { Table, Icon, Tooltip, Pagination, Button, Spin,message } from 'antd';
import {observer, inject} from 'mobx-react'
import {withRouter} from 'react-router-dom';
import axios from '../../../common/axios';

@observer
class PasswordPolicy extends Component{
  constructor(props) {
    super(props);
    this.loadPasswordPolicy=this.loadPasswordPolicy.bind(this);
    this.state = {
      id:'',
      open:false,
    }
  };

  linkToChange=(url)=>{
    const {history} = this.props;
    history.push(url);
  };

  componentDidMount(){
    this.loadPasswordPolicy();
  }

  loadPasswordPolicy=()=>{
    const { PasswordPolicyStore } = this.props;
    PasswordPolicyStore.loadPasswordPolicy(function (error) {
      message.error(error);
    });
  };

  handleChange=()=>{
    this.linkToChange('/iam/password-policy/edit')
  };

  openNewPage=()=>{
    this.linkToChange('/iam/password-policy/new')
  };

  render() {
    const { PasswordPolicyStore } = this.props;
    let tmp=PasswordPolicyStore.getPasswordPolicy;
    let data = [];
    if(tmp){
      data=tmp;
    }
    const loadingBar = (
        <div style={{ display: 'inherit', margin: '200px auto', textAlign: "center" }}>
          <Spin />
        </div>
    );
    const columns = [
      {
        title: HAP.languageChange('policy.name'),
        dataIndex: 'name',
        key: 'name'
      }, {
        title: HAP.languageChange('policy.lock'),
        key: 'lockEnabled',
        render: (text, record, index) => (
            record.lockEnabled == true ? <p>{HAP.languageChange('yes')}</p> : <p>{HAP.languageChange('no')}</p>
        )
      }, {
        title: HAP.languageChange('policy.passwordCheck'),
        key: 'passwordCheck',
        render: (text, record, index) => (
            record.passwordCheck == true ? <p>{HAP.languageChange('yes')}</p> : <p>{HAP.languageChange('no')}</p>
        )
      },
      {
        title: HAP.languageChange('policy.lockedTime'),
        dataIndex: 'lockedTime',
        key: 'lockedTime'
      },
      {
        title: HAP.languageChange('policy.maxErrorTimes'),
        dataIndex: 'maxErrorTimes',
        key: 'maxErrorTimes'
      },
      {
        title: <div style={{ textAlign: "center" }}>
          {HAP.languageChange('operation')}
        </div>,
        className: "operateIcons",
        key: "action",
        render: (text, record) => (
            <div>
              <Tooltip title={HAP.languageChange('edit')} placement="bottom" getTooltipContainer={(that) => that}>
                <a className="operateIcon small-tooltip" onClick={this.handleChange.bind(this)}>
                  <Icon type="edit" />
                </a>
              </Tooltip>
            </div>
        )
      },
    ];
    return (
        <div>
          <PageHeader title={HAP.languageChange("policy.title")}>
            {data.length==0?( <Button className="header-btn" ghost={true} onClick={() => { this.openNewPage() }} style={PageHeadStyle.leftBtn} icon="lock">{HAP.languageChange("policy.create")}</Button>):""}
            <Button className="header-btn" ghost={true} onClick={() => { this.loadPasswordPolicy() }} style={PageHeadStyle.leftBtn} icon="reload" >{HAP.languageChange("flush")}</Button>
          </PageHeader>
          <div style={{ margin: 20, }}>
            {this.state.isLoading ? loadingBar : (
                <Table pagination={false} columns={columns} dataSource={data} rowKey="id" />
            )
            }
          </div>
        </div>
    );
  }
}

export default PasswordPolicy;
