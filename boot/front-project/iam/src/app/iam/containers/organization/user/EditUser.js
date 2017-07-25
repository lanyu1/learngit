/**
 * Created by jaywoods on 2017/6/28.
 */
import React, {Component} from 'react';
import {Form, Input, Select, Button, Icon, Switch, Row, Col,message} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import PageHeader, { PageHeadStyle } from '../../../components/PageHeader';
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router-dom';
import Remove from '../../../components/Remove';

@inject("AppState")
@observer
class EditUser extends Component{
  constructor(props) {
    super(props);
    this.linkToChange=this.linkToChange.bind(this);
    this.state = {
      submitting: false,
      id:this.props.match.params.id,
      userInfo:''
    };

  }

  linkToChange=(url)=>{
    const {history} = this.props;
    history.push(url);
  };
  componentDidMount(){
    const {AppState} =this.props;
    let organizationId=AppState.menuType.id;
    this.getUserInfoById(organizationId);
    this.loadOrganizationById(organizationId);
    this.loadPasswordPolicyById(organizationId);
    this.loadLanguage();
  }

  getUserInfoById=(organizationId)=>{
    const {CreateUserStore} = this.props;
    CreateUserStore.getUserInfoById(organizationId,this.state.id).then(data=>{
      this.setState({
        userInfo:data
      });
    })

  };

  loadOrganizationById(id){
    const {CreateUserStore} = this.props;
    CreateUserStore.loadOrganizationById(id,function (error) {
      message.error(HAP.getMessage("组织信息加载失败","Organize information load failure"))
    })
  }

  loadPasswordPolicyById(id){
    const {CreateUserStore}= this.props;
    CreateUserStore.loadPasswordPolicyById(id)
  }

  loadLanguage(){
    const {CreateUserStore}= this.props;
    CreateUserStore.loadLanguage(error => {
      message.error(HAP.getMessage("语言信息加载失败","Language information load failure"))
    })
  }

  checkUsername = (rule, value, callback) => {
    const username = value;
    if (username&&username != this.state.userInfo.name) {
      if (/\s/.test(username)) {
        callback(HAP.getMessage("输入存在空格,请检查", "input Spaces, please check"));
        return;
      }
      const {CreateUserStore} = this.props;
      let id=CreateUserStore.getOrganization.id;
      CreateUserStore.checkUsername(id,username,error=>{
        callback(HAP.getMessage("用户名已存在","User name already exists"))
      }).then(()=>{
        callback();
      });

    } else {
      callback()
    }
  };

  //分别验证密码的最小长度，特殊字符和大写字母的情况和密码策略进行比对
  checkPassword = (rule, value, callback) => {
    if(value){
      const {CreateUserStore} = this.props;
      const passwordPolicy=CreateUserStore.getPasswordPolicy;
      if(passwordPolicy){
        let check=passwordPolicy.passwordCheck;
        let minLength=passwordPolicy.passwordMinLength;
        let upcount=passwordPolicy.uppercaseCount;
        let spcount=passwordPolicy.specialCharCount;
        if (value && (check)) {
          let len = 0;
          let rs = "";
          let sp;
          let up = 0;
          for (let i = 0; i < value.length; i++) {
            let a = value.charAt(i);
            if (a.match(/[^\x00-\xff]/ig) != null) {
              len += 2;
            }
            else {
              len += 1;
            }
          }
          let pattern = new RegExp("[`~!@#$^&*()=%|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
          for (let i = 0; i < value.length; i++) {
            rs = rs + value.substr(i, 1).replace(pattern, '');
            sp = value.length - rs.length;
          }
          if (/[A-Z]/i.test(value)) {
            let ups = value.match(/[A-Z]/g);
            up = ups ? ups.length : 0;
          }
          if (minLength && (len < minLength)) {
            callback(HAP.getMessage(`密码长度至少为${minLength}`,`Password length is at least ${minLength}`));
            return;
          }
          if (upcount && (up < upcount)) {
            callback(HAP.getMessage(`大写字母至少为${upcount}`,`At least for a capital letter ${upcount}`));
            return;
          }
          if (spcount && (sp < spcount)) {
            callback(HAP.getMessage(`特殊字符至少为${spcount}`,`At least for special characters ${spcount}`));
          }
          else {
            callback()
          }
        } else {
          callback()
        }
      }else{
        callback()
      }
    }else{
      callback()
    }


  };

  checkRepassword = (rule, value, callback) => {
    const form = this.props.form;
    const password = form.getFieldValue("password")
    if (value && value != password) {
      callback(HAP.getMessage("两次密码不一致","passwords don't match"));
    } else {
      callback();
    }
  };

  checkEmailAddress = (rule, value, callback) => {
    if (value&&value != this.state.userInfo.email) {
      let reg=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if(reg.test(value)){
        const {CreateUserStore} = this.props;
        let id=CreateUserStore.getOrganization.id;
        CreateUserStore.checkEmailAddress(id,value,error=>{
          callback(error.message)
        }).then(()=>{
          callback()
        })
      }else{
        callback(HAP.getMessage("请输入正确的邮箱格式","Please enter the correct email format"))
      }

    } else {
      callback()
    }
  };

  //验证用户的额外信息是json格式的数据
  handleChangeAddInfo = (rule, value, callback) => {
    var data = value;
    var obj = '';
    if (data) {
      try {
        obj = JSON.parse(data);
        this.setState({addInfoRequired: undefined});
      } catch (err) {
        callback(HAP.getMessage("请输入 json 格式的数据", "input json data"))
      }
      if (typeof obj === "object" && !(obj instanceof Array)) {
        var hasProp = false;
        for (var prop in obj) {
          hasProp = true;
          break;
        }
        if (hasProp) {
          callback()
        } else {
          callback(HAP.getMessage("请输入 json 格式的数据", "input json data"))
        }
      } else if (typeof obj == 'number' && typeof obj == 'string' && obj instanceof array) {
        callback(HAP.getMessage("请输入 json 格式的数据", "input json data"))
      } else {
        callback(HAP.getMessage("请输入 json 格式的数据", "input json data"))
      }
    } else {
      callback()
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {userInfo} = this.state;
        this.setState({
          submitting:true,
        });
        let data = {
          id:userInfo.id,
          name: values.name,
          password: values.password,
          language: values.language,
          status: values.status == true ? "Y" : "N",
          organizationId: values.organizationId,
          additionInfo: values.additionInfo,
          source: values.source == true ? "Y" : "N",
          email: values.email,
          objectVersionNumber: userInfo.objectVersionNumber
        };
        const {CreateUserStore} = this.props;
        CreateUserStore.updateUser(data.organizationId,userInfo.id,data).then(data=>{
          message.success(HAP.getMessage("修改成功","Success"));
          this.linkToChange('/iam/user');
        }).catch(error=>{
          message.error(HAP.getMessage("修改失败","Failed"));
          this.setState({
            submitting:false,
          })
        });
      }
    })
  };

  handleReset=()=>{
    this.linkToChange('/iam/user')
  };

  render() {
    const {CreateUserStore} = this.props;
    let orgData;
    if(CreateUserStore.getOrganization){
      orgData=CreateUserStore.getOrganization;
    }

    let languageDate=[];
    let valueLg;
    if(CreateUserStore.getLanguage){
      let data=CreateUserStore.getLanguage;
      languageDate=data.content.slice();
      valueLg=data.content[0].code
    }

    const {getFieldDecorator} = this.props.form;
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
    const node = [];
    const nodeLg = [];
    if (orgData) {
      node.push(<Option key={orgData.id}
                        value={String(orgData.id)}>{orgData.name}</Option>);
    }
    if (languageDate.length!=0) {
      languageDate.map(function (item) {
        nodeLg.push(<Option key={item.code} value={item.code}>{item.name}</Option >)
      })
    }

    let status = false;
    let source = false;
    if (this.state.userInfo && this.state.userInfo.status == "Y") {
      status = true
    } else {
      status = false
    }
    if (this.state.userInfo && this.state.userInfo.source == "Y") {
      source = true
    } else {
      source = false
    }
    return (
      <div>
        <PageHeader title={HAP.languageChange("user.edit")} backPath="/iam/user"/>
        <div className="mainContent">
          <Form onSubmit={this.handleSubmit.bind(this)}>
            <FormItem
              {...formItemLayout}
              label={HAP.languageChange("user.userName")}
              hasFeedback
            >
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: HAP.getMessage("该字段是必输的", "The field is required"),
                  }, {
                    validator: this.checkUsername,
                  }],
                initialValue: this.state.userInfo ? this.state.userInfo.name : ""
              })(
                <Input size="default"/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={HAP.languageChange("user.organization")}
              hasFeedback
            >
              {getFieldDecorator('organizationId', {
                initialValue: orgData?String(orgData.id):''
              })(
                <Select size="default" disabled={true}>
                  {node}
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={HAP.languageChange("user.password")}
              hasFeedback
            >
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: false,
                    whitespace: true,
                    message: HAP.getMessage("该字段是必输的", "The field is required"),
                  }, {
                    validator: this.checkPassword,
                  }]
              })(
                <Input size="default" type="password"/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={HAP.languageChange("user.password.confirm")}
              hasFeedback
            >
              {getFieldDecorator('rePassword', {
                rules: [
                  {
                    required: false,
                    whitespace: true,
                    message: HAP.getMessage("该字段是必输的", "The field is required"),
                  }, {
                    validator: this.checkRepassword,
                  }]
              })(
                <Input size="default" type="password"/>
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
                    required: true,
                    whitespace: true,
                    message: HAP.getMessage("该字段是必输的", "The field is required"),
                  }, {
                    validator: this.checkEmailAddress,
                  }],
                initialValue: this.state.userInfo ? this.state.userInfo.email : ""
              })(
                <Input size="default"/>
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label={HAP.languageChange("user.addtionInfo")}
              hasFeedback
            >
              {getFieldDecorator('additionInfo', {
                rules: [
                  {
                    validator: this.handleChangeAddInfo,
                  }],
                initialValue: this.state.userInfo ? this.state.userInfo.additionInfo : ""

              })(
                <Input type="textarea" rows={5}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={HAP.languageChange("user.language")}
              hasFeedback
            >
              {getFieldDecorator('language', {
                initialValue: (this.state.userInfo && this.state.userInfo.language) ? this.state.userInfo.language : "",
              })(
                <Select size="default">
                  {nodeLg}
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={HAP.languageChange("user.statue")}
            >
              {getFieldDecorator('status',{
                valuePropName: 'checked',
                initialValue: status
              })(
                <Switch size="default"/>
              )}

            </FormItem>
            <FormItem
              {...formItemLayout}
              label={HAP.languageChange("user.ldap")}
            >
              {getFieldDecorator('source',{
                valuePropName: 'checked',
                initialValue: source
              })(
                <Switch size="default"/>
              )}
            </FormItem>
            <FormItem
              wrapperCol={{offset: 3}}>
              <Row>
                <Col span={2}>
                  <Button size="default" loading={this.state.submitting} type="primary" htmlType="submit"
                          className="login-form-button">
                    {HAP.languageChange("form.update")}
                  </Button>
                </Col>
                <Col span={2} offset={1}>
                  <Button size="default" htmlType="reset" onClick={this.handleReset} className="login-form-button">
                    {HAP.languageChange("form.cancel")}
                  </Button>
                </Col>
              </Row>
            </FormItem>
          </Form>
        </div>
      </div>
    )
  }

}

export default Form.create({})(withRouter(EditUser));
