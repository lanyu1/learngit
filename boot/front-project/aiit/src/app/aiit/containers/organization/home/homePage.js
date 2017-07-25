import React , {Component} from 'react';
import Header from './header';
import Kanadd from './kanadd';
import Pageing from './pagination';

export default class homePage extends Component {
	render() {
		return (
			<div>
			    <Header></Header>
				<Kanadd></Kanadd>
				<Pageing></Pageing>
			</div>
		);
	};
}
