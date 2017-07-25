/**
 * Created by jaywoods on 2017/6/23.
 */
import cookie from 'react-cookie';
import React from 'react';
import {FormattedMessage} from 'react-intl';
import AppState from '../stores/globalStores/AppState'
!function () {
  const ACCESS_TOKEN = 'access_token', FETCH_ABORT = 'abort';
  const AUTH_URL = `${process.env.AUTH_HOST}/oauth/authorize?response_type=token&client_id=${process.env.CLIENT_ID}&state=&redirect_uri=${process.env.REDIRECT_URL}`;

  const getAccessToken = function (hash) {
      if (hash) {
        let ai = hash.indexOf(ACCESS_TOKEN);
        if (ai != -1) {
          let access_token = hash.split('&')[0].split('=')[1];
          return access_token;
        }
      }
      return null;
    },
    setAccessToken = (token, expiresion) => {
      const expirationDate = new Date(Date.now() + expiresion * 1000);
      setCookie(ACCESS_TOKEN, token, {
        path: '/',
        expires: expirationDate
      });
    },
    removeAccessToken = () => {
      removeCookie(ACCESS_TOKEN, {
        path: '/',
      });
    },
    languageChange = (id) => <FormattedMessage id={`${id}`}/>,
    logout = () => {
      removeAccessToken();
      window.location = `${process.env.AUTH_HOST}/logout`;
    },
    getMessage = (zh, en)=> {
      let language = AppState.currentLanguage;
      if (language == "zh") {
        return zh;
      } else if (language == "en") {
        return en;
      }
    },
    setCookie = cookie.save,
    getCookie = cookie.load,
    removeCookie = cookie.remove
  window.HAP = {
    ACCESS_TOKEN,
    AUTH_URL,
    getAccessToken,
    setCookie,
    getCookie,
    removeCookie,
    setAccessToken,
    removeAccessToken,
    languageChange,
    getMessage,
    logout
  }

}();
