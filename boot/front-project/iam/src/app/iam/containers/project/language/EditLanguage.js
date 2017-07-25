/**
 * Created by song on 2017/6/27.
 */

import React, { Component } from 'react';
import { Form, Input, Button,Row,Col,message } from 'antd';
import PageHeader from '../../../components/PageHeader';
import {observer, inject} from 'mobx-react'
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
class EditLanguage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: this.props.match.params.code,
      submiting: false,
    };
  };

  componentDidMount() {
    const { LanguageStore } = this.props;
    LanguageStore.getLanguageByCode(this.state.code).then((data) => {
      this.setState(data);
    }).catch(error => {
      message.info(HAP.languageChange("Failed!"));
    });
  };

  linkToChange = (url) => {
    const {history} = this.props;
    history.push(url);
  };

  handleReset = () => {
    this.linkToChange('/iam/language');
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({
          submiting: true,
        });
        
        values.objectVersionNumber = this.state.objectVersionNumber;
        let code = this.state.code;

        const { LanguageStore } = this.props;
        LanguageStore.updateLanguage(code, values).then(() => {
          message.success(HAP.getMessage("修改成功！", "update success!"));
          this.setState({ submiting: false }, () => {
            this.linkToChange('/iam/language');
          })
        }).catch(error => {
          message.info(HAP.languageChange("Failed!"));
          this.setState({
            saving: false,
          });
        });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        <PageHeader title={HAP.languageChange("language.edit")} backPath="/iam/language" />
        <div className="mainContent">
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout}
              label={HAP.languageChange("language.code")}
              hasFeedback>
              {getFieldDecorator('code', {
                initialValue: this.state.code ? this.state.code : "",
              })(
                <Input readOnly size="default" placeholder={HAP.languageChange("language.code")} />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={HAP.languageChange("language.name")}
              hasFeedback>
              {getFieldDecorator('name', {
                initialValue: this.state.name ? this.state.name : "",
              })(
                <Input size="default" placeholder={HAP.languageChange("language.name")} />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={HAP.languageChange("language.describe")}
              hasFeedback>
              {getFieldDecorator('description', {
                initialValue: this.state.description ? this.state.description : "",
              })(
                <Input size="default" placeholder={HAP.languageChange("language.describe")} />
              )}
            </FormItem>

            <FormItem
              wrapperCol={{ offset: 3 }}>
              <Row>
                <Col span={2}>
                  <Button size="default" loading={this.state.submiting} type="primary" htmlType="submit" className="login-form-button">
                    {HAP.languageChange("save")}
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

export default Form.create({})(withRouter(EditLanguage));
