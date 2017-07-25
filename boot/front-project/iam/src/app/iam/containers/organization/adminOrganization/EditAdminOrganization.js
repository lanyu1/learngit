/**
 * Created by song on 2017/6/28.
 */

import React, { Component } from 'react';
import { Form, Input, Button, Select,Row,Col,Tooltip,Icon , Modal, Table, message} from 'antd'
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
class EditOrganization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submiting: false,
      labelData:[],
      visible: false,
      datas: [],
      loading: false,
      orgData:{},
      organizationId:this.props.match.params.organizationId
    };
  }

  loadOrganization = () => {
    const { AdminOrganizationStore }=this.props;
    let id = this.state.organizationId;
    AdminOrganizationStore.getOrganizationById(id).then((data) => {
      if(data){
        this.setState({
          orgData: data,
          datas:data.labels,
        });
      }
    }).catch((error) => {
      message.error(HAP.getMessage('获取组织失败！', 'get organization failed!'));
    });
  };

  componentDidMount() {
    this.loadOrganization();
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
        let id = this.state.organizationId;
        values.objectVersionNumber = this.state.orgData.objectVersionNumber;
        AdminOrganizationStore.updateOrganization(id, values).then((data) => {
          if(data){
            this.setState({submiting: false}, () => {
              this.linkToChange('/iam/admin-organization');
            })
          }
          message.success(HAP.getMessage('修改成功！','update success!'));
        }).catch((error) => {
          this.setState({submiting: false});
          message.error(HAP.getMessage('修改失败！', 'update failed!'));
        });
      }
    });
  };


  render() {
    const { getFieldDecorator } = this.props.form;
    const {orgData} =this.state;
    return (
      <div>
        <PageHeader title={HAP.languageChange('adminOrg.edit')} backPath="/iam/admin-organization" />
        <div className="mainContent">
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout}
              label={HAP.languageChange('adminOrg.id')}
              hasFeedback>
              {getFieldDecorator('id', {
                rules: [{ required: true, message: HAP.getMessage('组织ID不能为空!', 'ID is required') }],
                initialValue: orgData ? orgData.id : "",
              })(
                <Input size="default" disabled={true} />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={HAP.languageChange('adminOrg.name')}
              hasFeedback>
              {getFieldDecorator('name', {
                rules: [{ required: true, whitespace: true, message: HAP.getMessage('组织名称不能为空!', 'Name is required') }],initialValue: orgData ? orgData.name : "",
              })(
                <Input size="default" placeholder={HAP.getMessage("组织名称", "Organization Name")} />
              )}
            </FormItem>

            <FormItem
              wrapperCol={{ offset: 3 }}>
              <Row>
                <Col span={2}>
                  <Button size="default" loading={this.state.submiting} type="primary" htmlType="submit" className="login-form-button">
                    {HAP.languageChange("form.update")}
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

export default Form.create({})(withRouter(EditOrganization));
