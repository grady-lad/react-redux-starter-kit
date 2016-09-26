import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import {reducer as reduxAsyncConnect} from 'redux-connect';

import auth from './auth';
import envConfigReducer from './envConfigReducer';

export default combineReducers({
  routing: routerReducer,
  reduxAsyncConnect,
  auth,
  envConfigReducer,
});
