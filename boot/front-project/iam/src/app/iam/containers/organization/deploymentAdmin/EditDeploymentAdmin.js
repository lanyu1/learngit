/**
 * Created by YANG on 2017/7/3.
 */

import React, {Component} from 'react';
import PageHeader, {PageHeadStyle} from '../../../components/PageHeader';
import {Form, Input, Button, Switch, InputNumber, Select, Row, Col,AutoComplete,message} from 'antd';
import {withRouter} from 'react-router-dom';
import {observer, inject} from 'mobx-react';
import Remove from '../../../components/Remove';

const FormItem = Form.Item;
const Option = Select.Option;

@inject("AppState")
@observer
class EditDeploymentAdmin extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      isSubmit: false,
      id:this.props.match.params.id
    };
  }

  linkToChange = (url)=> {
    const {history} = this.props;
    history.push(url);
  };

  componentDidMount() {
    const { DeploymentAdminStore, AppState} = this.props;
    const organizationId = AppState.currentMenuType.id;
    DeploymentAdminStore.loadDeploymentById(this.state.id).then(data => {
      this.setState({
        deploymentInfo:data
      })
    });
    DeploymentAdminStore.loadCategory(organizationId);
    DeploymentAdminStore.loadLabel();
  }

//处理提交
  handleSubmit = (e) => {
    e.preventDefault();
    //校验表单
    this.props.form.validateFieldsAndScroll((err, data) => {
      if (!err) {
        const { DeploymentAdminStore} = this.props;
        if (data.authorizedGrantTypes) {
          data.authorizedGrantTypes = data.authorizedGrantTypes.join(",");
          this.setState({submitting: true});
        }

        const orgData = this.state.deploymentInfo
        const deployment = {...orgData,...data};
        DeploymentAdminStore.updateDeployment(this.state.id,deployment).then(data=> {
          if (data) {
            this.linkToChange("/iam/deploymentAdmin");
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
  handleOpen = () => {
    this.setState({ open: true});
  };

  handleClose = (event) => {
    this.setState({ open: false});
  };
  handleDelete = () => {
    const {DeploymentAdminStore} = this.props;
    DeploymentAdminStore.deleteDeployment(this.state.id).then(data=> {
      this.handleClose();
      this.linkToChange('/iam/deploymentAdmin');
    }).catch(error => {
      message.error(HAP.getMessage("删除失败！", "Delete Failed!"))
    })
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
    const { DeploymentAdminStore } = this.props;
    const categoryDom = [];
    if(DeploymentAdminStore && DeploymentAdminStore.category){
      DeploymentAdminStore.category.map((value,index) => {
        categoryDom.push(
          <Option key={index} value={value.id.toString()}>{value.name}</Option>
        )
      })
    }
    const labelDom = [];
    if (DeploymentAdminStore && DeploymentAdminStore.label){
      DeploymentAdminStore.label.map((item,index) => {
        labelDom.push(
          <Option key={index} value={item}>{item}</Option>
        )
      })
    }
    return (
      <div>
        <Remove open={this.state.open} handleCancel={this.handleClose}
                handleConfirm={this.handleDelete}/>
        <PageHeader title={HAP.languageChange("deployment.edit")} backPath="/iam/deploymentAdmin" />
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
                initialValue:this.state.deploymentInfo?this.state.deploymentInfo.categoryId.toString():"",
              })(
                <Select disabled size="default">
                  {categoryDom}
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={HAP.languageChange('deployment.logoUrl')}
              hasFeedback>
              {getFieldDecorator('icon',{
                initialValue:this.state.deploymentInfo?this.state.deploymentInfo.icon:"",
              })(
                <Input disabled size="default" placeholder={HAP.getMessage("Logo 链接", 'Icon URL')}/>
              )}
            </FormItem>
    {/*        <FormItem {...formItemLayout}
                      label = {HAP.languageChange("deployment.tag")}>
              {getFieldDecorator('labelValues',{
                initialValue:this.state.deploymentInfo?this.state.deploymentInfo.labelValues:null,
              })(
                <Select
                  size="default"
                  mode="tags"
                  tokenSeparators={[';']}
                >
                  {labelDom}
                </Select>
              )}

            </FormItem>*/}
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

export default Form.create({})(withRouter(EditDeploymentAdmin));
