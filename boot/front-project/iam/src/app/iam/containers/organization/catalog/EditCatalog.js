/**
 * Created by jaywoods on 2017/6/30.
 */
import React,{Component} from 'react';
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router-dom';
import PageHeader,{PageHeadStyle} from '../../../components/PageHeader';
import {Menu, Dropdown, Button, Icon, message, Input, Card, Col, Row} from 'antd';

class EditCatalog extends Component{
  constructor(props,context){
    super(props,context);
  }

  render(){
    return (
      <div>
        Edit catalog
      </div>
    );
  }
}

export default withRouter(EditCatalog);
