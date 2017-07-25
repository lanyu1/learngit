/**
 * Created by jaywoods on 2017/6/25.
 */

import React, { Component } from 'react';
import PageHeader, { PageHeadStyle } from '../../../components/PageHeader';
import Remove from '../../../components/Remove';
import {Table, Icon, Tooltip, Pagination, Button, Spin,Popover,Tag,message} from 'antd';
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router-dom';


@inject("AppState")
@observer
class Clients extends Component {
  constructor(props) {
    super(props);
    this.loadClient = this.loadClient.bind(this);
    this.linkToChange = this.linkToChange.bind(this);
    this.state = {
      page: 0,
      id: '',
      open: false,
    }
  }

  componentDidMount() {
    let { page } = this.state;
    this.loadClient(page);
  }

  loadClient=(page)=>{
    const {AppState,ClientStore}= this.props;
    const menuType=AppState.currentMenuType;
    let organizationId=menuType.id;
    this.setState({
      page:page,
    });
    ClientStore.loadClients(organizationId,page);
  };

  linkToChange = (url) => {
    const { history } = this.props;
    history.push(url);
  };

  handleChange = (id) => {
    this.linkToChange(`client/edit/${id}`);
  };
  handleOpen = (id) => {
    this.setState({ open: true, id: id });
  };
  handleClose = (event) => {
    this.setState({ open: false, id: '' });
  };
  handleDelete = (event) => {
    const {AppState,ClientStore}= this.props;
    const {id} = this.state;
    let lastDatas = ClientStore.getTotalSize % 10;
    const menuType=AppState.currentMenuType;
    let organizationId=menuType.id;
    ClientStore.deleteClientById(organizationId,id).then(data=>{
      message.success("Success");
      if (lastDatas == 1 && this.state.page + 1 == ClientStore.getTotalPage) {
        this.loadClient(this.state.page - 1);
      } else {
        this.loadClient(this.state.page);
      }
      this.handleClose();
    })
  };
  openNewPage = () => {
    this.linkToChange('client/new');
  };

  authorizedContent = (row) => {
    const clearPointer = {
      cursor: "default"
    };

    let data = row?row.split(','):[];
    let content = [];
    data.map((item, index) => {
      let s = (<div key={index}><Tag key={index} style={clearPointer}>{item}</Tag></div>);
      content.push(s);
    });
    return (<div>{content}</div>);
  };

  render(){
    let data=[];
    const {ClientStore}= this.props;
    const clients = ClientStore.getClients;
    if(clients){
      data=clients;
    }
    const loadingBar = (
      <div style={{ display: 'inherit', margin: '200px auto', textAlign: "center" }}>
        <Spin />
      </div>
    );

    const columns = [
      {
        title: HAP.languageChange("client.id"),
        dataIndex: 'id',
        key: 'id'
      }, {
        title: HAP.languageChange("client.name"),
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: HAP.languageChange("client.authorizedNumber"),
        render: (text, record) => (
          <div style={{ overflow: 'visible' }}>
            <Popover rowKey="authorizedGrantTypes" title={HAP.languageChange("client.authorizedGrantTypes")} content={this.authorizedContent(record.authorizedGrantTypes)} placement="bottomLeft">
              <p>{record.authorizedGrantTypes ? record.authorizedGrantTypes.split(',').length : 0}</p>
            </Popover>
          </div>

        ),
        key: 'authorizedGrantTypes',
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
              <a className="operateIcon small-tooltip" onClick={this.handleChange.bind(this, record.id)}>
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


    return (
        <div>
          <Remove open={this.state.open} handleCancel={this.handleClose}
                  handleConfirm={this.handleDelete}/>
          <PageHeader title={HAP.languageChange("client.title")}>
            <Button className="header-btn" ghost={true} onClick={() => {
              this.openNewPage()
            }} style={PageHeadStyle.leftBtn} icon="laptop">{HAP.languageChange("client.create")}</Button>
            <Button className="header-btn" ghost={true} onClick={() => {
              this.loadClient(this.state.page)
            }} style={PageHeadStyle.leftBtn} icon="reload">{HAP.languageChange("flush")}</Button>
          </PageHeader>
          <div style={{margin: 5}}>
            {ClientStore.getIsLoading ? loadingBar : (
                <Table pagination={false} columns={columns} dataSource={data} rowKey="id"/>
            )}
            <div style={{marginTop: 10, float: 'right', display: data.length==0 ? 'none' : 'block'}}>
              <Pagination total={ClientStore.getTotalSize} pageSize={10} current={this.state.page + 1}
                          onChange={page => this.loadClient(page - 1)}/>
            </div>
          </div>
        </div>
    );
  }
}

export default withRouter(Clients);
