/**
 * Created by YANG on 2017/6/29.
 */

import React,{Component, PropTypes} from 'react';
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router-dom';
import PageHeader,{PageHeadStyle} from '../../../components/PageHeader';
import {Menu, Dropdown, Button, Icon, message, Input, Card, Col, Row} from 'antd';
import ResourceMenu from '../../../components/menu/ResourceMenu';

const Search = Input.Search;
const pageStyle = {
  input:{
    float:'left',
    width:'100%'
  },
  clear:{
    clear:'both'
  },
  fontStyle:{
    fontSize:'10px',
    color:'#333333',
    //float:'left'
  },
  iconStyle:{
    fontSize:"50px",
    paddingBottom:'20px',
    //paddingLeft:'40%',
  },
  cardStyle:{
    textAlign:'center',
    borderBottom:'1px solid  #d4cdcd'
  },
  dropDownStyle:{
    width:'80%',
    textAlign:'left',
  },
  rightdropDownStyle:{
    width:'100%',
    textAlign:'left',
  },
  dropDownIconStyle:{
    float:'right',
    lineHeight:'inherit'
  },
  nameStyle:{
    fontWeight:600,
    paddingBottom:4,
    fontSize:15
  },
  libraryManage:{
    position:'absolute',
    right:0,
    width:'350px',
    minHeight:'100%',
    backgroundColor:'white',
    zIndex:'100',
    padding:'10px 15px',
  },
  buttonLeft:{
    marginTop: "10px",
    paddingLeft: 0,
    lineHeight: '24px',
    height: '28px',
    color: 'rgb(59, 120, 231)',
    float: "left",
    marginRight:15,
  },
  libraryLabel:{
    textAlign:"right",
    fontSize:12,
    //paddingRight:"10px"
  },
  libraryInput:{
    marginBottom:10,
  }
}

@inject("AppState")
@observer
class Catalog extends Component{
  constructor(props,context){
    super(props,context);
    this.handleManageLibrary = this.handleManageLibrary.bind(this);
    this.handleManageLibraryClose = this.handleManageLibraryClose.bind(this);
    this.handleCreateCategory = this.handleCreateCategory.bind(this);
    this.handleCategoryDelete = this.handleCategoryDelete.bind(this);
    this.state = {
      libraryManageOpen:false,
      colNum:6,
      newForm:[],
      formKey:1,
    }
  }
  handleMenuClick = (e) => {
    message.info('Click on menu item.');
    console.log('click', e);
  }
  componentDidMount(){
    const {CatalogStore,AppState} = this.props;
    CatalogStore.loadCatalog();
    CatalogStore.loadCatagories();
  }

  handleManageLibrary = () => {
    if(this.state.libraryManageOpen){
      this.handleManageLibraryClose();
    }else{
      //document.getElementById("menuItem").style.display = "none"
      this.refs.pageContent.style.width = "65%";
      this.setState({
        libraryManageOpen:true,
        colNum:8,
      });
    }

  }
  handleManageLibraryClose = () =>{
    this.refs.pageContent.style.width = "96%";
    this.setState({
      libraryManageOpen:false,
      colNum:6,
      isNewDisplay:false,
      newForm:[],
    });
    document.getElementById("menuItem").style.display = "block"
  }

  getKey = (num) => {
    return num+1;
  }
  handleCreateCategory = () =>{
    const key = this.getKey(this.state.formKey);
    const formAfter = (
      <a onClick={this.handleCategoryDelete}>
        <Icon type="setting" />
      </a>
    )
    const form = (
      <div key={key}>
        <Row gutter={16}>
          <Col style={pageStyle.libraryLabel} span={4}>
            <label htmlFor="">名称</label>
          </Col>
          <Col span={20}>
            <Input style={{marginBottom:10}} placeholder="请输入名称" />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col style={pageStyle.libraryLabel} span={4}>
            <label htmlFor="">URL</label>
          </Col>
          <Col span={20}>
            <Input style={{marginBottom:0}} placeholder="请输入URL" />
          </Col>
        </Row>
        <Row>
          <Col span={4} offset={20} style={{marginBottom:20}}>
            <Button onClick={this.handleCategoryDelete} className="header-btn" ghost={true} style={pageStyle.buttonLeft} icon="delete">删除</Button>
          </Col>
        </Row>
      </div>)
    var oriForm = this.state.newForm;
    oriForm.push(form);
    this.setState({
      newForm:oriForm,
      formKey:key,
    })

  }

  handleCategoryDelete = () =>{
  }
  openNewPage = () => {
    this.handleManageLibraryClose();
    this.linkToChange(`catalog/new`);
  };
  linkToChange = (url) => {
    const {history} = this.props;
    history.push(url);
  };
  render(){
    const {CatalogStore} = this.props;
    const catalogDom = [];
    const formDom = [];
    const formAfter = (
      <a className="operateIcon" onClick={this.handleCategoryDelete}>
        <Icon type="minus" />
      </a>
    )
    formDom.push(
      <div key="form1">
        <Row gutter={16}>
          <Col style={pageStyle.libraryLabel} span={4}>
            <label htmlFor="">名称</label>
          </Col>
          <Col span={20}>
            <Input style={{marginBottom:10}} placeholder="请输入名称" />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col style={pageStyle.libraryLabel} span={4}>
            <label htmlFor="">URL</label>
          </Col>
          <Col span={20}>
            <Input addonAfter={formAfter} style={{marginBottom:30,width:'100%'}} placeholder="请输入URL" />
          </Col>
        </Row>
      </div>);
    const libraryManageDom = (
      <div style={pageStyle.libraryManage}>

        <div>
          <div>
            <span style={{fontSize:17}}>{HAP.languageChange("catalog.libraryManagement")}</span>
          </div>
          <Button onClick={this.handleCreateCategory} className="header-btn" ghost={true} style={pageStyle.buttonLeft} icon="user-add">{HAP.languageChange("catalog.createLibrary")}</Button>
          <Button className="header-btn" ghost={true} style={pageStyle.buttonLeft} icon="reload">{HAP.languageChange("flush")}</Button>
        </div>
        <div style={{clear:'both'}}></div>
        <div ref="libraryManage" style={{padding:10}}>
          {formDom}
          {this.state.newForm}
        </div>

        <div>
          <Button onClick={this.handleManageLibraryClose}>保存并关闭</Button>
        </div>

      </div>
    )
    if(CatalogStore.catalog){
      const catalog = CatalogStore.catalog;
      const that = this;
      if(catalog.content){
        catalog.content.map((item,index)=>{
          let dom = (<Col span={that.state.colNum} key={index}>
            <Card bordered={true}
                  style={{padding:'20px 0',borderRadius:0,marginTop:20,width:'90%'}}
                  bodyStyle={{padding:'24px 20px'}}>
              <div style={pageStyle.cardStyle}>
                <Icon style={pageStyle.iconStyle} type="smile-o" />
                <div style={pageStyle.nameStyle}>{item.name}</div>
              </div>
              <div style={{textAlign:'center'}}>
                <div style={{paddingTop:4,height:52}}>{item.description}</div>
                <div style={{marginTop:'20px'}}><Button type="primary">查看详情</Button></div>
              </div>
            </Card>
          </Col>);
          catalogDom.push(dom);
        })
      }
    }
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="1">1st menu item</Menu.Item>
        <Menu.Item key="2">2nd menu item</Menu.Item>
        <Menu.Item key="3">3d menu item</Menu.Item>
      </Menu>
    );
    return (
      <div style={{height:'100%'}}>
        {/*pageHeader*/}
        <PageHeader title={HAP.languageChange("catalog")}>
          <Button className="header-btn" ghost={true} onClick={() => {
            this.openNewPage()
          }} style={PageHeadStyle.leftBtn} icon="user-add">{HAP.languageChange("catalog.create")}</Button>
          <Button className="header-btn" ghost={true} onClick={() => {
            this.loadClient(this.state.page)
          }} style={PageHeadStyle.leftBtn} icon="reload">{HAP.languageChange("flush")}</Button>
        </PageHeader>

        {/*页面content*/}
        <div ref="pageContent" id="pageContent" style={{margin:20,float:'left',width:"96%"}}>
          <div>
            <div>
              <Row>
                <Col span={18}>
                  <div style={pageStyle.input}>
                    <div style={pageStyle.fontStyle}>
                      {HAP.languageChange("catalog.library")}
                    </div>
                    <Col span={9}>
                      <Dropdown overlay={menu} trigger={['click']}>
                        <Button style={pageStyle.dropDownStyle}>
                          Button <Icon type="down" style={pageStyle.dropDownIconStyle} />
                        </Button>
                      </Dropdown>
                      <a className="operateIcon small-tooltip" onClick={this.handleManageLibrary}>
                        <Icon type="setting" />
                      </a>
                    </Col>
                    <Col span={15}>
                      <Search
                        placeholder="input search text"
                        style={{ width: '90%' }}
                        onSearch={value => console.log(value)}
                      />
                    </Col>

                  </div>
                </Col>
                <Col span={6}>
                  <div style={pageStyle.input}>
                    <div style={pageStyle.fontStyle}>
                      {HAP.languageChange("catalog.category")}
                    </div>
                    <Dropdown overlay={menu} trigger={['click']}>
                      <Button style={pageStyle.rightdropDownStyle}>
                        Button <Icon type="down" style={pageStyle.dropDownIconStyle} />
                      </Button>
                    </Dropdown>
                  </div>
                </Col>
              </Row>

            </div>
            <div style={pageStyle.clear}></div>

            {/*Card布局*/}
            <div style={{textAlign:'center'}}>
              <Row gutter={32} justify="space-around">
                {catalogDom}
              </Row>
            </div>
          </div>
        </div>

        {/*右侧滑动面板*/}
          {this.state.libraryManageOpen?libraryManageDom:null}

      </div>
    )
  }

}

export default withRouter(Catalog);
