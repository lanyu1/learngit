import React, {Component} from 'react';
import {
    Route,
    Switch
} from 'react-router-dom'

import asyncRouter from '../../../util/asyncRouter'

class AIITIndex extends Component {
    render() {
        const Home = asyncRouter(() => import('./Home'));
         const HomeIndex = asyncRouter(() => import('./organization/home/HomeIndex'));
         const Page1Index = asyncRouter(() => import('./test/Page1Index'));
         const Page2Index = asyncRouter(() => import('./test/Page2Index'));
        const {match} = this.props;
        return (
            <div>
                <Switch>
                    <Route exact path={match.url} component={Home}/>
                     <Route path={`${match.url}/page1`} component={Page1Index}/>
                    <Route path={`${match.url}/page2`} component={Page2Index}/> 
                     <Route path={`${match.url}/HomeIndex`} component={HomeIndex}/>                     
                </Switch>
            </div>
        )
    }
}
export default AIITIndex;