const LOAD = 'app-login/auth/LOAD';
const LOAD_SUCCESS = 'app-login/auth/LOAD_SUCCESS';
const LOAD_FAIL = 'app-login/auth/LOAD_FAIL';
const LOGIN = 'app-login/auth/LOGIN';
const LOGIN_SUCCESS = 'app-login/auth/LOGIN_SUCCESS';
const LOGIN_FAIL = 'app-login/auth/LOGIN_FAIL';
const LOGOUT = 'app-login/auth/LOGOUT';
const LOGOUT_SUCCESS = 'app-login/auth/LOGOUT_SUCCESS';
const LOGOUT_FAIL = 'app-login/auth/LOGOUT_FAIL';

const initialState = {
  loaded: false
};

export default function auth(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        user: action.result
      };
    case LOAD_FAIL:
      console.log('loadAuth fail', action.error);
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case LOGIN:
      return {
        ...state,
        loggingIn: true
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loggingIn: false,
        user: action.result,
        loginError: null
      };
    case LOGIN_FAIL:
      console.log('login fail', action.error);
      return {
        ...state,
        loggingIn: false,
        user: null,
        loginError: action.error
      };
    case LOGOUT:
      return {
        ...state,
        loggingOut: true
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        loggingOut: false,
        user: null
      };
    case LOGOUT_FAIL:
      return {
        ...state,
        loggingOut: false,
        logoutError: action.error
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.auth && globalState.auth.loaded;
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/api/loadAuth')
  };
}

export function login(tokenPayload) {
  return {
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
    promise: (client) => client.post('/api/login', {data: tokenPayload})
  };
}

export function logout() {
  return {
    types: [LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAIL],
    promise: (client) => client.post('/api/logout')
  };
}
