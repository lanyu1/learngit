/*eslint-disable import/default */
import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import App from './App';
import { useStrict } from 'mobx'

const el = document.getElementById('app');

useStrict(true);

render(
        <App />, el
);