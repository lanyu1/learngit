/**
 * Created by song on 2017/6/28.
 */

import React, {Component} from 'react'
import PageHeader, {PageHeadStyle} from '../../../components/PageHeader';
import {Button, BackTop} from 'antd';
import Label from '../../../components/organization/Label';
import OrganizationList from '../../../components/organization/OrganizationList';
import {observer} from 'mobx-react';
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
class AdminOrganization extends Component {
  constructor(props, context) {
    super(props, context);
  };

  // 跳转
  linkToChange = (url) => {
    const {history} = this.props;
    history.push(url);
  };
  // 创建
  openNewPage() {
    this.linkToChange(`/iam/admin-organization/new`);
  }

  // 标签
  handleLableClick = () => {
    const {AdminOrganizationStore} = this.props;
    let isShow = AdminOrganizationStore.labelShow;
    if (isShow) {
      AdminOrganizationStore.changeLabelShow(false);
    } else {
      AdminOrganizationStore.changeLabelShow(true);
    }
  };

  componentWillUnmount() {
    const {AdminOrganizationStore} = this.props;
    AdminOrganizationStore.changeLabelShow(false);
    AdminOrganizationStore.setRows([]);
  }

  render() {
    const {AdminOrganizationStore,history} = this.props;
    const isShow = AdminOrganizationStore.labelShow;
    return (
      <div style={style.container}>
        <div style={style.top}>
          <PageHeader title={HAP.languageChange('adminOrg.manage')}>
            <Button className="header-btn" ghost={true} style={PageHeadStyle.leftBtn} icon="team" onClick={() => {
              this.openNewPage()
            }}>{HAP.languageChange('adminOrg.create')}</Button>
            <Button className="header-btn" ghost={true} style={PageHeadStyle.leftBtn} icon="tags-o" onClick={() => {
              this.handleLableClick()
            }}>{HAP.languageChange('adminOrg.label')}</Button>
          </PageHeader>
        </div>
        <div style={style.bottom}>
          <div style={style.left}>
            <OrganizationList AdminOrganizationStore={AdminOrganizationStore} history={history}/>
          </div>
          {isShow ? <div style={style.right}>
            <Label AdminOrganizationStore={AdminOrganizationStore}/>
          </div> : ''}
        </div>
        <BackTop />
      </div>
    );
  }
}


export default withRouter(AdminOrganization);
