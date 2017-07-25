/**
 * Created by jaywoods on 2017/7/6.
 */
import React, {Component} from 'react';
import {Table, Modal, Button, Icon, Tabs, Form, Input, Row, Col, Card, message, Tag} from 'antd';
import {observer, inject} from 'mobx-react';
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
class ServiceDeployment extends Component {
  constructor(props) {
    super(props);
  }


  handleClose = () => {
    const {labelStore} = this.props;
    labelStore.changeShow(false);
  };

  render() {
    const {labelStore} = this.props;
    const selectedRows = labelStore.getRows;
    let counter = 0;
    let cards = [], span = [], deploys = [];
    if (selectedRows) {
      counter = selectedRows.length;
      selectedRows.map((item, index) => {
        span.push(<Tag key={index} style={{cursor: 'default'}}>{item.value}</Tag>);
        cards.push(<div style={{marginBottom: '5px'}} key={index}>
          <Card title={item.value} bodyStyle={{padding: 0}} key={item.id}>
            <ServiceTable key={item.id} id={item.id} value={item.value} labelStore={labelStore}/>
          </Card>
        </div>);
      });
    }
    const operations = <a onClick={this.handleClose.bind(this)} style={{marginRight: '5px'}}><Icon type="close"/></a>;
    return (
      <div style={{height: '100%'}}>
        <Tabs defaultActiveKey="1" tabBarExtraContent={operations}>
          <TabPane tab={HAP.getMessage('组织', 'Organization')} key="1">
            <p
              style={styles.v1}>{HAP.languageChange("adminOrg.selected")}{counter}{HAP.languageChange("adminOrg.label")}:</p>
            <span style={styles.v2}>{span}</span>
            <br/>
            <div style={{padding: '5px', display: counter == 0 ? 'none' : 'block', overflowY: 'auto', height: '450px'}}>
              {cards}
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

class ServiceTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      isLoading: true,
    };
    this.loadData = this.loadData.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  getColumns = () => ([
    {
      title: HAP.languageChange("organization.id"),
      dataIndex: "id",
      key: 'id'
    },
    {
      title: HAP.languageChange("organization.name"),
      dataIndex: "name",
      key: 'name'
    }
  ]);

  loadData = () => {
    const {id, value, labelStore} = this.props;
    this.setState({
      isLoading: true,
    });
    labelStore.getOrgByLabel([value]).then(data => {
      if (data) {
        this.setState({
          dataSource: data,
          isLoading: false,
        });
      }
    }).catch(error => {
      message.error(HAP.getMessage("获取组织失败！", "get organization failed!"));
    });

  };


  render() {
    const {dataSource} = this.state;
    return (
      <div style={{margin: '1px'}}>
        <Table dataSource={dataSource} columns={this.getColumns()} rowKey="id"
               pagination={false} size="small" loading={this.state.isLoading}/>
      </div>
    );
  }
}

class DeploymentTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    this.setState({
      isLoading: false,
    });
  }

  loadData = () => {
    this.setState({
      isLoading: true,
    });
    const {id, value, labelStore} = this.props;

    labelStore.getDeploymentByLabel([value]).then(data=> {
      if (data) {
        this.setState({
          dataSource: data,
          isLoading: false,
        });
      }
    }).cache(()=> {
      console.error(HAP.getMessage("获取部署信息失败", "loading deployment failed!"))
    })
  };

  render() {
    const {dataSource} = this.state;
    return (
      <div style={{margin: '1px'}}>
        <Table dataSource={dataSource} columns={this.getColumns()} rowKey="id"
               pagination={false} size="small" loading={this.state.isLoading}/>
      </div>
    );
  }
}

export default ServiceDeployment;
