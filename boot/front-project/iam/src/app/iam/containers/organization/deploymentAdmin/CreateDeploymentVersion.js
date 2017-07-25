/**
 * Created by jaywoods on 2017/7/4.
 */

import React, {Component} from 'react';
import PageHeader, {PageHeadStyle} from '../../../components/PageHeader';
import {Form, Input, Button, Switch, InputNumber, Select, Row, Col, message} from 'antd';
import {withRouter} from 'react-router-dom';
import {observer, inject} from 'mobx-react';
import 'codemirror/mode/yaml/yaml';
import 'codemirror/lib/codemirror.css';
import '../../../assets/css/Codemirror.less';
import CodeMirror from '../../../components/Codemirror';
import yaml from 'js-yaml';


@inject("AppState")
@observer
class CreateDeploymentVersion extends Component {
  constructor(props) {
    super(props);
    this.handleConfigFile = this.handleConfigFile.bind(this);
    this.handleDeployFile = this.handleDeployFile.bind(this);
    this.linkToChange = this.linkToChange.bind(this);
    this.state = {
      submitting: false,
      windowWidth: document.body.clientWidth - 224,
      deploymentId: this.props.match.params.deploymentId,
      config: '',
      deploy: '',
      versionNameError: '',
      versionError: '',
      configError: '',
      deployError: '',
    };
  }

  componentDidMount() {
    //window.addEventListener('resize', this.handleScroll.bind(this));
  }

  componentWillUnmount() {
    // window.removeEventListener('resize', this.handleScroll.bind(this));
  }

  handleScroll = (e) => {
    this.setState({
      windowWidth: document.body.clientWidth - 224,
    });

  };

  updateConfig = (newCode) => {
    this.setState({
      config: newCode
    });
  };

  updateDeploy = (newCode) => {
    this.setState({
      deploy: newCode
    });
  };

  linkToChange = (url) => {
    const {history} = this.props;
    history.push(url);
  };

  handleSubmit() {
    let versionName = this.refs.versionName.refs.input.value;
    if (!versionName) {
      this.setState({
        versionNameError: HAP.getMessage("请输入版本名称", "Please enter the version name"),
      });
      return;
    }
    let version = this.refs.version.refs.input.value;
    if (version) {
      let reg = new RegExp(/(^[0-9]+)(\.[0-9]+){2}$/);
      if (!version.match(reg)) {
        this.setState({
          versionError: HAP.getMessage("请输入正确的版本号", "Please enter the correct version number"),
        });
        return;
      }
    } else {
      this.setState({
        versionError: HAP.getMessage("请输入版本号", "Please enter the version number"),
      });
      return;
    }

    if (!this.state.config) {
      this.setState({
        configError: HAP.getMessage("配置不能为空", "config is required"),
      });
      return;
    } else {
      this.setState({
        configError: '',
      });
    }

    if (!this.state.deploy) {
      this.setState({
        deployError: HAP.getMessage("部署内容不能为空", "config is required"),
      });
      return;
    } else {
      this.setState({
        deployError: '',
      });
    }

    if (version && this.state.config && this.state.deploy) {
      const {AppState, AdminCreateVersionStore} = this.props;
      let organizationId = AppState.menuType.id;
      let deploymentId = this.state.deploymentId;
      let data = {
        "versionName": versionName,
        "version": version,
        "config": this.state.config.toString(),
        "deploy": this.state.deploy.toString(),
        "deploymentId": deploymentId
      };
      this.setState({
        submitting: true,
      });

      AdminCreateVersionStore.createDeploymentVersion(organizationId, deploymentId, data).then(res => {
        if (res) {
          this.setState({
            submitting: false,
          });
          message.success(HAP.getMessage("添加成功", "Success"));
          this.linkToChange(`/iam/deploymentAdmin/${this.state.deploymentId}/version`);
        }
      }).catch(error => {
        let result = error.response.data;
        let message;
        try {
          message = JSON.parse(result.message);
          let tmp = JSON.stringify(message);
          let errorObj = JSON.parse(tmp);
          let configError = errorObj.configError;
          let deployError = errorObj.deploymentError;
          this.setState({
            submitting: false,
            configError: configError,
            deployError: deployError,
          });
        } catch (exception) {
          this.setState({
            submitting: false,
            versionError: result.message,
          });
        }

      });
    }

  }

  handleSelect() {
    let fileInput = document.getElementById("selectFile");
    fileInput.click();
  }

  handleConfigSelect() {
    let fileInput = document.getElementById("selectConfigFile");
    fileInput.click();
  }

  handleDeploySelect() {
    let fileInput = document.getElementById("selectDeployFile");
    fileInput.click();
  }


  handleConfigFile = () => {
    let fileInput = document.getElementById("selectConfigFile");
    var file = fileInput.files[0];
    var reader = new FileReader();
    var setValue = (value) => {
      this.updateConfig(value)
    };
    reader.onload = function (e) {
      setValue(e.target.result);
    };
    reader.readAsText(file);
    this.refs.configFilePath.refs.input.value = file.name;
  };

  handleDeployFile = () => {
    let fileInput = document.getElementById("selectDeployFile");
    var file = fileInput.files[0];
    var reader = new FileReader();
    var setValue = (value) => {
      this.updateDeploy(value)
    };
    reader.onload = function (e) {
      setValue(e.target.result);
    };
    reader.readAsText(file);
    this.refs.deployFilePath.refs.input.value = file.name;
  };

  handleCancel = () => {
    this.linkToChange(`/iam/deploymentAdmin/${this.state.deploymentId}/version`)
  };

  validateVersion = () => {
    let version = this.refs.version.refs.input.value;
    let reg = new RegExp(/(^[0-9]+)(\.[0-9]+){2}$/);
    if (version) {
      if (version.match(reg)) {
        this.setState({
          versionError: '',
        })
      } else {
        this.setState({
          versionError: HAP.getMessage("请输入正确的版本号", "Please enter the correct version number")
        })
      }
    } else {
      this.setState({
        versionError: HAP.getMessage("请输入版本号", "Please enter the version number")
      })
    }
  };

  validateVersionName = () => {
    let name = this.refs.versionName.refs.input.value;
    if (name) {
      this.setState({
        versionNameError: '',
      })
    } else {
      this.setState({
        versionNameError: HAP.getMessage("请输入版本名称", "Please enter the version name"),
      })
    }
  };

  render() {
    const options = {
      lineNumbers: true,
      readOnly: false,
      mode: "yaml",
      coverGutter: true,
      noHScroll: false,
    };

    return (
      <div>
        <PageHeader title={HAP.languageChange("deployment.version.new")}
                    backPath={`/iam/deploymentAdmin/${this.state.deploymentId}/version`}/>
        <div style={{marginLeft: '5px', marginTop: '10px'}}>
          <Row>
            <Col span={12}>
              <Row style={{marginBottom: '5px'}}>
                <Col span={4} offset={-1}>
                  <span style={{fontSize: '14px', marginLeft: "10px"}}>{HAP.getMessage("版本名称", "Name")}:</span>
                </Col>
                <Col span={10} style={{marginLeft: '-6px'}}>
                  <Input placeholder={HAP.getMessage("请输入版本名称", "Name")} ref="versionName"
                         onChange={this.validateVersionName}/>
                </Col>
                <Col span={6} style={{marginLeft: '5px'}}>
                  <p style={{color: 'red', fontSize: '12px', marginTop: '2px'}}>{this.state.versionNameError}</p>
                </Col>
              </Row>
            </Col>
            <Col span={12}>
              <Row style={{marginBottom: '5px'}}>
                <Col span={4} offset={-1}>
                  <span style={{fontSize: '14px', marginLeft: "10px"}}>{HAP.getMessage("版本号", "Version")}:</span>
                </Col>
                <Col span={10} style={{marginLeft: '-6px'}}>
                  <Input placeholder={HAP.getMessage("请输入版本号", "version")} ref="version"
                         onChange={this.validateVersion}/>
                </Col>
                <Col span={6} style={{marginLeft: '5px'}}>
                  <p style={{color: 'red', fontSize: '12px', marginTop: '2px'}}>{this.state.versionError}</p>
                </Col>
              </Row>
            </Col>
          </Row>


        </div>
        <div style={{width: this.state.windowWidth + 'px'}}>
          <div style={{marginLeft: '5px', marginTop: '5px'}}>
            <Row>
              <Col span={2}>
                <span style={{fontSize: '14px'}}>{HAP.getMessage("配置文件", "config")}:</span>
              </Col>

              <Col span={20} style={{marginLeft: '-5px'}}>
                <Input.Group>
                  <Input type="file" id="selectConfigFile" style={{display: "none"}} onChange={this.handleConfigFile}/>
                  <Input ref="configFilePath" placeholder={HAP.getMessage("请选择..", "Select..")} readOnly={true}/>
                </Input.Group>
              </Col>
              <Col span={2}>
                <Input.Group>
                  <Input type="button" onClick={this.handleConfigSelect} value={HAP.getMessage("浏览", "Choose")}
                         style={{cursor: "pointer"}}/>
                </Input.Group>
              </Col>
            </Row>
          </div>
          <div>
            <p style={{
              color: 'red',
              fontSize: '12px',
              marginLeft: '5px',
              minHeight: '20px'
            }}>{this.state.configError}</p>
          </div>
          <CodeMirror ref="config" value={this.state.config} onChange={this.updateConfig} options={options}
                      autoFocus={false}/>
        </div>

        <div style={{width: this.state.windowWidth + 'px'}}>
          <div style={{marginLeft: '5px', marginTop: '30px'}}>
            <Row>
              <Col span={2}>
                <span style={{fontSize: '14px'}}>{HAP.getMessage("部署文件", "deploy")}:</span>
              </Col>
              <Col span={20} style={{marginLeft: '-5px'}}>
                <Input.Group>
                  <Input type="file" id="selectDeployFile" style={{display: "none"}} onChange={this.handleDeployFile}/>
                  <Input ref="deployFilePath" placeholder={HAP.getMessage("请选择..", "Select..")} readOnly={true}/>
                </Input.Group>
              </Col>

              <Col span={2}>
                <Input.Group>
                  <Input type="button" onClick={this.handleDeploySelect} value={HAP.getMessage("浏览", "Choose")}
                         style={{cursor: "pointer"}}/>
                </Input.Group>
              </Col>
            </Row>
          </div>
          <div>
            <p style={{
              color: 'red',
              fontSize: '12px',
              marginLeft: '5px',
              minHeight: '20px'
            }}>{this.state.deployError}</p>
          </div>
          <CodeMirror ref="deploy" value={this.state.deploy} onChange={this.updateDeploy} options={options}
                      autoFocus={false}/>

        </div>

        <p style={{color: 'red', fontSize: '12px', marginLeft: '5px', height: '40px'}}>{this.state.Error || ''}</p>


        <Row style={{margin: '10px 0 0 5px'}}>
          <Col span={2} offset={0} style={{marginLeft: '5px'}}>
            <Button onClick={this.handleSubmit.bind(this)} type="primary"
                    loading={this.state.submitting}>{HAP.languageChange("save")}</Button>
          </Col>
          <Col span={2} offset={0}>
            <Button onClick={this.handleCancel}>{HAP.languageChange("cancel")}</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withRouter(CreateDeploymentVersion);
