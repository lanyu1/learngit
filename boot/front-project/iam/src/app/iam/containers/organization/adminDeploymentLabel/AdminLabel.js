import React, {Component, PropTypes} from 'react';
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router-dom';
import PageHeader, {PageHeadStyle} from '../../../components/PageHeader';
import axios from '../../../common/axios';
//import {Spin,Pagination,Menu, Dropdown, Button,Radio, Icon, message, Input, Card, Col, Row, Select,Table} from 'antd';
import {
  Tooltip,
  Table,
  Radio,
  Spin,
  Pagination,
  Menu,
  Dropdown,
  Button,
  Icon,
  message,
  Input,
  Card,
  Col,
  Row,
  Select,
  Avatar,
  Tabs
} from 'antd';
import Label from '../../../components/deployment/Label';
const pageStyle = {
  input: {
    float: 'left',
    width: '100%'
  },
  clear: {
    clear: 'both'
  },
  fontStyle: {
    fontSize: '10px',
    color: '#333333',
    //float:'left'
  },
  iconStyle: {
    fontSize: "65px",
    paddingBottom: '20px',
  },
  cardStyle: {
    textAlign: 'center',
    borderBottom: '1px solid  #d4cdcd'
  },
  dropDownStyle: {
    width: '80%',
    textAlign: 'left',
  },
  rightdropDownStyle: {
    width: '80%',
    textAlign: 'left',
  },
  dropDownIconStyle: {
    float: 'right',
    lineHeight: 'inherit'
  },
  nameStyle: {
    fontWeight: 600,
    paddingBottom: 4,
    fontSize: 16,

  },
  categoryManage: {
    position: 'absolute',
    right: 0,
    width: '350px',
    minHeight: '100%',
    backgroundColor: 'white',
    zIndex: '5',
    padding: '10px 15px',
  },
  buttonLeft: {
    lineHeight: '24px',
    height: '28px',
    color: 'rgb(59, 120, 231)',
    float: "left",
    marginLeft: -15,
    marginRight: 20,
  },
  categoryLabel: {
    textAlign: "right",
    fontSize: 12,
  },
  libraryInput: {
    marginBottom: 10,
  },
  description: {
    paddingTop: 4,
    height: 52,
    fontSize: 14,
  },
  //标签
  right: {
    flex: '1 1 0',
    order: 2,
    flexDirection: 'row',
    //paddingLeft:'10px',
    borderLeft: '1px solid #F4F4F4',
    flexGrow: '1',
  },
};
@inject("AppState")
@observer
class AdminLabel extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      libraryManageOpen: false,
      colNum: 6,
      page: 1,
      layoutCol: 3,
      loading: false,
      rows:[],//存放上一页的数据;
      flag:1//当前页
    }
  }
  componentDidMount() {
    const {AdminLabelStore, AppState} = this.props;
    let orgId = AppState.menuType.id;
    AdminLabelStore.setSelectRows(null);
    AdminLabelStore.loadDeployment(orgId, this.state.page - 1);
  }

  linkToChange = (url) => {
    const {history} = this.props;
    history.push(url);
  };

  loadDeployment = (page) => {
    const {AdminLabelStore, AppState} = this.props;
    let orgId = AppState.menuType.id;
    this.setState({selectedRowKeys:""});
    this.setState({selectRows:null});
    AdminLabelStore.setSelectRows(null);
    AdminLabelStore.changeLabelShow(true);
    AdminLabelStore.loadDeployment(orgId, page - 1);
  };

  // 处理查询
  loadDeploymentFilter = (value, id, page) => {
    const {AdminLabelStore, AppState} = this.props;
    AdminLabelStore.changeLabelShow(true);
    //AdminLabelStore.setRows(null);
    const organizationId = AppState.currentMenuType.id;

    if (value.trim() == "" && id == -1) {
      AdminLabelStore.loadDeploymentByOrgId(organizationId, page);
    }
  };



  // 翻页触发查询
  onPageChange = (page) => {
    const {AdminLabelStore} = this.props;
    var flag= page-1;
    AdminLabelStore.changeLabelShow(false);
    this.setState({
      page: page,flag:flag,selectRows:this.state.rows
    });
    const search = "";
    const id = -1;
    this.loadDeploymentFilter(search, id, page - 1);
  };

  handleOpen = (id) => {
    this.linkToChange(`/iam/deploymentAdmin/label/labels/${id}`)
  };

  //标签管理相关函数
  //选择列函数
  onSelectChange = (selectedRowKeys, selectedRows) => {
    //let selectedRows=this.state.selectedRows;
    //selectedRows.push(rows);
    //只操作当前页的数据
    let rows=[];
    selectedRowKeys.map((item)=>{
      selectedRows.map((record,index)=>{
        if(record.id==item){
          rows.push(record);
        }
      })
    });
    this.setState({selectedRowKeys,rows});
    //翻页的数据重新保存起来
    if(this.state.flag!=(this.refs.pagination.props.current)){
     rows=rows.concat(this.state.selectRows);
    }
    const {AdminLabelStore} = this.props;
    AdminLabelStore.setSelectRows(rows);

  };
  handleLableClick = ()=> {
    const {AdminLabelStore} = this.props;
    let isShow = AdminLabelStore.labelShow;
    if (isShow) {
      AdminLabelStore.changeLabelShow(false);
      this.refs.pageContent.style.width = "96%";
    } else {
      AdminLabelStore.changeLabelShow(true);
      this.refs.pageContent.style.width = "65%";
    }

  };


  render() {
    const {AdminLabelStore} = this.props;
    var deploymentDom = [];
    const columns = [
      {
        title: HAP.languageChange("deployment.id"),
        width: "15%",
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: HAP.languageChange("deployment.name"),
        width: "15%",
        dataIndex: 'name',
        key: 'name'
      }, {
        title: HAP.languageChange("deployment.description"),
        width: "50%",
        dataIndex: 'description',
        key: 'description'
      }, {
        title: <div style={{textAlign: "center"}}>
          {HAP.languageChange("operation")}
        </div>,
        className: "operateIcons",
        key: "action",
        render: (text, record) => (
          <div>
            <Tooltip title={HAP.languageChange('adminOrg.label')} placement="bottom"
                     getTooltipContainer={(that) => that}>
              <a className="operateIcon small-tooltip" onClick={this.handleOpen.bind(this, record.id)}>
                <Icon type="tag-o"/>
              </a>
            </Tooltip>
          </div>
        )
      },
    ];
    //标签管理相关函数
    const {selectedRowKeys} = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange.bind(this),
    };
    if (AdminLabelStore && AdminLabelStore.deployment) {
      const deployment = AdminLabelStore.deployment;
      const that = this;
      if (deployment.content) {
        deploymentDom = (
          <div style={{marginTop: 15}}>
            <Table pagination={false} columns={columns} dataSource={[...deployment.content]} rowKey="id"
                   rowSelection={rowSelection} ref="table" handleSelect={this.handleSelect}/>
          </div>
        )
      }
    }

    const loadingBar = (
      <div style={{display: 'inherit', margin: '200px auto', textAlign: "center"}}>
        <Spin />
      </div>
    );
    return (
      <div style={{height: '100%'}}>
        {/*pageHeader*/}
        <PageHeader title={HAP.languageChange("deployment.label")}>
          <Button className="header-btn" ghost={true} style={PageHeadStyle.leftBtn} icon="tags-o" onClick={() => {
            this.handleLableClick()
          }}>{HAP.languageChange('adminOrg.label')}</Button>
          <Button className="header-btn" ghost={true} onClick={() => {
            this.loadDeployment(this.state.page)
          }} style={PageHeadStyle.leftBtn} icon="reload">{HAP.languageChange("flush")}</Button>
        </PageHeader>
        {AdminLabelStore.isLoading ? loadingBar : (
          <div ref="pageContent" id="pageContent" style={{margin: 20, float: 'left', width:AdminLabelStore.labelShow?"65%":"96%"}}>
            {/*页面content*/}
            <div>
              <div style={pageStyle.clear}></div>
              {AdminLabelStore.isCategoryLoading ? loadingBar : (
                <div>
                  {/*Card布局*/}
                  <div style={{textAlign: 'center'}}>
                    <Row gutter={32} justify="space-around">
                      {deploymentDom}
                    </Row>
                  </div>
                  <div style={{clear: 'both'}}></div>
                  {AdminLabelStore.deployment && AdminLabelStore.deployment.content.length > 0 ?
                    <Pagination current={this.state.page} onChange={this.onPageChange.bind(this)}
                                style={{marginTop: 20, float: 'right'}} total={AdminLabelStore.totalSize}
                                pageSize={8} ref="pagination"/> : null
                  }

                </div>
              )}
            </div>
          </div>
        )}
        {/*右侧滑动面板*/}
        {(AdminLabelStore.labelShow &&!(AdminLabelStore.isLoading))? <div style={pageStyle.right}>
          <Label AdminLabelStore={AdminLabelStore} parent={this}/>
        </div> : null}
      </div>
    )
  }
}

export default withRouter(AdminLabel);
