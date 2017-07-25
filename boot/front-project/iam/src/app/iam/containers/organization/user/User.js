/**
 * Created by jaywoods on 2017/6/28.
 */
import React, {Component} from 'react';
import {Table, Icon, Spin, Pagination, Button, Tooltip, Select, message} from 'antd';
import PageHeader, {PageHeadStyle} from '../../../components/PageHeader';
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router-dom';
import Remove from '../../../components/Remove';
const styles = {
  cyan100: {
    color: "#03A9F4",
    fontSize: 14,
    marginRight: 20
  },

};
const Options = Select.Options;

@inject("AppState")
@observer
class User extends Component {
  constructor(props) {
    super(props);
    this.linkToChange = this.linkToChange.bind(this);
    this.state = {
      open: false,
      id: "",
      page: 0,
      isLoading: true,
    };
  };

  componentDidMount() {
    this.loadUser(this.state.page);
  }

  loadUser = (page) => {
    this.setState({
      page:page,
      isLoading: true,
    });
    const {AppState, UserStore} = this.props;
    UserStore.setUsers([]);
    let organizationId = AppState.menuType.id;
    UserStore.loadUsers(organizationId, page, function (error) {
      message.error(HAP.getMessage("加载失败", "Loading failed"));
    });
    this.setState({
      isLoading: false,
    });
  };

  linkToChange = (url) => {
    const {history} = this.props;
    history.push(url);
  };

  openNewPage = () => {
    this.linkToChange("user/new")
  };

  handleClose = () => {
    this.setState({open: false, userId: ''});
  };

  handleDelete = () => {
    const {AppState, UserStore} = this.props;
    let organizationId = AppState.menuType.id;
    const {userId} = this.state;
    let lastDatas = UserStore.totalSize % 10;
    UserStore.deleteUserById(organizationId, userId).then(data => {
      if (lastDatas == 1 && this.state.page + 1 == UserStore.totalPage) {
        this.loadUser(this.state.page - 1)
      } else {
        this.loadUser(this.state.page)
      }
      this.setState({
        open: false,
      });
      message.success(HAP.getMessage("删除成功", "Success"));
    }).catch(error => {
      message.error(HAP.getMessage("删除失败", "Failed"));
      this.setState({
        open: false,
      });
    })
  };

  handleOpen = (id) => {
    this.setState({open: true, userId: id});
  };

  onEdit = (id) => {
    this.linkToChange(`user/edit/${id}`)
  };

  render() {
    const {UserStore} = this.props;
    let data = [];
    if (UserStore.getUsers) {
      data = UserStore.users.slice();
    }
    const loading = (
      <div>
        <Spin size="default" style={{position: "fixed", bottom: "50%", left: "50%"}}/>
      </div>
    );

    const columns = [
      {
        title: HAP.languageChange("user.userName"),
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: HAP.languageChange("user.source"),
        key: 'source',
        render: (text, record) => (
          record.source == 'Y' ? <p>{HAP.languageChange("user.ldap")}</p> : <p>{HAP.languageChange("user.noLdap")}</p>
        )
      },
      {
        title: HAP.languageChange("user.language"),
        dataIndex: 'languageName',
        key: 'languageName',
      },
      {
        title: HAP.languageChange("user.statue"),
        key: 'status',
        render: (text, record) => (
          record.status == 'Y' ? <p>{HAP.languageChange("user.statue.enable")}</p> :
            <p>{HAP.languageChange("user.statue.disable")}</p>
        )
      }, {
        title: HAP.languageChange("user.locked"),
        key: 'locked',
        render: (text, record) => (
          record.locked == 'Y' ? <p>{HAP.languageChange("user.locked.ok")}</p> :
            <p>{HAP.languageChange("user.locked.no")}</p>
        )
      },
      {
        title: <div style={{textAlign: "center"}}>{HAP.languageChange("user.addtionInfo")}</div>,
        className: "addtionInfo",
        render: (text, record) => (
          <div style={{overflow: 'visible'}}>
            <Tooltip title={record.additionInfo || ""} placement="bottom">
              <Icon type="down"/>
            </Tooltip>
          </div>

        ),
        key: 'additionInfo',

      },
      {
        title: <div style={{textAlign: "center"}}>{HAP.languageChange("operation")}</div>,
        key: "action",
        render: (text, record) => (
          <div style={{textAlign: "center"}}>
            <Tooltip title={HAP.languageChange("edit")} placement="bottom" getTooltipContainer={(that) => that}>
              <a className="operateIcon small-tooltip"
                 onClick={this.onEdit.bind(this, record.id)}>
                <Icon type="edit"/>
              </a>
            </Tooltip>
            <Tooltip title={HAP.languageChange("delete")} placement="bottom" getTooltipContainer={(that) => that}>
              <a className="operateIcon small-tooltip"
                 onClick={this.handleOpen.bind(this, record.id)}>
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
        <PageHeader title={HAP.languageChange("user")}>

          <Button className="header-btn" ghost={true} onClick={this.openNewPage} style={PageHeadStyle.leftBtn}
                  icon="idcard">{HAP.languageChange("user.create")}</Button>
          <Button className="header-btn" ghost={true} onClick={() => {
            this.loadUser(this.state.page)
          }} style={PageHeadStyle.leftBtn} icon="reload">{HAP.languageChange("flush")}</Button>

        </PageHeader>
        <div style={{margin: 20,}}>
          {this.state.isLoading ? loading : (
            <Table columns={columns} dataSource={data} pagination={false} rowKey="id" style={{textAlign: 'center'}}>
            </Table>)}

          <div style={{float: 'right', marginTop: 8, display: this.state.isLoading ? 'none' : 'block'}}>
            <Pagination total={UserStore.totalPage} pageSize={10} current={this.state.page + 1}
                        onChange={page => this.loadUser(page - 1)}/>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(User);
