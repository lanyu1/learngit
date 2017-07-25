import React, {Component} from 'react';
import {Modal,Icon,Col,Row,Button} from 'antd'
import PropTypes from 'prop-types';

class Remove extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {open,handleCancel,handleConfirm} = this.props;
    return (
      <Modal visible={open?open:false}
             width={400}
             onCancel={handleCancel}
             wrapClassName="vertical-center-modal remove"
             footer={<div><Button onClick={handleCancel}>{HAP.languageChange("cancel")}</Button><Button type="primary" onClick={handleConfirm}>{HAP.languageChange("delete")}</Button></div>}
      >
        <Row>
          <Col span={24}>
            <Col span={2}>
              <a style={{fontSize:20,color:"#ffc07b"}}>
                <Icon type="question-circle-o" />
              </a>
            </Col>
            <Col span={22}>
              <h2>{HAP.languageChange("confirm.delete")}</h2>
            </Col>
          </Col>
        </Row>

        <Row>
          <Col offset={2}>
            <div style={{marginTop:10}}>
              <span>{HAP.languageChange("confirm.delete.tip")}</span>
            </div>
          </Col>
        </Row>
      </Modal>
    )
  }
}
Remove.propTypes = {
  open: PropTypes.bool,
};
export default Remove;
