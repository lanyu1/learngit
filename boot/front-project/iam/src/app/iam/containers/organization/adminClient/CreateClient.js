/**
 * Created by jaywoods on 2017/6/25.
 */
import React, {Component} from 'react';
import PageHeader, {PageHeadStyle} from '../../../components/PageHeader';
import {Form, Input, Button, Switch, InputNumber, Select, Row, Col} from 'antd';
import {withRouter} from 'react-router-dom';
import {observer, inject} from 'mobx-react'
const FormItem = Form.Item;
const Option = Select.Option;

@observer
class CreateClient extends Component{
  constructor(props){
    super(props);
    this.linkToChange=this.linkToChange.bind(this);
    this.state={
      submitting: false,
    };
  }

  componentDidMount() {
  }

  linkToChange=(url)=>{
    const {history} = this.props;
    history.push(url);
  };

  checkUsername = (rule, value, callback) => {
    callback()
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, data) => {
      if (!err) {
        const {AdminClientStore} = this.props;
        if (data.authorizedGrantTypes) {
          data.authorizedGrantTypes = data.authorizedGrantTypes.join(",");
          this.setState({submitting: true});
        }
        AdminClientStore.createClient(data).then(data=>{
          if(data){
            this.linkToChange("/iam/admin-client");
          }
        }).catch(error=>{
          this.setState({
            submitting: false,
          });
        });
      }
    });
  };

  handleReset = () => {
    this.linkToChange("/iam/client");
  };

  render(){
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 4},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 6},
      },
    };

    return (
        <div>
          <PageHeader title={HAP.languageChange("client.create")} backPath="/iam/admin-client"/>
          <div className="mainContent">
            <Form onSubmit={this.handleSubmit}>
              <FormItem
                  {...formItemLayout}
                  label={HAP.languageChange("client.name")}
                  hasFeedback
              >
                {getFieldDecorator('name', {
                  rules: [{required: true, message: HAP.getMessage("客户端名称是必须的","Client is required")}, {
                    validator: this.checkUsername,
                  }],
                })(
                    <Input size="default"/>
                )}
              </FormItem>
              <FormItem
                  {...formItemLayout}
                  label={HAP.languageChange("client.secret")}
                  hasFeedback
              >
                {getFieldDecorator('secret', {
                  rules: [{required: true, message: HAP.getMessage("密钥是必须的","secret is required")}],
                })(
                    <Input size="default"/>
                )}
              </FormItem>

              <FormItem
                  {...formItemLayout}
                  label={HAP.languageChange("client.authorizedGrantTypes")}
                  hasFeedback
              >
                {getFieldDecorator('authorizedGrantTypes', {
                  rules: [
                    {type: 'array',required: true, message: HAP.getMessage("授权类型是必须的","AuthorizedGrantTypes is required")},
                  ],
                })(
                    <Select mode="multiple" placeholder={HAP.languageChange("client.authorizedGrantTypes.select")}
                            size="default">
                      <Option value="password">password</Option>
                      <Option value="implicit">implicit</Option>
                      <Option value="clientCredentials">clientCredentials</Option>
                      <Option value="authorizationCode">authorizationCode</Option>
                      <Option value="refreshToken">refreshToken</Option>
                    </Select>
                )}
              </FormItem>
              <FormItem
                  {...formItemLayout}
                  label={HAP.languageChange("client.accessTokenValidity")}
                  hasFeedback
              >
                {getFieldDecorator('accessTokenValidity', {initialValue: 60})(
                    <InputNumber min={60} size="default"/>
                )}
                <span className="ant-form-text"> s</span>
              </FormItem>
              <FormItem
                  {...formItemLayout}
                  label={HAP.languageChange("client.refreshTokenValidity")}
                  hasFeedback
              >
                {getFieldDecorator('refreshTokenValidity', {initialValue: 60})(
                    <InputNumber min={60} size="default"/>
                )}
                <span className="ant-form-text"> s</span>
              </FormItem>
              <FormItem
                  {...formItemLayout}
                  label={HAP.languageChange("client.webServerRedirectUri")}
                  hasFeedback
              >
                {getFieldDecorator('webServerRedirectUri')(
                    <Input size="default"/>
                )}
              </FormItem>
              <FormItem
                  {...formItemLayout}
                  label={HAP.languageChange("client.additionalInformation")}
                  hasFeedback
              >
                {getFieldDecorator('additionalInformation')(
                    <Input type="textarea" rows={5}/>
                )}
              </FormItem>
              <FormItem
                  wrapperCol={{offset: 4}}
              >
                <Row>
                  <Col span={2}>
                    <Button size="default" loading={this.state.submitting} type="primary" htmlType="submit"
                            className="login-form-button">
                      {HAP.languageChange("form.create")}
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
    );

  }
}

export default Form.create({})(withRouter(CreateClient));
