/**
 * Created by hand on 2017/6/27.
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
class EditProject extends Component {
    constructor(props) {
        super(props);
        this.linkToChange = this.linkToChange.bind(this);
        this.state = {
            submitting: false,
            projectData: '',
            id: this.props.location.pathname.split('/')[4]//取url中传递的参数id
        };
    }

    componentDidMount() {
        this.loadProjectData(this.state.id);
    }

    loadProjectData = (id) => {
        const {AppState, ProjectStore}=this.props;
        const menuType = AppState.currentMenuType;
        let organizationId = menuType.id;
        ProjectStore.getProjectById(organizationId, id).then(data=> {
            this.setState({
                projectData: data,
            });
        })
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, data) => {
            if (!err) {
                const {AppState, ProjectStore}=this.props;
                const menuType = AppState.currentMenuType;
                let organizationId = menuType.id;
                this.setState({submitting: true});
                ProjectStore.updateProject(organizationId,
                    {...data, objectVersionNumber: this.state.projectData.objectVersionNumber},
                    this.state.id).then(data => {
                    if (data) {
                        message.success("Success");
                        this.setState({
                            submitting: false,
                        });
                        this.linkToChange("/iam/project");
                    }
                }).catch(error => {
                    message.info(HAP.languageChange("Failed!"));
                    this.setState({
                        submitting: false,
                    });
                });
            }
        });
    };

    linkToChange = (url) => {
        const {history} = this.props;
        history.push(url);
    };

    handleBack = () => {
        this.linkToChange("/iam/project");
    };

    getEditProjectPage = () => {
        const {projectData} = this.state;
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
                <PageHeader title={HAP.languageChange("project.edit")} backPath={"/iam/project"}/>
                <div className="mainContent">
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem
                            {...formItemLayout}
                            label={HAP.languageChange('project.name')}
                            hasFeedback>
                            {getFieldDecorator('name', {
                                rules: [{
                                    required: true,
                                    whitespace: true,
                                    message: HAP.getMessage('该字段是必输的','required!')
                                }],
                                initialValue: projectData ? projectData.name : "",
                            })(
                                <Input size="default" placeholder={HAP.getMessage('项目名称','Project Name')}/>
                            )}
                        </FormItem>

                        <FormItem
                            wrapperCol={{offset: 3}}>
                            <Row>
                                <Col span={2}>
                                    <Button size="default" loading={this.state.isSubmit} type="primary"
                                            htmlType="submit"
                                            className="login-form-button">
                                        {HAP.languageChange("form.update")}
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
        return this.getEditProjectPage()
    }
}
export default Form.create({})(withRouter(EditProject));