import React, {Component} from 'react';
import {Table, Modal, Button, Icon, Tabs, Form, Input, Row, Col, Card, Tooltip, Tag, message} from 'antd';
import Remove from '../Remove';
import {observer, inject} from 'mobx-react';
import labelStore from '../../stores/organization/adminOrganization/LabelStore';

const TabPane = Tabs.TabPane;

const styles = {
  v1: {
    color: '#3AB8F6'
  },
  v2: {
    fontSize: '15px',
    marginBottom: '20px',
    marginLeft: '10px',
  }
};

@observer
class Label extends Component {

  constructor(props) {
    super(props);
    this.state = {
      submitting: false,
    }
  }

  handleSubmit = () => {
    const {AdminLabelStore} = this.props;
    let selectedRows = AdminLabelStore.getSelectRows;
    let labelValue = this.refs.labelValue.refs.input.value;
    if (labelValue) {

      this.setState({
        submitting: true, mess: undefined
      });
      var success = 0;
      let l = selectedRows.length;
      selectedRows.map((item) => {
        let label = {
          "value": labelValue,
          "target": item.id
        };
        AdminLabelStore.createLabel(label).then(data => {
          if (data) {
            //success++;
            //if (success === l) {
              this.refs.labelValue.refs.input.value = "";
              this.setState({
                submitting: false,
              });
           // }
          }
        }).catch(error => {
          //console.log(item.name + HAP.getMessage("已存在标签", "already exist label") + label.value)
          message.error(item.name + HAP.getMessage("已存在标签", "already exist label") + label.value, 0.11);
         // success++;
          //if (success === l) {
            //this.refs.labelValue.refs.input.value = "";
            this.setState({
              submitting: false,
            });
         // }
        });
      });
    } else {
      this.setState({mess: "值是必须的"})
    }
  };

  handleClose = () => {
    const {AdminLabelStore} = this.props;
    this.props.parent.refs.pageContent.style.width = "96%";
    AdminLabelStore.changeLabelShow(false);
    //AdminLabelStore.setSelectRows([]);
  };
  handleChange = ()=> {
    let value = this.refs.labelValue.refs.input.value;
    ;
    if (value) {
      this.setState({mess: undefined})
    } else {
      this.setState({mess: "值是必须的"})
    }

  }

  render() {
    const {AdminLabelStore} = this.props;
    let selectedRows = AdminLabelStore.getSelectRows;
    let span = [], labelCounter = 0;
    let cards = [];
    if (selectedRows) {
      labelCounter = selectedRows.length;
      selectedRows.map((item, index) => {
        span.push(<Tag key={index} style={{cursor: 'default'}}>{item.name}</Tag>);
        cards.push(
          <div style={{marginBottom: '5px'}} key={index}>
            <Card title={item.name} bodyStyle={{padding: 0}} key={item.id}>
              <LabelTable id={item.id} key={item.id} organizationStore={AdminLabelStore}/>
            </Card>
          </div>
        );
      });
    }
    const operations = <a onClick={this.handleClose.bind(this)} style={{marginRight: '5px'}}><Icon type="close"/></a>;

    return (
      <div style={{height: '100%'}}>
        <Tabs defaultActiveKey="1" tabBarExtraContent={operations}>
          <TabPane tab={HAP.languageChange("adminOrg.label")} key="1">
            <p
              style={styles.v1}>{HAP.languageChange("adminOrg.selected")}{labelCounter}{HAP.languageChange("adminOrg.resource")}:</p>
            <span style={styles.v2}>{span}</span>
            <br/>
            <div style={{
              padding: '5px',
              display: labelCounter == 0 ? 'none' : 'block',
              overflowY: 'auto',
              height: '450px'
            }}>
              <Card title={HAP.languageChange("adminOrg.addLabel")} style={{margin: '8px 0', padding: 0}}
                    bodyStyle={{padding: '10px 0'}}>
                <Form layout="inline">
                  <Row>
                    <Col span="4" offset={1}>
                      <label htmlFor=""
                             className="ant-form-item-required">{HAP.languageChange("adminOrg.label")}</label>
                    </Col>
                    <Col span="12" offset={0}>
                      <Input ref="labelValue" prefix={<Icon type="file-text" style={{fontSize: 10}}/>}
                             placeholder={HAP.getMessage("值", "value")} onChange={() => {
                        this.handleChange()
                      }}/>
                      <span style={{
                        color: 'red',
                        display: this.state.mess ? "inline-block" : "none"
                      }}>{this.state.mess ? this.state.mess : ""}</span>
                    </Col>
                    <Col span="4" offset={1}>
                      <Button
                        type="primary"
                        onClick={this.handleSubmit}
                      >
                        {HAP.languageChange("adminOrg.add")}
                      </Button>
                    </Col>
                  </Row>

                </Form>
              </Card>
              {cards}
            </div>
          </TabPane>

        </Tabs>
      </div>
    )
  }
}

class LabelTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      open: false,
      dataSource: [],
      isLoading: true,
    };
    this.loadData = this.loadData.bind(this);
  }

  componentDidMount() {
    this.setState({
      isLoading: true,
    });
    this.loadData();
  }

  componentWillReceiveProps() {
    this.loadData();
  }

  loadData = () => {
    const {id, organizationStore} = this.props;
    organizationStore.selectLabelById(id).then(data => {
      if (data) {
        this.setState({
          dataSource: data,
          isLoading: false,
        });
      }
    }).catch(error => {
      console.error(HAP.getMessage("部署不存在", "deployment is not exist"))
    })
  };

  handleOpen = (id) => {
    this.setState({
      open: true,
      id: id
    });
  };

  handleClose = (event) => {
    this.setState({open: false});
  };

  handleDelete = (event) => {
    const {id} = this.state;
    const {organizationStore} = this.props;
    this.setState({
      open: false
    });

    organizationStore.deleteLabelById(id).then(() => {
      this.loadData();
      message.success(HAP.getMessage("删除成功", "Success!"));
    }).catch(() => {
      message.error(HAP.getMessage("删除失败", "Failed!"))
    });
  };

  render() {
    const {dataSource} = this.state;
    const columns = [
      {
        title: HAP.languageChange("adminOrg.label"),
        dataIndex: "value",
        key: 'value'
      },
      {
        title: <div style={{textAlign: "center"}}>{HAP.languageChange("operation")}</div>,
        key: "action",
        render: (text, record) => (
          <div style={{textAlign: 'center'}}>
            <Tooltip title={HAP.languageChange("delete")} placement="bottom" getTooltipContainer={(that) => that}>
              <a className="operateIcon small-tooltip" onClick={this.handleOpen.bind(this, record.id)}>
                <Icon type="delete"/>
              </a>
            </Tooltip>
          </div>
        )
      },
    ];

    return (
      <div>
        <Remove open={this.state.open} handleCancel={this.handleClose} handleConfirm={this.handleDelete}/>
        <div style={{margin: '1px'}}>
          <Table dataSource={dataSource} columns={columns} rowKey="id"
                 pagination={false} size="small" loading={this.state.isLoading}/>
        </div>
      </div>
    );
  }
}

export default Form.create()(Label);
