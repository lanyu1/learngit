/**
 * Created by jaywoods on 2017/7/4.
 */
import React, {Component} from 'react';
import PageHeader, {PageHeadStyle} from '../../../components/PageHeader';
import {Form, Input, Button, Switch, InputNumber, Select, Row, Col, message} from 'antd';
import {withRouter} from 'react-router-dom';
import {observer, inject} from 'mobx-react';
import 'codemirror/mode/yaml/yaml';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/lib/codemirror.css';
import '../../../assets/css/Codemirror.less';
import CodeMirror from '../../../components/Codemirror';
import yaml from 'js-yaml';


@inject("AppState")
@observer
class EditDeploymentVersion extends Component {
  constructor(props) {
    super(props);
    this.handleConfigFile = this.handleConfigFile.bind(this);
    this.handleDeployFile = this.handleDeployFile.bind(this);
    this.linkToChange = this.linkToChange.bind(this);
    this.state = {
      submitting: false,
      windowWidth: document.body.clientWidth - 224,
      deploymentId: this.props.match.params.deploymentId,
      versionId: this.props.match.params.versionId,
      version: '',
      objectVersionNumber: '',
      config: '',
      deploy: '',
      configError: '',
      deployError: '',
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleScroll.bind(this));
    const {deploymentId, versionId} = this.state;
    const {AppState, EditVersionStore} = this.props;
    let organizationId = AppState.menuType.id;
    EditVersionStore.getVersionById(organizationId, deploymentId, versionId).then(data => {
      if (data) {
        let version = data.version;
        let config = data.config;
        let deploy = data.deploy;
        let versionName = data.versionName;
        let objectVersionNumber = data.objectVersionNumber;
        this.refs.version.refs.input.value = version || '';
        this.refs.versionName.refs.input.value = versionName || '';
        this.setState({
          version: version,
          config: config,
          deploy: deploy,
          objectVersionNumber: objectVersionNumber,
        });
      }
    })
  }


  componentWillUnmount() {
    window.removeEventListener('resize', this.handleScroll.bind(this));
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

  handleCancel = () => {
    this.linkToChange(`/iam/deployment/${this.state.deploymentId}/version`)
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

  handleSubmit() {
    let version = this.refs.version.refs.input.value;
    let versionName = this.refs.versionName.refs.input.value;

    if (!versionName) {
      this.setState({
        versionNameError: HAP.getMessage("请输入版本名称", "Please enter the version name"),
      });
      return;
    }

    if (!this.state.config) {
      this.setState({
        configError: HAP.getMessage("配置不能为空", "config is required"),
      });
      return;
    }

    if (!this.state.deploy) {
      this.setState({
        deployError: HAP.getMessage("部署内容不能为空", "config is required"),
      });
      return;
    }

    if (version && this.state.config && this.state.deploy) {
      const {AppState, EditVersionStore} = this.props;
      let organizationId = AppState.menuType.id;
      let deploymentId = this.state.deploymentId;
      let versionId = this.state.versionId;

      let data = {
        "id": versionId,
        "version": this.state.version,
        "name": versionName,
        "config": this.state.config.toString(),
        "deploy": this.state.deploy.toString(),
        "deploymentId": deploymentId,
        "objectVersionNumber": this.state.objectVersionNumber
      };
      this.setState({
        submitting: true,
      });
      EditVersionStore.updateDeploymentVersion(organizationId, deploymentId, versionId, data).then(res => {
        if (res) {
          this.setState({
            submitting: false,
          });
          message.success(HAP.getMessage("修改成功", "Success"));
          this.linkToChange(`/iam/deployment/${deploymentId}/version`);
        }
      }).catch(error => {
        let result = error.response.data;
        message.error(result.message);
        this.setState({
          submitting: false,
        });
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


  render() {
    const options = {
      lineNumbers: true,
      readOnly: false,
      mode: "yaml",
      fixedGutter: false,
      coverGutterNextToScrollbar: false
    };

    return (
      <div>
        <PageHeader title={HAP.languageChange("deployment.version.edit")}
                    backPath={`/iam/deployment/${this.state.deploymentId}/version`}/>

        <div style={{marginLeft: '5px', marginTop: '10px'}}>
          <Row>
            <Col span={12}>
              <Row style={{marginBottom: '5px'}}>
                <Col span={4} offset={-1}>
                  <span style={{fontSize: '14px', marginLeft: "10px"}}>{HAP.getMessage("版本名称", "Name")}:</span>
                </Col>
                <Col span={10} style={{marginLeft: '-6px'}}>
                  <Input placeholder={HAP.getMessage("请输入版本名称", "Name")} ref="versionName"
                         readOnly={true}/>
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
                  <Input placeholder={HAP.getMessage("请输入版本号", "version")} ref="version" readOnly={true}/>
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
          <p style={{color: 'red', fontSize: '12px', marginLeft: '5px', height: '20px'}}>{this.state.configError}</p>
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
          <p style={{color: 'red', fontSize: '12px', marginLeft: '5px', height: '20px'}}>{this.state.deployError}</p>
          <CodeMirror ref="deploy" value={this.state.deploy} onChange={this.updateDeploy} options={options}
                      autoFocus={false}/>
        </div>

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

export default withRouter(EditDeploymentVersion);
