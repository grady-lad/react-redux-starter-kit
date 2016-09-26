import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import Helmet from 'react-helmet';
import {push} from 'react-router-redux';
import {bindActionCreators} from 'redux';
import {asyncConnect} from 'redux-connect';

import {isLoaded as isAuthLoaded, load as loadAuth, logout} from '../../redux/modules/auth';
import config from '../../../config/config';
import {loadEnvConfig} from '../../redux/modules/envConfigReducer';

@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => { //eslint-disable-line
    const promises = [];

    if (!isAuthLoaded(getState())) {
      promises.push(dispatch(loadAuth()));
    }

    return Promise.all(promises);
  }
}])
@connect(
  state => ({user: state.auth.user}),
  dispatch => bindActionCreators({loadEnvConfig, logout, pushState: push}, dispatch)
)
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object,
    logout: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
    loadEnvConfig: PropTypes.func,
  };

  navbar = () => {
    return (
      <div> This is a header</div>
    );
  }

  render() {
    const user = {name: 'martin'};
    const styles = require('./App.scss');

    return (
      <div className={styles.app}>
        <Helmet {...config.app.head}/>

        {user && this.navbar(user, styles)}
        <div className={styles.content}>
          Helllo
        </div>

      </div>
    );
  }
}
