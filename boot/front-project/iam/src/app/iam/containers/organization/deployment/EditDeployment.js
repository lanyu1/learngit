/**
 * Created by YANG on 2017/7/3.
 */

import React, {Component} from 'react';
import PageHeader, {PageHeadStyle} from '../../../components/PageHeader';
import {Form, Input, Button, Switch, InputNumber, message,Select, Row, Col,AutoComplete} from 'antd';
import {withRouter} from 'react-router-dom';
import {observer, inject} from 'mobx-react'
import Remove from '../../../components/Remove';

const FormItem = Form.Item;
const Option = Select.Option;

@inject("AppState")
@observer
class EditDeployment extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.state = {
      isSubmit: false,
      id:this.props.match.params.id,
      open:false,
    };
  }

  linkToChange = (url)=> {
    const {history} = this.props;
    history.push(url);
  };

  componentDidMount() {
    const { DeploymentStore,AppState } = this.props;
    let organizationId=AppState.menuType.id;
    DeploymentStore.loadDeploymentById(organizationId,this.state.id).then(data => {
      this.setState({
        deploymentInfo:data,
      })
    });
    DeploymentStore.loadCategory(organizationId);
  }

//处理提交
  handleSubmit = (e) => {
    e.preventDefault();
    //校验表单
    this.props.form.validateFieldsAndScroll((err, data) => {
      if (!err) {
        const {AppState, DeploymentStore} = this.props;
        let orgId=AppState.menuType.id;
        if (data.authorizedGrantTypes) {
          data.authorizedGrantTypes = data.authorizedGrantTypes.join(",");
          this.setState({submitting: true});
        }
        const orgData = this.state.deploymentInfo
        const deployment = {...orgData,...data,};
        DeploymentStore.updateDeployment(orgId,this.state.id,deployment).then(data=> {
          if (data) {
            this.linkToChange("/iam/deployment");
          }
        }).catch(error=> {
          this.setState({
            submitting: false,
          });
          message.error("更新失败");
        });
      }
    });
  };

  handleBack = () => {
    this.linkToChange("/iam/deployment");
  };

  handleOpen = () => {
    this.setState({ open: true});
  };

  handleClose = (event) => {
    this.setState({ open: false});
  };
  handleDelete = () => {
    const {DeploymentStore} = this.props;
    DeploymentStore.deleteDeployment(this.state.id).then(data=> {
      this.handleClose();
      this.linkToChange('/iam/deployment');
    }).catch(error => {
      this.handleClose();
      //message.error(error.response.data.message)
      message.error(HAP.getMessage("该部署有依赖的版本，不可删除！","Delete failed for having version rely on!"))
    })
  };
  render() {
    const {getFieldDecorator} = this.props.form;
    const that = this;
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
    const { DeploymentStore } = this.props;
    const categoryDom = [];
    var category = "";
    if(DeploymentStore && DeploymentStore.category && this.state.deploymentInfo){
      DeploymentStore.category.map((value,index) => {
          if(that.state.deploymentInfo.categoryId == value.id){
            category = value.name;
          }
      })
    }
    return (
      <div>
        <Remove open={this.state.open} handleCancel={this.handleClose}
                handleConfirm={this.handleDelete}/>
        <PageHeader title={HAP.languageChange("deployment.edit")} backPath="/iam/deployment" />
        <div className="mainContent">
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout}
              label={HAP.languageChange('deployment.name')}>
              {getFieldDecorator('name', {
                initialValue:this.state.deploymentInfo?this.state.deploymentInfo.name:"",
                rules: [{
                  required: true,
                  whitespace: true,
                  message: HAP.getMessage('该字段是必输的', 'Name is required'),
                }],
              })(
                <Input disabled size="default" placeholder={HAP.getMessage("部署名称", 'Deployment Name')}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={HAP.languageChange('deployment.description')}
              hasFeedback>
              {getFieldDecorator('description',{
                initialValue:this.state.deploymentInfo?this.state.deploymentInfo.description:"",
              })(
                <Input type="textarea" rows={3}  placeholder={HAP.getMessage("部署描述", 'Deployment Description')}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={HAP.languageChange('deployment.category')}>
              {getFieldDecorator('categoryId',{
                initialValue:category,
              })(
                <Input disabled size="default" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={HAP.languageChange('deployment.logoUrl')}
              hasFeedback>
              {getFieldDecorator('icon',{
                initialValue:this.state.deploymentInfo?this.state.deploymentInfo.icon:"",
              })(
                <Input disabled size="default" />
              )}
            </FormItem>
            <FormItem
              wrapperCol={{offset: 3}}>
              <Row>
                <Col span={2}>
                  <Button size="default" loading={this.state.isSubmit} type="primary"
                          htmlType="submit">
                    {HAP.languageChange("save")}
                  </Button>
                </Col>
                <Col span={2}>
                  <Button type="danger" size="default" htmlType="reset" onClick={this.handleOpen}>
                    {HAP.languageChange("delete")}
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

export default Form.create({})(withRouter(EditDeployment));
