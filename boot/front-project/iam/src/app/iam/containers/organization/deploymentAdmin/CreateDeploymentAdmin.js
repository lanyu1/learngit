/**
 * Created by YANG on 2017/7/3.
 */

import React, {Component} from 'react';
import PageHeader, {PageHeadStyle} from '../../../components/PageHeader';
import {Form, Input, Button, Switch, InputNumber, Select, Row, Col,AutoComplete} from 'antd';
import {withRouter} from 'react-router-dom';
import {observer, inject} from 'mobx-react'

const FormItem = Form.Item;
const Option = Select.Option;
@inject("AppState")
@observer
class CreateDeploymentAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSubmit: false,
    };
  }

  linkToChange = (url)=> {
    const {history} = this.props;
    history.push(url);
  };

  componentDidMount() {
    const {DeploymentAdminStore, AppState} = this.props;
    const organizationId = AppState.currentMenuType.id;
    DeploymentAdminStore.loadCategory(organizationId);
    DeploymentAdminStore.loadLabel();
  }

//处理提交
  handleSubmit = (e) => {
    e.preventDefault();
    //校验表单
    this.props.form.validateFieldsAndScroll((err, data) => {
      if (!err) {
        const {DeploymentAdminStore} = this.props;
        if (data.authorizedGrantTypes) {
          data.authorizedGrantTypes = data.authorizedGrantTypes.join(",");
          this.setState({submitting: true});
        }
        DeploymentAdminStore.createDeployment(data).then(datas=> {
          if (datas) {
            this.linkToChange("/iam/deploymentAdmin");
          }
        }).catch(error=> {
          message.error(HAP.getMessage("创建失败","Failed"));
          this.setState({
            submitting: false,
          });
        });
      }
    });
  };

  handleBack = () => {
    this.linkToChange("/iam/deploymentAdmin");
  };


  render() {

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
    const {DeploymentAdminStore} = this.props;
    const categoryDom = [];
    if(DeploymentAdminStore && DeploymentAdminStore.category){
      DeploymentAdminStore.category.map((value,index) => {
        categoryDom.push(
          <Option key={index} value={value.id.toString()}>{value.name}</Option>
        )
      })
    }

    const labelDom = [];
    if(DeploymentAdminStore && DeploymentAdminStore.label){
      DeploymentAdminStore.label.map((value,index) => {
        labelDom.push(
          <Option key={index} value={value}>{value}</Option>
        )
      })
    }
    return (
      <div>
        <PageHeader title={HAP.languageChange("deployment.create")} backPath="/iam/deploymentAdmin"/>
        <div className="mainContent">
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout}
              label={HAP.languageChange('deployment.name')}
              hasFeedback>
              {getFieldDecorator('name', {
                rules: [{
                  required: true,
                  whitespace: true,
                  message: HAP.getMessage('该字段是必输的', 'Name is required')
                }],
              })(
                <Input size="default" placeholder={HAP.getMessage("部署名称", 'Deployment Name')}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={HAP.languageChange('deployment.description')}
              hasFeedback>
              {getFieldDecorator('description')(
                <Input type="textarea" rows={3}  placeholder={HAP.getMessage("部署描述", 'Deployment Description')}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={HAP.languageChange('deployment.category')}
              hasFeedback>
              {getFieldDecorator('categoryId',{
                initialValue:DeploymentAdminStore&&DeploymentAdminStore.category?DeploymentAdminStore.category[0].id.toString():null
              })(
                <Select size="default">
                  {categoryDom}
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={HAP.languageChange('deployment.logoUrl')}
              hasFeedback>
              {getFieldDecorator('icon')(
                <Input size="default" placeholder={HAP.getMessage("Logo 链接", 'Icon URL')}/>
              )}
            </FormItem>
            <FormItem
              wrapperCol={{offset: 3}}>
              <Row>
                <Col span={2}>
                  <Button size="default" loading={this.state.isSubmit} type="primary"
                          htmlType="submit"
                          className="login-form-button">
                    {HAP.languageChange("form.create")}
                  </Button>
                </Col>
                <Col span={2}>
                  <Button size="default" htmlType="reset" onClick={this.handleBack}
                          className="login-form-button">
                    {HAP.languageChange("form.cancel")}
                  </Button>
                </Col>
              </Row>
            </FormItem>
          </Form>
        </div>

      </div>
    );
  };

}

export default Form.create({})(withRouter(CreateDeploymentAdmin));
