/**
 * Created by jaywoods on 2017/6/23.
 */

import axios from 'axios';
import cookie from 'react-cookie';
import AppState from '../stores/globalStores/AppState';


// axios 配置
axios.defaults.timeout = 5000;
axios.defaults.baseURL = `${process.env.API_HOST}`;

// http request 拦截器
axios.interceptors.request.use(
    config => {
      //config.headers['Origin'] = `${process.env.AUTH_HOST}`;
      config.headers['Content-Type'] = 'application/json';
      config.headers['Accept'] = 'application/json';
      let access_token = cookie.load(HAP.ACCESS_TOKEN);
      if (access_token) {
        config.headers['Authorization'] = `bearer ${access_token}`;
      }
      return config;
    },
    err => {
      return Promise.reject(err);
    });

// http response 拦截器
axios.interceptors.response.use(
    function (response) {
      if(response.status==204){
        return Promise.resolve(response)
      }else{
        // continue sending response to the then() method
        return Promise.resolve(response.data)
      }
    },
    function (error) {
      // check if unauthorized error returned
      
      if (error.response.status === 401) {
        HAP.removeAccessToken();
        window.location = `${HAP.AUTH_URL}`;
      }
      // request is rejected and will direct logic to the catch() method
      return Promise.reject(error)
    });

export default axios;
