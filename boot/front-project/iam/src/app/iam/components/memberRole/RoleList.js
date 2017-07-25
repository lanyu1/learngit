/**
 * Created by lty on 2017/6/27.
 */
import React, {Component, PropTypes} from 'react'
import {Button,Tree} from 'antd';
const TreeNode = Tree.TreeNode;

class RoleList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedKeys: [],
    };
  }

  static propTypes = {
    treeData: PropTypes.array.isRequired,
    defaultSelectKey: PropTypes.array.isRequired,
  };

  onCheck = (checkedKeys) => {
    this.setState({
      checkedKeys: checkedKeys.checked
    });
  };

  render() {
    const {treeData, handleClose, defaultSelectKey, handleSubmit, showClose} = this.props;
    let treeNodes = [];
    treeData.map((item, index) => {
      let childNodes = [];
      item.children.map((child, i) => {
        childNodes.push(<TreeNode title={child.label} key={child.value} isLeaf={true}/>);
      });
      treeNodes.push(<TreeNode title={item.label} key={item.key} disableCheckbox={true}>
        {childNodes}
      </TreeNode>);
    });

    const style = {
      btnContent: {
        //flex: '1 1 0',
        display: 'flex',
        justifyContent: 'flex-end',
      }
    };
    return (
      <div style={{height: '100%'}}>
        <Tree checkable onCheck={this.onCheck} checkStrictly={true} defaultExpandAll={true} autoExpandParent={true}
              defaultCheckedKeys={defaultSelectKey}>
          {treeNodes}
        </Tree>
        <div style={style.btnContent}>
          <Button type="primary"
                  onClick={handleSubmit.bind(this, this.state.checkedKeys)}>{HAP.languageChange('save')}</Button>
          &nbsp;
          {showClose ? <Button onClick={handleClose}>{HAP.languageChange('close')}</Button> : ''}

        </div>
      </div>
    );
  }
}

export default RoleList;
