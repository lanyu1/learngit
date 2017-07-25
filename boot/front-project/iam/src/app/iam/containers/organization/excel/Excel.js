/**
 * Created by Lty on 6/27
 */

import React, {Component} from 'react';
import {Upload, Icon, message, Card, Col, Row} from 'antd';
import PageHeader, { PageHeadStyle } from '../../../components/PageHeader';
import {withRouter} from 'react-router-dom';
import { observer, inject } from 'mobx-react';

const Dragger = Upload.Dragger;
const props = {
  name: 'file',
  multiple: false,
  showUploadList: false,
  action: '//jsonplaceholder.typicode.com/posts/',
  onChange(info) {
    const status = info.file.status;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    else if (status === 'uploading') {
      message.loading(`${info.file.name} is uploading...`);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

@inject("AppState")
@observer
class Excel extends Component{

  downloadExcel=()=>{
    const {dispatch, ExcelStore} = this.props;
    ExcelStore.loadExcel();
  };

  render(){
    return(
      <div style={PageHeadStyle.container}>
          <div style={PageHeadStyle.top}>
            <PageHeader title={HAP.languageChange('excel.organization')}/>
          </div>
          <div style={{ marginTop: 16, height: 600, padding: '60px' }}>
            <Row gutter={48}>
              <Col span={12}>
                <Card title="Download excel" bordered={true} style={{ height: 400 }} bodyStyle={{ textAlign: "center"}}>
                  <p onClick={this.downloadExcel}><a><Icon type="download" style={{ fontSize: 80 }} /></a></p>
                  <br/>
                  <p className="ant-upload-hint" style={{fontSize: 15}}>Click to download</p>
                  <p className="ant-upload-hint" style={{color: '#A8A8A8'}}>Download users.xls to view and edit users' infomation. Then you can upload the new file.</p>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="Upload excel" bordered={true} style={{ height: 400 }}>
                  <Dragger {...props}>
                    <p className="ant-upload-drag-icon">
                      <Icon type="upload" style={{ fontSize: 80 }}/>
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
                    <p>It's a test.</p>
                  </Dragger>
                </Card>
              </Col>
            </Row>
          </div>
      </div>
    )
  }
}
export default withRouter(Excel);
