/**
 * Created by song on 2017/6/28.
 */

import React, {Component} from 'react'
import PageHeader, {PageHeadStyle} from '../../../components/PageHeader';
import {Table, Icon, Button, Spin, Pagination, Tooltip, Modal, Row, Col, Input, Tabs, message} from 'antd';
import Remove from '../../../components/Remove';
import ServiceDeployment from '../../../components/organization/ServiceDeployment';
import LabelList from '../../../components/organization/LabelList';
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router-dom';

const style = {
  container: {
    display: 'flex',
    flex: '1 1 auto',
    backgroundColor: '#fafafa',
    flexDirection: 'column',
    height: '100%'
  },
  top: {
    top: 0,
    height: 48,
    flexDirection: 'row'
  },
  bottom: {
    flex: '1 1 0%',
    display: 'flex',
    flexDirection: 'row'
  },
  left: {
    flex: '1 1 0',
    order: 1,
    width: '60%',
    flexDirection: 'row',
    flexGrow: '2',
  },
  right: {
    flex: '1 1 0',
    order: 2,
    flexDirection: 'row',
    //paddingLeft:'10px',
    borderLeft: '1px solid #F4F4F4',
    flexGrow: '1',
  },
  tip: {
    backgroundColor: '#fafafa',
  }
};

@observer
class OrganizationLabel extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      organizationId: this.props.match.params.organizationId,
    };
    this.handleService = this.handleService.bind(this);
  }

  componentWillUnmount() {
    const {LabelStore} = this.props;
    LabelStore.changeShow(false);
    LabelStore.setRows([]);
  }

  handleService = () => {
    const {LabelStore} = this.props;
    let isShow = LabelStore.show;
    if (isShow) {
      LabelStore.changeShow(false);
    } else {
      LabelStore.changeShow(true);
    }
  };

  render() {
    const {LabelStore} = this.props;
    let isShow = LabelStore.show;

    return (
      <div style={style.container}>
        <div style={style.top}>
          <PageHeader title={HAP.languageChange('adminOrg.labelmanage')} backPath="/iam/admin-organization">
            <Button className="header-btn" ghost={true} style={PageHeadStyle.leftBtn} icon="customer-service"
                    onClick={() => {
                      this.handleService()
                    }}>{HAP.languageChange('adminOrg.server')}</Button>
          </PageHeader>
        </div>
        <div style={style.bottom}>
          <div style={style.left}>
            <LabelList labelStore={LabelStore} organizationId={this.state.organizationId}/>
          </div>
          {isShow ? <div style={style.right}>
            <ServiceDeployment labelStore={LabelStore} organizationId={this.state.organizationId}/>
          </div> : ''}
        </div>
      </div>
    );
  }
}


export default withRouter(OrganizationLabel);
