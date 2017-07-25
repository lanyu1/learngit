/**
 * Created by hand on 2017/6/30.
 */
/**
 * Created by hand on 2017/6/30.
 */
import React, {Component} from 'react';
import PageHeader, {PageHeadStyle} from '../../../components/PageHeader';
import {Form, Input, Button, Switch, InputNumber, Select, Row, Col,AutoComplete} from 'antd';
import {withRouter} from 'react-router-dom';
import {observer, inject} from 'mobx-react'
import catalogStore from '../../../stores/organization/catalog/CatalogStore';
const FormItem = Form.Item;
const Option = Select.Option;
@inject("AppState")
@observer
class CreateCatalog extends Component {
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
  // this.loadProjectData();
}

//处理提交
handleSubmit = (e) => {
  e.preventDefault();
  //校验表单
  this.props.form.validateFieldsAndScroll((err, data) => {
    if (!err) {
    const {AppState, CatalogStore} = this.props;
    if (data.authorizedGrantTypes) {
      data.authorizedGrantTypes = data.authorizedGrantTypes.join(",");
      this.setState({submitting: true});
    }
    CatalogStore.createCatalog(data).then(data=> {
      if (data) {
        this.linkToChange("/iam/catalog");
      }
    }).catch(error=> {
      this.setState({
      submitting: false,
    });
  });
  }
});
};

handleBack = () => {
  this.linkToChange("/iam/catalog");
};
  handleSearch=()=>{
    catalogStore.searchCategory();
  };
getNewPage = () => {
  //const {projectData} = this.props;
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
  return (
    <div>
    <PageHeader title={HAP.languageChange("catalog.create")} backPath="/iam/catalog"/>
    <div className="mainContent">
    <Form onSubmit={this.handleSubmit}>
<FormItem
  {...formItemLayout}
  label={HAP.languageChange('catalog.name')}
  hasFeedback>
  {getFieldDecorator('name', {
    rules: [{
      required: true,
      whitespace: true,
      message: HAP.getMessage('该字段是必输的', 'required')
    }],
  })(
  <Input size="default" placeholder={HAP.getMessage("模板名称", 'Catalog Name')}/>
)}
</FormItem>
  <FormItem
  {...formItemLayout}
  label={HAP.languageChange('catalog.description')}
  hasFeedback>
  {getFieldDecorator('description')(
  <Input type="textarea" rows={3}  placeholder={HAP.getMessage("描述", 'Catalog Description')}/>
)}
</FormItem>
  <FormItem
  {...formItemLayout}
  label={HAP.languageChange('catalog.category')}
  hasFeedback>
  {getFieldDecorator('category')(
    <AutoComplete
      dataSource={catalogStore.categories}
      style={{ width: '100%' }}
      //onSelect={onSelect}
      onSearch={this.handleSearch}
      placeholder={HAP.getMessage("类别", 'Catalog Category')}
    />
)}
</FormItem>
  <FormItem
  {...formItemLayout}
  label={HAP.languageChange('catalog.url')}
  hasFeedback>
  {getFieldDecorator('address')(
  <Input size="default" placeholder={HAP.getMessage("地址", 'Catalog URL')}/>
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

render() {
  return this.getNewPage();
};

}

export default Form.create({})(withRouter(CreateCatalog));
