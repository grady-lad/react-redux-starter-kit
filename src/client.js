/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Router, applyRouterMiddleware, browserHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import {ReduxAsyncConnect} from 'redux-connect';
import {useScroll} from 'react-router-scroll';
import injectTapEventPlugin from 'react-tap-event-plugin';
import createStore from './redux/create';
import ApiClient from './helpers/ApiClient';
import getRoutes from './routes';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const client = new ApiClient();
const dest = document.getElementById('content');
const store = createStore(browserHistory, client, window.__data); //eslint-disable-line
const history = syncHistoryWithStore(browserHistory, store);


const component = (
  <Router
    render={(props) =>
      <ReduxAsyncConnect {...props} helpers={{client}} filter={item => !item.deferred} render={applyRouterMiddleware(useScroll())} />}
    history={history}
    routes={getRoutes(store)}
  />
);


ReactDOM.render(
  <Provider store={store} key="provider">
    {component}
  </Provider>,
  dest
);

if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'staging') {
  window.React = React; // enable debugger
  window.React.Perf = require('react-addons-perf');

  if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-react-checksum']) {
    console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.');
  }
}

if (__DEVTOOLS__ && !window.devToolsExtension) {
  const DevTools = require('./containers/DevTools/DevTools');

  ReactDOM.render(
    <Provider store={store} key="provider">
      <div>
        {component}
        <DevTools />
      </div>
    </Provider>,
    dest
  );
}
