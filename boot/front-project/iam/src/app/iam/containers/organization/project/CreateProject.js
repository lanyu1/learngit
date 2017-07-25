/**
 * Created by hand on 2017/6/27.
 */
import React, {Component} from 'react';
import PageHeader, {PageHeadStyle} from '../../../components/PageHeader';
import {Form, Input, Button, Switch, InputNumber, Select, Row, Col} from 'antd';
import {withRouter} from 'react-router-dom';
import {observer, inject} from 'mobx-react'

const FormItem = Form.Item;
const Option = Select.Option;
@inject("AppState")
@observer
class CreateProject extends Component {
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

    //加载该用户组织下的所有组织,作为校验项目名称是否存在
    loadProjectData = () => {
        const {dispatch} = this.props;
        fetch(`${USER_API_HOST}/organization/${this.state.organizationId}/projects?page=${page}&size=10`, {
            headers: HAP.getHeader()
        }).then(HAP.convertResponse(this)).then((data) => {
            this.setState({
                projectData: data.content,
            });
        }).catch(HAP.catchHttpError());
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
                const {AppState, ProjectStore} = this.props;
                const menuType = AppState.currentMenuType;
                let organizationId = menuType.id;
                if (data.authorizedGrantTypes) {
                    data.authorizedGrantTypes = data.authorizedGrantTypes.join(",");
                    this.setState({submitting: true});
                }
                ProjectStore.createProject(organizationId, data).then(data=> {
                    if (data) {
                        this.linkToChange("/iam/project");
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
        this.linkToChange("/iam/project");
    };
    getNewProjectPage = () => {
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
                <PageHeader title={HAP.languageChange("project.create")} backPath="/iam/project"/>
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
                                    message: HAP.getMessage('该字段是必输的', 'required')
                                }],
                            })(
                                <Input size="default" placeholder={HAP.getMessage("项目名称", 'Project Name')}/>
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
        return this.getNewProjectPage();
    };

}

export default Form.create({})(withRouter(CreateProject));