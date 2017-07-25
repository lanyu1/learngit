/**
 * Created by hand on 2017/7/4.
 */
import React, {Component} from 'react'
import PageHeader, {PageHeadStyle} from '../../../components/PageHeader';
import {Button, Card, Row, Col, Icon, Spin, Pagination, Tooltip, Select, Form, Input, Collapse, message} from 'antd';
import {observer, inject} from 'mobx-react'
import {withRouter} from 'react-router-dom';
import '../../../assets/css/main.less';
import 'codemirror/mode/yaml/yaml';
import 'codemirror/lib/codemirror.css';
import '../../../assets/css/Codemirror.less';

const pageStyle = {
  nameDes: {
    padding: "20px 30px 10px 10px",
  },
  instanceName: {
    fontSize: 20,
  },
  deploymentName: {
    fontSize: 14,
    color: "#707070"
  }
};

@inject("AppState")
@observer
class InstanceHistory extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isSubmit: false,
      id: this.props.match.params.id,
      instanceId: this.props.match.params.instanceId,
      historyInfo: ''
    };
  };

  componentDidMount() {
    const {DeploymentInstanceStore, AppState} = this.props;
    let projectId = AppState.menuType.id;
    DeploymentInstanceStore.getHistoryById(projectId, this.state.instanceId, this.state.id).then(data => {
      this.setState({
        historyInfo: data
      })
    });
  }

  handleRollBack = () => {
    const {DeploymentInstanceStore, AppState} = this.props;
    let projectId = AppState.menuType.id;
    DeploymentInstanceStore.RollBackById(projectId, this.state.instanceId, this.state.id).then(data => {
      message.success(HAP.getMessage("回滚成功！", "Roll back successfully!"));
    }).catch(error => {
      message.error(HAP.getMessage("回滚失败！", "Roll back failed!"));
    });

    this.linkToChange(`/iam/instance/detail/${this.state.instanceId}`);
  };

  linkToChange = (url) => {
    const {history} = this.props;
    history.push(url);
  };

  render() {
    const {DeploymentInstanceStore} = this.props;
    const {historyInfo} = this.state;

    let hr = {
      backgroundColor: 'rgb(231, 231, 239)',
      height: 1,
      border: 'none',
      marginBottom: 10,
    };

    let item = [];
    if (historyInfo) {
      let historyVariables = JSON.parse(historyInfo.variables);
      historyVariables.map((value, index) => {
        item.push(<Col key={index}>
            <div className="ant-col-10" style={{marginBottom: 10}}>
              <div className="ant-row ant-form-item test">
                <div className="ant-form-item-label ant-col-xs-22 ant-col-sm-22">
                  <label className="ant-form-item-label" title=""><span>{value.display}</span></label>
                </div>
                <div className="ant-form-item-control-wrapper ant-col-xs-22 ant-col-sm-22">
                  <div className="ant-form-item-control ">
                    <input type="text" value={value.value} id="name" className="ant-input" readOnly/>
                    <span style={{color: "rgb(3, 169, 244)", fontSize: 12}}>{value.description}</span>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        );
      })
    }

    return (
      <div>
        <PageHeader title={HAP.languageChange("deployment.recordDetail")}
                    backPath={`/iam/instance/detail/${this.state.instanceId}`}>
        </PageHeader>
        <div>
          <div style={pageStyle.nameDes}>
            <span style={pageStyle.instanceName}>{historyInfo.instanceName} - {historyInfo.name}</span>
            <Button style={{float: "right"}} onClick={this.handleRollBack}>{HAP.languageChange("deployment.rollBack")}</Button>
          </div>
          <div style={{marginLeft: 10, marginBottom: 10}}>
            <span>{HAP.languageChange("deployment.instanceVersion")}：</span><span
            style={pageStyle.deploymentName}>{historyInfo.versionName}</span></div>
          <div style={{marginLeft: 10, marginBottom: 10}}><span>{HAP.languageChange("deployment.currentStatus")}：</span><span
            style={pageStyle.deploymentName}>{historyInfo.status}</span></div>
          <hr style={hr}/>
          <div style={{padding: 10}}>
            <p style={{marginBottom: 10}}>
              {HAP.getMessage("当前实例历史记录状态变量", "Currently deployed instance state variables")}
            </p>
            <Row>
              {item}
            </Row>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(InstanceHistory);

