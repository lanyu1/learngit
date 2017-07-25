/**
 * Created by cheon on 6/27/17.
 */

import React, { Component } from 'react';
import { Form, Input, Button,Row,Col ,Select} from 'antd';
import PageHeader from '../../../components/PageHeader';
import {withRouter} from 'react-router-dom';

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

class EditRole extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
      role: '',
      submit: false,
      isLoading: false,
    };
  };

  componentDidMount() {
    this.setState({isLoading: true});
    const { id } = this.state;
    this.props.RoleStore.getRoleById(id).then(data => {
      this.setState({role: data})
    })
    this.setState({isLoading: false});
  };

  linkToChange = (url) => {
    const { history } = this.props;
    history.push(url);
  };

  handleReset = () => {
    this.linkToChange('/iam/role');
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({
          submit: true,
        });
        let role = { ...values, objectVersionNumber: this.state.role.objectVersionNumber };
        console.log(role);
        this.props.RoleStore.updateRoleById(this.state.id, role).then(()=>{
            this.setState({submit: false});
            this.handleReset();
        })
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <PageHeader title={HAP.languageChange("role.updateRole")} backPath="/iam/role" />
        <div className="mainContent">
          <Form onSubmit={this.handleSubmit}>
            <Form.Item
              {...formItemLayout}
              label={HAP.languageChange("role.name")}
              hasFeedback>
              {getFieldDecorator('name', {
                initialValue: this.state.role.name ? this.state.role.name : "",
              })(
                <Input size="default" disabled={true} placeholder={HAP.languageChange("role.name")} />
              )}
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              label={HAP.languageChange("role.level")}
              hasFeedback
            >
              {getFieldDecorator('roleLevel', {
                initialValue: this.state.role.roleLevel ? this.state.role.roleLevel.toString() : "",
                rules: [{ required: true, message: HAP.getMessage("角色级别必填", "Role Level is required") }],
              })(
                <Select size="default" disabled={true}>
                  <Option value="organization">{HAP.languageChange("role.organization")}</Option>
                  <Option value="project">{HAP.languageChange("role.project")}</Option>
                  <Option value="resource">{HAP.languageChange("role.resource")}</Option>
                </Select>
              )}
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              label={HAP.languageChange("role.description")}
              hasFeedback>
              {getFieldDecorator('description', {
                initialValue: this.state.role.description ? this.state.role.description : "",
              })(
                <Input size="default" placeholder={HAP.getMessage("角色描述", "Role Description")} />
              )}
            </Form.Item>

            <Form.Item
              wrapperCol={{ offset: 3 }}>
              <Row>
                <Col span={2}>
                  <Button size="default" loading={this.state.submit} type="primary" htmlType="submit" className="login-form-button">
                    {HAP.languageChange("save")}
                  </Button>
                </Col>
                <Col span={2}>
                  <Button size="default" htmlType="reset" onClick={this.handleReset} className="login-form-button">
                    {HAP.languageChange("cancel")}
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </Form>
        </div>
      </div>
    )
  }
}

export default Form.create({})(withRouter(EditRole));
