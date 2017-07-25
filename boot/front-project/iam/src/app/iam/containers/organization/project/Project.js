import React, {Component} from 'react';
import PageHeader, {PageHeadStyle} from '../../../components/PageHeader';
import Remove from '../../../components/Remove';
import {Table, Icon, Tooltip, Pagination, Button, Spin, Popover, Tag, message} from 'antd';
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router-dom';

@inject("AppState")
@observer
class Project extends Component {
  constructor(props) {
    super(props);
    this.loadProjects = this.loadProjects.bind(this);
    this.linkToChange = this.linkToChange.bind(this);
    this.state = {
      page: 0,
      id: '',
      open: false,
    }
  }


  componentWillMount() {
    this.setState({
      isLoading: true,
    })
  };

  componentDidMount() {
    let {page} = this.state;
    this.loadProjects(page);
  }

  loadProjects = (page) => {
    const {AppState, ProjectStore} = this.props;
    const menuType = AppState.currentMenuType;
    let organizationId = menuType.id;
    this.setState({
      page: page,
    });
    ProjectStore.loadProject(organizationId, page);
  };

  openNewProjectPage = () => {
    const {AppState} = this.props;
    const menuType = AppState.currentMenuType;
    let organizationId = menuType.id;
    this.linkToChange(`project/new/${organizationId}`);
  };

  linkToChange = (url) => {
    const {history} = this.props;
    history.push(url);
  };

  handleOpen(id) {
    this.setState({open: true, id: id});
  }

  handleClose = () => {
    this.setState({open: false});
  };

  handleDelete = (e) => {
    const {AppState, ProjectStore} = this.props;
    const {id} = this.state;
    let lastDatas = ProjectStore.getTotalSize % 10;
    const menuType = AppState.currentMenuType;
    let organizationId = menuType.id;
    ProjectStore.deleteProjectById(organizationId, id).then(data => {
      message.success("Success");
      if (lastDatas == 1 && this.state.page + 1 == ProjectStore.getTotalPage) {
        this.loadProjects(this.state.page - 1);
      } else {
        this.loadProjects(this.state.page);
      }
      this.handleClose();
    })
  };

  onEdit = (projectId) => {
    this.linkToChange(`project/edit/${projectId}`);
  };
  getPage = () => {
    const loadingBar = (
      <div style={{display: 'inherit', margin: '200px auto', textAlign: "center"}}>
        <Spin />
      </div>
    );

    const columns = [{
      title: HAP.languageChange("project.id"),
      dataIndex: "id",
      key: "id"
    }, {
      title: HAP.languageChange("project.name"),
      dataIndex: "name",
      key: "name"
    }, {
      title: <div style={{textAlign: "center"}}>
        {HAP.languageChange('operation')}
      </div>,
      className: "operateIcons",
      key: 'action',
      render: (text, record) => (
        <div>
          <Tooltip title={HAP.languageChange('edit')} placement="bottom" getTooltipContainer={(that) => that}>
            <a className="operateIcon small-tooltip" onClick={this.onEdit.bind(this, record.id)}>
              <Icon type="edit"/>
            </a>
          </Tooltip>
          <Tooltip title={HAP.languageChange('delete')} placement="bottom"
                   getTooltipContainer={(that) => that}>
            <a className="operateIcon small-tooltip" onClick={this.handleOpen.bind(this, record.id)}>
              <Icon type="delete"/>
            </a>
          </Tooltip>
        </div>
      )
    }];
    const {ProjectStore} = this.props;
    const projectData = ProjectStore.getProjectData;

    return (
      <div>
        <PageHeader title={HAP.languageChange("project.title")}>
          <Button className="header-btn" ghost={true} onClick={this.openNewProjectPage}
                  style={PageHeadStyle.leftBtn}
                  icon="folder-add">{HAP.languageChange('project.create')}</Button>
          <Button className="header-btn" ghost={true} onClick={() => {
            this.loadProjects(this.state.page)
          }} style={PageHeadStyle.leftBtn} icon="reload">{HAP.languageChange('flush')}</Button>
        </PageHeader>
        <Remove open={this.state.open} handleCancel={this.handleClose} handleConfirm={this.handleDelete}/>
        <div style={{marge: 20,}}>
          {ProjectStore.getIsLoading ? loadingBar : (
            <Table pagination={false} columns={columns} dataSource={projectData} rowKey={function (record) {
              return record.id
            }}/>
          )}
        </div>
        <div style={{marginTop: 10, float: 'right', display: projectData.length == 0 ? 'none' : 'block'}}>
          <Pagination current={this.state.page + 1} pageSize={10}
                      onChange={page => this.loadProjects(page - 1)}
                      total={ProjectStore.getTotalSize}/>
        </div>
      </div>
    );
  };

  render() {
    return this.getPage();
  }

}

export default withRouter(Project);
