/**
 * Created by cheon on 6/26/17.
 */
import React, {Component} from 'react';
import {Button, Spin, Row, Col, Form, Input, message} from 'antd';
import {withRouter} from 'react-router-dom';
import PageHeader, {PageHeadStyle} from '../../../components/PageHeader';
import {observer, inject} from 'mobx-react'

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

@inject("AppState")
@observer
class Organization extends Component{
    constructor(props) {
        super(props);
        this.loadOrganization = this.loadOrganization.bind(this);
        this.state = {
            visible: false,
            isSubmit: false,
            organization: '',
            organizationId: this.props.AppState.currentMenuType.id,
        };
    };

    componentDidMount(){
        this.loadOrganization(this.state.organizationId)
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({ isSubmit: true, });
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let org={
                    ...this.props.OrganizationStore.organization,
                    objectVersionNumber: this.props.OrganizationStore.organization.objectVersionNumber
                };
                if(org.name === values.name){
                    message.warn(HAP.getMessage("名字相同","Same Name"));
                    this.setState({
                        isSubmit: false
                    });
                    return
                }
                org.name=values.name;
                this.props.OrganizationStore.updateOrganization(this.state.organizationId, org);
                message.success(HAP.getMessage("修改成功", "sucess"));
            }else{
                message.error("修改失败", "failed");
            }
        })
        this.setState({isSubmit: false});
    };

    loadOrganization = (organizationId) => {
        this.props.OrganizationStore.loadOrganization(organizationId);
        this.setState({
            isSubmit: false
        })
    };

    render(){
        const loadingBar = (
        <div style={{display: 'inherit', margin: '200px auto', textAlign: "center"}}>
            <Spin/>
        </div>
        );
        const { getFieldDecorator } = this.props.form;
        return(
            <div>
                <PageHeader title={HAP.languageChange('organization.title')}>
                    <Button className="header-btn" ghost={true} style={PageHeadStyle.leftBtn} icon="reload" onClick={()=>this.loadOrganization(this.state.organizationId)}>{HAP.languageChange('flush')}</Button>
                </PageHeader>
                {this.props.OrganizationStore.getIsLoading? loadingBar : (
                    <div className="mainContent">
                        <Form
                            onSubmit={this.handleSubmit}
                        >
                            <Form.Item
                                {...formItemLayout}
                                required
                                label={HAP.languageChange('organization.id')}
                                hasFeedback>
                                {getFieldDecorator('id', {
                                    rules: [{ required: true, message: HAP.languageChange('organization.idTip') }],
                                    initialValue: this.props.OrganizationStore.getOrganization ? this.props.OrganizationStore.organization.id : "",
                                })(
                                    <Input size="default" disabled={true} />
                                )}
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                required
                                label={HAP.languageChange('organization.name')}
                                hasFeedback>
                                {getFieldDecorator('name', {
                                    rules: [{ required: true, whitespace: true, message: HAP.languageChange('organization.nameTip') }],
                                    initialValue: this.props.OrganizationStore.getOrganization ? this.props.OrganizationStore.organization.name : "",
                                })(
                                    <Input size="default" placeholder={HAP.languageChange("organization.name")} />
                                )}
                            </Form.Item>

                            <Form.Item
                                wrapperCol={{ offset: 3 }}>
                                <Row>
                                    <Col span={2}>
                                        <Button size="default" loading={this.state.isSubmit} type="primary" htmlType="submit" className="login-form-button">
                                            {HAP.languageChange("form.update")}
                                        </Button>
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Form>
                   </div>
                )}
            </div>
        )
    }
}
export default Form.create({})(withRouter(Organization));
