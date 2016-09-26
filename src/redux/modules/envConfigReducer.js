const ENV_CONFIG_LOAD = 'configurationSpecs/ENV_CONFIG_LOAD';
const ENV_CONFIG_LOAD_SUCCESS = 'configurationSpecs/ENV_CONFIG_LOAD_SUCCESS';
const ENV_CONFIG_LOAD_FAIL = 'configurationSpecs/ENV_CONFIG_LOAD_FAIL';

export default function envConfigReducer(state = {envVariables: {}}, action = {}) {
  switch (action.type) {
    case ENV_CONFIG_LOAD_SUCCESS:
      return {
        envVariables: action.result
      };
    case ENV_CONFIG_LOAD_FAIL:
      return {
        error: action.error
      };
    default:
      return state;
  }
}

export function loadEnvConfig() {
  return {
    types: [ENV_CONFIG_LOAD, ENV_CONFIG_LOAD_SUCCESS, ENV_CONFIG_LOAD_FAIL],
    promise: (client) => client.get('/api/env-variables')
  };
}
