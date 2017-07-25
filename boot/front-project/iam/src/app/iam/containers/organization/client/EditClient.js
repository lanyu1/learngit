/**
 * Created by jaywoods on 2017/6/25.
 */
import React, {Component} from 'react';
import PageHeader, {PageHeadStyle} from '../../../components/PageHeader';
import {Form, Input, Button, message, InputNumber, Select, Row, Col, Spin} from 'antd';
import {withRouter} from 'react-router-dom';
import {observer, inject} from 'mobx-react';
const FormItem = Form.Item;
const Option = Select.Option;

@inject("AppState")
@observer
class EditClient extends Component {
  constructor(props) {
    super(props);
    this.linkToChange = this.linkToChange.bind(this);
    this.state = {
      submitting: false,
      client:'',
      id: this.props.match.params.id
    };
  }

  componentDidMount() {
    const {AppState,ClientStore}=this.props;
    const menuType = AppState.currentMenuType;
    let organizationId = menuType.id;
    ClientStore.getClientById(organizationId, this.state.id).then(data=>{
      this.setState({
        client:data,
      });
    })
  }

  linkToChange = (url) => {
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
        const {AppState,ClientStore}=this.props;
        const menuType = AppState.currentMenuType;
        let organizationId = menuType.id;
        data.authorizedGrantTypes = data.authorizedGrantTypes.join(",");
        this.setState({submitting: true});
        ClientStore.updateClient(organizationId,
            {...data, objectVersionNumber: this.state.client.objectVersionNumber},
            this.state.id).then(data => {
          if (data) {
            message.success(HAP.getMessage("修改成功","Success"));
            this.setState({
              submitting: false,
            });
            this.linkToChange("/iam/client");
          }
        }).catch(error => {
          message.info(HAP.getMessage("失败","Failed!"));
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

  render() {
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
    const {client} = this.state;
    const loadingBar = (
        <div style={{display: 'inherit', margin: '200px auto', textAlign: "center"}}>
          <Spin />
        </div>
    );
    return (
        <div>
          <PageHeader title={HAP.languageChange("client.edit")} backPath="/iam/client"/>
          {client ? (
              <div className="mainContent">
                <Form onSubmit={this.handleSubmit}>
                  <FormItem
                      {...formItemLayout}

                      label={HAP.languageChange("client.id")}
                      hasFeedback
                  >
                    {getFieldDecorator('id', {
                      initialValue: client.id
                    })(
                        <Input disabled={true} size="default"/>
                    )}
                  </FormItem>
                  <FormItem
                      {...formItemLayout}
                      label={HAP.languageChange("client.name")}
                      hasFeedback
                  >
                    {getFieldDecorator('name', {
                      initialValue: client.name,
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
                      initialValue: client.secret,
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
                      initialValue: client.authorizedGrantTypes?client.authorizedGrantTypes.split(','):[],
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
                    {getFieldDecorator('accessTokenValidity', {
                      initialValue: client.accessTokenValidity
                    })(
                        <InputNumber min={60} size="default"/>
                    )}
                    <span className="ant-form-text"> s</span>
                  </FormItem>
                  <FormItem
                      {...formItemLayout}
                      label={HAP.languageChange("client.refreshTokenValidity")}
                      hasFeedback
                  >
                    {getFieldDecorator('refreshTokenValidity', {
                      initialValue: client.refreshTokenValidity
                    })(
                        <InputNumber min={60} size="default"/>
                    )}
                    <span className="ant-form-text"> s</span>
                  </FormItem>
                  <FormItem
                      {...formItemLayout}
                      label={HAP.languageChange("client.webServerRedirectUri")}
                      hasFeedback
                  >
                    {getFieldDecorator('webServerRedirectUri', {
                      initialValue: client.webServerRedirectUri || ''
                    })(
                        <Input size="default"/>
                    )}
                  </FormItem>
                  <FormItem
                      {...formItemLayout}
                      label={HAP.languageChange("client.additionalInformation")}
                      hasFeedback
                  >
                    {getFieldDecorator('additionalInformation', {
                      initialValue: client.additionalInformation || ''
                    })(
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
                          {HAP.languageChange("form.update")}
                        </Button>
                      </Col>
                      <Col span={2} offset={1}>
                        <Button size="default" htmlType="reset" onClick={this.handleReset}
                                className="login-form-button">
                          {HAP.languageChange("form.cancel")}
                        </Button>
                      </Col>
                    </Row>
                  </FormItem>
                </Form>
              </div>
          ) : loadingBar}

        </div>
    );

  }
}

export default Form.create({})(withRouter(EditClient));
