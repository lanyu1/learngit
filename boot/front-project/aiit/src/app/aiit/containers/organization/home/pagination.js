import React , {Component} from 'react';
import ReactDOM from 'react-dom';
import { Pagination } from 'antd';

export default class pageing extends Component{
    getStyles() {
		const styles = {
            floatRight:{
               float:'right',
               margin:'30px',
			},
			

		};
		return styles;
	}

  render (){
      const styles = this.getStyles();
      return (
          
          <Pagination style={styles.floatRight} defaultCurrent={1} total={500} />

          )

  }
}


