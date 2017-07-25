/**
 * Created by YANG on 2017/7/4.
 */

import React,{Component, PropTypes} from 'react';
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router-dom';
import PageHeader,{PageHeadStyle} from '../../../components/PageHeader';
import Remove from '../../../components/Remove';

import {Tooltip,Table,Spin,Menu, Dropdown, Button, Icon, message, Input, Card, Col, Row} from 'antd';



@inject("AppState")
@observer
class DeploymentVersion extends Component{
  constructor(props,context){
    super(props,context);
    this.state = {
      dmpId:this.props.match.params.id,
      isLoading:true,
    }
    this.onRefresh = this.onRefresh.bind(this);
  }
  handleMenuClick = (e) => {
    message.info('Click on menu item.');
    console.log('click', e);
  }
  componentDidMount(){
    const { DeploymentStore,AppState } = this.props;
    let organizationId=AppState.menuType.id;
    this.setState({
      isLoading:true,
    })
    DeploymentStore.loadVersionByDeploymentId(organizationId,this.state.dmpId);
  }
  handleChange = (id) => {

  };
  
  handleOpen = (id) => {
    this.setState({ open: true, id: id });
  };

  handleClose = (event) => {
    this.setState({ open: false, id: '' });
  };

  openNewPage = () => {
    //this.handleManageLibraryClose();
    let deploymentId=this.state.dmpId;
    this.linkToChange(`/iam/deployment/${deploymentId}/version/new`);
  };
  linkToChange = (url) => {
    const {history} = this.props;
    history.push(url);
  };
  handleEdit =(id) => {
    this.linkToChange(`/iam/deployment/${this.state.dmpId}/version/edit/${id}`)
  }
  onRefresh = () => {
    const { DeploymentStore,AppState } = this.props;
    let organizationId=AppState.menuType.id;
    DeploymentStore.loadVersionByDeploymentId(organizationId,this.state.dmpId)
  };

  handleDelete = (event) => {
    const {AppState,DeploymentStore}= this.props;
    const {id} = this.state;
    const orgId=AppState.currentMenuType.id;
    DeploymentStore.deleteVersion(orgId,this.state.dmpId,this.state.id).then(data=>{

      this.handleClose();
      this.onRefresh();
      message.success("Success");
    }).catch( error => {
      this.handleClose();
      message.error("error");

    })

  };
  render(){
    const { DeploymentStore,AppState } = this.props;
    let organizationId=AppState.menuType.id;
    const columns = [
      {
        title: HAP.languageChange("deployment.versionName"),
        dataIndex: 'versionName',
        key: 'versionName'
      }, {
        title: HAP.languageChange("deployment.versionNumber"),
        dataIndex: 'version',
        key: 'version'
      },
      {
        title: <div style={{ textAlign: "center" }}>
          {HAP.languageChange("operation")}
        </div>,
        className: "operateIcons",
        key: "action",
        render: (text, record) => (
          <div>
            <Tooltip title={HAP.languageChange("edit")} placement="bottom" getTooltipContainer={(that) => that}>
              <a className="operateIcon small-tooltip" onClick={this.handleEdit.bind(this, record.id)}>
                <Icon type="edit" />
              </a>
            </Tooltip>
            <Tooltip title={HAP.languageChange("delete")} placement="bottom" getTooltipContainer={(that) => that}>
              <a className="operateIcon small-tooltip" onClick={this.handleOpen.bind(this, record.id)}>
                <Icon type="delete" />
              </a>
            </Tooltip>
          </div>
        )
      },
    ];
    const loadingBar = (
      <div style={{ display: 'inherit', margin: '200px auto', textAlign: "center" }}>
        <Spin />
      </div>
    );
    var version =[];
    if (DeploymentStore && DeploymentStore.version){
      version = DeploymentStore.version;
    }
    return(
      <div>
        <Remove open={this.state.open} handleCancel={this.handleClose}
                handleConfirm={this.handleDelete}/>
        {/*pageHeader*/}
        <PageHeader title={HAP.languageChange("deployment.version")} backPath="/iam/deployment">
          <Button className="header-btn" ghost={true} onClick={() => {
            this.openNewPage()
          }} style={PageHeadStyle.leftBtn} icon="user-add">{HAP.languageChange("deployment.createVersion")}</Button>
          <Button className="header-btn" ghost={true} onClick={this.onRefresh} style={PageHeadStyle.leftBtn} icon="reload">{HAP.languageChange("flush")}</Button>
        </PageHeader>

        <div style={{margin: 5}}>
          {DeploymentStore.isLoading ? loadingBar : (
            <Table pagination={false} columns={columns} dataSource={[...version]} rowKey="id"/>
          )}
        </div>
      </div>

      )

  }

}

export default withRouter(DeploymentVersion);
