/**
 * Created by song on 2017/6/26.
 */

import React, {Component} from 'react';
import PageHeader, {PageHeadStyle}from '../../../components/PageHeader';
import {Form, Icon, Input, Button, Checkbox, Switch, Select, Row, Col, Spin, message} from 'antd';
import {withRouter} from 'react-router-dom';
import {observer, inject} from 'mobx-react'

const FormItem = Form.Item;
const Option = Select.Option;

@inject("AppState")
@observer
class EditLDAP extends Component {
  constructor(props) {
    super(props);
    this.loadLDAP = this.loadLDAP.bind(this);
    this.state = {
      open: false,
      saving: false,
      organizationId: this.props.AppState.currentMenuType.id,
    }
  }

  loadLDAP = (organizationId) => {
    this.props.LDAPStore.loadLDAP(organizationId);
    this.setState({
      saving: false
    })
  };

  componentDidMount() {
    this.loadLDAP(this.state.organizationId);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({
      saving: true,
    });
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let ladp={
          ...this.props.LDAPStore.ldapData,
          status: this.props.LDAPStore.ldapData.status,
          objectVersionNumber: this.props.LDAPStore.ldapData.objectVersionNumber
        };
        if(ladp.name === values.name){
          message.warn(HAP.getMessage("名称相同","Same Name"));
          this.setState({
            saving: false
          });
          return
        }
        ladp.name=values.name;
        this.props.LDAPStore.updateLDAP(this.state.organizationId, ladp);
        message.success(HAP.getMessage("修改成功！", "update success!"));
      }else{
        message.error(HAP.getMessage("修改失败！", "update failed!"));
      }
    })
    this.setState({
       saving: false,
    });
  };

  render() {
    const {LDAPStore}=this.props;
    const loadingBar = (
      <div style={{display: 'inherit', margin: '200px auto', textAlign: "center"}}>
        <Spin/>
      </div>
    );
    const {getFieldDecorator} = this.props.form;
    let status = false;
    if (LDAPStore.ldapData && LDAPStore.ldapData.status == "Y") {
      status = true
    } else {
      status = false
    }

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
        <PageHeader title={HAP.languageChange("ldap.updateLDAP")}>
          <Button className="header-btn" ghost={true} onClick={() => {
            this.loadLDAP(this.state.organizationId)
          }} style={PageHeadStyle.leftBtn} icon="reload">{HAP.languageChange("flush")}</Button>
        </PageHeader>
        {this.props.LDAPStore.getIsLoading? loadingBar : (

          <div className="mainContent">
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout}
              label={HAP.languageChange("ldap.name")}
              hasFeedback
            >
              {getFieldDecorator('name', {
                rules: [{required: true, message: HAP.getMessage("名称是必输的！", "name is required!")}],
                initialValue:LDAPStore.ldapData ? LDAPStore.ldapData.name : ""
              })(
                <Input size="default"/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={HAP.languageChange("ldap.serverAddress")}
              hasFeedback
            >
              {getFieldDecorator('serverAddress', {
                initialValue: LDAPStore.ldapData ? LDAPStore.ldapData.serverAddress : ""
              })(
                <Input size="default"/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={HAP.languageChange("ldap.ldapAttributeName")}
              hasFeedback
            >
              {getFieldDecorator('ldapAttributeName', {
                initialValue: LDAPStore.ldapData ? LDAPStore.ldapData.ldapAttributeName : ""
              })(
                <Input size="default"/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={HAP.languageChange("ldap.encryption")}
              hasFeedback
            >
              {getFieldDecorator('encryption', {
                initialValue: LDAPStore.ldapData ? LDAPStore.ldapData.encryption : ""
              })(
                <Select size="default">
                  <Option value="SSL">SSL</Option>
                  <Option value="TSL">TSL</Option>
                  <Option value="STARTTLS">STARTTLS</Option>
                </Select>
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label={HAP.languageChange("ldap.baseDn")}
              hasFeedback
            >
              {getFieldDecorator('baseDn', {
                initialValue: LDAPStore.ldapData ? LDAPStore.ldapData.baseDn : ""
              })(
                <Input size="default"/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={HAP.languageChange("ldap.description")}
            >
              {getFieldDecorator('description', {
                initialValue: LDAPStore.ldapData ? LDAPStore.ldapData.description : ""
              })(
                <Input type="textarea" rows={5}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={HAP.languageChange("ldap.status")}
            >
              {getFieldDecorator('status', {
                valuePropName: 'checked',
                initialValue: status
              })(
                <Switch size="default"/>
              )}

            </FormItem>
            <FormItem wrapperCol={{offset: 3}}>
              <Row>
                <Col span={2}>
                  <Button size="default" loading={this.state.saving} type="primary" htmlType="submit"
                          className="login-form-button">
                    {HAP.languageChange("ldap.save")}
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

export default Form.create({})(withRouter(EditLDAP));
