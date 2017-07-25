/**
 * Created by hand on 2017/7/4.
 */
import React, {Component} from 'react'
import PageHeader, {PageHeadStyle} from '../../../components/PageHeader';
import {Button, Card, Row, Col, Icon, Spin, Pagination, Tooltip, Select, Form, Input, Collapse} from 'antd';
import Remove from '../../../components/Remove';
import {observer, inject} from 'mobx-react'
import {withRouter} from 'react-router-dom';
import '../../../assets/css/main.less';
import 'codemirror/mode/yaml/yaml';
import 'codemirror/lib/codemirror.css';
import '../../../assets/css/Codemirror.less';
import CodeMirror from '../../../components/Codemirror';
const FormItem = Form.Item;
const Option = Select.Option;
const Panel = Collapse.Panel;
const formItemLayout = {
  labelCol: {
    xs: {span: 22},
    sm: {span: 22},
  },
  wrapperCol: {
    xs: {span: 22},
    sm: {span: 22},
  },
};
@inject("AppState")
@observer
class DeploymentDetail extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isSubmit: false,
      id: this.props.match.params.id,
      display: '',
      devData: null,
      version: null,
      latestVersion: null,
      yamlDom: null
    };
  };

  componentDidMount() {
    this.loadDev();
  }

  loadDev = ()=> {
    const {AppState, RunDeploymentStore}=this.props;
    let organizationId=AppState.menuType.organizationId;

    RunDeploymentStore.loadVersionByDeploymentId(organizationId,this.state.id).then(data => {
      if (data.length != 0) {
        this.setState({display: true});
        this.setState({version: data});
        //取最新版本
        /* let versions = data;
         let value = versions[0].version;
         let num;
         for (var i = 0; i < versions.length; i++) {
         if (versions[i].version > value) {
         value = versions[i].version;
         num = versions[i].id;
         } else {
         num = versions[0].id
         }
         }*/
        let versionNumber = [];
        for (var i = 0; i < data.length; i++) {
          versionNumber.push(data[i].version)

        }
        let a = versionNumber.sort(this.versionCompare);
        let num = a[a.length - 1];
        let id;
        for (var j = 0; j < data.length; j++) {
          if (data[j].version == num) {
            id = data[j].id;
          }
        }
        //查json数据
        RunDeploymentStore.loadVersionByVersionId(organizationId,this.state.id, id).then(data=> {
          this.setState({latestVersion: data});
        })

      }
    });
    RunDeploymentStore.loadDeploymentById(organizationId,this.state.id).then(data => {
      this.setState({
        devData: data
      })
    })
  }

  versionCompare(v1, v2, options) {
    var lexicographical = options && options.lexicographical,
      zeroExtend = options && options.zeroExtend,
      v1parts = v1.split('.'),
      v2parts = v2.split('.');

    function isValidPart(x) {
      return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
    }

    if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
      return NaN;
    }

    if (zeroExtend) {
      while (v1parts.length < v2parts.length) v1parts.push("0");
      while (v2parts.length < v1parts.length) v2parts.push("0");
    }

    if (!lexicographical) {
      v1parts = v1parts.map(Number);
      v2parts = v2parts.map(Number);
    }

    for (var i = 0; i < v1parts.length; ++i) {
      if (v2parts.length == i) {
        return 1;
      }

      if (v1parts[i] == v2parts[i]) {
        continue;
      }
      else if (v1parts[i] > v2parts[i]) {
        return 1;
      }
      else {
        return -1;
      }
    }

    if (v1parts.length != v2parts.length) {
      return -1;
    }

    return 0;
  }

  handleVersion = (value)=> {
    const {AppState, RunDeploymentStore}=this.props;
    let organizationId=AppState.menuType.organizationId;;
    this.setState({yamlDom: ""});
    this.setState({display: true});
    if (this.refs.review.props.isActive) {
      this.refs.review.props.onItemClick();
    }
    if (value !== "") {
      this.props.form.resetFields();
      RunDeploymentStore.loadVersionByVersionId(organizationId,this.state.id, value).then(data=> {
        this.setState({latestVersion: data})
      })
    } else {
      this.setState({display: ""});
      this.setState({latestVersion: null})
    }
  };
  handleLook = ()=> {
    this.handleReview(this);
  };
  linkToChange = (url)=> {
    const {history} = this.props;
    history.push(url);
  };
  handleReview = (e) => {
    // e.preventDefault();
    //校验表单
    const {AppState, RunDeploymentStore} = this.props;
    let organizationId=AppState.menuType.organizationId;
    let version = this.state.latestVersion;
    let depId = this.state.devData.id;
    let versionId = this.state.latestVersion.id;
    this.props.form.validateFieldsAndScroll((err, data) => {
      if (!err) {
        version.parameters.map((value, index)=> {
          if (value.name == "DATABASE_SERVICE_NAME") {
            value.value = data.DATABASE_SERVICE_NAME
          } else if (value.name == "MEMORY_LIMIT") {
            value.value = data.MEMORY_LIMIT
          } else if (value.name == "MYSQL_DATABASE") {
            value.value = data.MYSQL_DATABASE
          } else if (value.name == "MYSQL_PASSWORD") {
            value.value = data.MYSQL_PASSWORD
          } else if (value.name == "MYSQL_ROOT_PASSWORD") {
            value.value = data.MYSQL_ROOT_PASSWORD
          } else if (value.name == "MYSQL_USER") {
            value.value = data.MYSQL_USER
          }
        });
        RunDeploymentStore.updateVersionByVersionId(organizationId,depId, versionId, version).then(data=> {
          this.setState({yamlDom: data.objectsYaml});
        }).catch(error=> {
        });
      }
    });
  };
  handleSubmit = (e) => {
    // e.preventDefault();
    //校验表单
    const {AppState, RunDeploymentStore} = this.props;
    let version = this.state.latestVersion;
    const proId = AppState.menuType.id;
    this.props.form.validateFieldsAndScroll((err, data) => {
      if (!err) {
        version.parameters.map((value, index)=> {
          if (value.name == "DATABASE_SERVICE_NAME") {
            value.value = data.DATABASE_SERVICE_NAME
          } else if (value.name == "MEMORY_LIMIT") {
            value.value = data.MEMORY_LIMIT
          } else if (value.name == "MYSQL_DATABASE") {
            value.value = data.MYSQL_DATABASE
          } else if (value.name == "MYSQL_PASSWORD") {
            value.value = data.MYSQL_PASSWORD
          } else if (value.name == "MYSQL_ROOT_PASSWORD") {
            value.value = data.MYSQL_ROOT_PASSWORD
          } else if (value.name == "MYSQL_USER") {
            value.value = data.MYSQL_USER
          }
        });
        RunDeploymentStore.rundeployment(proId, version).then(data=> {
          this.linkToChange("/iam/instance");
        }).catch(error=> {
        });
      }
    });
  };

  handleBack = () => {
    this.linkToChange("/iam/deployment");
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    const {RunDeploymentStore}=this.props;

    let versions = this.state.version;
    let option = [<Option key="0" value="">choose version</Option>];
    let icon;

    if (this.state.devData && this.state.devData.icon && this.state.devData.icon.indexOf(".") != -1) {
      icon = <img src={this.state.devData.icon} alt="" style={{width: 120, height: 75}}/>
    } else {
      icon = <Icon type="smile-o" style={{fontSize: 70, paddingBottom: 20, paddingLeft: 17}}/>
    }
    if (versions) {
      versions.map((value, index) => {
        option.push(
          <Option key={index} value={value.id.toString()}>{value.version + " (" + value.versionName + ") "}</Option>
        )
      })
    }
    let versionStyle = {
      //...styles.mainMenu,
      marginTop: 10,
      display: this.state.display ? 'block' : 'none'
    };
    let item = [];
    let latestVersion = this.state.latestVersion;
    if (latestVersion) {
      latestVersion.parameters.map((value, index)=> {
        if (value.generate && value.generate == "expression") {
          item.push(<Col span={11}>
              <FormItem

                {...formItemLayout}
                label={value.display}
                hasFeedback
              >
                {getFieldDecorator(value.name, {
                  initialValue: value.value,
                })(
                  <Input size="default" type="text"/>
                )}
                <span style={{color: '#03A9F4'}}>
                    {value.description}
                  </span>
              </FormItem>
            </Col>
          );
        } else {
          item.push(<Col span={11}>
              <FormItem

                {...formItemLayout}
                label={value.display}
                hasFeedback
              >
                {getFieldDecorator(value.name, {
                  rules: [{required: value.required, message: HAP.getMessage("该字段是必输的！", "name is required!")}],
                  initialValue: value.value
                })(
                  <Input size="default" type="text"/>
                )}
                <span style={{color: '#03A9F4'}}>
                    {value.description}
                  </span>
              </FormItem>
            </Col>
          );
        }
      });


    }

    return (
      <div>
        <PageHeader title={HAP.languageChange("deployment.detail")} backPath="/iam/deployment">
        </PageHeader>
        <div style={{marginLeft: 20, marginTop: 10, marginRight: 15}}>
          <div>
            <Card key={1} style={{marginBottom: 15}} bodyStyle={{padding: 18}}>
              <Row>
                <Col span={1}>
                  {icon}
                </Col>
                <Col span={20} offset={1} style={{marginLeft: 110}}>
                  <div>
                    <p style={{marginBottom: 10, fontSize: 28}}>{this.state.devData ? this.state.devData.name : ""}</p>
                    <p style={{fontSize: 15}}>
                      <b>{HAP.languageChange("deployment.category")}</b>：{this.state.devData ? this.state.devData.categoryName : ""}
                    </p>
                    <div>
                      <p style={{fontSize: 15, display: "inline-block", float: "left"}}>
                        <b>{HAP.languageChange("deployment.description")}</b>：
                      </p>


                      <Col span={20} style={{display: "inline-block"}}>
                        <span>{this.state.devData ? this.state.devData.description : ""}</span>
                      </Col>
                    </div>
                  </div>
                </Col>

              </Row>
            </Card>
          </div>
          <div style={{marginTop: 10}}>
            <Card key={1} style={{marginBottom: 15}} bodyStyle={{padding: 18}}>
              <Row>
                <Col>
                  <h4 style={{marginBottom: '15px', fontSize: 20}}>{HAP.languageChange("deployment.versionInfo")}</h4>
                  <hr style={{marginBottom: 20, backgroundColor: '#ccd1d3'}}/>
                </Col>
              </Row>
              <Row >
                <Col span={22} className="ant-form-item-required">
                  {HAP.languageChange("deployment.versionName")}：
                </Col>
                <Col span={9}>
                  <Select
                    onChange={this.handleVersion.bind(this)}
                    style={{width: '100%'}}
                    ref="version"
                    value={latestVersion ? latestVersion.version + " (" + latestVersion.versionName + " )" : ""}
                  >
                    {option}
                  </Select>
                </Col>
              </Row>
            </Card>
          </div>
          <div style={versionStyle}>
            <Card key={1} style={{marginBottom: 15}} bodyStyle={{padding: 18}}>
              <Row>
                <Col>
                  <h4 style={{marginBottom: '15px', fontSize: 20}}>{HAP.languageChange("deployment.versionConfig")}</h4>
                  <hr style={{marginBottom: 20, backgroundColor: '#ccd1d3'}}/>
                </Col>
              </Row>
              <div >
                <Form onSubmit={this.handleSubmit} className="test">
                  <Row>
                    {item}
                  </Row>
                </Form>
              </div>
            </Card>
          </div>
          <div style={versionStyle}>
            <Row>
              <Col>
                <Collapse onChange={this.handleLook}>
                  <Panel header={HAP.languageChange("deployment.preview")} key="1" ref="review">
                    <CodeMirror value={this.state.yamlDom ? this.state.yamlDom : ""} className="test"/>
                  </Panel>
                </Collapse>
              </Col>
            </Row>
          </div>
          <div style={{marginTop: 20}}>
            <Row >
              <Col span={2} offset={2} style={{display: this.state.display ? "inline" : 'none'}}>
                <Button size="default" type="primary"
                        htmlType="submit"
                        onClick={this.handleSubmit.bind(this)}
                        className="login-form-button">
                  {HAP.languageChange("deployment.launch")}
                </Button>
              </Col>
              <Col span={2} offset={this.state.display ? 0 : 2}>
                <Button size="default" htmlType="reset" onClick={this.handleBack}
                        className="login-form-button">
                  {HAP.languageChange("form.cancel")}
                </Button>
              </Col>
            </Row>
          </div>
        </div>

      </div>
    )
  }
}

export default Form.create({})(withRouter(DeploymentDetail));

