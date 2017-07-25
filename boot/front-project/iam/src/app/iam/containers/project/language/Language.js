/**
 * Created by song on 2017/6/27.
 */

import React, { Component } from 'react'
import PageHeader,{PageHeadStyle} from '../../../components/PageHeader';
import { Table, Icon, Button, Spin, Pagination, Tooltip } from 'antd';
import {observer, inject} from 'mobx-react'
import {withRouter} from 'react-router-dom';

@observer
class Language extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
    };
  };

  loadLanguages = (page) => {
    const { LanguageStore } = this.props;
    this.setState({
      page: page,
    });
    LanguageStore.loadLanguage(page, 10);
  };

  linkToChange = (url) => {
    const {history} = this.props;
    history.push(url);
  };

  onEdit = (code) => {
    this.linkToChange(`/iam/language/edit/${code}`);
  };

  componentDidMount = () => {
    this.loadLanguages(this.state.page);
  };

  render() {
    const columns = [{
      title: HAP.languageChange("language.code"),
      dataIndex: "code",
      key: "code"
    }, {
      title: HAP.languageChange("language.name"),
      dataIndex: "name",
      key: "name",
    },{
      title: HAP.languageChange("language.describe"),
      dataIndex: "description",
      key: "description",
    }, {
      title: <div style={{ textAlign: "center" }}>
        {HAP.languageChange("operation")}
      </div>,
      className: "operateIcons",
      key: 'action',
      render: (text, record) => (
        <div ref="opeIcon">
          <Tooltip title={HAP.languageChange("edit")} placement="bottom" getTooltipContainer={(that) => that}>
            <a className="operateIcon small-tooltip" onClick={this.onEdit.bind(this, record.code)}>
              <Icon type="edit" />
            </a>
          </Tooltip>
        </div>
      ),
    }];

    const { LanguageStore } = this.props;
    let totalElement = LanguageStore ? LanguageStore.getTotalSize : 1;
    let data = LanguageStore ? LanguageStore.getLanguageData : [];

    const loadingBar = (
      <div style={{ display: 'inherit', margin: '200px auto', textAlign: "center" }}>
        <Spin />
      </div>
    );

    return (
      <div>
        <PageHeader title={HAP.languageChange("language.manage")}>
          <Button className="header-btn" ghost={true} onClick={() => { this.loadLanguages(this.state.page) }} style={PageHeadStyle.leftBtn} icon="reload" >{HAP.languageChange("flush")}</Button>
        </PageHeader>

        <div style={{ margin: 20, }}>
          {LanguageStore.getIsLoading ? loadingBar : (
            <Table columns={columns} dataSource={data} pagination={false} rowKey={(record) => { return record.code }} />
          )}
          <div style={{ marginTop: 10, float: 'right', display: this.state.isLoading ? 'none' : 'block' }}>
            <Pagination current={this.state.page + 1} pageSize={10} onChange={page => this.loadLanguages(page - 1)} total={totalElement} />
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Language);
