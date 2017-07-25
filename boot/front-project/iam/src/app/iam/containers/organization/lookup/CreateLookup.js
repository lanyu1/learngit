/**
 * Created by cheon on 6/28/17.
 */

import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {observer, inject } from 'mobx-react';
import {Form, Icon, Input, Button, Checkbox, Switch, Select, Row, Col, Modal, Table, Tooltip, message} from 'antd';
import Remove from '../../../components/Remove';
import PageHeader, {PageHeadStyle} from '../../../components/PageHeader';

@inject("AppState")
@observer
class CreateLookup extends Component {
    constructor(props){
        super(props);
        this.state = {
            submiting: false,
            loading: false,
            visible: false,
            datas: [],
            lookupId: 1,
            checkCode: "",
            key: 1,
            organizationId: this.props.AppState.currentMenuType.id,
        }
    }

    componentDidMount(){};

    linkToChange = (url) => {
      const { history } = this.props;
      history.push(url);
    };

    handleOpen = (id) => {
        //index用與刪除數據
        this.setState({open: true, index: id});

    };

    handleClose = (e) => {
        this.setState({open: false});
    };

    handleCancel = () => {
        this.setState({visible: false, checkCode: undefined, editId: undefined});
    };

    handleOk = (e) => {
        let isDuplicate = false;
        if (this.state.editId){
            let self = this.state.datas.filter((data)=>{return data.lookupValueId===this.state.editId});
            isDuplicate = self[0].code===this.refs.code.refs.input.value ? false : this.state.datas.filter((data)=>{return data.code===this.refs.code.refs.input.value}).length!==0
        }else{
            isDuplicate = this.state.datas.filter((data)=>{return data.code===this.refs.code.refs.input.value}).length!==0
        }
        let values = {
            code: this.refs.code.refs.input.value,
            description: this.refs.description.refs.input.value,
            orderValue: this.refs.orderValue.refs.input.value,
            lookupValueId: ''
        };
        if(values.description===""){
            delete values.description;
        }
        if (values.code && !isDuplicate) {
            this.setState({loading: true});
            //lookupValueId用與刪除數據的id
            values.lookupValueId = this.state.lookupId;
            let datas = this.state.datas;
            //是否是编辑
            if (this.state.editId) {
                for (let i = 0; i < datas.length; i++) {
                    if (datas[i].lookupValueId === this.state.editId) {
                        datas[i] = values;
                        this.setState({editId: undefined})
                    }
                }
            } else {
                //新增
                datas.push(values)
            }
            //lookupValueId
            let lookupId = this.state.lookupId + 1;
            this.setState({datas: datas, lookupId: lookupId});
            this.setState({loading: false});
            this.setState({visible: false});
        } else {
            if(isDuplicate){
                this.setState({checkCode: HAP.getMessage("代码值必须唯一", "Code should be unique")})
            }else{
                this.setState({checkCode: HAP.getMessage("这是必输字段", "The field is required")})
            }
        }
    };

    handleDelete = (event) => {
        this.setState({open: false});
        let len = this.state.datas.length;
        let datas = this.state.datas;
        for (let i = 0; i < len; i++) {
            if (datas[i].lookupValueId === this.state.index) {
                datas.splice(i, 1)
            }
        }
        this.setState({datas: datas})
    };

    checkCode = (e) => {
        this.setState({checkCode: undefined});
        let isDuplicate = false;
        if (this.state.editId){
            let self = this.state.datas.filter((data)=>{return data.lookupValueId===this.state.editId})
            isDuplicate = self[0].code===e.target.value ? false : this.state.datas.filter((data)=>{return data.code===e.target.value}).length!==0
        }else{
            isDuplicate = this.state.datas.filter((data)=>{return data.code===e.target.value}).length!==0
        }
        if (e.target.value === "") {
            e.target.parentElement.className = " ant-form-item-control has-feedback has-error";
            this.setState({checkCode: HAP.getMessage("这是必输字段", "The field is required")})
        } 
        else if(isDuplicate){
            e.target.parentElement.className = " ant-form-item-control has-feedback has-error";
            this.setState({checkCode: HAP.getMessage("代码值必须唯一", "Code should be unique")})
        }
        else {
            this.setState({checkCode: undefined});
        }
    };


    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let data = {
                    code: values.typeCode,
                    description: values.desc,
                    values: this.state.datas
                };
                if(data.description===""){
                    delete data.description;
                }
                this.setState({submiting: true});
                this.props.LookupStore.createLookup(this.state.organizationId, data).then(()=>{
                  this.linkToChange('/iam/lookup');
                  this.setState({submiting: false});
                }).catch((err)=>{
                  switch (err.response.status) {
                    case 400:
                      message.error(HAP.getMessage("代码必须唯一", "Duplicate key"));
                      break;
                    case 401:
                      message.error(HAP.getMessage("未登录", "Unauthorized"));
                      break;
                    case 403:
                      message.error(HAP.getMessage("禁止访问", "Forbidden"));
                      break;
                    case 404:
                      message.error(HAP.getMessage("未找到", "Not Found"));
                      break;
                    default:
                      message.error(HAP.getMessage("未知的错误", "error occur"));
                  }
                })
              this.setState({submiting: false});
            }
        })
    };

    handleReset = () => {
        this.linkToChange('/iam/lookup');
    };

    addClass = (e) => {
        if (e.target.value) {
            e.target.parentElement.className = "ant-form-item-control has-feedback has-success";
            this.setState({checkCode: undefined});
        } else {
            e.target.parentElement.className = "";
        }
    };

    showModal = (id) => {
        let len = this.state.datas.length;
        let datas = this.state.datas;
        if (len !== 0 && typeof id === 'number') {
            for (let i = 0; i < len; i++){
                if (datas[i].lookupValueId === id) {
                    this.setState({rowData: datas[i]});
                }
            }
            this.setState({editId: id})
        } else{
            this.setState({rowData: undefined});
        }
        this.setState({
            visible: true,
            key: this.state.key + 1
        });
    };

    render(){

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


        let codeSpan;
        if (this.state.checkCode) {
            codeSpan = <div className="ant-form-explain" style={{textAlign: 'left'}}>{this.state.checkCode}</div>
        } else {
            codeSpan = ''
        }

//{{{ define table column
        const columns = [
            {
                title: HAP.languageChange("lookup.code"),
                dataIndex: 'code',
                key: 'code'
            },
            {
                title: HAP.languageChange("lookup.description"),
                dataIndex: "description",
                key: 'description'
            },
            {
                title: HAP.languageChange("lookup.sort"),
                dataIndex: "orderValue",
                key: 'orderValue'
            },
            {
                title: <div style={{textAlign: "center"}}>{HAP.languageChange("lookup.action")}</div>,
                key: "action",
                render: (text, record) => (
                    <div style={{textAlign: 'center'}}>
                        <Tooltip title={HAP.languageChange("lookup.delete")} placement="bottom" getTooltipContainer={(that) => that}>
                            <a className="operateIcon small-tooltip" onClick={this.handleOpen.bind(this, record.lookupValueId)}>
                                <Icon type="delete"/>
                            </a>
                        </Tooltip>
                        <Tooltip title={HAP.languageChange("lookup.edit")} placement="bottom" getTooltipContainer={(that) => that}>
                            <a className="operateIcon small-tooltip" onClick={this.showModal.bind(this, record.lookupValueId)}>
                                <Icon type="edit"/>
                            </a>
                        </Tooltip>
                    </div>
                )
            }
        ];
//}}}

        return (
            <div>
                <Remove open={this.state.open} handleCancel={this.handleClose} handleConfirm={this.handleDelete.bind(this)}/>
                <PageHeader title={HAP.languageChange("lookup.createCode")} backPath="/iam/lookup"/>
                <div className="mainContent">
                    <Form onSubmit={this.handleSubmit.bind(this)}>
                        <Form.Item
                              {...formItemLayout}
                              label={HAP.languageChange("lookup.code")}
                              hasFeedback
                        >
                            {getFieldDecorator('typeCode', {
                                rules: [{
                                    required: true,
                                    message: HAP.getMessage("该字段是必输的", "The field is required"),
                                }],
                              })(
                                <Input size="default"/>
                              )
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label={HAP.languageChange("lookup.description")}
                            hasFeedback
                        >
                           {getFieldDecorator('desc', {
                               rules: [{
                                   min: 2,
                                   max: 32,
                               }]
                           })(
                               <Input size="default"/>
                           )}
                        </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                label={HAP.languageChange("lookup.codeList")}
                            >
                            {getFieldDecorator('lookupValueList')(
                                <div>
                                    <div style={{marginBottom: "10px"}}>
                                        <Button type="primary" onClick={() => {this.showModal()}}>
                                            {HAP.languageChange("lookup.add")}
                                        </Button>
                                    </div>

                                    <Modal
                                        key={this.state.key}
                                        visible={this.state.visible}
                                        title={HAP.getMessage("添加值", "Add Code")}
                                        onOk={()=>{alert("Ok")}}
                                        onCancel={this.handleCancel}
                                        footer={[
                                            <Button key="back" size="large" onClick={this.handleCancel}> {HAP.languageChange("cancel")}</Button>,
                                            <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk.bind(this)}>
                                                {HAP.languageChange("lookup.confirm")}
                                            </Button>,
                                        ]}
                                    >
                                        <div style={{textAlign: 'right'}}>
                                            <Row>
                                                <Col span={3} offset={1}>
                                                    <label htmlFor="" className="ant-form-item-required">  {HAP.languageChange("lookup.code")}</label>
                                                </Col>
                                                <Col span="12" offset={1}>
                                                <div className={this.state.rowData && this.state.rowData.code ? "ant-form-item-control has-feedback has-success" : ""}>
                                                    <Input ref="code" onBlur={this.checkCode.bind(this)} defaultValue={this.state.rowData ? this.state.rowData.code : ""} onChange={this.addClass} />
                                                    {codeSpan}
                                                </div>
                                                </Col>
                                            </Row>
                                            <br/>
                                            <Row>
                                                <Col span={3} offset={1}>
                                                    <label htmlFor="">  {HAP.languageChange("lookup.description")}</label>
                                                </Col>
                                                <Col span="12" offset={1}>
                                                    <div className={this.state.rowData && this.state.rowData.description ? "ant-form-item-control has-feedback has-success" : ""}>
                                                        <Input ref="description" defaultValue={this.state.rowData ? this.state.rowData.description : ""} onChange={this.addClass}/>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <br/>
                                            <Row>
                                                <Col span={3} offset={1}>
                                                    <label htmlFor="">  {HAP.languageChange("lookup.sort")}</label>
                                                </Col>
                                                <Col span="12" offset={1}>
                                                    <div className={this.state.rowData && this.state.rowData.orderValue ? "ant-form-item-control has-feedback has-success" : ""}>
                                                        <Input ref="orderValue" type="number" defaultValue={this.state.rowData ? this.state.rowData.orderValue : ""} onChange={this.addClass}/>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Modal>

                                    <Table dataSource={this.state.datas} columns={columns} rowKey="lookupValueId" pagination={true} size="middle"/>
                                </div>
                          )}
                        </Form.Item>
                            <Form.Item wrapperCol={{offset: 3}}>
                                <Row>
                                    <Col span={2}>
                                        <Button size="default" loading={this.state.submiting} type="primary" htmlType="submit" className="login-form-button">
                                            {HAP.languageChange("lookup.create")}
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

export default Form.create({})(withRouter(CreateLookup));

