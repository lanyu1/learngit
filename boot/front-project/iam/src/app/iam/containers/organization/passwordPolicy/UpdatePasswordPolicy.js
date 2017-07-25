/**
 * Created by jaywoods on 2017/6/26.
 */
import React, { Component } from 'react';
import PageHeader, {PageHeadStyle} from '../../../components/PageHeader';
import {observer, inject} from 'mobx-react'
import {withRouter} from 'react-router-dom';
import { Form, Input, Button, Switch, InputNumber,Row,Col,message,Spin } from 'antd';
const FormItem = Form.Item;

@inject("AppState")
@observer
class UpdatePasswordPolicy extends Component{
  constructor(props) {
    super(props);
    this.loadData = this.loadData.bind(this);
    this.state = {
      passwordPolicy: '',
      submitting: false,
      organizationId: this.props.AppState.currentMenuType.id,
    };
  }

  componentDidMount(){
    this.loadData(this.state.organizationId);
  }

  loadData=(organizationId)=>{
    this.props.PasswordPolicyStore.loadData(organizationId);
    this.setState({
      submitting: false
    })
  }

  linkToChange=(url)=>{
    const {history} = this.props;
    history.push(url);
  };
  handleReset=()=>{
    this.linkToChange('/iam/password-policy');
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({
      submitting: true,
    });
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({ submitting: true });
        let data={
          ...this.props.PasswordPolicyStore.passwordPolicy,
          objectVersionNumber: this.props.PasswordPolicyStore.passwordPolicy.objectVersionNumber
        };
        if(data.name === values.name){
          message.warn(HAP.getMessage("名称相同","Same Name"));
          this.setState({
            submitting: false
          });
          return
        }
        data.name = values.name;
        this.props.PasswordPolicyStore.updatePasswordPolicy(this.state.organizationId, data);
        message.success(HAP.getMessage("更新成功","Success"));
      }else{
        message.error(HAP.languageChange("更新失败","Failed!"));
      }
    });
    this.setState({
      submitting: false,
    });
  };

  render(){
    const loadingBar = (
      <div style={{display: 'inherit', margin: '200px auto', textAlign: "center"}}>
        <Spin/>
      </div>
    );
    const { PasswordPolicyStore } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
    };
    return (
        <div>
          <PageHeader title={HAP.languageChange('policy.update')}>
            <Button className="header-btn" ghost={true} style={PageHeadStyle.leftBtn} icon="reload" onClick={()=>this.loadData(this.state.organizationId)}>{HAP.languageChange('flush')}</Button>
          </PageHeader>

          {this.props.PasswordPolicyStore.getIsLoading? loadingBar : (
            <div className="mainContent">
              <Form onSubmit={this.handleSubmit} className="ant-advanced-search-form">
                <FormItem
                    {...formItemLayout}
                    label={HAP.languageChange("policy.name")}
                    hasFeedback
                >
                  {getFieldDecorator('name', {
                    rules: [{required: true, message: HAP.getMessage("密码策略名称是必须的","Policy name is required")}],
                    initialValue: PasswordPolicyStore.passwordPolicy ? PasswordPolicyStore.passwordPolicy.name : ""
                  })(
                      <Input disabled={false} style={{width:'130px'}}/>
                  )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={HAP.languageChange("policy.lock")}
                >
                  {getFieldDecorator('lockEnabled', {
                    valuePropName: 'checked',
                    initialValue: PasswordPolicyStore.passwordPolicy ? PasswordPolicyStore.passwordPolicy.lockEnabled : "",
                  })(
                      <Switch />
                  )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={HAP.languageChange("policy.maxErrorTimes")}
                    hasFeedback
                >
                  {getFieldDecorator('maxErrorTimes', {
                    initialValue: PasswordPolicyStore.passwordPolicy　? PasswordPolicyStore.passwordPolicy.maxErrorTimes : "",
                  })(
                      <InputNumber style={{width:'130px'}}/>
                  )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={HAP.languageChange("policy.lockedTime")}
                    hasFeedback
                >
                  {getFieldDecorator('lockedTime', {
                    initialValue: PasswordPolicyStore.passwordPolicy ? PasswordPolicyStore.passwordPolicy.lockedTime : "",
                  })(
                      <InputNumber style={{width:'130px'}} />
                  )}
                  <span className="ant-form-text"> s</span>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={HAP.languageChange("policy.deviceOffline")}
                >
                  {getFieldDecorator('deviceOffline', {
                    valuePropName: 'checked',
                    initialValue: PasswordPolicyStore.passwordPolicy ? PasswordPolicyStore.passwordPolicy.deviceOffline : "",
                  })(
                      <Switch  />
                  )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={HAP.languageChange("policy.passwordCheck")}
                >
                  {getFieldDecorator('passwordCheck', {
                    valuePropName: 'checked',
                    initialValue: PasswordPolicyStore.passwordPolicy ? PasswordPolicyStore.passwordPolicy.passwordCheck : "",
                  })(
                      <Switch  />
                  )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={HAP.languageChange("policy.passwordMinLength")}
                    hasFeedback
                >
                  {getFieldDecorator('passwordMinLength', {
                    initialValue: PasswordPolicyStore.passwordPolicy ? PasswordPolicyStore.passwordPolicy.passwordMinLength : "",
                  })(
                      <InputNumber style={{width:'130px'}} />
                  )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={HAP.languageChange("policy.uppercaseCount")}
                    hasFeedback
                >
                  {getFieldDecorator('uppercaseCount', {
                    initialValue: PasswordPolicyStore.passwordPolicy ? PasswordPolicyStore.passwordPolicy.uppercaseCount : "",
                  })(
                      <InputNumber style={{width:'130px'}} />
                  )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={HAP.languageChange("policy.specialCharCount")}
                    hasFeedback
                >
                  {getFieldDecorator('specialCharCount', {
                    initialValue: PasswordPolicyStore.passwordPolicy ? PasswordPolicyStore.passwordPolicy.specialCharCount : "",
                  })(
                      <InputNumber style={{width:'130px'}} />
                  )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={HAP.languageChange("policy.maxRecentPassword")}
                    hasFeedback
                >
                  {getFieldDecorator('maxRecentPassword', {
                    initialValue: PasswordPolicyStore.passwordPolicy ? PasswordPolicyStore.passwordPolicy.maxRecentPassword : "",
                  })(
                      <InputNumber style={{width:'130px'}}  />
                  )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={HAP.languageChange("policy.passwordExpire")}
                    hasFeedback
                >
                  {getFieldDecorator('passwordExpire', {
                    initialValue: PasswordPolicyStore.passwordPolicy ? PasswordPolicyStore.passwordPolicy.passwordExpire : "",
                  })(
                      <InputNumber style={{width:'130px'}} />
                  )}
                  <span className="ant-form-text"> s</span>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={HAP.languageChange("policy.maxCheckNumber")}
                    hasFeedback
                >
                  {getFieldDecorator('maxCheckNumber', {
                    initialValue: PasswordPolicyStore.passwordPolicy ? PasswordPolicyStore.passwordPolicy.maxCheckNumber : "",
                  })(
                      <InputNumber style={{width:'130px'}} />
                  )}
                </FormItem>
                <FormItem
                    wrapperCol={{offset: 3 }}
                >
                  <Row>
                    <Col span={2}>
                      <Button size="default" loading={this.state.submitting} type="primary" htmlType="submit" className="login-form-button">
                        {HAP.languageChange("save")}
                      </Button>
                    </Col>
                  </Row>
                </FormItem>
              </Form>
            </div>
            )}
        </div>
    )
  }
}

export default Form.create({})(withRouter(UpdatePasswordPolicy))
