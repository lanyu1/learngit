import React, { Component } from 'react';
import logo from '../../assets/images/k-logo.png';

import { Button } from 'antd';

export default class Header extends Component {
	getStyles() {
		const styles = {
			header:{
			   	height:'60px',
		    	backgroundColor: '#0c6395',
			},
			img:{
			  	float: 'left',
		    	width: '40px',
		    	height: '40px',
		    	margin: '10px',
			},
			title:{
				float: 'left',
				fontSize: '20px',
			    lineHeight:'60px',
		    	fontWeight: 'bold',
		    	color: '#FFFFFF',
			}

		};
		return styles;
	}

	render() {
		const styles = this.getStyles();
		return (
		  	<header style={styles.header}>
			  <div>
			    <img src={logo} style={styles.img}/>
				<h3 style={styles.title} >AIIT BROAD</h3>
			  </div>
		    </header>
		);
	};
}