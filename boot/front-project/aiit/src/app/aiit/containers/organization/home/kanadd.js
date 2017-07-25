import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { Row, Col, Button } from 'antd';
import addimg from '../../assets/images/kanadd.png';


export default class Kanadd extends Component {
	getStyles() {
		const styles = {
			add:{
			    height:'150px',
			    width:'150px',
				margin:'10% auto'
			},
			col:{
				height:'200px',
				marginTop:'30px',
				backgroundColor:'#f5f5f5'
			},
			title:{
				lineHeight:'40px',
				fontSize:'20px',
				width:'95%',
				margin:'auto'
			},
			content:{
				height:'130px',
				backgroundColor:'#ffffff',
				width:'98%',
				margin:'auto'


			},
			buttonLeft:{
				marginLeft:'20px',
				float:'right',
			}
		};
		return styles;
	}

	render() {
		const styles = this.getStyles();
		return (
		    //  <div style={styles.add}>
			//  </div>
		  <div>
			  <Row type="flex" justify="space-around">
				<Col style={styles.col} span={5}>
				   <div style={styles.add}>
					   <img src={addimg}/>
				   </div>
				</Col>
				<Col style={styles.col} span={5}>
				    <h4 style={styles.title}>看板标题</h4>
					<p style={styles.content}>看板内容展示</p>
					<span>
                       
                       <Button style={styles.buttonLeft} type="danger">删除</Button>
					   <Button style={styles.buttonLeft} type="primary">编辑</Button>
					</span>
				</Col>
				<Col style={styles.col} span={5}>
				    <h4 style={styles.title}>看板标题</h4>
					<p style={styles.content}>看板内容展示</p>
					<span>
                        <Button style={styles.buttonLeft} type="danger">删除</Button>
						<Button style={styles.buttonLeft} type="primary">编辑</Button>
					</span>
				</Col>
				<Col style={styles.col} span={5}>
				    <h4 style={styles.title}>看板标题</h4>
					<p style={styles.content}>看板内容展示</p>
					<span>
                       
                       <Button style={styles.buttonLeft} type="danger">删除</Button>
					   <Button style={styles.buttonLeft} type="primary">编辑</Button>
					</span>
				</Col>
				<Col style={styles.col} span={5}>
				    <h4 style={styles.title}>看板标题</h4>
					<p style={styles.content}>看板内容展示</p>
					<span>
                       
                       <Button style={styles.buttonLeft} type="danger">删除</Button>
					   <Button style={styles.buttonLeft} type="primary">编辑</Button>
					</span>
				</Col>
				<Col style={styles.col} span={5}>
				    <h4 style={styles.title}>看板标题</h4>
					<p style={styles.content}>看板内容展示</p>
					<span>
                       
                       <Button style={styles.buttonLeft} type="danger">删除</Button>
					   <Button style={styles.buttonLeft} type="primary">编辑</Button>
					</span>
				</Col>
				<Col style={styles.col} span={5}>
				    <h4 style={styles.title}>看板标题</h4>
					<p style={styles.content}>看板内容展示</p>
					<span>
                       
                       <Button style={styles.buttonLeft} type="danger">删除</Button>
					   <Button style={styles.buttonLeft} type="primary">编辑</Button>
					</span>
				</Col>
				<Col style={styles.col} span={5}>
				    <h4 style={styles.title}>看板标题</h4>
					<p style={styles.content}>看板内容展示</p>
					<span>
                       <Button style={styles.buttonLeft} type="danger">删除</Button>
					   <Button style={styles.buttonLeft} type="primary">编辑</Button>
					</span>
				</Col>
			 </Row>
		  </div>


		);
	};
}