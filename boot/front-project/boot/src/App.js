import React, {Component} from 'react'
import {
  HashRouter as Router,
  Route,
  Switch
} from 'react-router-dom'
import {Provider, observer} from 'mobx-react'
import { createBrowserHistory } from 'history'
import stores from './app/generate/stores'
import AppState from './app/iam/stores/globalStores/AppState';
import './app/iam/common/HAP';

// import DevTools from 'mobx-react-devtools'
import asyncLocaleProvider from './util/asyncLocaleProvider'
import asyncRouter from './util/asyncRouter';
import DevTools from 'mobx-react-devtools';


const Masters = asyncRouter(() => import('../src/app/iam/containers/Masters'));

@observer
export default class App extends Component {

  render() {
    const langauge = AppState.currentLanguage
    const IntlProviderAsync = asyncLocaleProvider(langauge, () => import(`./containers/locale/${langauge}`), () => import(`react-intl/locale-data/${langauge}`))
    return (
        <IntlProviderAsync>
          <Provider {...stores}>
            <div>
              <DevTools />
              <Router history={createBrowserHistory}>
                <Switch>
                  <Route path='/' component={Masters}/>
                </Switch>
              </Router>
            </div>
          </Provider>
        </IntlProviderAsync>
    )
  }
}