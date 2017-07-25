/**
 * Created by YANG on 2017/6/27.
 */

import React, {Component, PropTypes} from 'react';
import {observer,inject} from 'mobx-react';
import {Form, Icon, Input, Button, Checkbox, Switch, Select, Row, Col,message, Spin} from 'antd';
import PageHeader, { PageHeadStyle }from '../../../components/PageHeader';
const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;

@inject("AppState")
@observer
class UserInfo extends Component{
  constructor(props,context) {
    super(props,context);
    this.state={
      submiting:false,
    };
    this.checkEmailAddress=this.checkEmailAddress.bind(this);
    this.handleSubmit=this.handleSubmit.bind(this);
    this.loadUserInfo=this.loadUserInfo.bind(this);
  }

  componentDidMount(){
    const {UserStore} = this.props;
    this.loadUserInfo(UserStore);
    this.loadLanguage(UserStore);
    this.loadOrganization(UserStore);
  }

  loadUserInfo=(UserStore)=>{
    UserStore.loadUserInfo();
    this.setState({
      submiting: false
    })
  };

  loadLanguage=(UserStore)=>{
    UserStore.loadLanguage();
  };

  loadOrganization=(UserStore)=>{
    UserStore.loadOrganization();
  };

  convertResponse = function (component, callback) {
    return function (res) {
      if (component && component.isUnMounted) {
        throw "abort";
      }
      callback && callback();
      if (res.status == 400) {
        return res.json();
      } else {
        throw res;
      }
    }
  };

  checkEmailAddress = (rule, value, callback) => {
    const {userInfo,UserStore} = this.props;
    if(UserStore.userInfo){
      let userInfo = UserStore.userInfo;
      let email=userInfo.email;
      let organizationId=userInfo.id;

      if (value && value != email) {
        UserStore.checkEmails(organizationId,value).then(()=>{
          callback();
        }).catch(err=>{
          callback(HAP.getMessage(err.response.data.message,'Invalid email address,please input correct mailbox!'));
        });
      } else {
        callback()
      }
    }

  };

  handleSubmit=(e)=>{
    const {UserStore} = this.props;
    let originUser=UserStore.userInfo;
    e.preventDefault();
    this.setState({ submiting: true, });
    this.props.form.validateFieldsAndScroll((err, values) => {
      if(!err){
        this.setState({
          submiting:false
        });
        let user={
          ...values,
          objectVersionNumber:originUser.objectVersionNumber
        };
        delete user.name;
        UserStore.updateUserInfo(user).then(data=>{
          const {AppState} = this.props;
          if(!(originUser.language === user.language)){
            const {AppState} = this.props;
            AppState.setAuthenticated(true);
            if("en_US"==data.language){
              AppState.changeLanguageTo('en');
            }else{
              AppState.changeLanguageTo('zh');
            }
          }else{
            message.success(HAP.getMessage("修改成功","Success"));
          }
        }).catch(err=>{
          message.error(err.response.data.message);
        });
      }
    });
    this.setState({submiting: false});
  };

  render(){
    const loadingBar = (
      <div style={{display: 'inherit', margin: '200px auto', textAlign: "center"}}>
        <Spin/>
      </div>
    );

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 3},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 7},
      },
    };
    const {UserStore} = this.props;
    const {getFieldDecorator} = this.props.form;
    let user,language,organization,timeZone;
    if(UserStore){
      user = UserStore.getUserInfo;
      language = UserStore.language;
      organization = UserStore.organization;
      timeZone = UserStore.timeZone;
    }

    let languageOptions=[];
    if(language){
      language.content.map((item,index)=>{
        languageOptions.push(<Option key={index} value={item.code}>{item.name}</Option>);
      });
    }
    let timeZoneOptions=[];
    if(timeZone&&timeZone.values){
      timeZone.values.map((item,index)=>{
        timeZoneOptions.push(<Option key={index} value={item.code}>{item.description}</Option>)
      });
    }
    return (
      <div>
        <PageHeader title={HAP.languageChange("user.userInfo")}>
          <Button className="header-btn" ghost={true} onClick={()=>{this.loadUserInfo(UserStore)}} style={PageHeadStyle.leftBtn} icon="reload" >{HAP.languageChange("flush")}</Button>
        </PageHeader>
        {this.props.UserStore.getIsLoading? loadingBar : (
        <div className="mainContent">
          <Form onSubmit={this.handleSubmit.bind(this)}>
            <FormItem
              {...formItemLayout}
              label={HAP.languageChange("user.userName")}
              hasFeedback
            >
              {getFieldDecorator('name', {
                initialValue: user ?user.name : ""
              })(
                <Input size="default" disabled={true}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={HAP.languageChange("organization.name")}
              hasFeedback
            >
              {getFieldDecorator('organizationName', {
                initialValue: organization ?organization.name : ""
              })(
                <Input size="default" disabled={true}/>
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label={HAP.languageChange("user.email")}
              hasFeedback
            >
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true, message: HAP.getMessage('该字段是必输的','Email is required')
                  }, {
                    validator: this.checkEmailAddress,
                  }],
                initialValue: user ? user.email : "",
              })(
                <Input size="default"/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={HAP.languageChange("user.language")}
              hasFeedback
            >
              {getFieldDecorator('language', {
                rules: [
                  {
                    required: true, message: HAP.getMessage('该字段是必输的','Language is required')
                  }],
                initialValue: user?user.language:"",
              })(
                <Select size="default">
                  {languageOptions}
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={HAP.languageChange("user.timeZone")}
              hasFeedback
            >
              {getFieldDecorator('timeZone', {
                rules: [
                  {
                    required: true, message: HAP.getMessage('该字段是必输的','Timezone is required')
                  }],
                initialValue: user?user.timeZone:"",
              })(
                <Select size="default">
                  {timeZoneOptions}
                </Select>
              )}
            </FormItem>
            <FormItem wrapperCol={{offset: 3}}>
              <Row>
                <Col span={2}>
                  <Button size="default" loading={this.state.submiting} type="primary" htmlType="submit"
                          className="login-form-button">
                    {HAP.languageChange("save")}
                  </Button>
                </Col>
              </Row>
            </FormItem>
          </Form>
        </div>
        )}
      </div>
    );
  }
}

export default Form.create({})(UserInfo);
