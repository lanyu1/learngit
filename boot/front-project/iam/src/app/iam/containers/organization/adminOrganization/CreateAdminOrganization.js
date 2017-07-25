/**
 * Created by song on 2017/6/28.
 */

import React, { Component } from 'react';
import { Form, Input, Button, Select,Row,Col,Tooltip,Icon , Modal, Table, message} from 'antd';
import PageHeader from '../../../components/PageHeader';
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router-dom';

const FormItem = Form.Item;
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

@observer
class CreateOrganization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submiting: false,
      visible: false,
      loading: false,
    };
  }

  linkToChange = (url) => {
    const { history } = this.props;
    history.push(url);
  };

  handleReset = () => {
    this.linkToChange('/iam/admin-organization');
  };


  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({
          submiting: true,
        });
        const { AdminOrganizationStore }=this.props;
        AdminOrganizationStore.createOrganization(values).then((data) => {
          if (data) {
            this.setState({submiting: false}, () => {
              this.linkToChange('/iam/admin-organization');
            });
          }
          message.success(HAP.getMessage('创建成功！',' success!'));
        }).catch((error) => {
          this.setState({submiting: false});
          if (error.response.status == 400)
            message.error(HAP.getMessage('组织名称已经存在！', 'Organization already exist!'));
          else
            message.error(HAP.getMessage('创建失败！', 'create failed!'));
        });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <PageHeader title={HAP.languageChange('adminOrg.create')} backPath="/iam/admin-organization" />
        <div className="mainContent">
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout}
              label={HAP.languageChange('adminOrg.name')}
              hasFeedback>
              {getFieldDecorator('name', {
                rules: [{ required: true, whitespace: true, message: HAP.getMessage('组织名称不能为空!', 'Name is required') }],
              })(
                <Input size="default" placeholder={HAP.getMessage("组织名称", "Organization Name")} />
              )}
            </FormItem>

            <FormItem
              wrapperCol={{ offset: 3 }}>
              <Row>
                <Col span={2}>
                  <Button size="default" loading={this.state.submiting} type="primary" htmlType="submit" className="login-form-button">
                    {HAP.languageChange("form.create")}
                  </Button>
                </Col>
                <Col span={2}>
                  <Button size="default" htmlType="reset" onClick={this.handleReset} className="login-form-button">
                    {HAP.languageChange("cancel")}
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

export default Form.create({})(withRouter(CreateOrganization));
