/**
 * Created by jaywoods on 2017/6/29.
 */
import React, {Component} from 'react';
import PageHeader, {PageHeadStyle} from '../../../components/PageHeader';
import Remove from '../../../components/Remove';
import {Table, Icon, Tooltip, Pagination, Button, Spin, Popover, Tag, message} from 'antd';
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router-dom';

@observer
class Client extends Component {
  constructor(props) {
    super(props);
    this.linkToChange = this.linkToChange.bind(this);
    this.handleDelete=this.handleDelete.bind(this);
    this.state = {
      page: 0,
      id: '',
      open: false,
    }
  }

  componentDidMount() {
    this.loadClient(this.state.page)
  }

  loadClient = (page) => {
    this.setState({
      page:page,
      isLoading: true,
    });
    const {AdminClientStore} = this.props;
    AdminClientStore.loadClients(page).then(() => {
      this.setState({
        isLoading: false,
      });
    }).catch(error=>{
      message.error(HAP.getMessage("加载失败","Loading Failed"))
    })
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

  linkToChange = (url) => {
    const { history } = this.props;
    history.push(url);
  };

  handleChange = (id) => {
    this.linkToChange(`admin-client/edit/${id}`);
  };
  handleOpen = (id) => {
    this.setState({ open: true, id: id });
  };
  handleClose = (event) => {
    this.setState({ open: false, id: '' });
  };

  handleDelete=()=>{
    const {AdminClientStore} = this.props;
    AdminClientStore.deleteClientById(this.state.id).then(()=>{
      message.success("Success");
      let lastDatas = AdminClientStore.totalSize % 10;
      if (lastDatas == 1 && this.state.page + 1 == AdminClientStore.totalPage) {
        this.loadClient(this.state.page - 1);
      } else {
        this.loadClient(this.state.page);
      }
      this.handleClose();
    }).catch(error=>{
      this.handleClose();
      message.error(HAP.getMessage("删除失败","Delete failed！"))
    });
  };

  openNewPage=()=>{
    this.linkToChange(`admin-client/new`);
  };

  render() {
    const {AdminClientStore} = this.props;
    let data =[];
    if(AdminClientStore.clients){
      data=AdminClientStore.clients.slice();
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
          {this.state.isLoading ? loadingBar : (
            <Table pagination={false} columns={columns} dataSource={data} rowKey="id"/>
          )}
          <div style={{marginTop: 10, float: 'right', display: data.length==0 ? 'none' : 'block'}}>
            <Pagination total={AdminClientStore.totalSize} pageSize={10} current={this.state.page + 1}
                        onChange={page => this.loadClient(page - 1)}/>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Client);
