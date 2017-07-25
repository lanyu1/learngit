/**
 * Created by jaywoods on 2017/6/26.
 */

import React, {Component} from 'react';
import {Form, Icon, Input, Button,message,Row,Col} from 'antd';
import PageHeader, {PageHeadStyle} from '../../../components/PageHeader';
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router-dom';
const FormItem = Form.Item;

@inject("AppState")
@observer
class ModifyPassword extends Component {
  constructor(props) {
    super(props);
    this.getMessage=this.getMessage.bind(this);
  }
  componentDidMount(){
    const {UserStore} = this.props;
    UserStore.loadPasswordPolicy();
  }


  //分别验证密码的最小长度，特殊字符和大写字母的情况和密码策略进行比对
  checkPassword = (rule, value, callback) => {
    const {UserStore} = this.props;
    const passwordPolicy=UserStore.passwordPolicy;
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
        callback(this.getMessage(`密码长度至少为${minLength}`,`Password length is at least ${minLength}`));
        return;
      }
      if (upcount && (up < upcount)) {
        callback(this.getMessage(`大写字母至少为${upcount}`,`At least for a capital letter ${upcount}`));
        return;
      }
      if (spcount && (sp < spcount)) {
        callback(this.getMessage(`特殊字符至少为${spcount}`,`At least for special characters ${spcount}`));
      }
      else {
        callback()
      }
    } else {
      callback()
    }
  };

  checkRepassword = (rule, value, callback) => {
    const form = this.props.form;
    const hashedPassword = form.getFieldValue("hashedPassword")
    if (value && value != hashedPassword) {
      callback(HAP.getMessage("两次密码不一致","passwords don't match"));
    } else {
      callback();
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
       const {UserStore} = this.props;
        UserStore.updatePassword(values.originPassword,values.hashedPassword).then(()=>{
          message.success(this.getMessage("修改成功","Success"));
          HAP.removeAccessToken();
          HAP.logout();
        }).catch((error)=>{
          const response=error.response;
          if(response.status==400){
            if("error.password.notMatch"==response.data.message){
              message.error(this.getMessage("密码不匹配","password not match"));
            }else{
              message.error(response.data.message);
            }

          }
        })
      }
    })

  };

  getMessage(zh,en){
    const {AppState} = this.props;
    let language=AppState.currentLanguage;
    if(language=="zh"){
      return zh;
    }else if (language=="en"){
      return en;
    }
  }
  render(){
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
    return (
        <div>
          <PageHeader title={HAP.languageChange("user.password.update")}/>
          <div className="mainContent">
            <Form onSubmit={this.handleSubmit.bind(this)}>
              <FormItem
                  {...formItemLayout}
                  label={HAP.languageChange("user.password.origin")}
                  hasFeedback
              >
                {getFieldDecorator('originPassword', {
                  rules: [{
                    required: true, message: this.getMessage("原始密码不能为空","Original password is required")
                  }]
                })(
                    <Input type="password" size="default"/>
                )}
              </FormItem>
              <FormItem
                  {...formItemLayout}
                  label={HAP.languageChange("user.password.new")}
                  hasFeedback
              >
                {getFieldDecorator('hashedPassword', {
                  rules: [{
                    required: true, message: this.getMessage("新密码不能为空","New Password is required")
                  },{
                    validator: this.checkPassword
                  }]
                })(
                    <Input type="password" size="default" />
                )}
              </FormItem>
              <FormItem
                  {...formItemLayout}
                  label={HAP.languageChange("user.password.confirm")}
                  hasFeedback
              >
                {getFieldDecorator('rePassword', {
                  rules: [{
                    required: true, message: this.getMessage("请再次输入密码","Password is required")
                  },
                    {
                      validator: this.checkRepassword
                    }
                  ]

                })(
                    <Input type="password" size="default"/>
                )}
              </FormItem>
              <FormItem
                wrapperCol={{offset: 3}}>
                <Row>
                  <Col span={2}>
                    <Button size="default" type="primary" htmlType="submit">{HAP.languageChange("save")}</Button>
                  </Col>
                </Row>
              </FormItem>
            </Form>
          </div>
        </div>)
  }
}

export default Form.create({})(ModifyPassword)
